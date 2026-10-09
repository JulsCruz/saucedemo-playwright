import {Page, Locator} from '@playwright/test';
import { InventoryCard } from './InventoryCard';

export class InventoryGrid {

    private readonly gridContainer: Locator;
    private readonly sortDropdown: Locator;


    constructor(page: Page) {
        this.gridContainer = page.locator('.inventory_list');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    }

    async getItemByName(productName: string): Promise<InventoryCard> {
        const productLocator = this.gridContainer.locator('.inventory_item', { hasText: productName });
        return new InventoryCard(productLocator);
    }

    async getItemByIndex(index: number): Promise<InventoryCard> {
        const productCell = this.gridContainer.locator('.inventory_item').nth(index);
        return new InventoryCard(productCell);
    }

    async selectSortOption(optionValue: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.sortDropdown.selectOption(optionValue);
    }

}