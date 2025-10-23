import { expect, test } from '@playwright/test'

test.describe('Writing page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/writing')
    await expect(page).toHaveTitle(/Writing/)
  })

  test('displays three-column layout', async ({ page }) => {
    await page.goto('/writing')

    // Check for the three main column headings (level 2 headings are the column titles)
    await expect(page.getByRole('heading', { name: 'Essays', exact: true, level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Logs', exact: true, level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Today I Learned', exact: true, level: 2 })).toBeVisible()
  })

  test('essays column has content', async ({ page }) => {
    await page.goto('/writing')

    // Check for specific essays - use first() since essay titles may appear multiple places
    await expect(page.getByRole('link', { name: /Visiting Lambda Calculus/ }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Forto/ }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /React Popover/ }).first()).toBeVisible()
  })

  test('logs column has content', async ({ page }) => {
    await page.goto('/writing')

    // Check for some log entries
    await expect(page.getByRole('link', { name: /Multi-Stage Docker Builds/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Writing pairs in TypeScript/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Yarn publish woes/ })).toBeVisible()
  })

  test('TIL column has content', async ({ page }) => {
    await page.goto('/writing')

    // Check for TIL entry - TIL links have day names in headings (e.g., "Dec 08 2018 2018 Sun Dec 9")
    // Filter by day names to specifically target TIL links
    const tilLinks = page.getByRole('link').filter({ hasText: /\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/ })
    await expect(tilLinks.first()).toBeVisible()
  })

  test('essay links are clickable and navigate correctly', async ({ page }) => {
    await page.goto('/writing')

    await page.getByRole('link', { name: /Visiting Lambda Calculus/ }).click()
    await expect(page).toHaveURL(/\/writing\/essays\/visiting-lambda-calculus/)
    await expect(page.getByRole('heading', { name: /Visiting Lambda Calculus/, level: 1 })).toBeVisible()
  })

  test('log links are clickable and navigate correctly', async ({ page }) => {
    await page.goto('/writing')

    await page.getByRole('link', { name: /Yarn publish woes/ }).click()
    await expect(page).toHaveURL(/\/writing\/logs\/yarn-publish-woes/)
    await expect(page.getByRole('heading', { name: /Yarn publish woes/, level: 1 })).toBeVisible()
  })

  test('TIL link is clickable and navigates correctly', async ({ page }) => {
    await page.goto('/writing')

    // Click on a TIL entry link - they have unique day names in headings (e.g., "Sun Dec 9")
    // Filter by links containing day names to avoid matching essay/log dates
    const tilLinks = page.getByRole('link').filter({ hasText: /\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/ })
    await tilLinks.first().click()

    // Should navigate to the TIL index page with anchor
    await expect(page).toHaveURL(/\/writing\/til\/index\/#/)
    await expect(page.getByRole('heading', { name: /Today I Learned/, level: 1 })).toBeVisible()
  })
})
