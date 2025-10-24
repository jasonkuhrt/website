import { expect, test } from '@playwright/test'

/**
 * Settings E2E Tests
 *
 * Tests the settings system with:
 * - Radix UI Dialog for accessibility
 * - Effect Schema validation
 * - localStorage persistence
 * - Reactive theme switching
 */

test.describe('Settings', () => {
  test('settings button opens modal with theme options', async ({ page }) => {
    await page.goto('/')

    // Wait for page to be fully hydrated
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Click settings button
    await page.getByRole('button', { name: 'Settings' }).click()

    // Verify modal is visible
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Verify theme options are present (toggle group items)
    await expect(page.getByLabel('Light')).toBeVisible()
    await expect(page.getByLabel('Dark')).toBeVisible()
    await expect(page.getByLabel('System')).toBeVisible()
  })

  test('modal closes with ESC key', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Open modal
    await page.getByRole('button', { name: 'Settings' }).click()
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Press ESC
    await page.keyboard.press('Escape')

    // Modal should close
    await expect(page.getByRole('heading', { name: 'Settings' })).not.toBeVisible()
  })

  test('theme switching updates DOM and persists', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await page.getByRole('button', { name: 'Settings' }).click()

    // Switch to dark theme (click the Dark toggle)
    await page.getByLabel('Dark').click()

    // Verify DOM updated
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Verify localStorage
    const settings = await page.evaluate(() => localStorage.getItem('settings'))
    expect(JSON.parse(settings!)).toMatchObject({ theme: 'dark' })

    // Reload page
    await page.reload()

    // Verify theme persisted
    await expect(html).toHaveClass(/dark/)
  })

  test('settings persist across different pages', async ({ page }) => {
    // Set theme on homepage
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    await page.getByRole('button', { name: 'Settings' }).click()
    await page.getByLabel('Dark').click()
    await page.keyboard.press('Escape')

    // Navigate to writing page
    await page.getByRole('link', { name: 'writing' }).click()
    await expect(page).toHaveURL(/\/writing/)

    // Verify theme persisted
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
  })

  test('system theme responds to OS preference changes', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Set theme to System (default)
    await page.getByRole('button', { name: 'Settings' }).click()
    await page.getByLabel('System').click()
    await page.keyboard.press('Escape')

    const html = page.locator('html')

    // Emulate dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.waitForTimeout(100) // Allow reactivity to trigger
    await expect(html).toHaveClass(/dark/)

    // Emulate light mode preference
    await page.emulateMedia({ colorScheme: 'light' })
    await page.waitForTimeout(100) // Allow reactivity to trigger
    await expect(html).not.toHaveClass(/dark/)
  })

  test('accessibility - proper ARIA structure', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    // Verify settings button has aria-label
    const settingsButton = page.getByRole('button', { name: 'Settings' })
    await expect(settingsButton).toHaveAttribute('aria-label', 'Settings')

    // Open modal
    await settingsButton.click()

    // Verify heading
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    // Verify theme option toggles have aria-labels
    await expect(page.getByLabel('Light')).toBeVisible()
    await expect(page.getByLabel('Dark')).toBeVisible()
    await expect(page.getByLabel('System')).toBeVisible()

    // Verify close button has accessible name
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible()
  })
})
