import { readFileSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { globSync } from 'tinyglobby'
import { DEFAULT_IGNORE } from './defaults.js'
import type { AssetMapping, DefinitionContext, Explorer, FileEntryPattern, FileMatchesRecord, Match } from './types.js'

/**
 * File explorer configuration.
 * Groups files by stem (filename without extension).
 */
export interface Config<$Entry extends string | readonly FileEntryPattern[] = string | readonly FileEntryPattern[]> {
  /** Root directory relative to content root. Defaults to definition name. */
  root?: string
  /** Extension shorthand or array of entry patterns. */
  entry: $Entry
}

/**
 * Exploration result for file-based entries.
 * Generic over entry config to derive precise match types.
 */
export type Exploration<$Entry extends string | readonly FileEntryPattern[] = string | readonly FileEntryPattern[]> = {
  _tag: 'file'
  /** Entry ID (stem - filename without extension). */
  id: string
  /** Matches keyed by pattern name. Type reflects optional/read config. */
  matches: FileMatchesRecord<$Entry>
  /** Explorer configuration. */
  config: Config<$Entry>
}

/**
 * Create a file explorer instance.
 */
export const create = <const $Entry extends string | readonly FileEntryPattern[]>(
  config: Config<$Entry>
): Explorer<Exploration<$Entry>> => {
  type NormalizedPattern = {
    name: string
    extensions: string[]
    read: boolean
    optional: boolean
  }

  const normalizePatterns = (entry: string | readonly FileEntryPattern[]): NormalizedPattern[] => {
    if (typeof entry === 'string') {
      return [{
        name: 'entry',
        extensions: [entry],
        read: true,
        optional: false,
      }]
    }
    return entry.map(p => ({
      name: p.name,
      extensions: Array.isArray(p.ext) ? p.ext : [p.ext],
      read: p.read ?? false,
      optional: p.optional ?? false,
    }))
  }

  const findDiscoveryPattern = (patterns: NormalizedPattern[]): NormalizedPattern => {
    const pattern = patterns.find(p => !p.optional)
    if (!pattern) {
      throw new Error('File explorer requires at least one non-optional entry pattern')
    }
    return pattern
  }

  const createMatch = (filePath: string, read: boolean): Match => {
    const stat = statSync(filePath)
    const match: Match = {
      path: filePath,
      mtime: stat.mtimeMs,
      size: stat.size,
    }
    if (read) {
      match.content = readFileSync(filePath, 'utf-8')
    }
    return match
  }

  return {
    run(ctx) {
      const effectiveRoot = config.root ?? ctx.name
      const contentRoot = join(ctx.root, effectiveRoot)
      const patterns = normalizePatterns(config.entry)
      const discoveryPattern = findDiscoveryPattern(patterns)

      const extGlob = discoveryPattern.extensions.length === 1
        ? `*.${discoveryPattern.extensions[0]}`
        : `*.{${discoveryPattern.extensions.join(',')}}`

      const discoveryMatches = globSync(extGlob, {
        cwd: contentRoot,
        ignore: DEFAULT_IGNORE,
      })

      const stems = new Set<string>()
      for (const file of discoveryMatches) {
        const ext = extname(file).slice(1)
        const stem = basename(file, `.${ext}`)
        stems.add(stem)
      }

      const explorations: Exploration[] = []

      for (const stem of stems) {
        const matches: Record<string, Match | null> = {}

        for (const pattern of patterns) {
          let match: Match | null = null

          for (const ext of pattern.extensions) {
            const files = globSync(`${stem}.${ext}`, {
              cwd: contentRoot,
              ignore: DEFAULT_IGNORE,
            })

            if (files.length > 0) {
              match = createMatch(join(contentRoot, files[0]!), pattern.read)
              break
            }
          }

          if (!match && !pattern.optional) {
            break
          }

          matches[pattern.name] = match
        }

        const allRequiredFound = patterns.every(
          p => p.optional || matches[p.name] !== null
        )

        if (allRequiredFound) {
          explorations.push({
            _tag: 'file',
            id: stem,
            matches: matches as any,
            config: { ...config, root: effectiveRoot } as any,
          })
        }
      }

      return Promise.resolve(explorations) as Promise<Exploration<$Entry>[]>
    },

    getCacheKey(exploration) {
      const parts: string[] = []
      const matches = exploration.matches as Record<string, Match | null>
      for (const [name, match] of Object.entries(matches)) {
        if (match) {
          parts.push(`${name}:${match.path}:${match.mtime}:${match.size}`)
        }
      }
      return parts.join('|')
    },

    getWatchPath(root) {
      return join(root, config.root ?? '')
    },

    getAssetMappings(_exploration, _dataId): AssetMapping[] {
      return []
    },

    getAssetsRootPath(dataId) {
      // Note: When root is not provided, this uses the exploration's resolved config
      // which is stored with the effective root during run()
      return config.root ? `${config.root}/${dataId}` : null
    },
  }
}
