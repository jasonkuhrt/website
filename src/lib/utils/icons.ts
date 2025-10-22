import BlueskyIcon from '$lib/components/icons/BlueskyIcon.svelte'
import { Github, Mail } from 'lucide-svelte'

/**
 * Maps icon names to their corresponding Svelte components
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const iconComponents: Record<string, any> = {
  github: Github,
  bluesky: BlueskyIcon,
  mail: Mail,
}
