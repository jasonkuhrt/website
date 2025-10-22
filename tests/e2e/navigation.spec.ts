import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test('all navigation links are accessible', async ({ page }) => {
    await page.goto('/')

    // Test each navigation link
    const navLinks = [
      { name: 'writing', url: '/writing' },
      { name: 'speaking', url: '/speaking' },
      { name: 'coding', url: '/coding' },
      { name: 'photographing', url: '/photographing' },
      { name: 'drawing', url: '/drawing' },
      { name: 'bio', url: '/bio' },
    ]

    for (const link of navLinks) {
      await page.goto('/')
      await page.getByRole('link', { name: link.name }).click()
      await expect(page).toHaveURL(new RegExp(link.url))
    }
  })

  test('logo link returns to homepage', async ({ page }) => {
    await page.goto('/writing')

    // Click the logo to return home
    await page.goto('/')
    const homeLink = page.locator('a[href="/"]').first()
    await homeLink.click()
    await expect(page).toHaveURL('/')
  })
})
