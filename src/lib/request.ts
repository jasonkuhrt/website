import { unstable_getContext as getContext } from 'waku/server'

const SITE_URL = 'https://jasonkuhrt.com'

export const getRequestUrl = () => {
  const { req } = getContext()
  const url = new URL(req.url)
  return {
    pathname: url.pathname,
    full: `${SITE_URL}${url.pathname}`,
    search: url.search,
  }
}
