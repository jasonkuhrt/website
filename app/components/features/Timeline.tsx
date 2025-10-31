import { css } from '#styled-system/css'
import { token } from '#styled-system/tokens'
import type { Experience } from '#~/data/schemas/experiences/__.js'
import {
  eventTypes,
  getColorForExperience,
  getIconForExperience,
  getIconForTag,
  getLabelForTag,
} from '#~/lib/experienceRegistry.js'
import { useEffect, useState } from 'react'
import { F, L, Text, UI } from '../__'

// Note: All CSS definitions inlined per project convention (single-use styles must be inlined)

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
      <L.Flex.Row justify='between' align='start' wrap className={css({ marginBottom: '8', gap: '4' })}>
        <L.Flex.Row wrap align='center' className={css({ gap: '2' })}>
          {eventTypes.map((eventType) => {
            const IconComponent = getIconForTag(eventType)

            return (
              <F.FilterButton
                key={eventType}
                icon={
                  <div className={css({ width: '3', height: '3' })}>
                    <IconComponent />
                  </div>
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
            <Text.Text
              color='text.tertiary'
              transitionProperty='colors'
              transitionDuration='base'
              _hover={{ color: 'text.secondary' }}
            >
              <UI.Badge icon='HelpCircle' scale='4' />
            </Text.Text>
          </button>
        </L.Flex.Row>
        <button
          type='button'
          className={css({ paddingInline: '2', paddingBlock: '1', borderRadius: '1', transitionProperty: '[opacity]', transitionDuration: 'fast', gap: '2', ...(timeScaleMode ? { opacity: '40' } : {}) })}
          onClick={toggleTimeScale}
        >
          <L.Flex.Row align='center' gap='2'>
            <UI.Badge icon='Ruler' scale='3' />
            <Text.Text fontSize='2'>Time Scale</Text.Text>
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
            className={`${UI.modalStyles.centeredContent} ${css({ backgroundColor: 'surface.base', borderRadius: '1', boxShadow: 'lg', padding: '6', maxWidth: '28', border: '[1px solid]', borderColor: 'border.default' })}`}
            onClick={(e) => e.stopPropagation()}
          >
            <L.Flex.Row justify='between' align='start' className={css({ marginBottom: '4' })}>
              <Text.H3 fontSize='5' fontWeight='semibold' color='text.primary'>Timeline Filters</Text.H3>
              <button
                onClick={() => setShowHelpOverlay(false)}
              >
                <Text.Text
                  color='text.tertiary'
                  transitionProperty='colors'
                  transitionDuration='base'
                  _hover={{ color: 'text.secondary' }}
                >
                  <UI.Badge icon='X' scale='7' />
                </Text.Text>
              </button>
            </L.Flex.Row>
            <L.Flex.Col gap='2'>
              <Text.P fontSize='2' color='text.secondary'>
                <Text.Text as='strong'>Click</Text.Text> a filter button to toggle that category on/off
              </Text.P>
              <Text.P fontSize='2' color='text.secondary'>
                <Text.Text as='strong'>Alt+Click</Text.Text> a filter button to show only that category
              </Text.P>
              <Text.P fontSize='2' color='text.secondary'>
                <Text.Text as='strong'>Time Scale</Text.Text>{' '}
                toggles between evenly-spaced and chronologically-accurate layout (1 pixel = 1 day)
              </Text.P>
            </L.Flex.Col>
          </div>
        </div>
      )}

      <div className={css({ position: 'relative', marginTop: '2' })}>
        {/* SVG Timeline */}
        <svg className={css({ position: 'absolute', left: '[0]', top: '[0]', height: 'full', width: 'full', pointerEvents: 'none' })} aria-hidden='true' id='timeline-svg'>
          <g className={css({ display: 'block', sm: { display: 'none' } })}>
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
          <g className={css({ display: 'none', sm: { display: 'block' }, md: { display: 'none' } })}>
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
          <g className={css({ display: 'none', md: { display: 'block' } })}>
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
              className={`timeline-item ${css({ position: 'relative', display: 'grid', gridTemplateColumns: '[78px auto]', gap: '4', paddingBottom: '12', _last: { paddingBottom: '[0]' }, scrollMarginTop: '8', marginLeft: '-4', paddingLeft: '4', paddingBlock: '4', borderRadius: '1', transitionProperty: '[background-color]', transitionDuration: 'base', sm: { gridTemplateColumns: '[102px auto]', gap: '6' }, md: { gridTemplateColumns: '[138px auto]', gap: '8' } })} ${anchoredItemId === itemId ? 'is-anchored' : ''}`}
              data-type={item._tag}
              style={{ minHeight: '180px' }}
            >
              {/* Date on left */}
              <div className={css({ textAlign: 'right', sm: { whiteSpace: 'nowrap' } })}>
                <div className={css({ lineHeight: '4' })}>
                  <UI.DateRange
                    startDate={startDate}
                    endDate={endDate}
                  />
                </div>
              </div>

              {/* Timeline node and content */}
              <div className={css({ position: 'relative', paddingLeft: '4' })}>
                {/* SVG Node */}
                <a
                  href={`#${itemId}`}
                  className={`timeline-node-link ${css({ position: 'absolute', left: '[0]', top: '[0]', pointerEvents: 'auto' })}`}
                  aria-label={`Jump to ${
                    item._tag === 'WorkExperience' ?
                      item.company :
                      item._tag === 'Education' ?
                      item.institution :
                      item.title
                  }`}
                  onClick={(e) => handleNodeLinkClick(e, itemId)}
                >
                  <div className={css({ position: 'relative', width: '2', height: '2' })}>
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
                <L.Flex.Row align='start' className={css({ lineHeight: '4', gap: '2' })}>
                  <Text.Text as='div' color='text.secondary'>
                    <IconComponent className={css({ width: '2', height: '2', flexShrink: '[0]', paddingTop: '1' })} />
                  </Text.Text>
                  <div className={css({ flex: '[1]', minWidth: '[0]' })}>
                    {item._tag === 'WorkExperience' && (
                      <>
                        <Text.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.title}
                        </Text.H2>
                        <Text.Text fontSize='2' color='text.secondary' opacity='60' marginBottom='2'>
                          @ {item.company}
                        </Text.Text>
                        {item.overview && (
                          <Text.P fontSize='2' color='text.secondary' opacity='80'>{item.overview}</Text.P>
                        )}
                      </>
                    )}
                    {item._tag === 'Education' && (
                      <>
                        <Text.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.degree}
                        </Text.H2>
                        <Text.Text fontSize='2' color='text.secondary' opacity='60' marginBottom='2'>
                          @ {item.institution}
                        </Text.Text>
                        {item.description && (
                          <Text.P fontSize='2' color='text.secondary' opacity='80'>{item.description}</Text.P>
                        )}
                      </>
                    )}
                    {item._tag === 'Achievement' && (
                      <>
                        <Text.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.title}
                        </Text.H2>
                        <Text.Text fontSize='2' color='text.secondary' opacity='60' marginBottom='2'>
                          @ {item.issuer}
                        </Text.Text>
                        {item.description && (
                          <Text.P fontSize='2' color='text.secondary' opacity='80'>{item.description}</Text.P>
                        )}
                      </>
                    )}
                    {item._tag === 'Speaking' && (
                      <>
                        <Text.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.title}
                        </Text.H2>
                        <Text.Text fontSize='2' color='text.secondary' opacity='60' marginBottom='3'>
                          @ {item.venue}
                        </Text.Text>
                        <L.Flex.Row gap='2'>
                          {item.links?.repo ?
                            (
                              <UI.Link.Ext
                                href={item.links.repo}
                                className={UI.transitions.opacityHidden}
                              >
                                <UI.Badge icon='Github' scale='4' />
                              </UI.Link.Ext>
                            ) :
                            (
                              <div className={UI.transitions.opacityDimmed}>
                                <UI.Badge icon='Github' scale='4' />
                              </div>
                            )}
                          {item.links?.info ?
                            (
                              <UI.Link.Ext
                                href={item.links.info}
                                className={UI.transitions.opacityHidden}
                              >
                                <UI.Badge icon='Link' scale='4' />
                              </UI.Link.Ext>
                            ) :
                            (
                              <div className={UI.transitions.opacityDimmed}>
                                <UI.Badge icon='Link' scale='4' />
                              </div>
                            )}
                          {item.links?.recording ?
                            (
                              <UI.Link.Ext
                                href={item.links.recording}
                                className={UI.transitions.opacityHidden}
                              >
                                <UI.Badge icon='Play' scale='4' />
                              </UI.Link.Ext>
                            ) :
                            (
                              <div className={UI.transitions.opacityDimmed}>
                                <UI.Badge icon='Video' scale='4' />
                              </div>
                            )}
                          {item.links?.twitter && (
                            <UI.Link.Ext
                              href={item.links.twitter}
                              className={UI.transitions.opacityHidden}
                            >
                              <UI.Badge icon='X' scale='4' />
                            </UI.Link.Ext>
                          )}
                        </L.Flex.Row>
                      </>
                    )}
                    {item._tag === 'Personal' && (
                      <>
                        <Text.H2 fontSize='5' fontWeight='semibold' color='text.primary' marginBottom='1'>
                          {item.title}
                        </Text.H2>
                        {item.description && (
                          <Text.P fontSize='2' color='text.secondary' opacity='80'>{item.description}</Text.P>
                        )}
                        {item.url && (
                          <div className={css({ marginTop: '2' })}>
                            <UI.Link.Ext
                              href={item.url}
                              className={`${css({ display: 'inline-block' })} ${UI.transitions.opacityHidden}`}
                              aria-label='Read more'
                            >
                              <UI.Badge icon='Link' scale='4' />
                            </UI.Link.Ext>
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
