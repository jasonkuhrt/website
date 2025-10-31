import { Container } from './Container'
import { Section } from './Section'

const SPACING_MAP = {
  xs: '8',
  sm: '12',
  md: '16',
  lg: '24',
} as const

interface Props {
  /**
   * Content to render inside the section
   */
  children: React.ReactNode
  /**
   * Vertical padding preset
   * @default 'lg'
   */
  spacing?: keyof typeof SPACING_MAP
  /**
   * Maximum width variant - maps to Container variants
   * @default 'content'
   */
  width?: 'content' | 'standard' | 'wide' | 'full'
  /**
   * Whether to wrap children in a Container component
   * Set to false when using custom layout components like Cover
   * @default true
   */
  withContainer?: boolean
}

/**
 * Page section wrapper that provides consistent vertical spacing and optional width constraints.
 *
 * By default, wraps children in a Container component. Disable with `withContainer={false}`
 * when using custom layout components like Cover or for full-width sections.
 *
 * @example
 * // Standard section with content width
 * <PageSection>
 *   <H1>Title</H1>
 * </PageSection>
 *
 * @example
 * // Full-width section without container
 * <PageSection withContainer={false} spacing="sm">
 *   <PhotoGallery />
 * </PageSection>
 *
 * @example
 * // Custom spacing and width
 * <PageSection spacing="md" width="wide">
 *   <DataTable />
 * </PageSection>
 */
export const PageSection: React.FC<Props> = ({
  children,
  spacing = 'lg',
  width = 'content',
  withContainer = true,
}) => {
  return (
    <Section paddingBlock={SPACING_MAP[spacing]}>
      {withContainer ? (
        <Container variant={width}>{children}</Container>
      ) : (
        children
      )}
    </Section>
  )
}
