<script lang="ts">
  import { page } from '$app/stores'

  let { href, text, activePath }: { href: string; text?: string; activePath?: RegExp } = $props()

  const linkText = text ?? href.replace(/^\//, '').replace(/\/$/, '')
  const pathPattern = activePath ?? new RegExp(`.*${linkText}.*`)

  const isActive = $derived(Boolean($page.url.pathname.slice(1).match(pathPattern)))
</script>

<a class:active={isActive} {href}>{linkText}</a>

<style>
  a {
    font-size: 0.8rem;
  }
  a.active {
    font-weight: 700;
  }
  a:not(.active) {
    opacity: 0.5;
  }
  a + :global(a) {
    margin-left: 0.75rem;
  }
</style>
