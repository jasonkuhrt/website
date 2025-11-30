declare module 'rehype-urls' {
  import type { Plugin } from 'unified'

  interface UrlObject {
    protocol?: string | null
    slashes?: boolean | null
    auth?: string | null
    host?: string | null
    port?: string | null
    hostname?: string | null
    hash?: string | null
    search?: string | null
    query?: string | null
    pathname?: string | null
    path?: string | null
    href?: string | null
  }

  interface RehypeUrlsOptions {
    transform: (url: UrlObject, node: unknown) => UrlObject | void
  }

  const rehypeUrls: Plugin<[RehypeUrlsOptions | ((url: UrlObject, node: unknown) => UrlObject | void)]>
  export default rehypeUrls
}
