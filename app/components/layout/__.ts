/**
 * Layout Component Library
 *
 * A compositional layout system based on modern CSS features and design patterns.
 * Built with Panda CSS for type-safe, zero-runtime styling.
 *
 * ## Architecture
 *
 * **Tier 1: Primitives** (Building blocks)
 * - Flex, Center, Grid, Cluster, Spacer
 *
 * **Tier 2: Patterns** (Composed layouts)
 * - Cover, Switcher, AspectRatio
 *
 * **Tier 3: Specialized** (Domain-specific)
 * - Future: Reel, Masonry, Sidebar
 *
 * ## Design System Integration
 *
 * - Based on 6px baseline grid
 * - Uses Panda CSS design tokens
 * - Modern CSS features: Subgrid (89%), Container Queries (91%)
 * - Type-safe props from Panda codegen
 */

// Tier 1: Core Primitives
export { Box } from '../../../styled-system/jsx'
export { Center } from './Center'
export { Cluster } from './Cluster'
export { Container } from './Container'
export * as Flex from './Flex/__.js'
export { Grid } from './Grid'
export { PageSection } from './PageSection'
export { Section } from './Section'
export { Spacer } from './Spacer'

// Tier 2: Composition Patterns
export { AspectRatio } from './AspectRatio'
export { Cover } from './Cover'
