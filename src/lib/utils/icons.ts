import { Github, Mail } from 'lucide-svelte'
import IconBluesky from '~icons/fa6-brands/bluesky'

/**
 * Maps icon names to their corresponding Svelte components
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const iconComponents: Record<string, any> = {
  github: Github,
  bluesky: IconBluesky,
  mail: Mail,
}
