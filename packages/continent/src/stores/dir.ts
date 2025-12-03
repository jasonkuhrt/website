import { readFile } from 'node:fs/promises'
import { basename, extname } from 'node:path'
import { glob as globFn } from 'tinyglobby'
import { Hash, Schema as S } from 'effect'
import type { Store } from '../store.js'

// ============================================================================
// DirData - Fixed schema for directory stores
// ============================================================================

export const DirData = S.Struct({
  stem: S.String,
  path: S.String,
  content: S.String,
})

export type DirData = S.Schema.Type<typeof DirData>

// ============================================================================
// Dir Store
// ============================================================================

/** Type alias for directory-based stores. */
export type Dir = Store<typeof DirData, 'n'>

export interface DirConfig {
  glob: string
}

/** Create a directory-based store (always cardinality 'n'). */
export const dir = (config: DirConfig): Dir => ({
  cardinality: 'n',
  watchPaths: [config.glob.split('*')[0]!],
  schema: DirData,
  async readMany() {
    const files = await globFn(config.glob, { cwd: process.cwd() })
    return Promise.all(
      files.map(async (file) => {
        const content = await readFile(file, 'utf-8')
        const data = { stem: basename(file, extname(file)), path: file, content }
        return { hash: Hash.hash(content), data }
      }),
    )
  },
})
