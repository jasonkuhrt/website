import { useParams } from 'react-router'
import portfolioData from '../../../public/designing/data.json'
import styles from './slug.module.css'

interface PortfolioProject {
  id: string
  title: string
  description: string
  coverImage: string
  images: string[]
  date: string
  tags: string[]
  hide?: boolean
  order?: number
}

interface PortfolioData {
  projects: PortfolioProject[]
}

const data = portfolioData as PortfolioData

export const meta = ({ params }: { params: { slug: string } }) => {
  const project = data.projects.find((p) => p.id === params.slug)
  return [
    { title: project ? `${project.title} – Designing – Kuhrt` : 'Project Not Found' },
    { name: 'description', content: project?.description || '' },
  ]
}

export default function DesigningProject() {
  const { slug } = useParams()
  const project = data.projects.find((p) => p.id === slug)

  if (!project || project.hide) {
    return (
      <div className={styles.container}>
        <h1 className={styles.notFoundTitle}>Project Not Found</h1>
        <p className={styles.notFoundText}>
          <a href='/designing' className={styles.backLink}>
            Back to Portfolio
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className={styles.containerNarrow}>
      {/* Project header */}
      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        {project.tags.length > 0 && (
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        {project.description && <p className={styles.description}>{project.description}</p>}
      </header>

      {/* Images container with hairline separations */}
      <div className={styles.images}>
        {/* Cover image */}
        <div>
          <img src={project.coverImage} alt={project.title} className={styles.image} loading='eager' />
        </div>

        {/* Project images */}
        {project.images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`${project.title} ${index + 1}`} className={styles.image} loading='lazy' />
          </div>
        ))}
      </div>

      {/* No images placeholder */}
      {project.images.length === 0 && (
        <div className={styles.noImages}>
          <p>Project images coming soon</p>
        </div>
      )}
    </div>
  )
}
