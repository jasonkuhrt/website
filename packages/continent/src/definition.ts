import * as S from 'effect/Schema'
import * as Cache from './cache.js'
import { Explorers } from './explorers/_.js'
import type { AssetMapping } from './explorers/types.js'
import * as SchemaUtils from './lib/schema.js'

// ============================================================================
// Default Loaders
// ============================================================================

// Default loaders assume Manifest explorer (which has .entry)
const defaultLoadOne = (exploration: Explorers.Exploration) => (exploration as any).entry

const defaultLoadAll = (explorations: Explorers.Exploration[]) => explorations.map(e => (e as any).entry)

// ============================================================================
// Cache Entry Type
// ============================================================================

/**
 * Cache entry storing loaded data and exploration context.
 */
interface LoadedEntry<$Data extends { id: string } = { id: string }> {
  /** Loaded entry data. */
  data: $Data
  /** Explorer instance that discovered this entry. */
  explorer: Explorers.Explorer
  /** Original exploration result. */
  exploration: Explorers.Exploration
}

// ============================================================================
// Type Utilities for Explorer → Exploration Mapping
// ============================================================================

/**
 * Extract exploration type from an Explorer.
 */
type ExplorationFromExplorer<$Explorer> =
  $Explorer extends Explorers.Explorer<infer $Exploration> ? $Exploration : never

/**
 * Extract exploration union from array of explorers or single explorer.
 */
type ExplorationFromExplorers<$Explorers> =
  $Explorers extends readonly (infer $E)[]
    ? ExplorationFromExplorer<$E>
    : ExplorationFromExplorer<$Explorers>

// ============================================================================
// Loader and Input Types
// ============================================================================

/**
 * Context provided to the load function.
 * Gives access to definition metadata for decoding frontmatter/data.
 */
export interface LoadContext<$Input extends S.Schema.AnyNoContext> {
  /** The input schema for decoding frontmatter/manifest data. */
  inputSchema: $Input
}

/**
 * Input configuration for defining a content type.
 * Generic over explorer config to provide type-safe load function.
 *
 * @typeParam $Loaded - Optional schema for loaded entries. When provided,
 *   constrains the loader return type to S.Schema.Type<$Loaded>.
 */
/**
 * Loader output type based on whether loaded schema is provided.
 */
type LoaderOutput<$Loaded extends S.Schema.AnyNoContext | undefined, $Output> =
  undefined extends $Loaded
    ? $Output | Promise<$Output>
    : S.Schema.Type<NonNullable<$Loaded>> | Promise<S.Schema.Type<NonNullable<$Loaded>>>

export interface Input<
  $Name extends string,
  $Input extends S.Schema.AnyNoContext,
  $Loaded extends S.Schema.AnyNoContext | undefined,
  $Output extends { id: string },
  $Explorer extends Explorers.Explorer | readonly Explorers.Explorer[] = Explorers.Explorer | Explorers.Explorer[],
> {
  name: $Name
  input: $Input
  /**
   * Optional schema for loaded entries.
   * When provided, the loader return type is constrained to S.Schema.Type<$Loaded>.
   * This enables future disk caching via encode/decode.
   */
  loaded?: $Loaded
  /** Content source root. Discarded when computing public asset paths. */
  root?: string
  /** Explorer(s) for discovering content entries. Defaults to Manifest explorer. */
  explorer?: $Explorer
  /**
   * Load a single entry. Called per-exploration when cache is mostly warm.
   * At least one of loadOne or loadAll must be provided.
   */
  loadOne?: (
    exploration: ExplorationFromExplorers<$Explorer>,
    ctx: LoadContext<$Input>,
  ) => LoaderOutput<$Loaded, $Output>
  /**
   * Load all entries in batch. Called when cache is cold or has significant misses.
   * More efficient for external API calls (e.g., GitHub GraphQL batch query).
   * At least one of loadOne or loadAll must be provided.
   */
  loadAll?: (
    explorations: ExplorationFromExplorers<$Explorer>[],
    ctx: LoadContext<$Input>,
  ) => undefined extends $Loaded
    ? $Output[] | Promise<$Output[]>
    : S.Schema.Type<NonNullable<$Loaded>>[] | Promise<S.Schema.Type<NonNullable<$Loaded>>[]>
}

/**
 * Asset copy mapping.
 */
export type { AssetMapping } from './explorers/types.js'

// ============================================================================
// Definition Interface
// ============================================================================

/**
 * A content definition with type-safe query methods.
 *
 * @typeParam $Loaded - Optional schema for loaded entries (undefined if not provided)
 * @typeParam $Output - The effective output type (derived from $Loaded when provided)
 */
export interface Definition<
  $Input extends S.Schema.AnyNoContext = S.Schema<{}, {}>,
  $Loaded extends S.Schema.AnyNoContext | undefined = undefined,
  $Output extends { id: string } = { id: string },
> {
  readonly name: string

  /** Get all entries. */
  list(): Promise<$Output[]>

  /** Get a single entry by ID. */
  get(id: string): Promise<$Output | null>

  /** Get asset mappings for copying/serving. */
  getAssetMappings(): Promise<AssetMapping[]>

  /** Get paths to watch for changes. */
  getWatchPaths(): string[]

  /** Get the asset root path for an entry. */
  getAssetsRootPath(entry: $Output): string | null

  /** Invalidate the cache (called by Vite plugin on file change). */
  invalidateCache(): void

  /** Type-safe constructor for a single manifest entry. */
  make(entry: S.Schema.Encoded<$Input>): S.Schema.Type<$Input>

  /** Type-safe constructor for multiple manifest entries. */
  makeMany(...entries: S.Schema.Encoded<$Input>[]): S.Schema.Type<$Input>[]
}

// ============================================================================
// Type Utilities
// ============================================================================

/**
 * Resolve the effective output type based on whether a loaded schema is provided.
 * - If $Loaded is a schema: use S.Schema.Type<$Loaded>
 * - Otherwise: use $Output (inferred from loader)
 */
type ResolveOutput<$Loaded, $Output> =
  undefined extends $Loaded ? $Output : S.Schema.Type<NonNullable<$Loaded>>

/**
 * Extract the entry type (loader output) from a Definition.
 *
 * @example
 * ```ts
 * type Post = Continent.EntryType<typeof Posts>
 * ```
 */
export type EntryType<$Definition> = $Definition extends Definition<infer _$Input, infer _$Loaded, infer $Output> ? $Output : never

/**
 * Extract the entry input type (for make/makeMany) from a Definition.
 *
 * @example
 * ```ts
 * type PostInput = Continent.EntryInput<typeof Posts>
 * ```
 */
export type EntryInput<$Definition> = $Definition extends Definition<infer $Input, infer _$Loaded, infer _$Output> ?
  S.Schema.Encoded<$Input> :
  never

// ============================================================================
// Definition Factory
// ============================================================================

/**
 * Define a content type with file, directory, or manifest-based exploration.
 */
export const define = <
  $Name extends string,
  $Input extends S.Schema.AnyNoContext,
  $Loaded extends S.Schema.AnyNoContext | undefined,
  $Output extends { id: string },
  $Explorer extends Explorers.Explorer | readonly Explorers.Explorer[],
>(
  input: Input<$Name, $Input, $Loaded, $Output, $Explorer>,
): Definition<$Input, $Loaded, ResolveOutput<$Loaded, $Output>> & SchemaUtils.UnionNamespace<$Input, $Name> => {
  // Normalize to array of explorers (default to Manifest explorer)
  const explorers = (
    input.explorer === undefined
      ? [Explorers.Manifest.create()]
      : Array.isArray(input.explorer) ? input.explorer : [input.explorer]
  ) as Explorers.Explorer[]
  const root = input.root ?? 'content'

  // Create cache with optional disk persistence
  const entryCache = Cache.create({
    path: `.continent/cache/${input.name}`,
    schema: input.loaded,
  })

  // Use default loaders if not provided
  // If loadOne provided but not loadAll, derive loadAll from loadOne
  const loadOne = input.loadOne ?? defaultLoadOne
  const loadAll = input.loadAll ?? (input.loadOne
    ? (explorations: any[], ctx: any) => Promise.all(explorations.map(e => input.loadOne!(e, ctx)))
    : defaultLoadAll)

  // Context object passed to load function
  const ctx: LoadContext<$Input> = {
    inputSchema: input.input,
  }

  // Cache hit threshold for smart dispatch (50%)
  const BATCH_THRESHOLD = 0.5

  const loadAllEntries = async (): Promise<LoadedEntry[]> => {
    const loadedEntries: LoadedEntry[] = []

    for (const explorer of explorers) {
      const explorations = await explorer.run({ name: input.name, root })

      // Separate cached and uncached explorations
      const cached: LoadedEntry[] = []
      const uncached: Explorers.Exploration[] = []

      for (const exploration of explorations) {
        // Check cache by explorer's cache key
        const cacheKey = JSON.stringify(explorer.getCacheKey(exploration))
        const cachedData = await entryCache.get(cacheKey)

        if (cachedData !== null) {
          // Cache hit - reconstruct LoadedEntry with fresh exploration
          cached.push({ data: cachedData as any, explorer, exploration })
        } else {
          uncached.push(exploration)
        }
      }

      // Add cached entries to results
      loadedEntries.push(...cached)

      // If no uncached entries, we're done with this explorer
      if (uncached.length === 0) continue

      // Smart dispatch: choose loadAll vs loadOne based on cache hit rate
      const totalCount = explorations.length
      const cacheHitRate = cached.length / totalCount
      const shouldBatch = cacheHitRate < BATCH_THRESHOLD

      if (shouldBatch) {
        // Batch load all uncached entries
        const results = await loadAll(uncached as any, ctx)

        // Cache and collect results
        for (let i = 0; i < results.length; i++) {
          const data = results[i]
          const exploration = uncached[i]!
          const cacheKey = JSON.stringify(explorer.getCacheKey(exploration))
          await entryCache.set(cacheKey, data as any)
          loadedEntries.push({ data, explorer, exploration })
        }
      } else {
        // Load one at a time
        for (const exploration of uncached) {
          const data = await loadOne(exploration as any, ctx)
          const cacheKey = JSON.stringify(explorer.getCacheKey(exploration))
          await entryCache.set(cacheKey, data as any)
          loadedEntries.push({ data, explorer, exploration })
        }
      }
    }

    return loadedEntries
  }

  // Schema decoder for make/makeMany
  const make = S.decodeUnknownSync(input.input)

  const base = {
    name: input.name,

    list: async () => {
      const all = await loadAllEntries()
      return all.map(r => r.data) as any
    },

    get: async (id: string) => {
      // Load all and find by ID (cache handles efficiency)
      const all = await loadAllEntries()
      return all.find(r => r.data.id === id)?.data ?? null as any
    },

    getWatchPaths: () => {
      const paths = explorers.map(e => e.getWatchPath(root))
      return [...new Set(paths)]
    },

    getAssetMappings: async () => {
      const loadedEntries = await loadAllEntries()
      return loadedEntries.flatMap(({ data, explorer, exploration }) => explorer.getAssetMappings(exploration, data.id))
    },

    getAssetsRootPath: (entry: { id: string }) => {
      for (const explorer of explorers) {
        const path = explorer.getAssetsRootPath(entry.id)
        if (path) return path
      }
      return null
    },

    invalidateCache: () => {
      entryCache.invalidate()
    },

    make,

    makeMany: (...entries: S.Schema.Encoded<$Input>[]) => {
      return entries.map(e => make(e))
    },
  }

  // If input is a union, expose members as namespace properties
  const unionNamespace = SchemaUtils.buildUnionNamespace(input.input, input.name)

  return Object.assign(base, unionNamespace) as any
}
