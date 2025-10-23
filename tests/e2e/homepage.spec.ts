import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Kuhrt/)
  })

  test('displays navigation links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'writing' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'speaking' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'coding' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'photographing' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'drawing' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'bio' })).toBeVisible()
  })

  test('settings button is present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible()
  })
})
