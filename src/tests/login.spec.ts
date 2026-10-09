import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import { secrets } from '../../test-data/secrets';
import { urlConstants, errorMessages } from '../../utils/constants';

test.describe('SauceDemo Authentication Tests',() => {
    // Declare variables here applicable to all  SauceDemo Authentication tests.
    let loginPage: LoginPage;
    
    // Before each test, this will run every time a Test case is executed. It will create a new instance of the LoginPage class and navigate to the login page. 
    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await page.goto(urlConstants.BASE_URL);
    });

    /******************* TEST CASES ***********************/ 
    // TEST CASE 1: Successful Login with Valid Credentials
    test('TC_LOG_01: Successful Login with Valid Credentials', async ({page}) => {
        await loginPage.login(secrets.username, secrets.password);
        await expect(page).toHaveURL(urlConstants.INVENTORY_PAGE_URL);
    });

    // TEST CASE 2: Locked Out User Login Attempt
    test('TC_LOG_02: Locked Out User Login Attempt', async ({page}) => {
        await loginPage.login(secrets.lockedOutUsername, secrets.password);
        const errorMessage = page.locator('.error-message-container');
        await expect(errorMessage).toHaveText(errorMessages.LOCKED_OUT_ERROR);
    });

    // TEST CASE 3: Login Attempt with Invalid Credentials (Invalid Username)
    test('TC_LOG_03: Login Attempt with Invalid Credentials (Invalid Username)', async ({page}) => {
        await loginPage.login(secrets.invalidUsername, secrets.password);
        const errorMessage = page.locator('.error-message-container');
        await expect(errorMessage).toHaveText(errorMessages.USER_PASS_NOT_MATCH_ERROR);
    });

    // TEST CASE 4: Login Attempt with Invalid Credentials (Invalid Password)
    test('TC_LOG_04: Login Attempt with Invalid Credentials (Invalid Password)', async ({page}) => {
        await loginPage.login(secrets.username, secrets.invalidPassword);
        const errorMessage = page.locator('.error-message-container');
        await expect(errorMessage).toHaveText(errorMessages.USER_PASS_NOT_MATCH_ERROR);
    });
    
    // TEST CASE 5: Login Attempt with Empty Credentials (Empty Username)
    test('TC_LOG_05: Login Attempt with Empty Credentials (Empty Username)', async ({page}) => {
        await loginPage.login('', 'secret_sauce');
        const errorMessage = page.locator('.error-message-container');
        await expect(errorMessage).toHaveText(errorMessages.USER_REQUIRED_ERROR);
    });

    // TEST CASE 6: Login Attempt with Empty Credentials (Empty Password)
    test('TC_LOG_06: Login Attempt with Empty Credentials (Empty Password)', async ({page}) => {
        await loginPage.login('standard_user', '');
        const errorMessage = page.locator('.error-message-container');
        await expect(errorMessage).toHaveText(errorMessages.PASSWORD_REQUIRED_ERROR);
    });


});