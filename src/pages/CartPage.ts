import {Page, Locator} from '@playwright/test';
import { itemConstants } from '../../utils/constants';

export class CartPage {

    readonly page: Page;
    readonly backpackCard: Locator;
    readonly bikeLightCard: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backpackCard = page.locator('.cart_item').filter({ hasText: itemConstants.BACKPACK_ITEM_NAME });
        this.bikeLightCard = page.locator('.cart_item').filter({ hasText: itemConstants.BIKE_LIGHT_ITEM_NAME });
    }

}