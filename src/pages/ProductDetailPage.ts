import {Page, Locator} from '@playwright/test';

export class ProductDetailPage {

    readonly page: Page;
    readonly itemName: Locator;
    readonly itemPrice: Locator;
    readonly button: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.itemName = page.locator('.inventory_details_name');
        this.itemPrice = page.locator('.inventory_details_price');
        this.button = page.locator('.btn_inventory');
        this.backButton = page.locator('.inventory_details_back_button');

    }

}