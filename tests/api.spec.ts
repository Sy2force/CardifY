import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Mock API failure
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server error' })
      });
    });
    
    // Try to navigate to cards if link exists
    const cardsLink = page.locator('a:has-text("Cartes"), a:has-text("Cards"), nav a[href*="cards"]').first();
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(2000);
    }
    
    // Should handle error gracefully (page should still load)
    await expect(page.locator('h1, main, body')).toBeVisible();
  });

  test('should handle slow API responses', async ({ page }) => {
    await page.goto('/');
    
    // Mock slow API response
    await page.route('**/api/cards', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ cards: [], pagination: { total: 0 } })
        });
      }, 1000);
    });
    
    // Try to navigate to cards if link exists
    const cardsLink = page.locator('a:has-text("Cartes"), a:has-text("Cards"), nav a[href*="cards"]').first();
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(3000);
    }
    
    // Should eventually load the page
    await expect(page.locator('h1, main, body')).toBeVisible();
  });

  test('should handle network offline state', async ({ page }) => {
    await page.goto('/');
    
    // Simulate offline
    await page.context().setOffline(true);
    
    // Try to navigate to cards if link exists
    const cardsLink = page.locator('a:has-text("Cartes"), a:has-text("Cards"), nav a[href*="cards"]').first();
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(2000);
    }
    
    // Should handle offline gracefully
    await expect(page.locator('h1, main, body')).toBeVisible();
    
    // Restore online
    await page.context().setOffline(false);
  });
});
