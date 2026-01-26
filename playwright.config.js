import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './requirements/specs',
  testMatch: ['**/e2e/**/*.spec.js', '**/calculators/**/*.spec.js'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:8001',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 8001 --directory public',
    url: 'http://localhost:8001',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});
