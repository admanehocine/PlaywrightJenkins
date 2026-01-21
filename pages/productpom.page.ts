import { Page } from '@playwright/test';

export class productpom {

    readonly page: Page;

    constructor(p: Page) {
        this.page = p;
    }
    // Les sélecteurs
    elements = {
        addToCart: () => this.page.locator("#add-to-cart-sauce-labs-backpack"),
        removeToCart: () => this.page.locator("#remove-sauce-labs-backpack"),
        cartBadge: () => this.page.locator(".shopping_cart_badge")
    }

    // Les méthodes
    async addToCartBtn() {
        await this.elements.addToCart().click();
    }

    async cartBtn() {
        await this.elements.cartBadge().click();
    }

    async getCartcount() {
        return await this.elements.cartBadge().textContent();
    }

    async getCartRemove() {
        return await this.elements.removeToCart().textContent();
    }
}