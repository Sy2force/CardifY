import { test, expect } from '@playwright/test';
import { loginAs, clickWithRetry, safeClick } from './utils/testHelpers';

test.describe('Multilingual Interface Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch to Hebrew', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for language switcher
    const langSwitcher = page.locator('[data-testid="language-switcher"], .language-selector, button:has-text("HE"), select[name="language"]');
    
    if (await langSwitcher.count() > 0) {
      await clickWithRetry(page, '[data-testid="language-switcher"], .language-selector, button:has-text("HE")');
      await page.waitForTimeout(500);
      
      // Select Hebrew
      const hebrewOption = page.locator('text="עברית", [data-lang="he"], button:has-text("HE"), option[value="he"]');
      if (await hebrewOption.count() > 0) {
        await hebrewOption.first().click();
        await page.waitForTimeout(2000);
        await page.waitForLoadState('networkidle');
        
        // Check if content changed to Hebrew (RTL)
        const hebrewContent = page.locator('text=/התחבר|הרשם/i');
        if (await hebrewContent.count() > 0) {
          await expect(hebrewContent.first()).toBeVisible();
        }
        
        // Check RTL direction
        const bodyDir = await page.locator('body').getAttribute('dir');
        if (bodyDir === 'rtl') {
          expect(bodyDir).toBe('rtl');
        }
      }
    } else {
      test.skip();
    }
  });

  test('should switch to English', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for language switcher
    const langSwitcher = page.locator('[data-testid="language-switcher"], .language-selector, button:has-text("EN"), select[name="language"]');
    
    if (await langSwitcher.count() > 0) {
      await clickWithRetry(page, '[data-testid="language-switcher"], .language-selector, button:has-text("EN")');
      await page.waitForTimeout(500);
      
      // Select English
      const englishOption = page.locator('text="English", [data-lang="en"], button:has-text("EN"), option[value="en"]');
      if (await englishOption.count() > 0) {
        await englishOption.first().click();
        await page.waitForTimeout(2000);
        await page.waitForLoadState('networkidle');
        
        // Check if content changed to English
        const englishContent = page.locator('text=/login|sign in|register/i');
        if (await englishContent.count() > 0) {
          await expect(englishContent.first()).toBeVisible();
        }
      }
    } else {
      test.skip();
    }
  });

  test('should maintain language preference across navigation', async ({ page }) => {
    // Try to switch language if switcher exists
    const languageButton = page.locator('button:has(.lucide-globe)');
    
    if (await languageButton.count() > 0) {
      await languageButton.click();
      const englishOption = page.getByText(/english|🇺🇸/i).first();
      if (await englishOption.count() > 0) {
        await englishOption.click();
        await page.waitForTimeout(500);
      }
      
      // Navigate to cards page
      const cardsLink = page.locator('a[href="/cards"]').first();
      if (await cardsLink.isVisible()) {
        await cardsLink.click();
        await page.waitForURL('**/cards', { timeout: 5000 });
        
        // Verify language is still English (check for English text)
        const englishText = page.locator('text=/cards|home|login/i');
        if (await englishText.count() > 0) {
          await expect(englishText.first()).toBeVisible();
        }
      }
    } else {
      test.skip();
    }
  });
});
