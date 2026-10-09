// src/components/InventoryCard.ts
import { Locator } from '@playwright/test';

export class InventoryCard {
  // Scopes interactions exclusively inside this card's bounding box
  private readonly root: Locator;
  
  // Public locators accessible inside your test scripts for assertions
  readonly title: Locator;
  readonly price: Locator;
  readonly actionButton: Locator;

  /**
   * Accepts a pre-isolated locator pointing to exactly one card container element.
   * This guarantees that lookups inside do not collide with adjacent cards.
   */
  constructor(rootLocator: Locator) {
    this.root = rootLocator;
    this.title = this.root.locator('.inventory_item_name');
    this.price = this.root.locator('.inventory_item_price');
    
    // SauceLabs uses a generic button tag that shifts text context from 'Add to cart' to 'Remove'
    this.actionButton = this.root.locator('button');
    
  }

  /**
   * Safe action method to append an item to the shopping cart.
   * Performs an initial check to avoid misclicks if the item is already added.
   */
  async addItem() {
    const text = await this.actionButton.textContent();
    if (text?.trim() === 'Add to cart') {
      await this.actionButton.click();
    }
  }

  /**
   * Safe action method to remove an item from the shopping cart.
   */
  async removeItem() {
    const text = await this.actionButton.textContent();
    if (text?.trim() === 'Remove') {
      await this.actionButton.click();
    }
  }
}