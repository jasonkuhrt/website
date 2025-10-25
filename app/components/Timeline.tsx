import styles from "./Timeline.module.css"
import {
  Award,
  Baby,
  Brain,
  Briefcase,
  Github,
  GraduationCap,
  Heart,
  HelpCircle,
  Home,
  Link,
  MapPin,
  Mountain,
  Play,
  Presentation,
  Ruler,
  Video,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

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
    url?: string
  }

interface Props {
  items: TimelineEvent[]
}

// Icon lookup map for personal event icons
const iconMap: Record<string, LucideIcon> = {
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
  if (monthYear) return new Date(`${monthYear[1]} 1, ${monthYear[2]}`)
  const year = dateStr.match(/^\d{4}$/)
  if (year) return new Date(`${dateStr}-01-01`)
  return new Date(dateStr)
}

function getItemDate(item: TimelineEvent): Date {
  if (item.type === 'achievement' || item.type === 'speaking' || item.type === 'personal') return parseDate(item.date)
  return parseDate(item.startDate)
}

export const Timeline: React.FC<Props> = ({ items }) => {
  const [filters, setFilters] = useState<Set<TimelineEvent['type']>>(
    new Set(['experience', 'education', 'achievement', 'speaking', 'personal']),
  )
  const [timeScaleMode, setTimeScaleMode] = useState(false)
  const [showHelpOverlay, setShowHelpOverlay] = useState(false)
  const [anchoredItemId, setAnchoredItemId] = useState<string | null>(null)

  function toggleFilter(type: TimelineEvent['type'], altKey: boolean) {
    if (altKey) setFilters(new Set([type]))
    else {
      setFilters((prev) => {
        const newFilters = new Set(prev)
        if (newFilters.has(type)) {
          if (newFilters.size > 1) newFilters.delete(type)
        } else {
          newFilters.add(type)
        }
        return newFilters
      })
    }

    if (typeof localStorage !== 'undefined')
      localStorage.setItem('timeline-filters', JSON.stringify(Array.from(filters)))

    setTimeout(updateSVGLines, 50)
  }

  function toggleTimeScale() {
    setTimeScaleMode((prev) => !prev)

    if (typeof localStorage !== 'undefined') localStorage.setItem('timeline-time-scale', (!timeScaleMode).toString())

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
    setAnchoredItemId(currentHash || null)
  }

  function handleNodeLinkClick(event: React.MouseEvent, itemId: string) {
    const currentHash = window.location.hash.substring(1)

    if (currentHash === itemId) {
      event.preventDefault()
      setAnchoredItemId(null)
      history.pushState(null, '', window.location.pathname + window.location.search)
    } else {
      setTimeout(updateAnchoredState, 0)
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showHelpOverlay) setShowHelpOverlay(false)
  }

  useEffect(() => {
    // Load saved state
    if (typeof localStorage !== 'undefined') {
      const savedFilters = localStorage.getItem('timeline-filters')
      if (savedFilters) setFilters(new Set(JSON.parse(savedFilters)))

      const savedTimeScale = localStorage.getItem('timeline-time-scale')
      if (savedTimeScale === 'true') setTimeScaleMode(true)
    }

    // Initial setup
    updateAnchoredState()

    if (timeScaleMode) updateTimelinePositions()

    // Initial SVG line positioning
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateSVGLines()
      })
    })

    // Event listeners
    window.addEventListener('hashchange', updateAnchoredState)
    const handleResize = () => setTimeout(updateSVGLines, 100)
    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('hashchange', updateAnchoredState)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  // Update SVG lines when filters or time scale mode changes
  useEffect(() => {
    setTimeout(updateSVGLines, 50)
  }, [filters, timeScaleMode])

  return (
    <>
      {/* Filter and mode toggles */}
      <div className={styles.header}>
        <div className={styles.linkGroup}>
          {eventTypes.map((eventType) => {
            const IconComponent = eventType === 'personal' ?
              Heart :
              eventType === 'experience' ?
              Briefcase :
              eventType === 'education' ?
              GraduationCap :
              eventType === 'achievement' ?
              Award :
              Presentation

            return (
              <button
                key={eventType}
                type='button'
                className={`timeline-filter px-2 py-1 rounded text-xs transition-opacity flex items-center gap-1.5 ${
                  !filters.has(eventType) ? 'opacity-40' : ''
                }`}
                onClick={(e) => toggleFilter(eventType, e.altKey)}
              >
                <IconComponent className='w-2.5 h-2.5' />
                {getNodeLabel(eventType)}
              </button>
            )
          })}
          <button
            type='button'
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            aria-label='Show filter help'
            onClick={() => setShowHelpOverlay(true)}
          >
            <HelpCircle className='w-3.5 h-3.5' />
          </button>
        </div>
        <button
          type='button'
          className={`px-2 py-1 rounded text-xs transition-opacity flex items-center gap-1.5 ${
            !timeScaleMode ? 'opacity-100' : 'opacity-40'
          }`}
          onClick={toggleTimeScale}
        >
          <Ruler className='w-2.5 h-2.5' />
          Time Scale
        </button>
      </div>

      {/* Help overlay */}
      {showHelpOverlay && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowHelpOverlay(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Timeline Filters</h3>
              <button
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                onClick={() => setShowHelpOverlay(false)}
              >
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className={styles.details}>
              <p>
                <strong>Click</strong> a filter button to toggle that category on/off
              </p>
              <p>
                <strong>Alt+Click</strong> a filter button to show only that category
              </p>
              <p>
                <strong>Time Scale</strong>{' '}
                toggles between evenly-spaced and chronologically-accurate layout (1 pixel = 1 day)
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.event}>
        {/* SVG Timeline */}
        <svg className={styles.iconLabel} aria-hidden='true' id='timeline-svg'>
          <g className='timeline-lines-mobile sm:hidden'>
            {items.map((item, index) => (
              index < items.length - 1 && (
                <line
                  key={index}
                  x1={LINE_X_MOBILE}
                  y1={index * 180 + NODE_CENTER}
                  x2={LINE_X_MOBILE}
                  y2={(index + 1) * 180 + NODE_CENTER}
                  className='timeline-line stroke-gray-200 dark:stroke-gray-800'
                  strokeWidth='1'
                  data-type={item.type}
                  data-index={index}
                />
              )
            ))}
            <line
              x1={LINE_X_MOBILE}
              y1={(items.length - 1) * 180 + NODE_CENTER}
              x2={LINE_X_MOBILE}
              y2={(items.length - 1) * 180 + NODE_CENTER + 800}
              className='timeline-line stroke-gray-200 dark:stroke-gray-800'
              strokeWidth='1'
              opacity='0.5'
            />
          </g>
          <g className='timeline-lines-sm hidden sm:block md:hidden'>
            {items.map((item, index) => (
              index < items.length - 1 && (
                <line
                  key={index}
                  x1={LINE_X_SM}
                  y1={index * 180 + NODE_CENTER}
                  x2={LINE_X_SM}
                  y2={(index + 1) * 180 + NODE_CENTER}
                  className='timeline-line stroke-gray-200 dark:stroke-gray-800'
                  strokeWidth='1'
                  data-type={item.type}
                  data-index={index}
                />
              )
            ))}
            <line
              x1={LINE_X_SM}
              y1={(items.length - 1) * 180 + NODE_CENTER}
              x2={LINE_X_SM}
              y2={(items.length - 1) * 180 + NODE_CENTER + 800}
              className='timeline-line stroke-gray-200 dark:stroke-gray-800'
              strokeWidth='1'
              opacity='0.5'
            />
          </g>
          <g className='timeline-lines-md hidden md:block'>
            {items.map((item, index) => (
              index < items.length - 1 && (
                <line
                  key={index}
                  x1={LINE_X_MD}
                  y1={index * 180 + NODE_CENTER}
                  x2={LINE_X_MD}
                  y2={(index + 1) * 180 + NODE_CENTER}
                  className='timeline-line stroke-gray-200 dark:stroke-gray-800'
                  strokeWidth='1'
                  data-type={item.type}
                  data-index={index}
                />
              )
            ))}
            <line
              x1={LINE_X_MD}
              y1={(items.length - 1) * 180 + NODE_CENTER}
              x2={LINE_X_MD}
              y2={(items.length - 1) * 180 + NODE_CENTER + 800}
              className='timeline-line stroke-gray-200 dark:stroke-gray-800'
              strokeWidth='1'
              opacity='0.5'
            />
          </g>
        </svg>

        {items.map((item) => {
          const isSingleDate = item.type === 'achievement' || item.type === 'speaking' || item.type === 'personal'
          const startDate = isSingleDate ? item.date : item.startDate
          const endDate = isSingleDate ? null : item.endDate === 'Present' ? null : item.endDate
          const itemId = getItemId(item)
          const nodeColor = getNodeColor(item.type)
          const isVisible = filters.has(item.type)
          const IconComponent = getNodeIconComponent(item)

          if (!isVisible) return null

          return (
            <div
              key={itemId}
              id={itemId}
              className={`timeline-item relative grid grid-cols-[80px_auto] sm:grid-cols-[100px_auto] md:grid-cols-[140px_auto] gap-4 sm:gap-6 md:gap-8 pb-12 last:pb-0 scroll-mt-8 -ml-4 pl-4 py-4 rounded transition-colors ${
                anchoredItemId === itemId ? 'is-anchored' : ''
              }`}
              data-type={item.type}
              style={{ minHeight: '180px' }}
            >
              {/* Date on left */}
              <div className='text-right text-sm text-gray-700 dark:text-gray-400 sm:whitespace-nowrap flex items-start justify-end'>
                <div className={styles.eventContentSimple}>
                  <span className={styles.inlineBlock}>{startDate}</span>
                  {endDate && (
                    <>
                      <span className={styles.hiddenSmall}>-</span>
                      <span className={styles.inlineBlock}>{endDate}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Timeline node and content */}
              <div className={styles.timeline}>
                {/* SVG Node */}
                <a
                  href={`#${itemId}`}
                  className='timeline-node-link absolute left-0 top-0 pointer-events-auto'
                  aria-label={`Jump to ${
                    item.type === 'experience' ?
                      item.company :
                      item.type === 'education' ?
                      item.institution :
                      item.title
                  }`}
                  onClick={(e) => handleNodeLinkClick(e, itemId)}
                >
                  <div className={styles.iconButton}>
                    <svg
                      width='32'
                      height='32'
                      viewBox='0 0 32 32'
                      className='timeline-node-circle transition-transform'
                    >
                      <circle
                        cx='16'
                        cy='16'
                        r='15'
                        fill={nodeColor}
                        className='timeline-node-outer-ring transition-opacity'
                      />
                      <circle cx='16' cy='16' r='8' fill={nodeColor} />
                    </svg>
                  </div>
                </a>

                {/* Content */}
                <div className={styles.eventContent}>
                  <IconComponent className='w-6 h-6 text-gray-600 dark:text-gray-400 flex-shrink-0 pt-1' />
                  <div className={styles.heading}>
                    {item.type === 'experience' && (
                      <>
                        <div className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
                          {item.title}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400 opacity-60 mb-2'>@ {item.company}</div>
                        {item.description && (
                          <p className='text-sm text-gray-700 dark:text-gray-300 opacity-80'>{item.description}</p>
                        )}
                      </>
                    )}
                    {item.type === 'education' && (
                      <>
                        <div className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
                          {item.degree}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400 opacity-60 mb-2'>
                          @ {item.institution}
                        </div>
                        {item.description && (
                          <p className='text-sm text-gray-700 dark:text-gray-300 opacity-80'>{item.description}</p>
                        )}
                      </>
                    )}
                    {item.type === 'achievement' && (
                      <>
                        <div className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
                          {item.title}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400 opacity-60 mb-2'>@ {item.issuer}</div>
                        {item.description && (
                          <p className='text-sm text-gray-700 dark:text-gray-300 opacity-80'>{item.description}</p>
                        )}
                      </>
                    )}
                    {item.type === 'speaking' && (
                      <>
                        <div className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
                          {item.title}
                        </div>
                        <div className='text-sm text-gray-600 dark:text-gray-400 opacity-60 mb-3'>@ {item.venue}</div>
                        <div className={styles.controls}>
                          {item.links.repo ?
                            (
                              <a
                                className={styles.iconHidden}
                                href={item.links.repo}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <Github className='w-3.5 h-3.5' />
                              </a>
                            ) :
                            (
                              <div className={styles.iconLabelDimmed}>
                                <Github className='w-3.5 h-3.5' />
                              </div>
                            )}
                          {item.links.info ?
                            (
                              <a
                                className={styles.iconHidden}
                                href={item.links.info}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <Link className='w-3.5 h-3.5' />
                              </a>
                            ) :
                            (
                              <div className={styles.iconLabelDimmed}>
                                <Link className='w-3.5 h-3.5' />
                              </div>
                            )}
                          {item.links.recording ?
                            (
                              <a
                                className={styles.iconHidden}
                                href={item.links.recording}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <Play className='w-3.5 h-3.5' />
                              </a>
                            ) :
                            (
                              <div className={styles.iconLabelDimmed}>
                                <Video className='w-3.5 h-3.5' />
                              </div>
                            )}
                          {item.links.twitter && (
                            <a
                              className={styles.iconHidden}
                              href={item.links.twitter}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <X className='w-3.5 h-3.5' />
                            </a>
                          )}
                        </div>
                      </>
                    )}
                    {item.type === 'personal' && (
                      <>
                        <div className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1'>
                          {item.title}
                        </div>
                        {item.description && (
                          <p className='text-sm text-gray-700 dark:text-gray-300 opacity-80'>{item.description}</p>
                        )}
                        {item.url && (
                          <div className={styles.spacing}>
                            <a
                              className={styles.detailLinkInline}
                              href={item.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              aria-label='Read more'
                            >
                              <Link className='w-3.5 h-3.5' />
                            </a>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>
        {`
        .timeline-item:target,
        .timeline-item.is-anchored {
          background-color: rgba(200, 200, 200, 0.08);
        }

        :global(.dark) .timeline-item:target,
        :global(.dark) .timeline-item.is-anchored {
          background-color: rgba(100, 100, 100, 0.05);
        }

        .timeline-node-link:hover .timeline-node-circle {
          transform: scale(1.15);
        }

        .timeline-node-outer-ring {
          opacity: 0;
        }

        .timeline-item:target .timeline-node-outer-ring,
        .timeline-item.is-anchored .timeline-node-outer-ring {
          opacity: 0.15;
        }
      `}
      </style>
    </>
  )
}
