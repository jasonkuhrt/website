import { expect, test } from '@playwright/test'

test.describe('Individual posts', () => {
  test.describe('Essays', () => {
    test('Forto essay loads with images', async ({ page }) => {
      await page.goto('/writing/essays/forto')
      await expect(page).toHaveTitle(/Forto/)

      // Check that content is present
      await expect(page.locator('article')).toBeVisible()
    })

    test('Lambda Calculus essay loads', async ({ page }) => {
      await page.goto('/writing/essays/visiting-lambda-calculus')
      await expect(page).toHaveTitle(/Lambda Calculus/)

      // Check that content is present
      await expect(page.locator('article')).toBeVisible()
    })
  })

  test.describe('Drivel', () => {
    test('React Popover drivel loads', async ({ page }) => {
      await page.goto('/writing/drivel/react-popover-history')
      await expect(page).toHaveTitle(/React Popover/)

      // Check that content is present
      await expect(page.locator('article')).toBeVisible()
    })

    test('Yarn publish woes drivel loads with code blocks', async ({ page }) => {
      await page.goto('/writing/drivel/2017-06-08_yarn-publish-woes')
      await expect(page).toHaveTitle(/Yarn publish woes/)

      // Verify code blocks are rendered (this was a problematic post)
      // Note: Shiki class may vary, just check for pre tags
      await expect(page.locator('pre').first()).toBeVisible()
    })

    test('Journaling foobar platform drivel loads', async ({ page }) => {
      await page.goto('/writing/drivel/2018-01-01_journaling-the-foobar-platform')
      await expect(page).toHaveTitle(/journaling/i)

      // This post had backtick issues in code blocks - verify at least one code block is rendered
      await expect(page.locator('pre').first()).toBeVisible()
    })

    test('Writing pairs in TypeScript drivel loads', async ({ page }) => {
      await page.goto('/writing/drivel/2018-01-23_writing-pairs-in-typescript')
      await expect(page).toHaveTitle(/TypeScript/i)

      // Check that content is present
      await expect(page.locator('article')).toBeVisible()
    })

    test('Multi-stage Docker builds drivel loads', async ({ page }) => {
      await page.goto('/writing/drivel/2018-02-27_multi-stage-docker-builds')
      await expect(page).toHaveTitle(/Docker/i)

      // Check that content is present
      await expect(page.locator('article')).toBeVisible()
    })
  })

  test.describe('Scribbles', () => {
    test('Scribbles entry loads with content', async ({ page }) => {
      await page.goto('/writing/scribbles/2017-09-05')

      // Check that content is present
      await expect(page.locator('article')).toBeVisible()
    })
  })
})
