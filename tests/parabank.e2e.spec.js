// tests/parabank.e2e.spec.js
import { test, expect } from '@playwright/test';

// --- Username/Password setup ---
const userCounter = Date.now(); 
const username = `test_${userCounter}`;
const password = 'pwdStudy$20';

test('ParaBank E2E Flow - Registration, Account, Transfer, Bill Pay', async ({ page }) => {
  // Open ParaBank
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');

  // --- Registration ---
  await page.getByRole('link', { name: 'Register' }).click();
  await page.fill('#customer\\.firstName', 'vivek');
  await page.fill('#customer\\.lastName', 'swa');
  await page.fill('#customer\\.address\\.street', 'bangalore');
  await page.fill('#customer\\.address\\.city', 'bangalore');
  await page.fill('#customer\\.address\\.state', 'karnataka');
  await page.fill('#customer\\.address\\.zipCode', '560076');
  await page.fill('#customer\\.phoneNumber', '9430101556');
  await page.fill('#customer\\.ssn', 'nhjpr7412g');

  await page.fill('#customer\\.username', username);
  await page.fill('#customer\\.password', password);
  await page.fill('#repeatedPassword', password);

  await page.getByRole('button', { name: 'Register' }).click();

  // --- Site Map navigation ---
  await page.getByRole('link', { name: 'Site Map' }).click();

  // --- Open New Account ---
  await page.locator('#leftPanel').getByRole('link', { name: 'Open New Account' }).click();
  await page.locator('#type').selectOption('1'); // Savings
  await page.getByRole('button', { name: 'Open New Account' }).click();

  // --- Account details ---
  page.locator("body").click(); // clicks first account link

  // --- Transfer Funds ---
  await page.getByRole('link', { name: 'Transfer Funds' }).click();
  await page.locator('#fromAccountId').selectOption({ index: 0 });
  await page.fill('#amount', '10');
  await page.getByRole('button', { name: 'Transfer' }).click();

  // --- Bill Pay ---
  await page.getByRole('link', { name: 'Bill Pay' }).click();
  await page.fill('input[name="payee\\.accountNumber"]', '14454');
  await page.fill('input[name="verifyAccount"]', '14454');
  await page.fill('input[name="payee\\.name"]', 'vviek');
  await page.fill('input[name="payee\\.address\\.street"]', 'bangalore');
  await page.fill('input[name="payee\\.address\\.city"]', 'bangalore');
  await page.fill('input[name="payee\\.address\\.state"]', 'karnataka');
  await page.fill('input[name="payee\\.address\\.zipCode"]', '560076');
  await page.fill('input[name="payee\\.phoneNumber"]', '9934808110');
  await page.fill('input[name="amount"]', '5');

  await page.getByRole('button', { name: 'Send Payment' }).click();
  await page.waitForTimeout(5000);
  await page.getByRole('heading', { name: 'Bill Payment Complete' }).click();
  await page.waitForTimeout(5000);
});

test('Login and fetch transaction JSON dynamically', async ({ page, request }) => {
  // --- Login ---
  await page.goto('https://parabank.parasoft.com/parabank/index.htm');
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('input[value="Log In"]');
  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();

  // --- Grab accountId dynamically from Accounts Overview ---
  const accountId = await page.locator('table a').first().innerText();
  console.log("Extracted Account ID:", accountId);

  // --- Navigate to Find Transactions page ---
  await page.getByRole('link', { name: 'Find Transactions' }).click();
  await page.waitForURL('**/findtrans.htm');

  // --- Search by amount ---
  await page.fill('#amount', '5');
  await page.click('#findByAmount');

  // --- Grab cookies from browser session ---
  const cookies = await page.context().cookies();
  const jsession = cookies.find(c => c.name === "JSESSIONID");
  console.log("Using JSESSIONID:", jsession?.value);

  // --- API Call (with session cookie) ---
  const response = await request.get(
    `https://parabank.parasoft.com/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/5?timeout=30000`,
    {
      headers: {
        "Cookie": `JSESSIONID=${jsession.value}`,
        "Referer": "https://parabank.parasoft.com/parabank/findtrans.htm",
        "X-Requested-With": "XMLHttpRequest",
      }
    }
  );

  expect(response.ok()).toBeTruthy();

  // --- Parse JSON ---
  const transactions = await response.json();
  console.log("Transaction JSON:", JSON.stringify(transactions, null, 2));

  // --- Validate fields ---
  expect(transactions.length).toBeGreaterThan(0);
  const txn = transactions[0];
  expect(txn.accountId).toBe(Number(accountId));
  expect(txn.amount).toBe(5.00);
  expect(txn.description).toMatch(/^Bill Payment/);
});
