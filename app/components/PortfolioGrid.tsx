import styles from './PortfolioGrid.module.css'

interface PortfolioProject {
  id: string
  title: string
  description: string
  coverImage: string
}

interface Props {
  projects: PortfolioProject[]
}

export const PortfolioGrid: React.FC<Props> = ({ projects }) => {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <a
          key={project.id}
          href={`/designing/${project.id}`}
          className={styles.item}
        >
          {/* Cover Image */}
          <div className={styles.imageContainer}>
            <img
              src={project.coverImage}
              alt={project.title}
              className={styles.image}
              loading='lazy'
              decoding='async'
            />
          </div>
          {/* Title and Description */}
          <div className={styles.details}>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.description}>
              {project.description || '\u00A0'}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
