import { css } from '#styled-system/css'

/**
 * Hide element on small screens, show on small breakpoint and above
 *
 * Useful for: secondary info, full labels, decorative elements
 *
 * @example
 * <span className={hiddenSmall}>Full Text</span>
 */
export const hiddenSmall = css({
  display: 'none',
  sm: {
    display: 'inline',
  },
})

/**
 * Hide element on small screens, show as block on small breakpoint and above
 *
 * Useful for: content sections, layout blocks
 *
 * @example
 * <div className={hiddenSmallBlock}>Detailed Content</div>
 */
export const hiddenSmallBlock = css({
  display: 'none',
  sm: {
    display: 'block',
  },
})

/**
 * Show element only on small screens, hide on small breakpoint and above
 *
 * Useful for: mobile-only UI, simplified mobile views
 *
 * @example
 * <span className={visibleSmallOnly}>📱</span>
 */
export const visibleSmallOnly = css({
  display: 'block',
  sm: {
    display: 'none',
  },
})

/**
 * Show element only on small breakpoint, hide on mobile and medium+
 *
 * Useful for: tablet-specific layouts
 *
 * @example
 * <div className={visibleSmallOnly}>Tablet View</div>
 */
export const visibleSmOnly = css({
  display: 'none',
  sm: {
    display: 'block',
  },
  md: {
    display: 'none',
  },
})

/**
 * Show element only on medium breakpoint and above
 *
 * Useful for: desktop-only features
 *
 * @example
 * <div className={visibleMdUp}>Desktop Content</div>
 */
export const visibleMdUp = css({
  display: 'none',
  md: {
    display: 'block',
  },
})
