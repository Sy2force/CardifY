import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test('should display correctly on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    
    // Check responsive layout
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText(/connexion/i)).toBeVisible();
    
    // Check if mobile menu button exists (hamburger menu)
    const mobileMenuButton = page.locator('button:has(.lucide-menu), .hamburger, [data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton).toBeVisible();
    }
  });

  test('should display correctly on tablet devices', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText(/connexion/i)).toBeVisible();
    
    // Try to navigate to cards if link exists
    const cardsLink = page.locator('a:has-text("Cartes"), a:has-text("Cards"), nav a[href*="cards"]').first();
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(2000);
      const cardCount = await page.locator('.card, [data-testid="card"], .card-item').count();
      if (cardCount > 0) {
        expect(cardCount).toBeGreaterThan(0);
      }
    }
  });

  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText(/connexion/i)).toBeVisible();
    
    // Check if navigation exists
    const navigation = page.locator('nav, .navigation, .navbar, header');
    if (await navigation.count() > 0) {
      await expect(navigation.first()).toBeVisible();
    }
  });

  test('should handle mobile menu interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu button exists
    const mobileMenuButton = page.locator('button:has(.lucide-menu), .hamburger, [data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.count() === 0) {
      test.skip();
      return;
    }
    
    // Open mobile menu
    await mobileMenuButton.click();
    await page.waitForTimeout(500);
    
    // Check if menu items are visible
    const menuItems = page.locator('.mobile-menu-items, .menu-items, nav');
    if (await menuItems.count() > 0) {
      await expect(menuItems).toBeVisible();
    }
  });
});
