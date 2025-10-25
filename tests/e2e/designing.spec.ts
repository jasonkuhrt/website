import { expect, test } from '@playwright/test'

test.describe('Designing page', () => {
  test('index loads successfully', async ({ page }) => {
    await page.goto('/designing')
    await expect(page).toHaveTitle(/Designing/)
  })

  test('displays portfolio grid', async ({ page }) => {
    await page.goto('/designing')
    // Check for presence of project links (using href pattern)
    const projectLinks = page.locator('a[href^="/designing/"]')
    await expect(projectLinks.first()).toBeVisible()
  })

  test('displays portfolio projects', async ({ page }) => {
    await page.goto('/designing')
    const projectItems = page.locator('a[href^="/designing/"]')
    await expect(projectItems.first()).toBeVisible()

    // Should have 15 visible projects (modus-operandi and montreal-urban-sustainment are hidden)
    const count = await projectItems.count()
    expect(count).toBe(15)
  })

  test('project cards link to detail pages', async ({ page }) => {
    await page.goto('/designing')
    const firstProject = page.locator('a[href^="/designing/"]').first()
    await expect(firstProject).toHaveAttribute('href', /^\/designing\//)
  })

  test('project detail page loads', async ({ page }) => {
    await page.goto('/designing/wall')
    await expect(page).toHaveTitle(/Wall.*Designing/)
    await expect(page.locator('h1')).toHaveText('Wall')
  })

  test('project detail page displays title', async ({ page }) => {
    await page.goto('/designing/wall')
    const title = page.locator('h1')
    await expect(title).toBeVisible()
    await expect(title).toHaveText('Wall')
  })
})
