import { css } from '../../../styled-system/css'
import { UI } from '../__'

const grid = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1',
  sm: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  lg: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  // xl breakpoint removed - not needed (stays at 3 columns)
})

const item = css({
  display: 'block',
  transform: '[scale(0.792)]', // Design choice for compact portfolio layout
})

const details = css({
  paddingInline: '4',
  paddingBlock: '3',
})

const title = css({
  fontSize: '2',
  color: 'text.primary',
})

const description = css({
  fontSize: '2',
  color: 'text.secondary',
  marginTop: '1',
  lineClamp: '[2]',
})

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
    <div className={grid}>
      {projects.map((project) => (
        <a
          key={project.id}
          href={`/designing/${project.id}`}
          className={item}
        >
          {/* Cover Image */}
          <UI.MediaCell
            src={project.coverImage}
            alt={project.title}
            grayscale
          />
          {/* Title and Description */}
          <div className={details}>
            <h3 className={title}>{project.title}</h3>
            <p className={description}>
              {project.description || '\u00A0'}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
