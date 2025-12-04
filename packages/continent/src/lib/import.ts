import { Effect } from 'effect'

/**
 * Represents the structure of a dynamically imported ES module.
 */
export interface EsModule<$Default = unknown> {
  default: $Default
  [key: string]: unknown
}

/**
 * Dynamically import a module as an Effect.
 * Handles the promise wrapper and provides typed module structure.
 */
export const dynamicImport = <$Default = unknown>(
  url: string,
): Effect.Effect<EsModule<$Default>> =>
  Effect.promise(() => import(/* @vite-ignore */ url) as Promise<EsModule<$Default>>)
