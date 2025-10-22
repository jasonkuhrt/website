<script lang="ts">
  /**
   * Grid component - responsive grid layout
   *
   * Columns are responsive:
   * - 1 column on mobile
   * - 2 columns on tablet (md)
   * - 3 columns on desktop (lg)
   */
  let {
    cols = { sm: 1, md: 2, lg: 3 },
    gap = 'base',
    class: className,
    children,
  }: {
    cols?: { sm?: number; md?: number; lg?: number } | number
    gap?: 'sm' | 'base' | 'lg'
    class?: string
    children?: any
  } = $props()

  const gapMap = {
    sm: 'var(--spacing-2)',
    base: 'var(--spacing-4)',
    lg: 'var(--spacing-6)',
  }

  // Normalize cols to object format
  const colsObj = typeof cols === 'number' ? { sm: cols, md: cols, lg: cols } : cols
</script>

<div
  class="grid {className || ''}"
  style="--grid-gap: {gapMap[gap]}; --cols-sm: {colsObj.sm || 1}; --cols-md: {colsObj.md ||
    2}; --cols-lg: {colsObj.lg || 3}"
>
  {@render children?.()}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--cols-sm), 1fr);
    gap: var(--grid-gap);
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(var(--cols-md), 1fr);
    }
  }

  @media (min-width: 1024px) {
    .grid {
      grid-template-columns: repeat(var(--cols-lg), 1fr);
    }
  }
</style>
