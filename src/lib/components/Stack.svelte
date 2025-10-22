<script lang="ts">
  /**
   * Stack component - vertical layout with consistent spacing
   *
   * Uses CSS gap for spacing between children
   */
  let {
    spacing = 'base',
    class: className,
    children,
  }: {
    spacing?: 'sm' | 'base' | 'lg' | 'xl'
    class?: string
    children?: any
  } = $props()

  const spacingMap = {
    sm: 'var(--spacing-2)',
    base: 'var(--spacing-4)',
    lg: 'var(--spacing-6)',
    xl: 'var(--spacing-8)',
  }
</script>

<div class="stack {className || ''}" style="--stack-gap: {spacingMap[spacing]}">
  {@render children?.()}
</div>

<style>
  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--stack-gap);
  }
</style>
