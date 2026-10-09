import {Page, Locator} from '@playwright/test';
import { itemConstants } from '../../utils/constants';

export class InventoryPage {

    readonly page: Page;
    readonly backpackCard: Locator;
    readonly bikeLightCard: Locator;
    readonly boltTshirtCard: Locator;
    readonly grid: Locator;

    constructor(page: Page) {
        this.page = page;
        this.backpackCard = page.locator('.inventory_item').filter({ hasText: itemConstants.BACKPACK_ITEM_NAME });
        this.bikeLightCard = page.locator('.inventory_item').filter({ hasText: itemConstants.BIKE_LIGHT_ITEM_NAME });
        this.boltTshirtCard = page.locator('.inventory_item').filter({ hasText: itemConstants.BOLT_TSHIRT_ITEM_NAME });
        this.grid = page.locator('.inventory_list');
    }

}