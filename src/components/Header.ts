import {Page, Locator} from '@playwright/test';

export class Header {

    readonly page: Page;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;


    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('.shopping_cart_link');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    async goToCart() {
        await this.cartLink.click();
    }
}