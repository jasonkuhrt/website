/**
 * Grid-Locked Design System Utilities
 *
 * Border compensation functions to maintain grid alignment
 * when using non-grid borders (1px, 2px).
 *
 * Strategy: Reduce padding by border width using calc()
 * Example: padding: 4rem, border: 1px → padding: calc(4rem - 1px)
 */

/**
 * Calculate grid-locked padding with border compensation
 *
 * @param baselines - Number of baseline units (1 baseline = 6px)
 * @param borderWidth - Border width in pixels (0, 1, or 2)
 * @returns CSS value with border compensation
 *
 * @example
 * gridLocked(4, 0)  // "4rem" (24px, no border)
 * gridLocked(4, 1)  // "calc(4rem - 1px)" (23px content + 1px border = 24px total)
 * gridLocked(4, 2)  // "calc(4rem - 2px)" (22px content + 2px border = 24px total)
 */
export function gridLocked(baselines: number, borderWidth: number = 0): string {
  if (borderWidth === 0) return `${baselines}rem`
  return `calc(${baselines}rem - ${borderWidth}px)`
}

/**
 * Calculate grid-locked padding for a box with borders on multiple sides
 *
 * @param padding - Padding in baseline units
 * @param border - Border widths for each side
 * @returns CSS padding values with border compensation
 *
 * @example
 * gridLockedBox({ block: 4, inline: 6 }, { top: 1, bottom: 1, left: 2, right: 2 })
 * // Returns:
 * // {
 * //   paddingBlock: "calc(4rem - 1px)",  // (1px top + 1px bottom) / 2 = 1px per side
 * //   paddingInline: "calc(6rem - 2px)", // (2px left + 2px right) / 2 = 2px per side
 * // }
 */
export function gridLockedBox(
  padding: { block?: number; inline?: number },
  border: { top?: number; right?: number; bottom?: number; left?: number } = {},
): {
  paddingBlock?: string
  paddingInline?: string
} {
  const borderBlock = (border.top ?? 0) + (border.bottom ?? 0)
  const borderInline = (border.left ?? 0) + (border.right ?? 0)

  return {
    paddingBlock: padding.block !== undefined ? gridLocked(padding.block, borderBlock / 2) : undefined,
    paddingInline: padding.inline !== undefined ? gridLocked(padding.inline, borderInline / 2) : undefined,
  }
}

/**
 * Calculate grid-locked padding for individual sides
 *
 * @param padding - Padding values for each side in baseline units
 * @param border - Border widths for each side in pixels
 * @returns CSS padding values for each side with border compensation
 *
 * @example
 * gridLockedSides(
 *   { top: 4, right: 6, bottom: 4, left: 6 },
 *   { top: 1, right: 2, bottom: 1, left: 2 }
 * )
 * // Returns:
 * // {
 * //   paddingTop: "calc(4rem - 1px)",
 * //   paddingRight: "calc(6rem - 2px)",
 * //   paddingBottom: "calc(4rem - 1px)",
 * //   paddingLeft: "calc(6rem - 2px)",
 * // }
 */
export function gridLockedSides(
  padding: { top?: number; right?: number; bottom?: number; left?: number },
  border: { top?: number; right?: number; bottom?: number; left?: number } = {},
): {
  paddingTop?: string
  paddingRight?: string
  paddingBottom?: string
  paddingLeft?: string
} {
  return {
    paddingTop: padding.top !== undefined ? gridLocked(padding.top, border.top ?? 0) : undefined,
    paddingRight: padding.right !== undefined ? gridLocked(padding.right, border.right ?? 0) : undefined,
    paddingBottom: padding.bottom !== undefined ? gridLocked(padding.bottom, border.bottom ?? 0) : undefined,
    paddingLeft: padding.left !== undefined ? gridLocked(padding.left, border.left ?? 0) : undefined,
  }
}
