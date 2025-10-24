import { siteDescription, siteTitle } from '../consts'

export const prerender = true

export const load = () => {
  return {
    title: siteTitle,
    description: siteDescription,
  }
}
