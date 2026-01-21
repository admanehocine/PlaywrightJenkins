
import { Page } from '@playwright/test'

export class loginpom {
    readonly page: Page;

    constructor(p: Page) {
        this.page = p;
    }

    // Les sélecteurs
    elements = {


        username: () => this.page.locator("#user-name"),
        password: () => this.page.locator("#password"),
        login: () => this.page.locator("#login-button"),
        errorMessage: () => this.page.locator("[data-test='error']")
    }

    // Les méthodes

    async setUsername(username: string) {
        await this.elements.username().fill(username);
    }

    async setPassword(password: string) {
        await this.elements.password().fill(password);
    }

    async loginBtn() {
        await this.elements.login().click();
    }

    async getErrorMessageText() {
        return await this.elements.errorMessage().textContent();
    }
    async getErrorMessageVisible() {
        return await this.elements.errorMessage().isVisible();
    }

    async loginWithCredentials(username: string, password: string) {
        await this.setUsername(username)
        await this.setPassword(password);
        await this.loginBtn();
    }
}