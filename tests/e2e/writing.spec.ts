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
    await expect(page.getByRole('heading', { name: 'Drivel', exact: true, level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Scribbles', exact: true, level: 2 })).toBeVisible()
  })

  test('essays column has content', async ({ page }) => {
    await page.goto('/writing')

    // Check for specific essays - use first() since essay titles may appear multiple places
    await expect(page.getByRole('link', { name: /Visiting Lambda Calculus/ }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Forto/ }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /React Popover/ }).first()).toBeVisible()
  })

  test('drivel column has content', async ({ page }) => {
    await page.goto('/writing')

    // Check for some drivel entries
    await expect(page.getByRole('link', { name: /Multi-Stage Docker Builds/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Writing pairs in TypeScript/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Yarn publish woes/ })).toBeVisible()
  })

  test('Scribbles column has content', async ({ page }) => {
    await page.goto('/writing')

    // Use semantic region selector to target Scribbles section
    const scribblesSection = page.getByRole('region', { name: 'Scribbles' })
    const scribblesLinks = scribblesSection.getByRole('link')
    await expect(scribblesLinks.first()).toBeVisible()
  })

  test('essay links are clickable and navigate correctly', async ({ page }) => {
    await page.goto('/writing')

    await page.getByRole('link', { name: /Visiting Lambda Calculus/ }).click()
    await expect(page).toHaveURL(/\/writing\/essays\/visiting-lambda-calculus/)
    await expect(page.locator('.prose')).toBeVisible()
  })

  test('drivel links are clickable and navigate correctly', async ({ page }) => {
    await page.goto('/writing')

    await page.getByRole('link', { name: /Yarn publish woes/ }).click()
    await expect(page).toHaveURL(/\/writing\/drivel\/2017-06-08_yarn-publish-woes/)
    await expect(page.locator('.prose')).toBeVisible()
  })

  test('Scribbles link is clickable and navigates correctly', async ({ page }) => {
    await page.goto('/writing')

    // Use semantic region selector to target Scribbles section, then click first link
    const scribblesSection = page.getByRole('region', { name: 'Scribbles' })
    await scribblesSection.getByRole('link').first().click()

    // Should navigate to a scribbles entry
    await expect(page).toHaveURL(/\/writing\/scribbles\//)
  })
})
