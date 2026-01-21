
import { test, expect } from '@playwright/test';
import { loginpom } from '../pages/loginpom.page';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';


let loginPage: loginpom // instance de pom login

const users = parse(fs.readFileSync(path.join(__dirname, 'data/data.csv')), {
    columns: true,
    skip_empty_lines: true,
})

test("login_jdd", { tag: "@jdd" }, async ({ page }) => {
    for (const user of users!) {

        loginPage = new loginpom(page);

        await page.goto("https://www.saucedemo.com/");

        await loginPage.setUsername(user!.username);
        await loginPage.setPassword(user!.password);

        await loginPage.loginBtn();

        if (user!.result === "success") {
            await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
        } else {

            await expect(loginPage.getErrorMessageVisible()).toBeTruthy();

        }



    }
})