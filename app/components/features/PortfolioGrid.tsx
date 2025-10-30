import { css } from '../../../styled-system/css'

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
  xl: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
})

const item = css({
  display: 'block',
  transform: 'scale(0.792)', // Design choice for compact portfolio layout
  _hover: {
    '& .portfolio-image': {
      filter: 'grayscale(0%)',
    },
  },
})

const imageContainer = css({
  position: 'relative',
  aspectRatio: '1',
  overflow: 'hidden',
  backgroundColor: 'bg.subtle',
})

const image = css({
  display: 'block',
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  filter: 'grayscale(100%)',
  transition: 'filter {durations.slow}',
})

const details = css({
  paddingInline: '4',
  paddingBlock: '3',
})

const title = css({
  fontSize: 'xs',
  color: 'text.primary',
})

const description = css({
  fontSize: 'xs',
  color: 'text.secondary',
  marginTop: '1',
  lineClamp: 2,
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
          <div className={imageContainer}>
            <img
              src={project.coverImage}
              alt={project.title}
              className={`${image} portfolio-image`}
              loading='lazy'
              decoding='async'
            />
          </div>
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
