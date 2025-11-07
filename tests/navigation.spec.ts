import { test, expect } from '@playwright/test';
import { loginAsAdmin, clickWithRetry, safeClick, waitForNetworkIdle } from './utils/testHelpers';

test.describe('Navigation Tests', () => {
  test('should handle browser back/forward navigation', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to login
    const loginClicked = await safeClick(page, '[data-testid="navbar-login-button"]');
    if (!loginClicked) {
      await clickWithRetry(page, 'button:has-text("Connexion"), a:has-text("Connexion")');
    }
    
    await page.waitForURL(/.*login/, { timeout: 10000 });
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
    
    // Go forward
    await page.goForward();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to dashboard after login', async ({ page }) => {
    // Use helper function for reliable login
    await loginAsAdmin(page);
    await waitForNetworkIdle(page);
    
    // Should be on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Check for dashboard content with fallback selectors
    const dashboardIndicator = page.locator('[data-testid="dashboard-title"], h1:has-text("Dashboard"), h1:has-text("Tableau de bord"), main');
    await expect(dashboardIndicator.first()).toBeVisible();
  });

  test('should navigate to login page from navbar', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click login button in navbar with fallback
    const loginClicked = await safeClick(page, '[data-testid="navbar-login-button"]');
    if (!loginClicked) {
      await clickWithRetry(page, 'button:has-text("Connexion"), a:has-text("Connexion")');
    }
    
    // Should navigate to login page
    await page.waitForURL(/.*login/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="login-heading"]')).toBeVisible();
  });

  test('should handle 404 page correctly', async ({ page }) => {
    await page.goto('/non-existent-page');
    // Should redirect to home page since we have catch-all route
    await expect(page).toHaveURL('/');
  });

  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login', { timeout: 5000 });
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('[data-testid="login-heading"]')).toBeVisible();
  });
});
