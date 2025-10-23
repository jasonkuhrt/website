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
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5175',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: process.env.CI ?
      'NODE_OPTIONS="--max-old-space-size=8192" pnpm build && pnpm preview --port 5175' :
      'NODE_OPTIONS="--max-old-space-size=8192" pnpm dev',
    url: 'http://localhost:5175',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000, // 5 minutes for CI builds
  },
})
