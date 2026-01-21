// typescript
import { test, expect } from '@playwright/test';
import { productpom } from '../pages/productpom.page';
import { loginpom } from '../pages/loginpom.page'

let loginPage: loginpom;
let productPage: productpom;


test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    productPage = new productpom(page); // 
    loginPage = new loginpom(page);

    await loginPage.loginWithCredentials("standard_user", "secret_sauce")
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")

});

test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
});

test('cartBtn pour naviguer aprés ajout', { tag: "@addedToCart" }, async ({ page }) => {


    await productPage.addToCartBtn()


    await expect(productPage.elements.cartBadge()).toBeVisible();
    await expect(productPage.elements.cartBadge()).toHaveText('1');


    await productPage.cartBtn();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');


    const val_remove = await productPage.getCartRemove();
    expect(val_remove).toContain('Remove');

    const val_count = await productPage.getCartcount();
    expect(val_count).toContain('1');
});

test('cartBtn fonctionne quand le badge est présent pour vérifier', { tag: "@badge" }, async ({ page }) => {

    await productPage.addToCartBtn()
    await expect(productPage.elements.cartBadge()).toBeVisible();


    await productPage.cartBtn();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
});