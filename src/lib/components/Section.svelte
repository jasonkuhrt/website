<script lang="ts">
  let {
    spacing = 'base',
    class: className,
    children,
  }: { spacing?: 'sm' | 'base' | 'lg' | 'xl'; class?: string; children?: any } = $props()

  const spacingClasses = {
    sm: 'py-8',
    base: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  }
</script>

<section class="{spacingClasses[spacing]} {className || ''}">
  {@render children?.()}
</section>
