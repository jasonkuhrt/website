<script lang="ts">
  /**
   * Container component - provides consistent width constraints and padding
   *
   * Variants:
   * - content: 768px max-width, for text-heavy content (default)
   * - standard: 1280px max-width, for general layouts
   * - wide: 1600px max-width, for wide content like photo galleries
   * - full: Full viewport width, breaks out of parent constraints
   */
  let {
    variant = 'content',
    class: className,
    children,
  }: {
    variant?: 'content' | 'standard' | 'wide' | 'full'
    class?: string
    children?: any
  } = $props()

  const variantClass = {
    content: 'container-content',
    standard: 'container',
    wide: 'container-wide',
    full: 'container-full',
  }[variant]
</script>

<div class="{variantClass} {className || ''}">
  {@render children?.()}
</div>
