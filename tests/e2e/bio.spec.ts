import { expect, test } from '@playwright/test'

test.describe('Bio page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/bio')
    await expect(page.getByRole('heading', { name: 'Experiences' })).toBeVisible()
  })

  test('displays timeline with vertical line', async ({ page }) => {
    await page.goto('/bio')

    // Wait for the timeline to load
    await expect(page.getByRole('heading', { name: 'Experiences' })).toBeVisible()

    // Check that the timeline SVG exists
    const timelineSvg = page.locator('#timeline-svg')
    await expect(timelineSvg).toBeVisible()

    // Check that vertical line elements exist
    const lines = page.locator('#timeline-svg line')
    const lineCount = await lines.count()
    expect(lineCount).toBeGreaterThan(0)

    // Verify at least one line has a stroke color (not transparent/invisible)
    const firstLine = lines.first()
    const stroke = await firstLine.evaluate((el) => {
      return window.getComputedStyle(el).stroke
    })

    // Should not be 'none' or empty
    expect(stroke).not.toBe('none')
    expect(stroke).not.toBe('')
    expect(stroke).not.toBe('transparent')
  })

  test('timeline vertical line is positioned on the left side', async ({ page }) => {
    await page.goto('/bio')
    await expect(page.getByRole('heading', { name: 'Experiences' })).toBeVisible()

    // Find and verify at least one timeline line is properly rendered
    // Note: SVG vertical lines have zero width, so Playwright's .isVisible() returns false
    // We check for proper rendering by verifying parent display, stroke, and height
    const allLines = await page.locator('#timeline-svg line').all()

    let renderedLine = null
    for (const line of allLines) {
      const lineInfo = await line.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        const parent = el.parentElement
        const rect = el.getBoundingClientRect()
        return {
          computedStroke: styles.stroke,
          opacity: styles.opacity,
          parentDisplay: parent ? window.getComputedStyle(parent).display : 'n/a',
          height: rect.height,
        }
      })

      // A line is rendered if it has:
      // - Parent display not 'none'
      // - Non-zero height (vertical lines)
      // - Valid stroke color (not 'none', '', or 'transparent')
      // - Opacity > 0
      const isRendered = (
        lineInfo.parentDisplay !== 'none' &&
        lineInfo.height > 0 &&
        lineInfo.computedStroke !== 'none' &&
        lineInfo.computedStroke !== '' &&
        lineInfo.computedStroke !== 'transparent' &&
        parseFloat(lineInfo.opacity) > 0
      )

      if (isRendered) {
        renderedLine = line
        break
      }
    }

    expect(renderedLine).not.toBeNull()

    // Get the x1 and x2 coordinates (should be the same for vertical line)
    const x1 = await renderedLine!.getAttribute('x1')
    const x2 = await renderedLine!.getAttribute('x2')

    // Vertical lines should have the same x coordinate
    expect(x1).toBe(x2)

    // The x coordinate should be on the left side, aligned with timeline nodes
    // Based on the code: LINE_X_MOBILE (168), LINE_X_SM (200), LINE_X_MD (484)
    const xValue = parseFloat(x1 || '0')
    expect(xValue).toBeGreaterThan(100) // Not too far left
    expect(xValue).toBeLessThan(500) // On the left side, not in the middle or right
  })
})
