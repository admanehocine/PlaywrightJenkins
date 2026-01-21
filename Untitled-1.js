saucedemo-cucumber-playwright/
├── features/
│   └── login.feature
├── step_definitions/
│   └── login.steps.js
├── support/
│   ├── world.js          ← Custom World + hooks
│   └── hooks.js
├── cucumber.js           ← Config globale
├── package.json
└── .env                  (optionnel)


const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');

let browser;
let page;

Before(async function () {
  browser = await chromium.launch({ headless: false, slowMo: 100 }); // slowMo pour voir
  const context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await page?.close();
  await browser?.close();
});

Given('je suis sur la page de connexion', async function () {
  await page.goto('https://www.saucedemo.com/');
  await expect(page).toHaveTitle(/Swag Labs/);
});

When('je saisis le username {string}', async function (username) {
  await page.fill('input[data-test="username"]', username);
});

When('je saisis le password {string}', async function (password) {
  await page.fill('input[data-test="password"]', password);
});

When('je clique sur le bouton Login', async function () {
  await page.click('input[data-test="login-button"]');
});

Then('je suis redirigé vers la page inventaire', async function () {
  await expect(page).toHaveURL(/.*inventory\.html/);
});

Then('je vois le titre {string}', async function (title) {
  await expect(page.locator('.title')).toHaveText(title);
});

Then('je vois le message d\'erreur {string}', async function (errorMessage) {
  await expect(page.locator('[data-test="error"]')).toHaveText(errorMessage);
});