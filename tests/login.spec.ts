import { test, expect } from '@playwright/test';


//exécuter avant chaque tests

test.beforeEach(async ({ page }) => {

    await page.goto("https://www.saucedemo.com/");
});

test.afterEach(async ({ page }) => {

    await page.context().clearCookies();

    //permet de supprimer les param de la session locale
    await page.evaluate(() => localStorage.clear());
});



test("login valid", async ({ page }) => {


    await page.locator("#user-name").fill("standard_user");
    await page.locator("#password").fill("secret_sauce");

    await page.locator("#login-button").click();
    //assertion
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")

});

test("login invalid",{ tag: ["@invalid", "@invalid_login"] },  async ({ page }) => {


    await page.locator("#user-name").fill("standard_use");
    await page.locator("#password").fill("secret_sauc");

    await page.locator("#login-button").click();

    //assertion

    const errorMessage = page.locator("[data-test=error]");

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Epic sadface/);


    await expect(page).toHaveURL("https://www.saucedemo.com/")

});



