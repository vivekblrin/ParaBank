// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  use: {
    headless: false, // set to true if you don’t want browser UI
    viewport: { width: 1280, height: 720 },
    screenshot: 'on',
    video: 'on-first-retry',
    baseURL: 'https://parabank.parasoft.com',
  },
});
