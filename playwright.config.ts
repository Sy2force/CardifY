import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  
  /* Global test timeout */
  timeout: 45000,
  /* Expect timeout */
  expect: {
    timeout: 15000
  },
  
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3009',

    /* Collect trace when retaining on failure. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    /* Take screenshot only on failures */
    screenshot: 'only-on-failure',
    /* Record video on failure */
    video: 'retain-on-failure',
    /* Action timeout */
    actionTimeout: 20000,
    /* Navigation timeout */
    navigationTimeout: 25000,
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    /* Viewport size */
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
    },
  ],

  webServer: [
    {
      command: 'cd backend && npm run dev',
      port: 3006,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'cd frontend && npm run dev',
      port: 3009,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
