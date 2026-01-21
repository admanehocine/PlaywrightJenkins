
import { test, expect } from '@playwright/test';
import { loginpom } from '../pages/loginpom.page';

let loginPage: loginpom; // variable qui va contenir l'instance du nom page object

test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com/");
    loginPage = new loginpom(page); // cree une instance du pom et en lui pass le page de test
});

// Nettoyage après chaque test 
test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
});


test("login valid", { tag: "@valid" }, async ({ page }) => {
    await loginPage.setUsername("standard_user");
    await loginPage.setPassword("secret_sauce");
    await loginPage.loginBtn();
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")

});

test("login invalid", { tag: "@test" }, async ({ page }) => {
    await loginPage.setUsername("standard_use");
    await loginPage.setPassword("secret_sauc");
    await loginPage.loginBtn();
    const val=await loginPage.getErrorMessageText();

     expect(val).toContain("Username");
    //await expect(loginPage.getErrorMessageVisible()).toBeTruthy();

});

