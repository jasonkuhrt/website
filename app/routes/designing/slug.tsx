import { useParams } from 'react-router'
import { css } from '../../../styled-system/css'
import { L } from '../../components/__'
import portfolioData from '../../../public/designing/data.json'

const narrowOverride = css({
  maxWidth: '650px',
})

const notFoundTitle = css({
  fontSize: '2xl',
  fontWeight: 'bold',
})

const notFoundText = css({
  marginTop: '4',
})

const backLink = css({
  color: 'accent.default',
  _hover: {
    textDecoration: 'underline',
  },
})

const header = css({
  marginBottom: '8',
  textAlign: 'center',
})

const title = css({
  fontSize: '4xl',
  fontWeight: 'bold',
  marginBottom: '2',
})

const tags = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  marginBottom: '4',
  justifyContent: 'center',
})

const tagStyle = css({
  fontSize: 'xs',
  paddingInline: '2',
  paddingBlock: '1',
  backgroundColor: 'bg.subtle',
  borderRadius: 'radii.sm',
})

const description = css({
  color: 'text.secondary',
})

const images = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1px',
})

const image = css({
  maxWidth: '100%',
})

const noImages = css({
  textAlign: 'center',
  color: 'text.tertiary',
  paddingBlock: '12',
})

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
      <L.Section spacing='sm'>
        <L.Container variant='wide'>
          <h1 className={notFoundTitle}>Project Not Found</h1>
          <p className={notFoundText}>
            <a href='/designing' className={backLink}>
              Back to Portfolio
            </a>
          </p>
        </L.Container>
      </L.Section>
    )
  }

  return (
    <L.Section spacing='sm'>
      <L.Container variant='content' className={narrowOverride}>
      {/* Project header */}
      <header className={header}>
        <h1 className={title}>{project.title}</h1>
        {project.tags.length > 0 && (
          <div className={tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        )}
        {project.description && <p className={description}>{project.description}</p>}
      </header>

      {/* Images container with hairline separations */}
      <div className={images}>
        {/* Cover image */}
        <div>
          <img src={project.coverImage} alt={project.title} className={image} loading='eager' />
        </div>

        {/* Project images */}
        {project.images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`${project.title} ${index + 1}`} className={image} loading='lazy' />
          </div>
        ))}
      </div>

      {/* No images placeholder */}
      {project.images.length === 0 && (
        <div className={noImages}>
          <p>Project images coming soon</p>
        </div>
      )}
      </L.Container>
    </L.Section>
  )
}
