import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never', outputFolder: 'tests/reports/html' }], ['list']],
  outputDir: 'tests/results',
  timeout: 10_000, // 10s per test
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    navigationTimeout: 5_000, // 5s max for navigation
    actionTimeout: 3_000, // 3s max for actions
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm build && pnpm start',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.GITHUB_ACTIONS,
    timeout: 120_000, // 2 minutes
  },
})
