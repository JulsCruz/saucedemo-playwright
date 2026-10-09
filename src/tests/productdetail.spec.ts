import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { Header } from '../components/Header';
import { secrets } from '../../test-data/secrets';
import { itemConstants, urlConstants } from '../../utils/constants';
import { InventoryGrid } from '../components/InventoryGrid';
import { ProductDetailPage } from '../pages/ProductDetailPage';



test.describe('SauceLabs Product Detail Page Suite', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let inventoryGrid: InventoryGrid;
    let productDetailPage: ProductDetailPage;
    let cartPage: CartPage;
    let headers: Header;    

    // Before each test, this will run every time a Test case is executed. It will create a new instance of the LoginPage class and navigate to the login page. 
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        inventoryGrid = new InventoryGrid(page);
        productDetailPage = new ProductDetailPage(page);
        cartPage = new CartPage(page);
        headers = new Header(page);

        await loginPage.navigate();
        await loginPage.login(secrets.username, secrets.password);

        
    });

    /******************* TEST CASES ***********************/ 

    // TEST CASE 1: Verify Product Details Views
    test('TC_PDV_01: Verify Product Details View', async ({page}) => {

        const backPackItem = await inventoryGrid.getItemByName(itemConstants.BACKPACK_ITEM_NAME);
        await backPackItem.title.click();

        await expect(page).toHaveURL(`${urlConstants.INVENTORY_DETAIL_PAGE_URL}${itemConstants.BACKPACK_ITEM_ID}`);
        await expect(productDetailPage.itemName).toHaveText(`${itemConstants.BACKPACK_ITEM_NAME}`);
        await expect(productDetailPage.itemPrice).toHaveText(`$${itemConstants.BACKPACK_ITEM_PRICE}`);

        await expect(headers.cartBadge).toBeHidden();
        await productDetailPage.button.click();
        await expect(headers.cartBadge).toHaveText('1');

    });

    // TEST CASE 2: Add/Remove Item from Product Detail Page
    test('TC_PDV_02: Add/Remove Item from Product Detail Page', async ({page}) => {

        const backPackItem = await inventoryGrid.getItemByName(itemConstants.BACKPACK_ITEM_NAME);
        await backPackItem.title.click();

        await expect(page).toHaveURL(`${urlConstants.INVENTORY_DETAIL_PAGE_URL}${itemConstants.BACKPACK_ITEM_ID}`);
        await expect(productDetailPage.itemName).toHaveText(`${itemConstants.BACKPACK_ITEM_NAME}`);
        await expect(productDetailPage.itemPrice).toHaveText(`$${itemConstants.BACKPACK_ITEM_PRICE}`);

        await expect(headers.cartBadge).toBeHidden();
        await productDetailPage.button.click();
        await expect(headers.cartBadge).toHaveText('1');

        await productDetailPage.button.click();
        await expect(headers.cartBadge).toBeHidden();

    });

    // TEST CASE 3: Back To Products Navigation
    test('TC_PDV_03: Add/Remove Item from Product Detail Page', async ({page}) => {

        const backPackItem = await inventoryGrid.getItemByName(itemConstants.BACKPACK_ITEM_NAME);
        await backPackItem.title.click();

        await expect(page).toHaveURL(`${urlConstants.INVENTORY_DETAIL_PAGE_URL}${itemConstants.BACKPACK_ITEM_ID}`);
        await expect(productDetailPage.itemName).toHaveText(`${itemConstants.BACKPACK_ITEM_NAME}`);
        await expect(productDetailPage.itemPrice).toHaveText(`$${itemConstants.BACKPACK_ITEM_PRICE}`);

        await expect(headers.cartBadge).toBeHidden();
        await productDetailPage.button.click();
        await expect(headers.cartBadge).toHaveText('1');

        await productDetailPage.backButton.click();
        await expect(page).toHaveURL(urlConstants.INVENTORY_PAGE_URL);
        await expect(headers.cartBadge).toHaveText('1');
        const backPackCartRemove = cartPage.backpackCard.locator('button').filter({ hasText: 'Remove' });

    });


});