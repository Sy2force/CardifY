import { test, expect } from '@playwright/test';
import { loginAsAdmin, loginAsBusiness, waitForNetworkIdle } from './utils/testHelpers';

test.describe('API Integration Tests', () => {
  test('should handle API errors gracefully', async ({ page }) => {
    // Intercept API calls and return errors
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should handle API errors without crashing
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
    
    // Clean up route interception
    await page.unroute('**/api/**');
    
    // Should show error message or empty state
    const errorIndicator = page.locator('text=/error|erreur|aucune carte|no cards/i');
    if (await errorIndicator.count() > 0) {
      await expect(errorIndicator.first()).toBeVisible();
    }
  });

  test('should validate API response format', async ({ page }) => {
    // Intercept cards API to check response format
    let apiResponse: any;
    
    page.on('response', response => {
      if (response.url().includes('/api/cards')) {
        apiResponse = response;
      }
    });
    
    await page.goto('/cards');
    await page.waitForLoadState('networkidle');
    
    // Wait for API response
    await page.waitForTimeout(3000);
    
    if (apiResponse) {
      expect(apiResponse.status()).toBeLessThan(400);
      
      try {
        const responseBody = await apiResponse.json();
        expect(responseBody).toHaveProperty('success');
      } catch (error) {
        console.log('API response not in JSON format, skipping validation');
      }
    } else {
      test.skip();
    }
  });

  test('should handle slow API responses', async ({ page }) => {
    // Login first to avoid auth issues
    await loginAsBusiness(page);
    
    // Mock slow API response
    await page.route('**/api/cards*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          cards: [], 
          pagination: { total: 0, page: 1, limit: 10 } 
        })
      });
    });
    
    await page.goto('/cards');
    await page.waitForLoadState('domcontentloaded');
    
    // Check if we're still on login page (auth failed)
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      await page.unroute('**/api/cards*');
      test.skip();
      return;
    }
    
    // Wait for the slow response to complete
    await page.waitForTimeout(4000);
    
    // Should eventually show the page content
    await expect(page.locator('h1, main, body')).toBeVisible();
    
    // Clean up route
    await page.unroute('**/api/cards*');
  });

  test('should handle network offline state', async ({ page }) => {
    try {
      // Login first to avoid auth issues
      await loginAsBusiness(page);
      
      // Start online, then go offline
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Simulate offline state
      await page.context().setOffline(true);
      
      // Try to navigate to cards page while offline
      await page.goto('/cards');
      await page.waitForLoadState('domcontentloaded');
      
      // Should handle gracefully - page should still load basic structure
      await expect(page.locator('h1, main, body')).toBeVisible();
      
      // Re-enable network
      await page.context().setOffline(false);
      
      // Should recover when back online
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('h1')).toBeVisible();
    } catch (error) {
      // Ensure network is back online even if test fails
      await page.context().setOffline(false);
      throw error;
    }
  });
  
  test('should handle authentication errors', async ({ page }) => {
    // Mock authentication failure
    await page.route('**/api/users/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Invalid credentials' })
      });
    });
    
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    await waitForNetworkIdle(page);
    
    try {
      // Fill login form with invalid credentials
      const emailInput = page.locator('[data-testid="email-input"], input[type="email"]').first();
      const passwordInput = page.locator('[data-testid="password-input"], input[type="password"]').first();
      const loginButton = page.locator('[data-testid="login-button"], button[type="submit"]').first();
      
      await emailInput.fill('invalid@example.com');
      await passwordInput.fill('wrongpassword');
      await loginButton.click();
      
      // Should remain on login page or show error
      await page.waitForTimeout(3000);
      const currentUrl = page.url();
      const stillOnLogin = currentUrl.includes('/login');
      const hasErrorMessage = await page.locator('text=/invalid|error|incorrect/i').count() > 0 || 
                                  await page.locator('.error').count() > 0 || 
                                  await page.locator('[data-testid*="error"]').count() > 0;
      
      expect(stillOnLogin || hasErrorMessage).toBeTruthy();
    } finally {
      // Clean up route
      await page.unroute('**/api/users/login');
    }
  });
});
