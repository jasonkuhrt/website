import { Effect, type ManagedRuntime } from 'effect'

/**
 * Create Waku page/config wrappers for a ManagedRuntime.
 *
 * Pages use Effect generators:
 * ```typescript
 * export default page(function* ({ slug }) {
 *   const essay = yield* Essay.get({ slug })
 *   // ...
 *   return <article>...</article>
 * })
 * ```
 */
export const makeWakuEffect = <R, E>(runtime: ManagedRuntime.ManagedRuntime<R, E>) => ({
  /**
   * Wrap an Effect generator as a Waku page component.
   * The generator receives props and returns React.JSX.Element.
   */
  page:
    <Props>(gen: (props: Props) => Generator<any, React.JSX.Element, any>) =>
    async (props: Props): Promise<React.JSX.Element> => runtime.runPromise(Effect.gen(() => gen(props)) as any),

  /**
   * Wrap an Effect generator as a Waku getConfig function.
   */
  config: <A>(gen: () => Generator<any, A, any>) => async (): Promise<A> => runtime.runPromise(Effect.gen(gen) as any),
})
