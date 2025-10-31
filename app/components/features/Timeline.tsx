import {
  Github,
  Heart,
  HelpCircle,
  Link,
  Play,
  Ruler,
  Video,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { css } from '../../../styled-system/css'
import { token } from '../../../styled-system/tokens'
import type { Experience } from '../../data/schemas/experiences/__.js'
import {
  eventTypes,
  getColorForExperience,
  getIconForExperience,
  getIconForTag,
  getLabelForTag,
} from '../../lib/experienceRegistry.js'
import { F, L, T, UI } from '../__'

const header = css({
  marginBottom: '8',
  gap: '4',
})

const heading = css({
  flex: '[1]',
  minWidth: '[0]',
})

const iconButton = css({
  position: 'relative',
  width: '2',
  height: '2',
})

const iconLabel = css({
  position: 'absolute',
  left: '[0]',
  top: '[0]',
  height: 'full',
  width: 'full',
  pointerEvents: 'none',
})

const nodeLink = css({
  position: 'absolute',
  left: '[0]',
  top: '[0]',
  pointerEvents: 'auto',
})

const timelineLinesMobile = css({
  display: 'block',
  sm: {
    display: 'none',
  },
})

const timelineLinesSm = css({
  display: 'none',
  sm: {
    display: 'block',
  },
  md: {
    display: 'none',
  },
})

const timelineLinesMd = css({
  display: 'none',
  md: {
    display: 'block',
  },
})

const timeline = css({
  position: 'relative',
  paddingLeft: '4',
})

const event = css({
  position: 'relative',
  marginTop: '2',
})

const eventContent = css({
  lineHeight: '4',
  gap: '2',
})

const eventContentSimple = css({
  lineHeight: '4',
})

const inlineBlock = css({
  display: 'inline-block',
})

const spacing = css({
  marginTop: '2',
})

const linkGroup = css({
  gap: '2',
})

const detailLinkInline = css({
  display: 'inline-block',
})

const modalContent = css({
  backgroundColor: 'surface.base',
  borderRadius: '1',
  boxShadow: 'lg',
  padding: '6',
  maxWidth: '28',
  border: '[1px solid]',
  borderColor: 'border.default',
})

const modalHeader = css({
  marginBottom: '4',
})

const dateContainer = css({
  textAlign: 'right',
  sm: {
    whiteSpace: 'nowrap',
  },
})

const timelineItem = css({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '[78px auto]',
  gap: '4',
  paddingBottom: '12',
  _last: {
    paddingBottom: '[0]',
  },
  scrollMarginTop: '8',
  marginLeft: '-4',
  paddingLeft: '4',
  paddingBlock: '4',
  borderRadius: '1',
  transitionProperty: '[background-color]',
  transitionDuration: 'base',
  sm: {
    gridTemplateColumns: '[102px auto]',
    gap: '6',
  },
  md: {
    gridTemplateColumns: '[138px auto]',
    gap: '8',
  },
})

const iconComponent = css({
  width: '2',
  height: '2',
  flexShrink: '[0]',
  paddingTop: '1',
})

const timeScaleButton = css({
  paddingInline: '2',
  paddingBlock: '1',
  borderRadius: '1',
  transitionProperty: '[opacity]',
  transitionDuration: 'fast',
  gap: '2',
})

const timeScaleButtonInactive = css({
  opacity: '40',
})

interface Props {
  items: Experience[]
}

// Timeline positioning constants
// The #timeline-svg spans the full viewport with coordinates starting at x=0
// Timeline node circles are positioned absolutely in viewport space
const NODE_SIZE = 32
const NODE_CENTER = NODE_SIZE / 2

// These values are measured from actual browser rendering at each breakpoint
const LINE_X_MD = 484 // Measured at 1280px viewport
const LINE_X_SM = 200 // Estimated for sm breakpoint
const LINE_X_MOBILE = 168 // Estimated for mobile breakpoint

export const Timeline: React.FC<Props> = ({ items }) => {
  const [filters, setFilters] = useState<Set<Experience['_tag']>>(
    new Set(['WorkExperience', 'Education', 'Achievement', 'Speaking', 'Personal']),
  )
  const [timeScaleMode, setTimeScaleMode] = useState(false)
  const [showHelpOverlay, setShowHelpOverlay] = useState(false)
  const [anchoredItemId, setAnchoredItemId] = useState<string | null>(null)

  function toggleFilter(type: Experience['_tag'], altKey: boolean) {
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

    const dates = items.map((item) => item.date)
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
      <L.Flex.Row justify='between' align='start' wrap className={header}>
        <L.Flex.Row wrap align='center' className={linkGroup}>
          {eventTypes.map((eventType) => {
            const IconComponent = getIconForTag(eventType)

            return (
              <F.FilterButton
                key={eventType}
                icon={
                  <UI.Icon size='xs'>
                    <IconComponent />
                  </UI.Icon>
                }
                label={getLabelForTag(eventType)}
                active={filters.has(eventType)}
                onClick={(e) => toggleFilter(eventType, e.altKey)}
              />
            )
          })}
          <button
            type='button'
            aria-label='Show filter help'
            onClick={() => setShowHelpOverlay(true)}
          >
            <T.Text
              color='text.tertiary'
              transitionProperty='colors'
              transitionDuration='base'
              _hover={{ color: 'text.secondary' }}
            >
              <UI.Icon size='sm'>
                <HelpCircle />
              </UI.Icon>
            </T.Text>
          </button>
        </L.Flex.Row>
        <button
          type='button'
          className={`${timeScaleButton} ${timeScaleMode ? timeScaleButtonInactive : ''}`}
          onClick={toggleTimeScale}
        >
          <L.Flex.Row align='center' gap='2'>
            <UI.Icon size='xs'>
              <Ruler />
            </UI.Icon>
            <T.Text fontSize='2'>Time Scale</T.Text>
          </L.Flex.Row>
        </button>
      </L.Flex.Row>

      {/* Help overlay */}
      {showHelpOverlay && (
        <div
          className={UI.modalStyles.overlay}
          onClick={() => setShowHelpOverlay(false)}
        >
          <div
            className={`${UI.modalStyles.centeredContent} ${modalContent}`}
            onClick={(e) => e.stopPropagation()}
          >
            <L.Flex.Row justify='between' align='start' className={modalHeader}>
              <T.H3 fontSize='5' fontWeight='semibold' color='text.primary'>Timeline Filters</T.H3>
              <button
                onClick={() => setShowHelpOverlay(false)}
              >
                <T.Text
                  color='text.tertiary'
                  transitionProperty='colors'
                  transitionDuration='base'
                  _hover={{ color: 'text.secondary' }}
                >
                  <UI.Icon size='lg'>
                    <X />
                  </UI.Icon>
                </T.Text>
              </button>
            </L.Flex.Row>
            <L.Flex.Col gap='2'>
              <T.P fontSize='2' color='text.secondary'>
                <T.Text as='strong'>Click</T.Text> a filter button to toggle that category on/off
              </T.P>
              <T.P fontSize='2' color='text.secondary'>
                <T.Text as='strong'>Alt+Click</T.Text> a filter button to show only that category
              </T.P>
              <T.P fontSize='2' color='text.secondary'>
                <T.Text as='strong'>Time Scale</T.Text>{' '}
                toggles between evenly-spaced and chronologically-accurate layout (1 pixel = 1 day)
              </T.P>
            </L.Flex.Col>
          </div>
        </div>
      )}

      <div className={event}>
        {/* SVG Timeline */}
        <svg className={iconLabel} aria-hidden='true' id='timeline-svg'>
          <g className={timelineLinesMobile}>
            {items.map((item, index) => (
              index < items.length - 1 && (
                <line
                  key={index}
                  x1={LINE_X_MOBILE}
                  y1={index * 180 + NODE_CENTER}
                  x2={LINE_X_MOBILE}
                  y2={(index + 1) * 180 + NODE_CENTER}
                  stroke={token('colors.border.hover')}
                  strokeWidth='2'
                  data-type={item._tag}
                  data-index={index}
                />
              )
            ))}
            <line
              x1={LINE_X_MOBILE}
              y1={(items.length - 1) * 180 + NODE_CENTER}
              x2={LINE_X_MOBILE}
              y2={(items.length - 1) * 180 + NODE_CENTER + 800}
              stroke={token('colors.border.default')}
              strokeWidth='1'
              opacity='0.5'
            />
          </g>
          <g className={timelineLinesSm}>
            {items.map((item, index) => (
              index < items.length - 1 && (
                <line
                  key={index}
                  x1={LINE_X_SM}
                  y1={index * 180 + NODE_CENTER}
                  x2={LINE_X_SM}
                  y2={(index + 1) * 180 + NODE_CENTER}
                  stroke={token('colors.border.hover')}
                  strokeWidth='2'
                  data-type={item._tag}
                  data-index={index}
                />
              )
            ))}
            <line
              x1={LINE_X_SM}
              y1={(items.length - 1) * 180 + NODE_CENTER}
              x2={LINE_X_SM}
              y2={(items.length - 1) * 180 + NODE_CENTER + 800}
              stroke={token('colors.border.default')}
              strokeWidth='1'
              opacity='0.5'
            />
          </g>
          <g className={timelineLinesMd}>
            {items.map((item, index) => (
              index < items.length - 1 && (
                <line
                  key={index}
                  x1={LINE_X_MD}
                  y1={index * 180 + NODE_CENTER}
                  x2={LINE_X_MD}
                  y2={(index + 1) * 180 + NODE_CENTER}
                  stroke={token('colors.border.hover')}
                  strokeWidth='2'
                  data-type={item._tag}
                  data-index={index}
                />
              )
            ))}
            <line
              x1={LINE_X_MD}
              y1={(items.length - 1) * 180 + NODE_CENTER}
              x2={LINE_X_MD}
              y2={(items.length - 1) * 180 + NODE_CENTER + 800}
              stroke={token('colors.border.default')}
              strokeWidth='1'
              opacity='0.5'
            />
          </g>
        </svg>

        {items.map((item) => {
          const isSingleDate = item._tag === 'Achievement' || item._tag === 'Speaking' || item._tag === 'Personal'
          const startDate = item.date
          const endDate = isSingleDate ? undefined : item.endDate
          const itemId = item.id
          const nodeColor = getColorForExperience(item)
          const isVisible = filters.has(item._tag)
          const IconComponent = getIconForExperience(item)

          if (!isVisible) return null

          return (
            <div
              key={itemId}
              id={itemId}
              className={`timeline-item ${timelineItem} ${anchoredItemId === itemId ? 'is-anchored' : ''}`}
              data-type={item._tag}
              style={{ minHeight: '180px' }}
            >
              {/* Date on left */}
              <div className={dateContainer}>
                <div className={eventContentSimple}>
                  <UI.DateRange
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </div>

              {/* Timeline node and content */}
              <div className={timeline}>
                {/* SVG Node */}
                <a
                  href={`#${itemId}`}
                  className={`timeline-node-link ${nodeLink}`}
                  aria-label={`Jump to ${
                    item._tag === 'WorkExperience' ?
                      item.company :
                      item._tag === 'Education' ?
                      item.institution :
                      item.title
                  }`}
                  onClick={(e) => handleNodeLinkClick(e, itemId)}
                >
                  <div className={iconButton}>
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
                <L.Flex.Row align='start' className={eventContent}>
                  <T.Text as='div' color='text.secondary'>
                    <IconComponent className={iconComponent} />
                  </T.Text>
                  <div className={heading}>
                    {item._tag === 'WorkExperience' && (
                      <>
                        <T.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.title}
                        </T.H2>
                        <T.Text fontSize='2' color='text.secondary' opacity='60' marginBottom='2'>
                          @ {item.company}
                        </T.Text>
                        {item.overview && <T.P fontSize='2' color='text.secondary' opacity='80'>{item.overview}</T.P>}
                      </>
                    )}
                    {item._tag === 'Education' && (
                      <>
                        <T.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.degree}
                        </T.H2>
                        <T.Text fontSize='2' color='text.secondary' opacity='60' marginBottom='2'>
                          @ {item.institution}
                        </T.Text>
                        {item.description && (
                          <T.P fontSize='2' color='text.secondary' opacity='80'>{item.description}</T.P>
                        )}
                      </>
                    )}
                    {item._tag === 'Achievement' && (
                      <>
                        <T.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.title}
                        </T.H2>
                        <T.Text fontSize='2' color='text.secondary' opacity='60' marginBottom='2'>
                          @ {item.issuer}
                        </T.Text>
                        {item.description && (
                          <T.P fontSize='2' color='text.secondary' opacity='80'>{item.description}</T.P>
                        )}
                      </>
                    )}
                    {item._tag === 'Speaking' && (
                      <>
                        <T.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.title}
                        </T.H2>
                        <T.Text fontSize='2' color='text.secondary' opacity='60' marginBottom='3'>
                          @ {item.venue}
                        </T.Text>
                        <L.Flex.Row gap='2'>
                          {item.links?.repo ?
                            (
                              <UI.Link
                                href={item.links.repo}
                                external
                                className={UI.transitions.opacityHidden}
                              >
                                <UI.Icon size='sm'>
                                  <Github />
                                </UI.Icon>
                              </UI.Link>
                            ) :
                            (
                              <div className={UI.transitions.opacityDimmed}>
                                <UI.Icon size='sm'>
                                  <Github />
                                </UI.Icon>
                              </div>
                            )}
                          {item.links?.info ?
                            (
                              <UI.Link
                                href={item.links.info}
                                external
                                className={UI.transitions.opacityHidden}
                              >
                                <UI.Icon size='sm'>
                                  <Link />
                                </UI.Icon>
                              </UI.Link>
                            ) :
                            (
                              <div className={UI.transitions.opacityDimmed}>
                                <UI.Icon size='sm'>
                                  <Link />
                                </UI.Icon>
                              </div>
                            )}
                          {item.links?.recording ?
                            (
                              <UI.Link
                                href={item.links.recording}
                                external
                                className={UI.transitions.opacityHidden}
                              >
                                <UI.Icon size='sm'>
                                  <Play />
                                </UI.Icon>
                              </UI.Link>
                            ) :
                            (
                              <div className={UI.transitions.opacityDimmed}>
                                <UI.Icon size='sm'>
                                  <Video />
                                </UI.Icon>
                              </div>
                            )}
                          {item.links?.twitter && (
                            <UI.Link
                              href={item.links.twitter}
                              external
                              className={UI.transitions.opacityHidden}
                            >
                              <UI.Icon size='sm'>
                                <X />
                              </UI.Icon>
                            </UI.Link>
                          )}
                        </L.Flex.Row>
                      </>
                    )}
                    {item._tag === 'Personal' && (
                      <>
                        <T.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.title}
                        </T.H2>
                        {item.description && (
                          <T.P fontSize='2' color='text.secondary' opacity='80'>{item.description}</T.P>
                        )}
                        {item.url && (
                          <div className={spacing}>
                            <UI.Link
                              href={item.url}
                              external
                              className={`${detailLinkInline} ${UI.transitions.opacityHidden}`}
                              aria-label='Read more'
                            >
                              <UI.Icon size='sm'>
                                <Link />
                              </UI.Icon>
                            </UI.Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </L.Flex.Row>
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
