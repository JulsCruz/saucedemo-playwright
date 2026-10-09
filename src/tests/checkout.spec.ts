import { test, expect } from '@playwright/test';
import { Header } from '../components/Header';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckOutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckOutStepTwoPage';
import { testUser } from '../../test-data/user-data';
import { secrets } from '../../test-data/secrets';
import { urlConstants, itemConstants, errorMessages } from '../../utils/constants';



test.describe('SauceLabs Checkout Suite', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let headers: Header;
    let checkoutStepOnePage: CheckoutStepOnePage;
    let checkoutStepTwoPage: CheckoutStepTwoPage;


    // Before each test, this will run every time a Test case is executed. It will create a new instance of the LoginPage class and navigate to the login page. 
    test.beforeEach(async ({ page }) => {
        headers = new Header(page);
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutStepOnePage = new CheckoutStepOnePage(page);
        checkoutStepTwoPage = new CheckoutStepTwoPage(page);

        await loginPage.navigate();
        await loginPage.login(secrets.username, secrets.password);

        
    });

    /******************* TEST CASES ***********************/ 
    // TEST CASE 1: End-to-End Checkout Process with Single Item
    test('TC_CHK_01: End-to-End Checkout Process with Single Item', async ({page}) => {

        await inventoryPage.backpackCard.locator('button').click();
        await headers.goToCart();

        await expect(page).toHaveURL(urlConstants.CART_PAGE_URL);

        const checkOutButton = page.locator('#checkout');
        await checkOutButton.click();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_ONE_URL);

        await checkoutStepOnePage.fillOutInformation(testUser.firstName, testUser.lastName, testUser.zipCode);
        await checkoutStepOnePage.clickContinue();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_TWO_URL);

        await expect(checkoutStepTwoPage.backpackCard).toBeVisible();

        const backPackCartQuantity = checkoutStepTwoPage.backpackCard.locator('.cart_quantity');
        await expect(backPackCartQuantity).toHaveText('1');

        const backPackCartPrice = checkoutStepTwoPage.backpackCard.locator('.inventory_item_price');
        await expect(backPackCartPrice).toHaveText('$' + itemConstants.BACKPACK_ITEM_PRICE);

        await checkoutStepTwoPage.clickFinish();

    });

    // TEST CASE 2: Form Validations - Missing First Name
    test('TC_CHK_02: Form Validations - Missing First Name', async ({page}) => {
  
        await inventoryPage.backpackCard.locator('button').click();
        await headers.goToCart();

        await expect(page).toHaveURL(urlConstants.CART_PAGE_URL);

        const checkOutButton = page.locator('#checkout');
        await checkOutButton.click();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_ONE_URL);

        await checkoutStepOnePage.fillOutInformation('', testUser.lastName, testUser.zipCode);
        await checkoutStepOnePage.clickContinue();

        const errorMessage = page.locator('.error-message-container');
        await expect(errorMessage).toHaveText(errorMessages.FIRST_NAME_REQUIRED_ERROR);
        

    });

    // TEST CASE 3: Form Validations - Missing Last Name  
    test('TC_CHK_03: Form Validations - Missing Last Name', async ({page}) => {

        await inventoryPage.backpackCard.locator('button').click();
        await headers.goToCart();

        await expect(page).toHaveURL(urlConstants.CART_PAGE_URL);

        const checkOutButton = page.locator('#checkout');
        await checkOutButton.click();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_ONE_URL);

        await checkoutStepOnePage.fillOutInformation(testUser.firstName, '', testUser.zipCode);
        await checkoutStepOnePage.clickContinue();

        const errorMessage = page.locator('.error-message-container');
        await expect(errorMessage).toHaveText(errorMessages.LAST_NAME_REQUIRED_ERROR);
        

    });

    
    // TEST CASE 4: Form Validations - Missing Postal Code 
    test('TC_CHK_04: Form Validations - Missing Postal Code', async ({page}) => {

        await inventoryPage.backpackCard.locator('button').click();
        await headers.goToCart();

        await expect(page).toHaveURL(urlConstants.CART_PAGE_URL);

        const checkOutButton = page.locator('#checkout');
        await checkOutButton.click();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_ONE_URL);

        await checkoutStepOnePage.fillOutInformation(testUser.firstName, testUser.lastName, '');
        await checkoutStepOnePage.clickContinue();

        const errorMessage = page.locator('.error-message-container');
        await expect(errorMessage).toHaveText(errorMessages.POSTAL_CODE_REQUIRED_ERROR);
        

    });

    // TEST CASE 5: Step 2 Cancel / Backtrack Workflow
    test('TC_CHK_05: Step 1 Cancel / Backtrack Workflow', async ({page}) => {

        await inventoryPage.backpackCard.locator('button').click();
        await headers.goToCart();

        await expect(page).toHaveURL(urlConstants.CART_PAGE_URL);

        const checkOutButton = page.locator('#checkout');
        await checkOutButton.click();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_ONE_URL);

        await checkoutStepOnePage.clickCancel();

        await expect(page).toHaveURL(urlConstants.CART_PAGE_URL);
    });

       //TEST CASE 6: Price and Tax Calculation Accuracy
   test('TC_CHK_06: Price and Tax Calculation Accuracy', async ({page}) => {

        await inventoryPage.backpackCard.locator('button').click();
        await inventoryPage.bikeLightCard.locator('button').click();
        await inventoryPage.boltTshirtCard.locator('button').click();
        await headers.goToCart();

        await expect(page).toHaveURL(urlConstants.CART_PAGE_URL);

        const checkOutButton = page.locator('#checkout');
        await checkOutButton.click();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_ONE_URL);

        await checkoutStepOnePage.fillOutInformation(testUser.firstName, testUser.lastName, testUser.zipCode);
        await checkoutStepOnePage.clickContinue();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_TWO_URL);

        await expect(checkoutStepTwoPage.summarySubtotalLabel).toHaveText('Item total: $' + (itemConstants.BACKPACK_ITEM_PRICE + itemConstants.BIKE_LIGHT_ITEM_PRICE + itemConstants.BOLT_TSHIRT_ITEM_PRICE).toFixed(2));
        await expect(checkoutStepTwoPage.summaryTaxLabel).toHaveText('Tax: $' + ((itemConstants.BACKPACK_ITEM_PRICE + itemConstants.BIKE_LIGHT_ITEM_PRICE + itemConstants.BOLT_TSHIRT_ITEM_PRICE) * 0.08).toFixed(2));
        await expect(checkoutStepTwoPage.summaryTotalLabel).toHaveText('Total: $' + (itemConstants.BACKPACK_ITEM_PRICE + itemConstants.BIKE_LIGHT_ITEM_PRICE + itemConstants.BOLT_TSHIRT_ITEM_PRICE + (itemConstants.BACKPACK_ITEM_PRICE + itemConstants.BIKE_LIGHT_ITEM_PRICE + itemConstants.BOLT_TSHIRT_ITEM_PRICE) * 0.08).toFixed(2));

    });

   // TEST CASE 7: Step 2 Cancel / Backtrack Workflow
    test('TC_CHK_07: Step 2 Cancel / Backtrack Workflow', async ({page}) => {

        await inventoryPage.backpackCard.locator('button').click();
        await headers.goToCart();

        await expect(page).toHaveURL(urlConstants.CART_PAGE_URL);

        const checkOutButton = page.locator('#checkout');
        await checkOutButton.click();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_ONE_URL);

        await checkoutStepOnePage.fillOutInformation(testUser.firstName, testUser.lastName, testUser.zipCode);
        await checkoutStepOnePage.clickContinue();

        await expect(page).toHaveURL(urlConstants.CHECKOUT_STEP_TWO_URL);

        await checkoutStepTwoPage.clickCancel();

        await expect(page).toHaveURL(urlConstants.INVENTORY_PAGE_URL);
    });

});
