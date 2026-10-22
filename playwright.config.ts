import { defineConfig } from '@playwright/test';

// Tests run against the production build (`astro preview` over dist/), the
// same bytes that get deployed. One worker: the machine is often busy.
export default defineConfig({
  testDir: 'tests',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4322',
    // The installed Chrome: no browser download.
    channel: 'chrome',
    headless: true,
    viewport: { width: 1280, height: 800 },
    colorScheme: 'light',
  },
  webServer: {
    // --ignore-lock: a stray background preview's lock file must not stop the run.
    command: 'pnpm exec astro preview --port 4322 --ignore-lock',
    url: 'http://localhost:4322',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
