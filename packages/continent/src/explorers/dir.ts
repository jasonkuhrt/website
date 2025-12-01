import { readFileSync, statSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { globSync } from 'tinyglobby'
import { DEFAULT_IGNORE } from './defaults.js'
import type { AssetMapping, DirEntryPattern, DirMatchesRecord, Explorer, GlobConfig, Match } from './types.js'

/**
 * Dir explorer configuration.
 * Groups files by directory.
 */
export interface Config<$Entry extends string | readonly DirEntryPattern[] = string | readonly DirEntryPattern[]> {
  root: string
  /** Glob shorthand or array of entry patterns. */
  entry: $Entry
}

/**
 * Exploration result for directory-based entries.
 * Generic over entry config to derive precise match types.
 */
export type Exploration<$Entry extends string | readonly DirEntryPattern[] = string | readonly DirEntryPattern[]> = {
  _tag: 'dir'
  /** Entry ID (directory name). */
  id: string
  /** Absolute directory path. */
  dirPath: string
  /** Matches keyed by pattern name. Type reflects optional/count config. */
  matches: DirMatchesRecord<$Entry>
  /** Explorer configuration. */
  config: Config<$Entry>
}

/**
 * Create a dir explorer instance.
 */
export const create = <const $Entry extends string | readonly DirEntryPattern[]>(
  config: Config<$Entry>
): Explorer<Exploration<$Entry>> => {
  type NormalizedPattern = {
    name: string
    glob: string
    count: 'one' | 'many'
    read: boolean
    optional: boolean
  }

  const inferCount = (glob: string): 'one' | 'many' => {
    return glob.includes('*') ? 'many' : 'one'
  }

  const normalizePatterns = (entry: string | readonly DirEntryPattern[]): NormalizedPattern[] => {
    if (typeof entry === 'string') {
      return [{
        name: 'entry',
        glob: entry,
        count: inferCount(entry),
        read: true,
        optional: false,
      }]
    }

    return entry.map(p => {
      const globConfig: GlobConfig = typeof p.glob === 'string'
        ? { pattern: p.glob, count: inferCount(p.glob) }
        : p.glob

      return {
        name: p.name,
        glob: globConfig.pattern,
        count: globConfig.count,
        read: p.read ?? false,
        optional: p.optional ?? false,
      }
    })
  }

  const findDiscoveryPattern = (patterns: NormalizedPattern[]): NormalizedPattern => {
    const pattern = patterns.find(p => !p.optional)
    if (!pattern) {
      throw new Error('Dir explorer requires at least one non-optional entry pattern')
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
    run(root) {
      const contentRoot = join(root, config.root)
      const patterns = normalizePatterns(config.entry as string | readonly DirEntryPattern[])
      const discoveryPattern = findDiscoveryPattern(patterns)

      // Glob for files matching discovery pattern in any subdirectory
      const discoveryMatches = globSync(`*/${discoveryPattern.glob}`, {
        cwd: contentRoot,
        ignore: DEFAULT_IGNORE,
      })

      // Extract unique directory names from discovery matches
      const dirNames = new Set<string>()
      for (const file of discoveryMatches) {
        const dirName = dirname(file)
        if (dirName !== '.') {
          // Only include first-level directories, not nested ones
          const topLevelDir = dirName.split('/')[0]!
          dirNames.add(topLevelDir)
        }
      }

      // For each directory, build the matches record
      const explorations: Exploration[] = []

      for (const dirName of dirNames) {
        const dirPath = join(contentRoot, dirName)
        const matches: Record<string, Match | Match[] | null> = {}
        let allRequiredFound = true

        for (const pattern of patterns) {
          // Glob within this directory
          const files = globSync(pattern.glob, {
            cwd: dirPath,
            ignore: DEFAULT_IGNORE,
          })

          if (files.length === 0) {
            if (pattern.optional) {
              matches[pattern.name] = null
            } else {
              allRequiredFound = false
              break
            }
          } else if (pattern.count === 'one') {
            if (files.length > 1) {
              throw new Error(
                `Dir explorer: pattern '${pattern.name}' expected one file but found ${files.length} in ${dirPath}`
              )
            }
            matches[pattern.name] = createMatch(join(dirPath, files[0]!), pattern.read)
          } else {
            // count === 'many'
            matches[pattern.name] = files.map(f => createMatch(join(dirPath, f), pattern.read))
          }
        }

        if (allRequiredFound) {
          explorations.push({
            _tag: 'dir',
            id: dirName,
            dirPath,
            matches: matches as any,
            config: config as any,
          })
        }
      }

      return Promise.resolve(explorations) as Promise<Exploration<$Entry>[]>
    },

    getCacheKey(exploration) {
      const parts: string[] = []

      const addMatch = (name: string, match: Match) => {
        parts.push(`${name}:${match.path}:${match.mtime}:${match.size}`)
      }

      const matches = exploration.matches as Record<string, Match | Match[] | null>
      for (const [name, matchOrMatches] of Object.entries(matches)) {
        if (matchOrMatches === null) continue
        if (Array.isArray(matchOrMatches)) {
          for (const match of matchOrMatches) {
            addMatch(name, match)
          }
        } else {
          addMatch(name, matchOrMatches)
        }
      }

      return parts.join('|')
    },

    getWatchPath(root) {
      return join(root, config.root)
    },

    getAssetMappings(exploration, dataId): AssetMapping[] {
      const exp = exploration as Exploration
      const patterns = normalizePatterns(config.entry as string | readonly DirEntryPattern[])
      const mappings: AssetMapping[] = []

      for (const pattern of patterns) {
        // Skip patterns marked with read: true (they're content, not assets)
        if (pattern.read) continue

        const matchOrMatches = (exp.matches as Record<string, Match | Match[] | null>)[pattern.name]
        if (!matchOrMatches) continue

        const matches = Array.isArray(matchOrMatches) ? matchOrMatches : [matchOrMatches]
        for (const match of matches) {
          mappings.push({
            src: match.path,
            dest: `${config.root}/${dataId}/${basename(match.path)}`,
          })
        }
      }

      return mappings
    },

    getAssetsRootPath(dataId) {
      return `${config.root}/${dataId}`
    },
  }
}
