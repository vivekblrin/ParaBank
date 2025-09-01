import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    browserName: 'chromium',
    channel: undefined, // don’t use Chrome stable
    executablePath: 'C:\\Users\\Lenovo\\AppData\\Local\\ms-playwright\\chromium-1187\\chrome-win\\chrome.exe',
  },
});
