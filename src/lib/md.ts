import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ReactElement } from 'react'

export interface CollectionConfig {
  dir: string
  filePattern?: RegExp
}

export interface ContentMeta {
  slug: string
  title: string
  date: Date
}

export interface ContentItem<$Meta extends ContentMeta = ContentMeta> {
  meta: $Meta
  content: ReactElement
}

interface Frontmatter {
  title?: string
  date?: string
}

const parseDate = (date: string | undefined): Date => {
  return date ? new Date(date) : new Date()
}

const getMdxFiles = (dir: string, filePattern?: RegExp): string[] => {
  return readdirSync(dir)
    .filter(f => f.endsWith('.mdx') && !f.startsWith('_'))
    .filter(f => !filePattern || filePattern.test(f))
}

const parseFileMeta = <$Meta extends ContentMeta>(
  filePath: string,
  slug: string,
  extraMeta?: Omit<$Meta, keyof ContentMeta>,
): $Meta => {
  const source = readFileSync(filePath, 'utf8')
  const { data } = matter(source)
  const frontmatter = data as Frontmatter

  return {
    slug,
    title: frontmatter.title || slug,
    date: parseDate(frontmatter.date),
    ...extraMeta,
  } as $Meta
}

const sortByDateDesc = <$Meta extends ContentMeta>(a: $Meta, b: $Meta): number => {
  return b.date.getTime() - a.date.getTime()
}

export const getCollection = <$Meta extends ContentMeta>(
  config: CollectionConfig,
  extraMeta?: (slug: string) => Omit<$Meta, keyof ContentMeta>,
): $Meta[] => {
  const files = getMdxFiles(config.dir, config.filePattern)
  return files
    .map(file => {
      const slug = file.replace('.mdx', '')
      const extra = extraMeta?.(slug)
      return parseFileMeta<$Meta>(join(config.dir, file), slug, extra)
    })
    .sort(sortByDateDesc)
}

export const getSlugs = (config: CollectionConfig): string[] => {
  return getMdxFiles(config.dir, config.filePattern).map(f => f.replace('.mdx', ''))
}

export const getBySlug = async <$Meta extends ContentMeta>(
  config: CollectionConfig,
  slug: string,
  extraMeta?: Omit<$Meta, keyof ContentMeta>,
): Promise<ContentItem<$Meta>> => {
  const filePath = join(config.dir, `${slug}.mdx`)
  const source = readFileSync(filePath, 'utf8')

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    options: { parseFrontmatter: true },
  })

  const meta = {
    slug,
    title: frontmatter?.title || slug,
    date: parseDate(frontmatter?.date),
    ...extraMeta,
  } as $Meta

  return { meta, content }
}
