import { Console, Effect, Equal, Option, pipe, PubSub, Stream } from 'effect'
import fg from 'fast-glob'
import picomatch from 'picomatch'
import { Cache } from './cache.js'

// ============================================================================
// Types
// ============================================================================

/**
 * Content definition interface for the registry.
 * Matches Content.CollectionClass and Content.SingletonClass.
 */
export interface Definition {
  readonly _tag: string
  readonly version: number
  readonly store: {
    watchPaths: string[]
    watchGlobs: string[]
  }
  /** Source file that defines this content (for module graph invalidation). */
  sourceFilePath?: string
}

/** Check if an export is a content definition. */
export const isDefinition = (exp: unknown): exp is Definition =>
  exp !== null &&
  typeof exp === 'object' &&
  '_tag' in exp &&
  'store' in exp &&
  'version' in exp

/** Function to load a module and return its exports (Effect-based). */
export type LoadModule = (path: string) => Effect.Effect<Record<string, unknown>, Error>

/** Configuration for the registry. */
export interface Config {
  /** Glob pattern for discovering content definition files. */
  discoveryGlob: string
  /** Initial definitions to register (optional). */
  definitions?: Definition[]
  /** Root directory for resolving paths. */
  root: string
}

/** Result of classifying what's affected by a file path change. */
export type AffectedByFilePath =
  | { _tag: 'Nothing' }
  | { _tag: 'Definition'; definition: Option.Option<Definition> }
  | { _tag: 'Content'; definitions: Definition[] }

/**
 * Registry for tracking content definitions and their watch patterns.
 * Provides O(n) lookup by file path using glob matching.
 */
export interface DefinitionRegistry {
  /** The registry configuration. */
  readonly config: Config

  /** Discover and register content definitions from files matching config.discoveryGlob. */
  discover(loadModule: LoadModule): Effect.Effect<Definition[]>

  /** Import a single content file and register its definition (default export). */
  importFile(sourceFile: string, loadModule: LoadModule): Effect.Effect<Option.Option<Definition>>

  /** Register a content definition. */
  register(def: Definition): void

  /** Get definitions whose watchGlobs match a file path. */
  getByWatchedFilePath(filePath: string): Definition[]

  /** Get all registered definitions. */
  getAll(): Definition[]

  /** Get definition by tag. */
  get(tag: string): Definition | undefined

  /** Unregister by tag. */
  remove(tag: string): void

  /** Unregister definition from a source file. Returns the removed definition. */
  unregisterBySourceFile(sourceFile: string): Option.Option<Definition>

  /** Get definition from a source file. */
  getBySourceFile(sourceFile: string): Option.Option<Definition>

  /**
   * Ready-to-run Effect that removes stale cache entries when definition versions change.
   * Provide Cache layer and run with `Effect.runFork`.
   *
   * Subscribes to {@link importStream} (debounced 500ms). When a definition is imported
   * with a new version number, deletes cache entries from the old version since they're
   * keyed by version and will never be read again.
   *
   * Hygiene optimization - also runs on cache flush, so not strictly required.
   * Helps keep memory clean during development.
   */
  pruningStream: Effect.Effect<void, never, Cache>

  /**
   * Stream of imported definitions. Consumers can subscribe to handle
   * activation tasks like setting up file watchers.
   */
  importStream: Stream.Stream<Definition>

  /** Classify what's affected by a file path change. */
  getAffectedByFilePath(filePath: string): AffectedByFilePath
}

// ============================================================================
// Factory
// ============================================================================

/** Create a new DefinitionRegistry instance. */
export const create = (config: Config): DefinitionRegistry => {
  const definitions = new Map<string, Definition>()
  const pubsub = Effect.runSync(PubSub.unbounded<Definition>())

  // Register initial definitions (stream will emit them on subscription - no publish needed)
  if (config.definitions) {
    for (const def of config.definitions) definitions.set(def._tag, def)
  }

  const importFile = (sourceFilePath: string, loadModule: LoadModule): Effect.Effect<Option.Option<Definition>> =>
    Effect.gen(function*() {
      const mod = yield* loadModule(sourceFilePath).pipe(
        Effect.catchAll((err) => {
          console.error(`[continent] Failed to import ${sourceFilePath}:`, err)
          return Effect.succeed({})
        }),
      )

      const exp = (mod as { default?: unknown }).default
      if (!exp) {
        console.warn(`[continent] No default export in ${sourceFilePath}`)
        return Option.none()
      }
      if (!isDefinition(exp)) {
        console.warn(`[continent] Default export in ${sourceFilePath} is not a valid content definition`)
        return Option.none()
      }

      const def = { ...exp, sourceFilePath }
      const existing = definitions.get(def._tag)

      // Same version → no-op
      if (existing && Equal.equals(existing.version, def.version)) return Option.none()

      definitions.set(def._tag, def)
      yield* PubSub.publish(pubsub, def)
      return Option.some(def)
    })

  return {
    config,

    discover: (loadModule) =>
      Effect.gen(function*() {
        const files = yield* Effect.promise(() => fg(config.discoveryGlob, { cwd: config.root, absolute: true }))
        const allDefs: Definition[] = []
        for (const file of files) {
          const result = yield* importFile(file, loadModule)
          if (Option.isSome(result)) allDefs.push(result.value)
        }
        return allDefs
      }),

    importFile,

    register: (def) => {
      definitions.set(def._tag, def)
      Effect.runSync(PubSub.publish(pubsub, def))
    },

    getByWatchedFilePath(filePath) {
      const results: Definition[] = []
      for (const def of definitions.values()) {
        for (const glob of def.store.watchGlobs) {
          if (picomatch.isMatch(filePath, glob)) {
            results.push(def)
            break
          }
        }
      }
      return results
    },

    getAll: () => Array.from(definitions.values()),

    get: (tag) => definitions.get(tag),

    remove: (tag) => {
      definitions.delete(tag)
    },

    unregisterBySourceFile: (sourceFile) => {
      for (const def of definitions.values()) {
        if (def.sourceFilePath === sourceFile) {
          definitions.delete(def._tag)
          return Option.some(def)
        }
      }
      return Option.none()
    },

    getBySourceFile: (sourceFile) => {
      for (const def of definitions.values()) if (def.sourceFilePath === sourceFile) return Option.some(def)
      return Option.none()
    },

    pruningStream: pipe(
      Stream.suspend(() =>
        Stream.concat(
          Stream.fromIterable(definitions.values()),
          Stream.fromPubSub(pubsub),
        )
      ),
      Stream.debounce('500 millis'),
      Stream.tap((def) =>
        Effect.gen(function*() {
          const cache = yield* Cache
          const pruned = cache.pruneOrphans(def._tag, def.version)
          if (pruned > 0) yield* Console.log(`[continent] Pruned ${pruned} orphan cache entries from ${def._tag}`)
        })
      ),
      Stream.runDrain,
    ),

    importStream: Stream.suspend(() =>
      Stream.concat(
        Stream.fromIterable(definitions.values()),
        Stream.fromPubSub(pubsub),
      )
    ),

    getAffectedByFilePath: (filePath: string): AffectedByFilePath => {
      // Definition file: matches discovery glob
      if (picomatch.isMatch(filePath, config.discoveryGlob)) {
        const def = [...definitions.values()].find((d) => d.sourceFilePath === filePath)
        return { _tag: 'Definition', definition: Option.fromNullable(def) }
      }
      // Definition file: registered source file
      for (const def of definitions.values())
        if (def.sourceFilePath === filePath) return { _tag: 'Definition', definition: Option.some(def) }
      // Content asset: matches any definition's watchGlobs
      const affected: Definition[] = []
      for (const def of definitions.values()) {
        for (const glob of def.store.watchGlobs) {
          if (picomatch.isMatch(filePath, glob)) {
            affected.push(def)
            break
          }
        }
      }
      if (affected.length > 0) return { _tag: 'Content', definitions: affected }
      return { _tag: 'Nothing' }
    },
  }
}
