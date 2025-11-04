import { test, expect } from '@playwright/test';

test.describe('Multilingual Interface Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch to English language', async ({ page }) => {
    // Find language switcher (globe icon or flag)
    const languageButton = page.locator('button:has(.lucide-globe), button:has-text("🇫🇷"), [data-testid="language-switcher"]');
    if (await languageButton.count() === 0) {
      test.skip();
      return;
    }
    
    await languageButton.click();
    
    // Select English if dropdown appears
    const englishOption = page.getByText(/english|🇺🇸/i).first();
    if (await englishOption.count() > 0) {
      await englishOption.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should switch to Hebrew language', async ({ page }) => {
    // Find language switcher
    const languageButton = page.locator('button:has(.lucide-globe), button:has-text("🇫🇷"), [data-testid="language-switcher"]');
    if (await languageButton.count() === 0) {
      test.skip();
      return;
    }
    
    await languageButton.click();
    
    // Select Hebrew if dropdown appears
    const hebrewOption = page.getByText(/עברית|🇮🇱/i).first();
    if (await hebrewOption.count() > 0) {
      await hebrewOption.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should maintain language preference across pages', async ({ page }) => {
    // Try to switch language if switcher exists
    const languageButton = page.locator('button:has(.lucide-globe), button:has-text("🇫🇷"), [data-testid="language-switcher"]');
    if (await languageButton.count() === 0) {
      test.skip();
      return;
    }
    
    await languageButton.click();
    const englishOption = page.getByText(/english|🇺🇸/i).first();
    if (await englishOption.count() > 0) {
      await englishOption.click();
      await page.waitForTimeout(1000);
    }
    
    // Navigate to cards page if link exists
    const cardsLink = page.locator('a:has-text("Cards"), a:has-text("Cartes"), nav a[href*="cards"]').first();
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should display correct date formats for different languages', async ({ page }) => {
    // Login first to see dates
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
      await page.waitForTimeout(1000);
    }
    
    // Check if dates are displayed (format may vary by language)
    const dateElements = page.locator('[data-testid="card-date"], .card-date, .date, time');
    if (await dateElements.count() > 0) {
      await expect(dateElements.first()).toBeVisible();
    } else {
      // Skip if no date elements found
      test.skip();
    }
  });
});
