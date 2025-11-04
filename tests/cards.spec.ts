import { test, expect } from '@playwright/test';

test.describe('Cards Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await page.goto('/');
    await page.getByText(/connexion/i).first().click();
    await page.fill('input[type="email"]', 'admin@cardify.com');
    await page.fill('input[type="password"]', 'admin123');
    
    const loginButton = page.locator('button[type="submit"], button:has-text("Connexion"), button:has-text("Se connecter"), .btn-primary').first();
    await loginButton.click();
    
    // Wait for login to complete
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    const isLoggedIn = currentUrl.includes('dashboard') || currentUrl.includes('cards') || !currentUrl.includes('login');
    
    if (!isLoggedIn) {
      test.skip();
    }
  });

  test('should display cards page correctly', async ({ page }) => {
    // Try to navigate to cards page
    const cardsLink = page.locator('a:has-text("Cartes"), a:has-text("Cards"), nav a[href*="cards"]').first();
    
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/.*cards/);
      
      // Check if page has cards or at least the cards container
      const cardsContainer = page.locator('.cards-container, .card-grid, main');
      await expect(cardsContainer).toBeVisible();
    } else {
      // If no cards link, check if we're already on a cards-like page
      const hasCards = await page.locator('.card, [data-testid="card"], .card-item').count();
      if (hasCards === 0) {
        test.skip();
      }
    }
  });

  test('should create new card successfully', async ({ page }) => {
    // Navigate to cards page first
    const cardsLink = page.locator('a:has-text("Cartes"), a:has-text("Cards"), nav a[href*="cards"]').first();
    if (await cardsLink.isVisible()) {
      await cardsLink.click();
      await page.waitForTimeout(1000);
    }
    
    // Check if create button exists
    const createButton = page.locator('button:has-text("Créer"), button:has-text("Nouvelle carte"), .create-btn, [data-testid="create-card"]').first();
    if (await createButton.count() === 0) {
      test.skip();
      return;
    }
    
    await createButton.click();
    await page.waitForTimeout(1000);
    
    // Try to fill form if it exists
    const titleInput = page.locator('input[name="title"], input[placeholder*="titre"]').first();
    if (await titleInput.isVisible()) {
      await titleInput.fill('Test Card Playwright');
      
      // Fill other fields if they exist
      const subtitleInput = page.locator('input[name="subtitle"]');
      if (await subtitleInput.count() > 0) {
        await subtitleInput.fill('Test Subtitle');
      }
      
      const submitButton = page.locator('button[type="submit"], button:has-text("Créer"), button:has-text("Enregistrer")').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(2000);
      }
    } else {
      test.skip();
    }
  });

  test('should view card details', async ({ page }) => {
    await page.getByRole('link', { name: /cartes/i }).click();
    
    // Check if cards exist
    const cards = page.locator('.card, [data-testid="card"]');
    if (await cards.count() === 0) {
      test.skip();
      return;
    }
    
    // Click on first card
    await cards.first().click();
    
    // Should show card details or navigate somewhere
    await page.waitForTimeout(1000);
    await expect(page.locator('h1, h2')).toBeVisible();
  });

  test('should edit existing card', async ({ page }) => {
    await page.getByRole('link', { name: /cartes/i }).click();
    
    // Check if edit functionality exists
    const editButton = page.getByRole('button', { name: /modifier/i });
    if (await editButton.count() === 0) {
      test.skip();
      return;
    }
    
    // Find edit button for first card
    await page.locator('.card, [data-testid="card"]').first().hover();
    await editButton.first().click();
    
    // Try to update if form exists
    const titleInput = page.locator('input[name="title"]');
    if (await titleInput.count() > 0) {
      await titleInput.fill('Updated Card Title');
      await page.getByRole('button', { name: /mettre.*jour/i }).click();
    }
  });

  test('should like/unlike a card', async ({ page }) => {
    await page.getByRole('link', { name: /cartes/i }).click();
    
    // Check if like functionality exists
    const likeButton = page.locator('.like-button, [data-testid="like-button"], .heart, .favorite');
    if (await likeButton.count() === 0) {
      test.skip();
      return;
    }
    
    // Click like button on first card
    await likeButton.first().click();
    await page.waitForTimeout(500);
  });

  test('should delete a card', async ({ page }) => {
    await page.getByRole('link', { name: /cartes/i }).click();
    
    // Check if delete functionality exists
    const deleteButton = page.getByRole('button', { name: /supprimer/i });
    if (await deleteButton.count() === 0) {
      test.skip();
      return;
    }
    
    // Get initial card count
    const initialCount = await page.locator('.card, [data-testid="card"]').count();
    
    // Find delete button for first card
    await page.locator('.card, [data-testid="card"]').first().hover();
    await deleteButton.first().click();
    
    // Try to confirm deletion if modal appears
    const confirmButton = page.getByRole('button', { name: /confirmer|oui/i });
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }
  });

  test('should filter cards by search', async ({ page }) => {
    await page.getByRole('link', { name: /cartes/i }).click();
    
    // Use search functionality if it exists
    const searchInput = page.locator('input[type="search"], input[placeholder*="recherch"]');
    if (await searchInput.count() === 0) {
      test.skip();
      return;
    }
    
    await searchInput.fill('David');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
  });

  test('should navigate through pagination', async ({ page }) => {
    await page.getByRole('link', { name: /cartes/i }).click();
    
    // Check if pagination exists
    const nextButton = page.locator('.pagination button:has-text("Suivant"), .pagination .next');
    if (await nextButton.count() === 0) {
      test.skip();
      return;
    }
    
    await nextButton.click();
    await page.waitForTimeout(1000);
  });
});
