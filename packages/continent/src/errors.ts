import { Data } from 'effect'

/**
 * Error for cache operations (load, flush, read, write).
 */
export class CacheError extends Data.TaggedError('CacheError')<{
  readonly operation: 'load' | 'flush' | 'read' | 'write'
  readonly path: string
  readonly cause?: unknown
}> {}

/**
 * Error for store operations (readMany, import).
 */
export class StoreError extends Data.TaggedError('StoreError')<{
  readonly storeType: 'dir' | 'js'
  readonly operation: 'readMany' | 'import'
  readonly path: string
  readonly cause?: unknown
}> {}

/**
 * Error for MDX compilation.
 */
export class MdxCompilationError extends Data.TaggedError('MdxCompilationError')<{
  readonly path: string
  readonly cause?: unknown
}> {}

/**
 * Error for content operations (get, list).
 */
export class ContentError extends Data.TaggedError('ContentError')<{
  readonly contentTag: string
  readonly operation: 'get' | 'list'
  readonly message: string
}> {}
