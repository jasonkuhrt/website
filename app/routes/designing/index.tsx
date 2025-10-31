import portfolioData from 'virtual:designing-data'
import { F, L } from '../../components/__'
import { createPageMeta } from '../../lib/metaHelpers'
import type { Route } from './+types/index'

const data = portfolioData

export const meta: Route.MetaFunction = () =>
  createPageMeta('Designing', 'Portfolio by Jason Kuhrt')

export default function Designing() {
  const { projects } = data
  const visibleProjects = projects.filter(p => !p.hide)

  // Sort projects: items with order come first (sorted by order), then items without order
  const sortedProjects = visibleProjects.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return 0
  })

  return (
    <L.PageSection spacing="xs" width="wide">
      {sortedProjects.length > 0 && <F.PortfolioGrid projects={sortedProjects} />}
    </L.PageSection>
  )
}
