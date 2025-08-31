ParaBank Playwright E2E Tests

This project contains end-to-end (E2E) Playwright tests for ParaBank.

📌 Features
•Automated registration with unique timestamp-based usernames.
•Open new account and perform transfers.
•Bill Payment flow verification.
•Dynamic transaction lookup using API.
•JSON response validation.


⚙️ Prerequisites

Install dependencies: 
npm install 
Install Playwright browsers:
install (Optional)use Chromium stable chromium-1187 instead of bundled Chromium:

Install playwright:
npx playwright install

Run in headless mode (faster, no UI):
npx playwright test tests/parabank.e2e.spec.js --headed 




