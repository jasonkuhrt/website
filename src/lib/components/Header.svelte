<script lang="ts">
  import NavLink from './NavLink.svelte'
  import Logo from './Logo.svelte'
</script>

<header class="flex flex-col items-center mt-12">
  <a class="opacity-100 hover:opacity-80 active:opacity-40" href="/">
    <Logo width={40} height={40} />
  </a>
  <nav class="mt-2">
    <NavLink href="/writing" />
    <NavLink href="/speaking" />
    <NavLink href="/coding" />
    <NavLink href="/photographing" />
    <NavLink href="/drawing" />
    <NavLink href="/bio" />
  </nav>
</header>
