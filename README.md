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
`bashnpm install Install Playwright browsers:

bash Copy code npx playwright install (Optional) To use Chromium stable chromium-1187 instead of bundled Chromium:

bash Copy code npx playwright install chrome ▶️ Running Tests Run all tests in headed mode (browser visible):

bash Copy code npx playwright test tests/parabank.e2e.spec.js --headed Run in headless mode (faster, no UI):

bash Copy code npx playwright test tests/parabank.e2e.spec.js
