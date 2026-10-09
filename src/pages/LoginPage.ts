import {Page, Locator} from '@playwright/test';
import { urlConstants } from '../../utils/constants';

export class LoginPage {

    readonly page: Page;

    async login(userName: string, password: string) {
        await this.page.fill('#user-name', userName);
        await this.page.fill('#password', password);
        await this.page.click('#login-button');
    }

    async navigate() {
        await this.page.goto(urlConstants.BASE_URL);
    }

    constructor(page: Page) {
        this.page = page;
    }

}