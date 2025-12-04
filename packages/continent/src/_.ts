// Core exports
export { type Asset, AssetsField, type CacheEvent, Content, type ContentOpError, Store, UniqueKey } from './content.js'

// Error types
export { CacheError, ContentError, MdxCompilationError, StoreError } from './errors.js'
export {
  type ExtractUniqueKeys,
  extractUniqueKeys,
  type ExtractUniqueKeysFromFields,
  extractUniqueKeysFromFields,
} from './unique-key.js'
export type { DirData } from './stores/dir.js'

// Factories
export { Mdx } from './factories/mdx.js'
export type { MdxConfig } from './factories/mdx.js'

// Plugin
export { continentPlugin } from './vite-plugin.js'
export type { ContinentPluginOptions } from './vite-plugin.js'
