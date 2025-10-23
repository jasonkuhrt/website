import { siteDescription, siteTitle } from '../consts'

export const load = () => {
  return {
    title: siteTitle,
    description: siteDescription,
  }
}
