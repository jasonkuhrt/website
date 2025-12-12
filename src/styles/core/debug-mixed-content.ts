/**
 * Mixed Content Detector
 *
 * CSS operates on boxes, not elements. When a block container has mixed
 * children (both block and inline), CSS wraps the inline content in an
 * anonymous block box. This anonymous box:
 *
 * - Cannot be selected or styled
 * - Does not inherit `text-box` trimming behavior reliably
 * - Breaks grid-locked vertical rhythm
 *
 * This script detects inline elements that are siblings of block elements,
 * which triggers anonymous box generation. The fix is to wrap inline
 * content in explicit block elements (e.g., `<li><p>text</p><ul>...</ul></li>`).
 *
 * @example
 * ```ts
 * // In browser console:
 * import('/src/styles/core/debug-mixed-content.ts').then(m => m.detectMixedContent())
 * ```
 */

import { Schema as S } from 'effect'

/**
 * CSS Display values that establish block-level boxes.
 * @see https://drafts.csswg.org/css-display/#display-type
 */
const DisplayBlock = S.Enums({
  block: 'block',
  flex: 'flex',
  grid: 'grid',
  table: 'table',
  tableRowGroup: 'table-row-group',
  tableHeaderGroup: 'table-header-group',
  tableFooterGroup: 'table-footer-group',
  tableRow: 'table-row',
  tableCell: 'table-cell',
  tableColumnGroup: 'table-column-group',
  tableColumn: 'table-column',
  tableCaption: 'table-caption',
  listItem: 'list-item',
  flowRoot: 'flow-root',
})

/**
 * CSS Display values that establish inline-level boxes.
 * @see https://drafts.csswg.org/css-display/#display-type
 */
const DisplayInline = S.Enums({
  inline: 'inline',
  inlineBlock: 'inline-block',
  inlineFlex: 'inline-flex',
  inlineGrid: 'inline-grid',
  inlineTable: 'inline-table',
})

/**
 * CSS Display values that generate no box.
 * @see https://drafts.csswg.org/css-display/#display-type
 */
const DisplayNone = S.Enums({
  none: 'none',
  contents: 'contents',
})

/**
 * All known CSS display values.
 */
const Display = S.Union(DisplayBlock, DisplayInline, DisplayNone)

const OUTLINE_STYLE = '3px solid oklch(70% 0.25 30)' // red-orange
const ATTR_NAME = 'data-mixed-content-violation'

const isDisplay = S.is(Display)
const isBlockLevel = S.is(DisplayBlock)
const isInlineLevel = S.is(DisplayInline)

const hasTextNodes = (element: Element): boolean => {
  for (const node of element.childNodes) if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) return true
  return false
}

export const detectMixedContent = (): Element[] => {
  const violations: Element[] = []
  const unknownDisplayValues = new Set<string>()

  document.querySelectorAll('*').forEach((el) => {
    const style = window.getComputedStyle(el)
    const display = style.display

    if (!isDisplay(display)) {
      unknownDisplayValues.add(display)
      return
    }

    // Only check block containers
    if (!isBlockLevel(display)) return

    let hasBlockChild = false
    const inlineChildren: Element[] = []

    for (const child of el.children) {
      const childStyle = window.getComputedStyle(child)
      const childDisplay = childStyle.display

      if (!isDisplay(childDisplay)) {
        unknownDisplayValues.add(childDisplay)
        continue
      }

      if (isBlockLevel(childDisplay)) hasBlockChild = true
      else if (isInlineLevel(childDisplay)) inlineChildren.push(child)
    }

    // Violation: block container has both block children AND inline children
    if (hasBlockChild && inlineChildren.length > 0) {
      for (const inlineChild of inlineChildren) {
        violations.push(inlineChild)
        inlineChild.setAttribute(ATTR_NAME, 'true')
        ;(inlineChild as HTMLElement).style.outline = OUTLINE_STYLE
      }
    }
  })

  if (unknownDisplayValues.size > 0) {
    console.warn(
      '[Mixed Content] Unknown display values encountered (update schema):',
      [...unknownDisplayValues],
    )
  }

  if (violations.length > 0) {
    console.warn(
      `[Mixed Content] Found ${violations.length} violation(s):`,
      violations,
    )
  } else {
    console.info('[Mixed Content] No violations found')
  }

  return violations
}

export const clearViolations = (): void => {
  document.querySelectorAll(`[${ATTR_NAME}]`).forEach((el) => {
    el.removeAttribute(ATTR_NAME)
    ;(el as HTMLElement).style.outline = ''
  })
}
