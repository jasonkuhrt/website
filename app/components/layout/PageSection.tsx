import type { ScaleToken } from '#styled-system/tokens'
import { Container } from './Container'
import { Section } from './Section'

interface Props {
  /**
   * Content to render inside the section
   */
  children: React.ReactNode
  /**
   * Vertical padding using grid scale token
   * @default '24' (144px - 24 baselines)
   * @example <PageSection spacing="8" /> // 48px padding
   * @example <PageSection spacing="16" /> // 96px padding
   */
  spacing?: ScaleToken
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
 * <PageSection withContainer={false} spacing="12">
 *   <PhotoGallery />
 * </PageSection>
 *
 * @example
 * // Custom spacing and width
 * <PageSection spacing="16" width="wide">
 *   <DataTable />
 * </PageSection>
 */
export const PageSection: React.FC<Props> = ({
  children,
  spacing = '24',
  width = 'content',
  withContainer = true,
}) => {
  return (
    <Section paddingBlock={spacing}>
      {withContainer ? (
        <Container variant={width}>{children}</Container>
      ) : (
        children
      )}
    </Section>
  )
}
