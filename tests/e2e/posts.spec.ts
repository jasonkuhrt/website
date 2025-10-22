import { expect, test } from '@playwright/test'

test.describe('Individual posts', () => {
  test.describe('Essays', () => {
    test('Forto essay loads with images', async ({ page }) => {
      await page.goto('/writing/essays/forto')
      await expect(page).toHaveTitle(/Forto/)
      await expect(page.getByRole('heading', { name: /Forto/, level: 1 })).toBeVisible()

      // Check that article content is present
      await expect(page.locator('article')).toBeVisible()
    })

    test('React Popover essay loads', async ({ page }) => {
      await page.goto('/writing/essays/react-popover-history')
      await expect(page).toHaveTitle(/React Popover/)
      await expect(page.getByRole('heading', { name: /Reviving React Popover/, level: 1 })).toBeVisible()
    })

    test('Lambda Calculus essay loads', async ({ page }) => {
      await page.goto('/writing/essays/visiting-lambda-calculus')
      await expect(page).toHaveTitle(/Lambda Calculus/)
      await expect(page.getByRole('heading', { name: /Visiting Lambda Calculus/, level: 1 })).toBeVisible()
    })
  })

  test.describe('Logs', () => {
    test('Yarn publish woes log loads with code blocks', async ({ page }) => {
      await page.goto('/writing/logs/yarn-publish-woes')
      await expect(page.getByRole('heading', { name: /Yarn publish woes/, level: 1 })).toBeVisible()

      // Verify code blocks are rendered (this was a problematic post)
      await expect(page.locator('pre.shiki')).toBeVisible()
    })

    test('Journaling foobar platform log loads', async ({ page }) => {
      await page.goto('/writing/logs/14-journaling-the-foobar-platform')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

      // This post had backtick issues in code blocks - verify at least one code block is rendered
      await expect(page.locator('pre.shiki').first()).toBeVisible()
    })

    test('Writing pairs in TypeScript log loads', async ({ page }) => {
      await page.goto('/writing/logs/10-writing-pairs-in-typescript')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('Multi-stage Docker builds log loads', async ({ page }) => {
      await page.goto('/writing/logs/12-multi-stage-docker-builds')
      await expect(page.getByRole('heading', { name: /Multi-Stage Docker Builds/, level: 1 })).toBeVisible()
    })
  })

  test.describe('TIL', () => {
    test('TIL index loads with content', async ({ page }) => {
      await page.goto('/writing/til/index')
      await expect(page.getByRole('heading', { name: /Today I Learned/, level: 1 })).toBeVisible()

      // Check that article content is present
      await expect(page.locator('article')).toBeVisible()
    })
  })
})
