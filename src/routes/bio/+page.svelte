<script lang="ts">
  import { MapPin } from 'lucide-svelte'
  import { socialLinks, talks } from '../../consts'
  import Section from '$lib/components/Section.svelte'
  import Container from '$lib/components/Container.svelte'
  import PhotoGallery from '$lib/components/PhotoGallery.svelte'
  import Timeline from '$lib/components/Timeline.svelte'
  import { iconComponents } from '$lib/utils/icons'
  import linkedinData from '$lib/data/linkedin.json'

  // Transform data into tagged union timeline events
  const experienceEvents = linkedinData.experience.map((exp) => ({
    type: 'experience' as const,
    ...exp,
  }))

  const educationEvents = linkedinData.education.map((edu) => ({
    type: 'education' as const,
    ...edu,
  }))

  const achievementEvents = linkedinData.achievements.map((ach) => ({
    type: 'achievement' as const,
    ...ach,
  }))

  const speakingEvents = talks.map((talk) => ({
    type: 'speaking' as const,
    ...talk,
  }))

  const personalEvents = [
    {
      type: 'personal' as const,
      title: 'My first son Roman is born',
      date: 'July 2011',
    },
    {
      type: 'personal' as const,
      title: 'Move to NYC',
      date: 'March 2014',
    },
    {
      type: 'personal' as const,
      title: 'Move back to Montreal',
      date: 'July 2015',
    },
    {
      type: 'personal' as const,
      title: 'My second son Willem is born',
      date: 'March 2016',
    },
    {
      type: 'personal' as const,
      title: 'First Rocky Mountains Expedition',
      date: 'July 2023',
    },
    {
      type: 'personal' as const,
      title: 'ADHD positive assessment',
      date: 'December 2023',
    },
    {
      type: 'personal' as const,
      title: 'Second Rocky Mountains Expedition',
      date: 'August 2025',
    },
  ]

  // Combine and sort all events chronologically
  const allEvents = [
    ...experienceEvents,
    ...educationEvents,
    ...achievementEvents,
    ...speakingEvents,
    ...personalEvents,
  ]

  // Parse dates for sorting
  const parseDate = (dateStr: string): Date => {
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

  const getStartDate = (event: (typeof allEvents)[0]): Date => {
    if (event.type === 'achievement' || event.type === 'speaking' || event.type === 'personal') {
      return parseDate(event.date)
    }
    return parseDate(event.startDate)
  }

  allEvents.sort((a, b) => getStartDate(b).getTime() - getStartDate(a).getTime())
</script>

<svelte:head>
  <title>Bio – Kuhrt</title>
  <meta name="description" content="About Jason Kuhrt" />
</svelte:head>

<!-- Photo Gallery Section -->
<Section spacing="xl">
  <PhotoGallery />
</Section>

<!-- Hero Section -->
<Section spacing="lg">
  <Container variant="content">
    <div class="flex flex-col items-center text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">{linkedinData.name.first} {linkedinData.name.last}</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-2">{linkedinData.headline}</p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mb-6">
        <MapPin class="inline-block w-4 h-4 mr-1" />
        {linkedinData.location}
      </p>
      <div class="flex gap-4">
        {#each socialLinks as socialLink}
          <a
            rel="me"
            href={socialLink.href}
            title={socialLink.title}
            class="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            target="_blank"
          >
            {#if iconComponents[socialLink.icon]}
              <svelte:component this={iconComponents[socialLink.icon]} class="w-5 h-5" />
            {/if}
          </a>
        {/each}
      </div>
    </div>

    <!-- Bio -->
    <div class="prose prose-gray dark:prose-invert max-w-none">
      <p class="text-lg leading-relaxed">
        {linkedinData.summary}
      </p>
    </div>
  </Container>
</Section>

<!-- Timeline -->
<Section spacing="lg">
  <Container variant="content">
    <h2 class="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">Timeline</h2>
    <Timeline items={allEvents} />
  </Container>
</Section>
