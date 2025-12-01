import type * as S from 'effect/Schema'
import type * as Dir from './dir.js'
import type * as File from './file.js'
import type * as Manifest from './manifest.js'

// ============================================================================
// Match Types
// ============================================================================

/**
 * A discovered file match with metadata (content optional).
 */
export interface Match {
  /** Absolute path to the file. */
  path: string
  /** File modification time (ms since epoch). */
  mtime: number
  /** File size in bytes. */
  size: number
  /** File content (only present if read: true). */
  content?: string
}

/**
 * A discovered file match with content (read: true).
 */
export interface MatchWithContent {
  /** Absolute path to the file. */
  path: string
  /** File modification time (ms since epoch). */
  mtime: number
  /** File size in bytes. */
  size: number
  /** File content (always present when read: true). */
  content: string
}

// ============================================================================
// Type Utilities for Deriving Match Types from Config
// ============================================================================

/**
 * Select Match or MatchWithContent based on read config.
 */
export type MatchForRead<$Read extends boolean | undefined> =
  $Read extends true ? MatchWithContent : Match

/**
 * Compute match type for file explorer pattern.
 * File explorer always returns single matches (stem-based grouping).
 */
export type FileMatchType<$Pattern extends FileEntryPattern> =
  $Pattern extends { optional: true }
    ? MatchForRead<$Pattern['read']> | null
    : MatchForRead<$Pattern['read']>

/**
 * Infer count from glob pattern string (has `*` = many).
 */
export type InferGlobCount<$Glob extends string> =
  $Glob extends `${string}*${string}` ? 'many' : 'one'

/**
 * Get count from GlobConfig or string.
 */
export type GetGlobCount<$Glob extends string | GlobConfig> =
  $Glob extends GlobConfig ? $Glob['count'] :
  $Glob extends string ? InferGlobCount<$Glob> :
  'one'

/**
 * Compute match type for dir explorer pattern.
 */
export type DirMatchType<$Pattern extends DirEntryPattern> =
  GetGlobCount<$Pattern['glob']> extends 'many'
    ? $Pattern extends { optional: true }
      ? MatchForRead<$Pattern['read']>[] | null
      : MatchForRead<$Pattern['read']>[]
    : $Pattern extends { optional: true }
      ? MatchForRead<$Pattern['read']> | null
      : MatchForRead<$Pattern['read']>

/**
 * Build matches record type from file entry patterns.
 */
export type FileMatchesRecord<$Entry extends string | readonly FileEntryPattern[]> =
  // dprint-ignore
  $Entry extends string                                         ? { entry: MatchWithContent } :
  $Entry extends readonly (infer $P extends FileEntryPattern)[] ? { [k in $P as k['name']]: FileMatchType<k> } :
                                                                  never

/**
 * Build matches record type from dir entry patterns.
 */
export type DirMatchesRecord<$Entry extends string | readonly DirEntryPattern[]> =
  // dprint-ignore
  $Entry extends string                                        ? (InferGlobCount<$Entry> extends 'many' ? { entry: MatchWithContent[] } : { entry: MatchWithContent }) :
  $Entry extends readonly (infer $P extends DirEntryPattern)[] ? { [k in $P as k['name']]: DirMatchType<k> } :
                                                                 never

// ============================================================================
// File Explorer Entry Patterns
// ============================================================================

/**
 * Entry pattern for file explorer (extension-based matching).
 */
export interface FileEntryPattern {
  /** Name for this match in the matches record. */
  name: string
  /** Extension(s) to match (without dot). */
  ext: string | string[]
  /** Read file content (default: false). */
  read?: boolean
  /** Allow missing (null) vs error (default: false = error). */
  optional?: boolean
}

// ============================================================================
// Dir Explorer Entry Patterns
// ============================================================================

/**
 * Glob configuration with explicit count.
 */
export interface GlobConfig {
  /** Glob pattern to match within directory. */
  pattern: string
  /** Expected cardinality. */
  count: 'one' | 'many'
}

/**
 * Entry pattern for dir explorer (glob-based matching).
 */
export interface DirEntryPattern {
  /** Name for this match in the matches record. */
  name: string
  /** Glob pattern (string infers count from * presence, or explicit config). */
  glob: string | GlobConfig
  /** Read file content (default: false). */
  read?: boolean
  /** Allow missing (null) vs error (default: false = error). */
  optional?: boolean
}

// ============================================================================
// Asset Mapping
// ============================================================================

/**
 * Asset copy mapping.
 */
export interface AssetMapping {
  src: string
  dest: string
}

/**
 * Polymorphic explorer interface.
 * Generic over Exploration type to preserve type info through definition.
 */
export interface Explorer<$Exploration extends Exploration = Exploration> {
  run(root: string): Promise<$Exploration[]>
  getCacheKey(exploration: $Exploration): unknown
  getWatchPath(root: string): string
  getAssetMappings(exploration: $Exploration, dataId: string): AssetMapping[]
  getAssetsRootPath(dataId: string): string | null
}

/**
 * Exploration result passed to loader function (created by explorer).
 */
export type Exploration<$Schema extends S.Schema.AnyNoContext = S.Schema<{}, {}>> =
  | File.Exploration
  | Dir.Exploration
  | Manifest.Exploration<$Schema>

