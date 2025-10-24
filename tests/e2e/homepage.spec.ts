import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Kuhrt/)
  })

  test('displays navigation links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'writing' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'crafting' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'designing' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'capturing' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'speaking' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'bio' })).toBeVisible()
  })
})
