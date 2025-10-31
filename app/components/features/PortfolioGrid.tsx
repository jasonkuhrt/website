import { css } from '#styled-system/css'
import { UI } from '../__'

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
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1',
        sm: {
          gridTemplateColumns: 'repeat(2, 1fr)',
        },
        lg: {
          gridTemplateColumns: 'repeat(3, 1fr)',
        },
      })}
    >
      {projects.map((project) => (
        <a
          key={project.id}
          href={`/designing/${project.id}`}
          className={css({ display: 'block', transform: '[scale(0.792)]' })}
        >
          {/* Cover Image */}
          <UI.MediaCell
            src={project.coverImage}
            alt={project.title}
            grayscale
          />
          {/* Title and Description */}
          <div className={css({ paddingInline: '4', paddingBlock: '3' })}>
            <h3 className={css({ fontSize: '2', color: 'text.primary' })}>{project.title}</h3>
            <p
              className={css({
                fontSize: '2',
                color: 'text.secondary',
                marginTop: '1',
                lineClamp: '[2]',
              })}
            >
              {project.description || '\u00A0'}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
