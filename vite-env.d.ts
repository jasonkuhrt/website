/// <reference types="vite/client" />

declare module 'virtual:designing-data' {
  interface PortfolioProject {
    id: string
    title: string
    description: string
    coverImage: string
    cover?: string
    images: string[]
    date: string
    appreciations: number
    views: number
    tags: string[]
    hide?: boolean
    order?: number
  }

  interface PortfolioData {
    projects: PortfolioProject[]
    lastUpdated: string
  }

  const data: PortfolioData
  export default data
}
