import portfolioData from 'virtual:designing-data'
import { PortfolioGrid } from '../../components/PortfolioGrid'
import styles from './index.module.css'

const data = portfolioData

export const meta = () => {
  return [
    { title: 'Designing – Kuhrt' },
    { name: 'description', content: 'Portfolio by Jason Kuhrt' },
  ]
}

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
    <div className={styles.container}>
      {sortedProjects.length > 0 && <PortfolioGrid projects={sortedProjects} />}
    </div>
  )
}
