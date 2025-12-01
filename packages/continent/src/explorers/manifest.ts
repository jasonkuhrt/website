import type * as S from 'effect/Schema'
import { dirname, join, resolve } from 'node:path'
import type { AssetMapping, DefinitionContext, Explorer } from './types.js'

/**
 * Manifest explorer configuration.
 */
export interface Config {
  /** Path to manifest file relative to root. Defaults to `<name>.ts` where name comes from the definition. */
  file?: string
}

/**
 * Exploration result for manifest-based entries.
 */
export type Exploration<$Schema extends S.Schema.AnyNoContext> = {
  _tag: 'manifest'
  /** The parsed manifest entry. */
  entry: S.Schema.Type<$Schema>
  config: Config
}

/**
 * Create a manifest explorer instance.
 */
export const create = <$Schema extends S.Schema.AnyNoContext>(
  config: Config = {}
): Explorer<Exploration<$Schema>> => {
  return {
    async run(ctx) {
      const file = config.file ?? `${ctx.name}.ts`
      const manifestPath = resolve(process.cwd(), ctx.root, file)
      const manifestModule = await import(/* @vite-ignore */ manifestPath)
      const entries = manifestModule.default as S.Schema.Type<$Schema>[]

      return entries.map(entry => ({
        _tag: 'manifest' as const,
        entry,
        config: { file },
      }))
    },

    getCacheKey(exploration) {
      return exploration.entry
    },

    getWatchPath(root) {
      const file = config.file ?? ''
      return join(root, dirname(file))
    },

    getAssetMappings(): AssetMapping[] {
      return []
    },

    getAssetsRootPath() {
      return null
    },
  }
}
