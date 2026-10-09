import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { Header } from '../components/Header';
import { secrets } from '../../test-data/secrets';
import { itemConstants, urlConstants } from '../../utils/constants';
import { InventoryGrid } from '../components/InventoryGrid';
import { ProductDetailPage } from '../pages/ProductDetailPage';



test.describe('SauceLabs Inventory Page Suite', () => {
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
        headers = new Header(page);

        await loginPage.navigate();
        await loginPage.login(secrets.username, secrets.password);

        
    });

    /******************* TEST CASES ***********************/ 

    // TEST CASE 1: Grid Card Layout Verification
    test('TC_INV_01: Grid Card Layout Verification', async ({page}) => {
        const fleeceJacketCard = await inventoryGrid.getItemByName(itemConstants.FLEECE_JACKET_ITEM_NAME);
        await expect(fleeceJacketCard.title).toHaveText(`${itemConstants.FLEECE_JACKET_ITEM_NAME}`);
        await expect(fleeceJacketCard.price).toHaveText(`$${itemConstants.FLEECE_JACKET_ITEM_PRICE}`);
        
    });

    // TEST CASE 2: Catalog Grid Sorting - Price Low to High
    test('TC_INV_02: Catalog Grid Sorting - Price Low to High', async ({page}) => {

        await inventoryGrid.selectSortOption('lohi');

        const firstItem = await inventoryGrid.getItemByIndex(0);
        await expect(firstItem.title).toHaveText(`${itemConstants.ONESIE_ITEM_NAME}`);
        await expect(firstItem.price).toHaveText(`$${itemConstants.ONESIE_ITEM_PRICE}`);

        const secondItem = await inventoryGrid.getItemByIndex(1);
        await expect(secondItem.title).toHaveText(`${itemConstants.BIKE_LIGHT_ITEM_NAME}`);
        await expect(secondItem.price).toHaveText(`$${itemConstants.BIKE_LIGHT_ITEM_PRICE}`);
        
    });

    // TEST CASE 3: Catalog Grid Sorting - Alphabetical Z to A
    test('TC_INV_03: Catalog Grid Sorting - Alphabetical Z to A', async ({page}) => {

        await inventoryGrid.selectSortOption('za');

        const firstItem = await inventoryGrid.getItemByIndex(0);
        await expect(firstItem.title).toHaveText(`${itemConstants.TEST_ALL_THE_THINGS_TSHIRT_RED_ITEM_NAME}`);
        await expect(firstItem.price).toHaveText(`$${itemConstants.TEST_ALL_THE_THINGS_TSHIRT_RED_ITEM_PRICE}`);

        const secondItem = await inventoryGrid.getItemByIndex(1);
        await expect(secondItem.title).toHaveText(`${itemConstants.ONESIE_ITEM_NAME}`);
        await expect(secondItem.price).toHaveText(`$${itemConstants.ONESIE_ITEM_PRICE}`);
        
    });

    // TEST CASE 4: Product Deep-Link Pathway

    test('TC_INV_04: Product Deep-Link Pathway', async ({page}) => {

        await inventoryGrid.selectSortOption('za');

        const firstItem = await inventoryGrid.getItemByIndex(0);
        await firstItem.title.click();

        await expect(page).toHaveURL(`${urlConstants.INVENTORY_DETAIL_PAGE_URL}${itemConstants.TEST_ALL_THE_THINGS_TSHIRT_RED_ITEM_ID}`);
        await expect(productDetailPage.itemName).toHaveText(`${itemConstants.TEST_ALL_THE_THINGS_TSHIRT_RED_ITEM_NAME}`);
        await expect(productDetailPage.itemPrice).toHaveText(`$${itemConstants.TEST_ALL_THE_THINGS_TSHIRT_RED_ITEM_PRICE}`);
        
        await expect(headers.cartBadge).toBeHidden();
        await productDetailPage.button.click();
        await expect(headers.cartBadge).toHaveText('1');
        await productDetailPage.backButton.click();
        
        await expect(page).toHaveURL(urlConstants.INVENTORY_PAGE_URL);

    });


});