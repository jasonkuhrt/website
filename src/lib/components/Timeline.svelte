<script lang="ts">
  import {
    Briefcase,
    GraduationCap,
    Award,
    Presentation,
    Heart,
    HelpCircle,
    X,
    Ruler,
    Github,
    Link,
    Play,
    Video,
    Baby,
    MapPin,
    Home,
    Mountain,
    Brain,
  } from 'lucide-svelte'
  import { onMount } from 'svelte'
  import type { ComponentType } from 'svelte'
  import IconYoutube from '~icons/fa6-brands/youtube'

  type TimelineEvent =
    | {
        type: 'experience'
        title: string
        company: string
        location: string
        startDate: string
        endDate: string
        description: string
      }
    | {
        type: 'education'
        institution: string
        degree: string
        startDate: string
        endDate: string
        description: string
      }
    | {
        type: 'achievement'
        title: string
        issuer: string
        date: string
        description: string
      }
    | {
        type: 'speaking'
        title: string
        venue: string
        date: string
        links: {
          info?: string
          repo?: string
          recording?: string
          twitter?: string
        }
      }
    | {
        type: 'personal'
        title: string
        date: string
        description?: string
        icon?: string
      }

  interface Props {
    items: TimelineEvent[]
  }

  let { items }: Props = $props()

  // Icon lookup map for personal event icons
  const iconMap: Record<string, ComponentType> = {
    Baby,
    MapPin,
    Home,
    Mountain,
    Brain,
    Heart, // Fallback default
  }

  // Event types constant
  const eventTypes = ['experience', 'education', 'achievement', 'speaking', 'personal'] as const

  // Timeline positioning constants
  const NODE_SIZE = 32 // w-8 h-8
  const NODE_CENTER = NODE_SIZE / 2
  const DATE_COL_MOBILE = 80
  const DATE_COL_SM = 100
  const DATE_COL_MD = 140
  const GAP_MOBILE = 16 // gap-4 = 1rem
  const GAP_SM = 24 // sm:gap-6 = 1.5rem
  const GAP_MD = 32 // md:gap-8 = 2rem
  const LINE_X_MOBILE = DATE_COL_MOBILE + GAP_MOBILE + NODE_CENTER
  const LINE_X_SM = DATE_COL_SM + GAP_SM + NODE_CENTER
  const LINE_X_MD = DATE_COL_MD + GAP_MD + NODE_CENTER

  // Reactive state
  let filters = $state<Set<TimelineEvent['type']>>(
    new Set(['experience', 'education', 'achievement', 'speaking', 'personal']),
  )
  let timeScaleMode = $state(false)
  let showHelpOverlay = $state(false)
  let anchoredItemId = $state<string | null>(null)

  // Helper functions
  const slugify = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const getItemId = (item: TimelineEvent): string => {
    switch (item.type) {
      case 'experience':
        return `exp-${slugify(item.company)}-${slugify(item.startDate)}`
      case 'education':
        return `edu-${slugify(item.institution)}-${slugify(item.startDate)}`
      case 'achievement':
        return `award-${slugify(item.title)}-${slugify(item.date)}`
      case 'speaking':
        return `talk-${slugify(item.title.slice(0, 40))}-${slugify(item.date)}`
      case 'personal':
        return `personal-${slugify(item.title)}-${slugify(item.date)}`
    }
  }

  const getNodeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'experience':
        return '#3b82f6'
      case 'education':
        return '#22c55e'
      case 'achievement':
        return '#f59e0b'
      case 'speaking':
        return '#a855f7'
      case 'personal':
        return '#ec4899'
    }
  }

  const getNodeIconComponent = (item: TimelineEvent) => {
    switch (item.type) {
      case 'experience':
        return Briefcase
      case 'education':
        return GraduationCap
      case 'achievement':
        return Award
      case 'speaking':
        return Presentation
      case 'personal':
        return item.icon && iconMap[item.icon] ? iconMap[item.icon] : Heart
    }
  }

  const getNodeLabel = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'experience':
        return 'Experience'
      case 'education':
        return 'Education'
      case 'achievement':
        return 'Honours'
      case 'speaking':
        return 'Speaking'
      case 'personal':
        return 'Personal'
    }
  }

  // Date parsing
  function parseDate(dateStr: string): Date {
    if (dateStr === 'Present') return new Date()
    const monthYear = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/)
    if (monthYear) {
      return new Date(`${monthYear[1]} 1, ${monthYear[2]}`)
    }
    const year = dateStr.match(/^\d{4}$/)
    if (year) {
      return new Date(`${dateStr}-01-01`)
    }
    return new Date(dateStr)
  }

  function getItemDate(item: TimelineEvent): Date {
    if (item.type === 'achievement' || item.type === 'speaking' || item.type === 'personal') {
      return parseDate(item.date)
    }
    return parseDate(item.startDate)
  }

  // Event handlers
  function toggleFilter(type: TimelineEvent['type'], altKey: boolean) {
    if (altKey) {
      filters = new Set([type])
    } else {
      const newFilters = new Set(filters)
      if (newFilters.has(type)) {
        if (newFilters.size > 1) {
          newFilters.delete(type)
        }
      } else {
        newFilters.add(type)
      }
      filters = newFilters
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('timeline-filters', JSON.stringify(Array.from(filters)))
    }

    setTimeout(updateSVGLines, 50)
  }

  function toggleTimeScale() {
    timeScaleMode = !timeScaleMode

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('timeline-time-scale', timeScaleMode.toString())
    }

    setTimeout(() => {
      updateTimelinePositions()
      setTimeout(updateSVGLines, 50)
    }, 0)
  }

  function updateTimelinePositions() {
    const timelineItems = document.querySelectorAll('.timeline-item')

    if (!timeScaleMode) {
      timelineItems.forEach((item) => {
        ;(item as HTMLElement).style.marginTop = ''
        ;(item as HTMLElement).style.minHeight = '180px'
      })
      return
    }

    const dates = items.map(getItemDate)
    const pixelsPerDay = 1

    timelineItems.forEach((item, index) => {
      const el = item as HTMLElement
      if (index === 0) {
        el.style.marginTop = '0'
        el.style.minHeight = '40px'
      } else {
        const prevDate = dates[index - 1].getTime()
        const currentDate = dates[index].getTime()
        const daysDiff = (prevDate - currentDate) / (1000 * 60 * 60 * 24)
        const spacing = Math.max(40, daysDiff * pixelsPerDay)

        el.style.marginTop = `${spacing}px`
        el.style.minHeight = '40px'
      }
    })
  }

  function updateSVGLines() {
    const timelineItems = document.querySelectorAll('.timeline-item')
    const container = timelineItems[0]?.parentElement
    if (!container) return

    const visibleItems: { originalIndex: number; y: number }[] = []
    timelineItems.forEach((item, idx) => {
      const el = item as HTMLElement
      if (el.style.display !== 'none') {
        const nodeLink = item.querySelector('.timeline-node-link')
        if (nodeLink) {
          const itemRect = item.getBoundingClientRect()
          const containerRect = container.getBoundingClientRect()
          const relativeY = itemRect.top - containerRect.top + NODE_CENTER
          visibleItems.push({ originalIndex: idx, y: relativeY })
        }
      }
    })

    const lines = document.querySelectorAll('.timeline-line')
    lines.forEach((line) => {
      const lineIndex = parseInt(line.getAttribute('data-index') || '0')
      const currentIdx = visibleItems.findIndex((item) => item.originalIndex === lineIndex)

      if (currentIdx !== -1 && currentIdx < visibleItems.length - 1) {
        const y1 = visibleItems[currentIdx].y
        const y2 = visibleItems[currentIdx + 1].y

        line.setAttribute('y1', y1.toString())
        line.setAttribute('y2', y2.toString())
        ;(line as HTMLElement).style.display = ''
      } else {
        ;(line as HTMLElement).style.display = 'none'
      }
    })
  }

  function updateAnchoredState() {
    if (typeof window === 'undefined') return
    const currentHash = window.location.hash.substring(1)
    anchoredItemId = currentHash || null
  }

  function handleNodeLinkClick(event: MouseEvent, itemId: string) {
    const currentHash = window.location.hash.substring(1)

    if (currentHash === itemId) {
      event.preventDefault()
      anchoredItemId = null
      history.pushState(null, '', window.location.pathname + window.location.search)
    } else {
      setTimeout(updateAnchoredState, 0)
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showHelpOverlay) {
      showHelpOverlay = false
    }
  }

  onMount(() => {
    // Load saved state
    if (typeof localStorage !== 'undefined') {
      const savedFilters = localStorage.getItem('timeline-filters')
      if (savedFilters) {
        filters = new Set(JSON.parse(savedFilters))
      }

      const savedTimeScale = localStorage.getItem('timeline-time-scale')
      if (savedTimeScale === 'true') {
        timeScaleMode = true
      }
    }

    // Initial setup
    updateAnchoredState()

    if (timeScaleMode) {
      updateTimelinePositions()
    }

    // Initial SVG line positioning
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateSVGLines()
      })
    })

    // Event listeners
    window.addEventListener('hashchange', updateAnchoredState)
    window.addEventListener('resize', () => setTimeout(updateSVGLines, 100))

    return () => {
      window.removeEventListener('hashchange', updateAnchoredState)
      window.removeEventListener('resize', () => setTimeout(updateSVGLines, 100))
    }
  })
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Filter and mode toggles -->
<div class="mb-8 flex justify-between items-start flex-wrap gap-4">
  <div class="flex gap-2 flex-wrap items-center">
    {#each eventTypes as eventType (eventType)}
      {@const IconComponent =
        eventType === 'personal'
          ? Heart
          : eventType === 'experience'
            ? Briefcase
            : eventType === 'education'
              ? GraduationCap
              : eventType === 'achievement'
                ? Award
                : Presentation}
      <button
        type="button"
        class="timeline-filter px-2 py-1 rounded text-xs transition-opacity flex items-center gap-1.5"
        class:opacity-40={!filters.has(eventType)}
        onclick={(e) => toggleFilter(eventType, e.altKey)}
      >
        <IconComponent class="w-2.5 h-2.5" />
        {getNodeLabel(eventType)}
      </button>
    {/each}
    <button
      type="button"
      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      aria-label="Show filter help"
      onclick={() => (showHelpOverlay = true)}
    >
      <HelpCircle class="w-3.5 h-3.5" />
    </button>
  </div>
  <button
    type="button"
    class="px-2 py-1 rounded text-xs transition-opacity flex items-center gap-1.5"
    class:opacity-40={!timeScaleMode}
    class:opacity-100={timeScaleMode}
    onclick={toggleTimeScale}
  >
    <Ruler class="w-2.5 h-2.5" />
    Time Scale
  </button>
</div>

<!-- Help overlay -->
{#if showHelpOverlay}
  <div
    class="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
    onclick={() => (showHelpOverlay = false)}
    onkeydown={(e) => e.key === 'Enter' && (showHelpOverlay = false)}
    role="button"
    tabindex="0"
  >
    <div
      class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-w-md z-50 border border-gray-200 dark:border-gray-700"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Timeline Filters</h3>
        <button
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          onclick={() => (showHelpOverlay = false)}
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p><strong>Click</strong> a filter button to toggle that category on/off</p>
        <p><strong>Alt+Click</strong> a filter button to show only that category</p>
        <p>
          <strong>Time Scale</strong> toggles between evenly-spaced and chronologically-accurate layout (1 pixel
          = 1 day)
        </p>
      </div>
    </div>
  </div>
{/if}

<div class="relative">
  <!-- SVG Timeline -->
  <svg class="absolute left-0 top-0 h-full w-full pointer-events-none" aria-hidden="true" id="timeline-svg">
    <g class="timeline-lines-mobile sm:hidden">
      {#each items as item, index (index)}
        {#if index < items.length - 1}
          <line
            x1={LINE_X_MOBILE}
            y1={index * 180 + NODE_CENTER}
            x2={LINE_X_MOBILE}
            y2={(index + 1) * 180 + NODE_CENTER}
            class="timeline-line stroke-gray-200 dark:stroke-gray-800"
            stroke-width="1"
            data-type={item.type}
            data-index={index}
          />
        {/if}
      {/each}
      <line
        x1={LINE_X_MOBILE}
        y1={(items.length - 1) * 180 + NODE_CENTER}
        x2={LINE_X_MOBILE}
        y2={(items.length - 1) * 180 + NODE_CENTER + 800}
        class="timeline-line stroke-gray-200 dark:stroke-gray-800"
        stroke-width="1"
        opacity="0.5"
      />
    </g>
    <g class="timeline-lines-sm hidden sm:block md:hidden">
      {#each items as item, index (index)}
        {#if index < items.length - 1}
          <line
            x1={LINE_X_SM}
            y1={index * 180 + NODE_CENTER}
            x2={LINE_X_SM}
            y2={(index + 1) * 180 + NODE_CENTER}
            class="timeline-line stroke-gray-200 dark:stroke-gray-800"
            stroke-width="1"
            data-type={item.type}
            data-index={index}
          />
        {/if}
      {/each}
      <line
        x1={LINE_X_SM}
        y1={(items.length - 1) * 180 + NODE_CENTER}
        x2={LINE_X_SM}
        y2={(items.length - 1) * 180 + NODE_CENTER + 800}
        class="timeline-line stroke-gray-200 dark:stroke-gray-800"
        stroke-width="1"
        opacity="0.5"
      />
    </g>
    <g class="timeline-lines-md hidden md:block">
      {#each items as item, index (index)}
        {#if index < items.length - 1}
          <line
            x1={LINE_X_MD}
            y1={index * 180 + NODE_CENTER}
            x2={LINE_X_MD}
            y2={(index + 1) * 180 + NODE_CENTER}
            class="timeline-line stroke-gray-200 dark:stroke-gray-800"
            stroke-width="1"
            data-type={item.type}
            data-index={index}
          />
        {/if}
      {/each}
      <line
        x1={LINE_X_MD}
        y1={(items.length - 1) * 180 + NODE_CENTER}
        x2={LINE_X_MD}
        y2={(items.length - 1) * 180 + NODE_CENTER + 800}
        class="timeline-line stroke-gray-200 dark:stroke-gray-800"
        stroke-width="1"
        opacity="0.5"
      />
    </g>
  </svg>

  {#each items as item (getItemId(item))}
    {@const isSingleDate =
      item.type === 'achievement' || item.type === 'speaking' || item.type === 'personal'}
    {@const startDate = isSingleDate ? item.date : item.startDate}
    {@const endDate = isSingleDate ? null : item.endDate === 'Present' ? null : item.endDate}
    {@const itemId = getItemId(item)}
    {@const nodeColor = getNodeColor(item.type)}
    {@const isVisible = filters.has(item.type)}
    {@const IconComponent = getNodeIconComponent(item)}

    <div
      id={itemId}
      class="timeline-item relative grid grid-cols-[80px_auto] sm:grid-cols-[100px_auto] md:grid-cols-[140px_auto] gap-4 sm:gap-6 md:gap-8 pb-12 last:pb-0 scroll-mt-8 -ml-4 pl-4 py-4 rounded transition-colors"
      class:is-anchored={anchoredItemId === itemId}
      data-type={item.type}
      style="min-height: 180px; {isVisible ? '' : 'display: none'}"
    >
      <!-- Date on left -->
      <div
        class="text-right text-sm text-gray-700 dark:text-gray-400 sm:whitespace-nowrap flex items-start justify-end"
      >
        <div class="leading-8">
          <span class="inline-block">{startDate}</span>
          {#if endDate}
            <span class="hidden sm:inline"> - </span>
            <span class="inline-block">{endDate}</span>
          {/if}
        </div>
      </div>

      <!-- Timeline node and content -->
      <div class="relative pl-10">
        <!-- SVG Node -->
        <a
          href={`#${itemId}`}
          class="timeline-node-link absolute left-0 top-0 pointer-events-auto"
          aria-label={`Jump to ${item.type === 'experience' ? item.company : item.type === 'education' ? item.institution : item.title}`}
          onclick={(e) => handleNodeLinkClick(e, itemId)}
        >
          <div class="relative w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 32 32" class="timeline-node-circle transition-transform">
              <circle
                cx="16"
                cy="16"
                r="15"
                fill={nodeColor}
                class="timeline-node-outer-ring transition-opacity"
              />
              <circle cx="16" cy="16" r="8" fill={nodeColor} />
            </svg>
          </div>
        </a>

        <!-- Content -->
        <div class="leading-8 flex items-start gap-2">
          <IconComponent class="w-6 h-6 text-gray-600 dark:text-gray-400 flex-shrink-0 pt-0.5" />
          <div class="flex-1 min-w-0">
            {#if item.type === 'experience'}
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {item.title}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 opacity-60 mb-2">@ {item.company}</div>
              {#if item.description}
                <p class="text-sm text-gray-700 dark:text-gray-300 opacity-80">{item.description}</p>
              {/if}
            {:else if item.type === 'education'}
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {item.degree}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 opacity-60 mb-2">@ {item.institution}</div>
              {#if item.description}
                <p class="text-sm text-gray-700 dark:text-gray-300 opacity-80">{item.description}</p>
              {/if}
            {:else if item.type === 'achievement'}
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {item.title}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 opacity-60 mb-2">@ {item.issuer}</div>
              {#if item.description}
                <p class="text-sm text-gray-700 dark:text-gray-300 opacity-80">{item.description}</p>
              {/if}
            {:else if item.type === 'speaking'}
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {item.title}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 opacity-60 mb-3">@ {item.venue}</div>
              <div class="flex gap-2">
                {#if item.links.repo}
                  <a
                    class="opacity-20 dark:opacity-40 hover:opacity-100 transition-opacity"
                    href={item.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github class="w-3.5 h-3.5" />
                  </a>
                {:else}
                  <div class="opacity-10 dark:opacity-20">
                    <Github class="w-3.5 h-3.5" />
                  </div>
                {/if}
                {#if item.links.info}
                  <a
                    class="opacity-20 dark:opacity-40 hover:opacity-100 transition-opacity"
                    href={item.links.info}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Link class="w-3.5 h-3.5" />
                  </a>
                {:else}
                  <div class="opacity-10 dark:opacity-20">
                    <Link class="w-3.5 h-3.5" />
                  </div>
                {/if}
                {#if item.links.recording}
                  {@const isYouTube =
                    item.links.recording.includes('youtube.com') || item.links.recording.includes('youtu.be')}
                  <a
                    class="opacity-20 dark:opacity-40 hover:opacity-100 transition-opacity"
                    href={item.links.recording}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {#if isYouTube}
                      <IconYoutube class="w-3.5 h-3.5" />
                    {:else}
                      <Play class="w-3.5 h-3.5" />
                    {/if}
                  </a>
                {:else}
                  <div class="opacity-10 dark:opacity-20">
                    <Video class="w-3.5 h-3.5" />
                  </div>
                {/if}
                {#if item.links.twitter}
                  <a
                    class="opacity-20 dark:opacity-40 hover:opacity-100 transition-opacity"
                    href={item.links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <X class="w-3.5 h-3.5" />
                  </a>
                {/if}
              </div>
            {:else if item.type === 'personal'}
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {item.title}
              </div>
              {#if item.description}
                <p class="text-sm text-gray-700 dark:text-gray-300 opacity-80">{item.description}</p>
              {/if}
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .timeline-item:target,
  .timeline-item.is-anchored {
    background-color: rgba(200, 200, 200, 0.08);
  }

  :global(.dark) .timeline-item:target,
  :global(.dark) .timeline-item.is-anchored {
    background-color: rgba(100, 100, 100, 0.05);
  }

  .timeline-node-link:hover :global(.timeline-node-circle) {
    transform: scale(1.15);
  }

  :global(.timeline-node-outer-ring) {
    opacity: 0;
  }

  .timeline-item:target :global(.timeline-node-outer-ring),
  .timeline-item.is-anchored :global(.timeline-node-outer-ring) {
    opacity: 0.15;
  }
</style>
