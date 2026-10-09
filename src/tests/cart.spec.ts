import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { Header } from '../components/Header';
import { secrets } from '../../test-data/secrets';
import { urlConstants } from '../../utils/constants';



test.describe('SauceLabs Shopping Cart Suite', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let headers: Header;

    // Before each test, this will run every time a Test case is executed. It will create a new instance of the LoginPage class and navigate to the login page. 
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        headers = new Header(page);

        await loginPage.navigate();
        await loginPage.login(secrets.username, secrets.password);

        
    });

    /******************* TEST CASES ***********************/ 
    // TEST CASE 1: Add Single Item to Cart and Verify
    test('TC_CRT_01: Add Single Item to Cart and Verify', async ({page}) => {

        await expect(inventoryPage.backpackCard).toBeVisible();
        await inventoryPage.backpackCard.locator('button').click();
        await expect(inventoryPage.backpackCard.locator('button')).toHaveText('Remove');
        
        await expect(headers.cartBadge).toHaveText('1');
        await headers.goToCart();

        await expect(cartPage.backpackCard).toBeVisible();

        const backPackCartQuantity = cartPage.backpackCard.locator('.cart_quantity');
        await expect(backPackCartQuantity).toHaveText('1');

        const backPackCartPrice = cartPage.backpackCard.locator('.inventory_item_price');
        await expect(backPackCartPrice).toHaveText('$29.99');
    });
  
    // TEST CASE 2: Add Multiple Items to Cart and Verify
    test('TC_CRT_02: Add Multiple Items to Cart and Verify', async ({page}) => {

        
        await inventoryPage.backpackCard.locator('button').click();
        await inventoryPage.bikeLightCard.locator('button').click();
        await expect(headers.cartBadge).toHaveText('2');

        // Navigate to Cart Page
        await headers.goToCart();

        await expect(cartPage.backpackCard).toBeVisible();

        const backPackCartQuantity = cartPage.backpackCard.locator('.cart_quantity');
        await expect(backPackCartQuantity).toHaveText('1');

        const backPackCartPrice = cartPage.backpackCard.locator('.inventory_item_price');
        await expect(backPackCartPrice).toHaveText('$29.99');

        await expect(cartPage.bikeLightCard).toBeVisible();

        const bikeLightCartQuantity = cartPage.bikeLightCard.locator('.cart_quantity');
        await expect(bikeLightCartQuantity).toHaveText('1');

        const bikeLightCartPrice = cartPage.bikeLightCard.locator('.inventory_item_price');
        await expect(bikeLightCartPrice).toHaveText('$9.99');

    });
    // TEST CASE 3: Remove Item from Inventory Page and Verify Cart Update
    test('TC_CRT_03: Remove Item from Inventory Page and Verify Cart Update', async ({page}) => {

        await expect(inventoryPage.backpackCard).toBeVisible();
        await inventoryPage.backpackCard.locator('button').click();
        await expect(headers.cartBadge).toHaveText('1');

        await expect(inventoryPage.backpackCard.locator('button')).toHaveText('Remove');
        await inventoryPage.backpackCard.locator('button').click();
        await expect(headers.cartBadge).toBeHidden();

        await headers.goToCart();
        const cartItem = page.locator('.cart_item')
        await expect(cartItem).toBeHidden();
    });

    // TEST CASE 4: Remove Item from Cart Page and Verify Cart Update
    test('TC_CRT_04: Remove Item from Cart Page and Verify Cart Update', async ({page}) => {

        await inventoryPage.backpackCard.locator('button').click();
        await expect(headers.cartBadge).toHaveText('1');
        await headers.goToCart();

        await expect(cartPage.backpackCard).toBeVisible();

        const backPackCartRemove = cartPage.backpackCard.locator('button').filter({ hasText: 'Remove' });
        await backPackCartRemove.click();
        await expect(headers.cartBadge).toBeHidden();
        await expect(cartPage.backpackCard).toBeHidden();
     });   
    
    // TEST CASE 5: Empty Cart Boundary Navigation Test
    test('TC_CRT_05: Empty Cart Boundary Navigation Test', async ({page}) => {
        await headers.goToCart();

        const cartItem = page.locator('.cart_item');

        await expect(headers.cartBadge).toBeHidden();
        await expect(cartItem).toBeHidden();

        const continueShoppingButton = page.locator('button').filter({ hasText: 'Continue Shopping' });
        await continueShoppingButton.click();

        await expect(page).toHaveURL(urlConstants.INVENTORY_PAGE_URL);
     });  
    
});