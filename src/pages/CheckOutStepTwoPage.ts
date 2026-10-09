import {Page, Locator} from '@playwright/test';
import { itemConstants } from '../../utils/constants';

export class CheckoutStepTwoPage {

    readonly page: Page;
    readonly backpackCard: Locator;
    readonly summarySubtotalLabel: Locator;
    readonly summaryTaxLabel: Locator;
    readonly summaryTotalLabel: Locator;

    async clickCancel() {
        await this.page.click('#cancel');
    }
    async clickFinish() {
        await this.page.click('#finish');
    }

    constructor(page: Page) {
        this.page = page;
        this.backpackCard = page.locator('.cart_item').filter({ hasText: itemConstants.BACKPACK_ITEM_NAME });
        this.summarySubtotalLabel = page.locator('.summary_subtotal_label');
        this.summaryTaxLabel = page.locator('.summary_tax_label');
        this.summaryTotalLabel = page.locator('.summary_total_label');
    }

}