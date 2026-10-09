import {Page, Locator} from '@playwright/test';

export class CheckoutStepOnePage {

    readonly page: Page;

    async fillOutInformation(firstName: string, lastName: string, zipCode: string) {
        await this.page.fill('#first-name', firstName);
        await this.page.fill('#last-name', lastName);
        await this.page.fill('#postal-code', zipCode);
    }

    async clickContinue() {
        await this.page.click('#continue');
    }

    async clickCancel() {
        await this.page.click('#cancel');
    }

    constructor(page: Page) {
        this.page = page;
    }

}