import { test, expect } from '@playwright/test';

test("Ouvrir la page de sauce demo", async ({page}) => {
   await page.goto("https://www.saucedemo.com/"); // naviguer vers l'URL

   await expect(page).toHaveTitle(/Swag Labs/); // assertion pour vérifier qu'on est dans la bonne page 

/*

await page.locator ()

*/
await page.getByPlaceholder("Username").fill("")

   await page.locator("#user-name").fill("standard_user"); //
   await page.locator("#password").fill("secret_sauce");

} );