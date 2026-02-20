import { defineConfig, devices } from '@playwright/test';

function parseWorkerCount(value) {
  if (!value) {
    return undefined;
  }
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

const resolvedWorkers = process.env.CI
  ? parseWorkerCount(process.env.PW_WORKERS_CI) || 2
  : parseWorkerCount(process.env.PW_WORKERS_LOCAL);
const resolvedMaxFailures = parseWorkerCount(process.env.PW_MAX_FAILURES);
const resolvedWebServerPort = parseWorkerCount(process.env.PW_WEB_SERVER_PORT) || 8001;
const resolvedBaseUrl = process.env.PW_BASE_URL || `http://localhost:${resolvedWebServerPort}`;

export default defineConfig({
  testDir: './tests_specs',
  testMatch: ['**/*.spec.js'],
  testIgnore: ['**/*.test.js', '**/*-snapshots/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: resolvedWorkers,
  maxFailures: resolvedMaxFailures,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: resolvedBaseUrl,
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
    command: `python3 -m http.server ${resolvedWebServerPort} --directory public`,
    url: resolvedBaseUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
});
