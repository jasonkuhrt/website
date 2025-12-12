import { NodeContext } from '@effect/platform-node'
import { CacheLive } from 'continent'
import { Layer, ManagedRuntime } from 'effect'
import { makeWakuEffect } from './lib/waku-effect.js'

/**
 * Application layer stack.
 * Provides all runtime requirements (FileSystem, Cache, etc.) for content operations.
 */
const AppLayer = Layer.mergeAll(
  NodeContext.layer,
  CacheLive,
)

/**
 * Application runtime.
 * Single instance used across all pages.
 */
export const AppRuntime = ManagedRuntime.make(AppLayer)

/**
 * Page and config wrappers for Waku.
 * Use these to wrap Effect generators as page components.
 *
 * @example
 * ```typescript
 * // src/pages/writing/essays/[slug].tsx
 * import { Option } from 'effect'
 * import { page, config } from '#~/runtime'
 * import { Essay } from '#~/content/essay'
 *
 * export default page(function* ({ slug }) {
 *   const essayOption = yield* Essay.get({ slug })
 *   const essay = Option.getOrThrowWith(essayOption, () => new Error(`Essay not found: ${slug}`))
 *
 *   return (
 *     <article>
 *       <h1>{essay.title}</h1>
 *       <MdxContent compiledJs={essay.compiledJs} />
 *     </article>
 *   )
 * })
 *
 * export const getConfig = config(function* () {
 *   const essays = yield* Essay.list()
 *   return {
 *     render: 'static',
 *     staticPaths: essays.map(e => e.slug),
 *   } as const
 * })
 * ```
 */
export const { page, config } = makeWakuEffect(AppRuntime)
