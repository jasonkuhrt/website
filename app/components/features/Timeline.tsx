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
import { DateString } from '../../data/schemas/DateString.js'
import {
  eventTypes,
  getColorForExperience,
  getIconForExperience,
  getIconForTag,
  getLabelForTag,
} from '../../lib/experienceRegistry.js'

const header = css({
  marginBottom: '8',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: '4',
})

const heading = css({
  flex: 1,
  minWidth: 0,
})

const controls = css({
  display: 'flex',
  gap: '2',
})

const iconButton = css({
  position: 'relative',
  width: '2rem',
  height: '2rem',
})

const iconHidden = css({
  opacity: '0.2',
  transition: 'opacity',
  _hover: {
    opacity: '1',
  },
})

const iconLabel = css({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  pointerEvents: 'none',
})

const iconLabelDimmed = css({
  opacity: '0.1',
})

const iconSizeSmall = css({
  width: '0.625rem',
  height: '0.625rem',
})

const iconSizeMedium = css({
  width: '0.875rem',
  height: '0.875rem',
})

const iconSizeLarge = css({
  width: '1.25rem',
  height: '1.25rem',
})

const nodeLink = css({
  position: 'absolute',
  left: 0,
  top: 0,
  pointerEvents: 'auto',
})

const hiddenSmall = css({
  display: 'none',
  sm: {
    display: 'inline',
  },
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
  paddingLeft: '4rem',
})

const event = css({
  position: 'relative',
  marginTop: '2',
})

const eventContent = css({
  lineHeight: '2rem',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '2',
})

const eventContentSimple = css({
  lineHeight: '2rem',
})

const inlineBlock = css({
  display: 'inline-block',
})

const spacing = css({
  marginTop: '2',
})

const details = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  fontSize: 'sm',
  color: 'text.secondary',
})

const linkGroup = css({
  display: 'flex',
  gap: '2',
  flexWrap: 'wrap',
  alignItems: 'center',
})

const detailLink = css({
  opacity: '0.2',
  transition: 'opacity',
  _hover: {
    opacity: '1',
  },
})

const detailLinkInline = css({
  opacity: '0.2',
  transition: 'opacity',
  display: 'inline-block',
  _hover: {
    opacity: '1',
  },
})

const modalOverlay = css({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'overlay.medium',
  zIndex: 40,
})

const modalContent = css({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'bg.default',
  borderRadius: 'radii.base',
  boxShadow: 'shadows.lg',
  padding: '6',
  maxWidth: '28rem',
  zIndex: 50,
  border: '1px solid',
  borderColor: 'border.default',
})

const modalHeader = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '4',
})

const modalTitle = css({
  fontSize: 'lg',
  fontWeight: 'fontWeights.semibold',
  color: 'text.primary',
})

const iconButtonColor = css({
  color: 'text.tertiary',
  transition: 'color',
  _hover: {
    color: 'text.secondary',
  },
})

const dateText = css({
  textAlign: 'right',
  fontSize: 'sm',
  color: 'text.secondary',
  sm: {
    whiteSpace: 'nowrap',
  },
})

const timelineItem = css({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '80px auto',
  gap: '4',
  paddingBottom: '12',
  _last: {
    paddingBottom: 0,
  },
  scrollMarginTop: '8',
  marginLeft: '-24px',
  paddingLeft: '4',
  paddingBlock: '4',
  borderRadius: 'radii.base',
  transition: 'background-color',
  sm: {
    gridTemplateColumns: '100px auto',
    gap: '6',
  },
  md: {
    gridTemplateColumns: '140px auto',
    gap: '8',
  },
})

const timelineTitle = css({
  fontSize: 'lg',
  fontWeight: 'fontWeights.semibold',
  color: 'text.primary',
  marginBottom: '1',
})

const timelineSubtitle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  opacity: '0.6',
  marginBottom: '2',
})

const timelineSubtitle3 = css({
  fontSize: 'sm',
  color: 'text.secondary',
  opacity: '0.6',
  marginBottom: '3',
})

const timelineDescription = css({
  fontSize: 'sm',
  fontFamily: 'serif',
  color: 'text.secondary',
  opacity: '0.8',
})

const iconComponent = css({
  width: '1.5rem',
  height: '1.5rem',
  color: 'text.secondary',
  flexShrink: 0,
  paddingTop: '1',
})

const filterButton = css({
  paddingInline: '2',
  paddingBlock: '1',
  borderRadius: 'radii.base',
  fontSize: 'xs',
  transition: 'opacity {durations.fast}',
  display: 'flex',
  alignItems: 'center',
  gap: '1.5',
})

const filterButtonInactive = css({
  opacity: 'opacity.40',
})

const timeScaleButton = css({
  paddingInline: '2',
  paddingBlock: '1',
  borderRadius: 'radii.base',
  fontSize: 'xs',
  transition: 'opacity {durations.fast}',
  display: 'flex',
  alignItems: 'center',
  gap: '1.5',
})

const timeScaleButtonInactive = css({
  opacity: 'opacity.40',
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
      <div className={header}>
        <div className={linkGroup}>
          {eventTypes.map((eventType) => {
            const IconComponent = getIconForTag(eventType)

            return (
              <button
                key={eventType}
                type='button'
                className={`${filterButton} ${!filters.has(eventType) ? filterButtonInactive : ''}`}
                onClick={(e) => toggleFilter(eventType, e.altKey)}
              >
                <IconComponent className={iconSizeSmall} />
                {getLabelForTag(eventType)}
              </button>
            )
          })}
          <button
            type='button'
            className={iconButtonColor}
            aria-label='Show filter help'
            onClick={() => setShowHelpOverlay(true)}
          >
            <HelpCircle className={iconSizeMedium} />
          </button>
        </div>
        <button
          type='button'
          className={`${timeScaleButton} ${timeScaleMode ? timeScaleButtonInactive : ''}`}
          onClick={toggleTimeScale}
        >
          <Ruler className={iconSizeSmall} />
          Time Scale
        </button>
      </div>

      {/* Help overlay */}
      {showHelpOverlay && (
        <div
          className={modalOverlay}
          onClick={() => setShowHelpOverlay(false)}
        >
          <div
            className={modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={modalHeader}>
              <h3 className={modalTitle}>Timeline Filters</h3>
              <button
                className={iconButtonColor}
                onClick={() => setShowHelpOverlay(false)}
              >
                <X className={iconSizeLarge} />
              </button>
            </div>
            <div className={details}>
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
              <div className={dateText}>
                <div className={eventContentSimple}>
                  <span className={inlineBlock}>{DateString.format(startDate)}</span>
                  {(endDate !== undefined || !isSingleDate) && (
                    <>
                      <span className={hiddenSmall}>-</span>
                      <span className={inlineBlock}>{DateString.format(endDate)}</span>
                    </>
                  )}
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
                <div className={eventContent}>
                  <IconComponent className={iconComponent} />
                  <div className={heading}>
                    {item._tag === 'WorkExperience' && (
                      <>
                        <div className={timelineTitle}>
                          {item.title}
                        </div>
                        <div className={timelineSubtitle}>@ {item.company}</div>
                        {item.overview && <p className={timelineDescription}>{item.overview}</p>}
                      </>
                    )}
                    {item._tag === 'Education' && (
                      <>
                        <div className={timelineTitle}>
                          {item.degree}
                        </div>
                        <div className={timelineSubtitle}>
                          @ {item.institution}
                        </div>
                        {item.description && <p className={timelineDescription}>{item.description}</p>}
                      </>
                    )}
                    {item._tag === 'Achievement' && (
                      <>
                        <div className={timelineTitle}>
                          {item.title}
                        </div>
                        <div className={timelineSubtitle}>@ {item.issuer}</div>
                        {item.description && <p className={timelineDescription}>{item.description}</p>}
                      </>
                    )}
                    {item._tag === 'Speaking' && (
                      <>
                        <div className={timelineTitle}>
                          {item.title}
                        </div>
                        <div className={timelineSubtitle3}>@ {item.venue}</div>
                        <div className={controls}>
                          {item.links?.repo ?
                            (
                              <a
                                className={iconHidden}
                                href={item.links.repo}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <Github className={iconSizeMedium} />
                              </a>
                            ) :
                            (
                              <div className={iconLabelDimmed}>
                                <Github className={iconSizeMedium} />
                              </div>
                            )}
                          {item.links?.info ?
                            (
                              <a
                                className={iconHidden}
                                href={item.links.info}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <Link className={iconSizeMedium} />
                              </a>
                            ) :
                            (
                              <div className={iconLabelDimmed}>
                                <Link className={iconSizeMedium} />
                              </div>
                            )}
                          {item.links?.recording ?
                            (
                              <a
                                className={iconHidden}
                                href={item.links.recording}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                <Play className={iconSizeMedium} />
                              </a>
                            ) :
                            (
                              <div className={iconLabelDimmed}>
                                <Video className={iconSizeMedium} />
                              </div>
                            )}
                          {item.links?.twitter && (
                            <a
                              className={iconHidden}
                              href={item.links.twitter}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <X className={iconSizeMedium} />
                            </a>
                          )}
                        </div>
                      </>
                    )}
                    {item._tag === 'Personal' && (
                      <>
                        <div className={timelineTitle}>
                          {item.title}
                        </div>
                        {item.description && <p className={timelineDescription}>{item.description}</p>}
                        {item.url && (
                          <div className={spacing}>
                            <a
                              className={detailLinkInline}
                              href={item.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              aria-label='Read more'
                            >
                              <Link className={iconSizeMedium} />
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
