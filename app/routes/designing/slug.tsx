import { useParams } from 'react-router'
import portfolioData from '../../../public/designing/data.json'

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
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold'>Project Not Found</h1>
        <p className='mt-4'>
          <a href='/designing' className='text-blue-600 hover:underline'>
            Back to Portfolio
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8' style={{ maxWidth: '650px' }}>
      {/* Project header */}
      <header className='mb-8 text-center'>
        <h1 className='text-4xl font-bold mb-2'>{project.title}</h1>
        {project.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4 justify-center'>
            {project.tags.map((tag) => (
              <span key={tag} className='text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded'>
                {tag}
              </span>
            ))}
          </div>
        )}
        {project.description && <p className='text-gray-700 dark:text-gray-300'>{project.description}</p>}
      </header>

      {/* Images container with hairline separations */}
      <div className='space-y-px'>
        {/* Cover image */}
        <div>
          <img src={project.coverImage} alt={project.title} className='max-w-full' loading='eager' />
        </div>

        {/* Project images */}
        {project.images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`${project.title} ${index + 1}`} className='max-w-full' loading='lazy' />
          </div>
        ))}
      </div>

      {/* No images placeholder */}
      {project.images.length === 0 && (
        <div className='text-center text-gray-500 dark:text-gray-400 py-12'>
          <p>Project images coming soon</p>
        </div>
      )}
    </div>
  )
}
