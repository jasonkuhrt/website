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
    <div className='portfolio-grid'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[7px]'>
        {projects.map((project) => (
          <a
            key={project.id}
            href={`/designing/${project.id}`}
            className='portfolio-item block group scale-[0.792]'
          >
            {/* Cover Image */}
            <div className='relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800'>
              <img
                src={project.coverImage}
                alt={project.title}
                className='block h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300'
                loading='lazy'
                decoding='async'
              />
            </div>
            {/* Title and Description */}
            <div className='px-4 py-3'>
              <h3 className='text-xs text-gray-900 dark:text-gray-100'>{project.title}</h3>
              <p className='text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1'>
                {project.description || '\u00A0'}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
