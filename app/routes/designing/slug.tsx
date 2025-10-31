import { L, Text } from '#~/components/__'
import portfolioData from 'virtual:designing-data'
import type { Route } from './+types/slug'

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

export const meta: Route.MetaFunction = ({ params }) => {
  const project = data.projects.find((p) => p.id === params.slug)
  return [
    { title: project ? `${project.title} – Designing – Kuhrt` : 'Project Not Found' },
    { name: 'description', content: project?.description || '' },
  ]
}

const DesigningProject: React.FC<Route.ComponentProps> = ({ params }) => {
  const { slug } = params
  const project = data.projects.find((p) => p.id === slug)

  if (!project || project.hide) {
    return (
      <L.PageSection spacing='8' width='wide'>
        <Text.H1 fontSize='8' fontWeight='bold'>Project Not Found</Text.H1>
        <L.Box marginTop='4'>
          <Text.Link href='/designing' color='accent.default' _hover={{ textDecoration: 'underline' }}>
            Back to Portfolio
          </Text.Link>
        </L.Box>
      </L.PageSection>
    )
  }

  return (
    <L.PageSection spacing='xs'>
      <L.Box maxWidth='[648px]'>
        {/* Project header */}
        <Text.ArticleHeader
          title={project.title}
          subtitle={project.description}
          tags={project.tags}
          titleVariant='h1-large'
        />

        {/* Images container with hairline separations */}
        <L.Flex.Col gap='[1px]'>
          {/* Cover image */}
          <L.Box maxWidth='full'>
            <img src={project.coverImage} alt={project.title} style={{ maxWidth: '100%' }} loading='eager' />
          </L.Box>

          {/* Project images */}
          {project.images.map((image, index) => (
            <L.Box key={index} maxWidth='full'>
              <img src={image} alt={`${project.title} ${index + 1}`} style={{ maxWidth: '100%' }} loading='lazy' />
            </L.Box>
          ))}
        </L.Flex.Col>

        {/* No images placeholder */}
        {project.images.length === 0 && (
          <L.Box textAlign='center' paddingBlock='12'>
            <Text.P color='text.tertiary'>Project images coming soon</Text.P>
          </L.Box>
        )}
      </L.Box>
    </L.PageSection>
  )
}

export default DesigningProject
