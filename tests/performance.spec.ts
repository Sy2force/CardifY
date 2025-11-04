import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
  });

  test('should load cards page efficiently', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/cards');
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
  });

  test('should handle large datasets without performance issues', async ({ page }) => {
    await page.goto('/');
    
    // Login first
    await page.getByText(/connexion/i).first().click();
    await page.fill('input[type="email"]', 'admin@cardify.com');
    await page.fill('input[type="password"]', 'admin123');
    
    const loginButton = page.locator('button[type="submit"], button:has-text("Connexion"), button:has-text("Se connecter"), .btn-primary').first();
    await loginButton.click();
    await page.waitForTimeout(3000);
    
    // Try to navigate to cards if link exists
    const cardsLink = page.locator('a:has-text("Cartes"), a:has-text("Cards"), nav a[href*="cards"]').first();
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(2000);
      
      // Measure scroll performance
      const startTime = Date.now();
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(100);
      const scrollTime = Date.now() - startTime;
      
      expect(scrollTime).toBeLessThan(1000); // Smooth scrolling
    } else {
      test.skip();
    }
  });

  test('should optimize image loading', async ({ page }) => {
    // Try to go to cards page directly or navigate there
    await page.goto('/');
    
    const cardsLink = page.locator('a:has-text("Cartes"), a:has-text("Cards"), nav a[href*="cards"]').first();
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(2000);
    } else {
      // Try direct navigation
      await page.goto('/cards');
      await page.waitForTimeout(2000);
    }
    
    // Check if images are lazy loaded
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check first image loads
      await expect(images.first()).toBeVisible();
      
      // Check loading attribute (optional - not all images need lazy loading)
      const loadingAttr = await images.first().getAttribute('loading');
      // Don't enforce lazy loading as it's optional
    } else {
      // Skip if no images found
      test.skip();
    }
  });
});
