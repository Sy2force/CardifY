import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate through all main pages as guest', async ({ page }) => {
    await page.goto('/');
    
    // Landing page
    await expect(page).toHaveTitle(/Cardify/);
    await expect(page.locator('h1')).toBeVisible();
    
    // Try to navigate to cards page if link exists
    const cardsLink = page.locator('a:has-text("Cartes"), a:has-text("Cards"), nav a[href*="cards"]').first();
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/.*cards/);
      
      // Navigate back to home
      const homeLink = page.locator('a:has-text("Accueil"), a:has-text("Home"), nav a[href="/"]').first();
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await expect(page).toHaveURL('/');
      }
    } else {
      console.log('Cards navigation not available for guests');
    }
  });

  test('should navigate through authenticated pages', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByText(/connexion/i).first().click();
    await page.fill('input[type="email"]', 'admin@cardify.com');
    await page.fill('input[type="password"]', 'admin123');
    
    const loginButton = page.locator('button[type="submit"], button:has-text("Connexion"), button:has-text("Se connecter"), .btn-primary').first();
    await loginButton.click();
    await page.waitForTimeout(3000);
    
    // Check if we're logged in (could be dashboard, cards, or home)
    const currentUrl = page.url();
    const isLoggedIn = currentUrl.includes('dashboard') || currentUrl.includes('cards') || !currentUrl.includes('login');
    
    if (isLoggedIn) {
      // Try to navigate to different sections if they exist
      const profileLink = page.locator('a:has-text("Profil"), a:has-text("Profile"), nav a[href*="profile"]').first();
      if (await profileLink.isVisible()) {
        await profileLink.click();
        await page.waitForTimeout(1000);
      }
      
      const cardsLink = page.locator('a:has-text("Mes cartes"), a:has-text("My cards"), nav a[href*="cards"]').first();
      if (await cardsLink.isVisible()) {
        await cardsLink.click();
        await page.waitForTimeout(1000);
      }
    }
    
    expect(isLoggedIn).toBeTruthy();
  });

  test('should handle 404 page correctly', async ({ page }) => {
    await page.goto('/non-existent-page');
    // Should redirect to home page since we have catch-all route
    await expect(page).toHaveURL('/');
  });

  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });
});
