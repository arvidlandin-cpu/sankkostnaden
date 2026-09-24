import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 180_000,
  expect: { timeout: 10_000 },
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.QA_BASE_URL || 'https://sankkostnaden.se',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'browserstack',
      use: { browserName: 'chromium' },
    },
  ],
});
