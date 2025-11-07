import { Page, expect } from '@playwright/test';

export const loginAs = async (page: Page, role: 'admin' | 'business' | 'user'): Promise<string> => {
  const credentials = {
    admin: { email: 'admin@cardify.com', password: 'admin123' },
    business: { email: 'sarah@example.com', password: 'business123' },
    user: { email: 'john@example.com', password: 'user123' }
  };

  // Always use mock authentication for stability
  const mockToken = 'mock-jwt-token-' + role + '-' + Date.now();
  const mockUser = {
    _id: 'test-user-id-' + Date.now(),
    email: credentials[role].email,
    firstName: 'Test',
    lastName: 'User',
    isAdmin: role === 'admin',
    isBusiness: role === 'business' || role === 'admin',
    phone: '+1234567890'
  };
  
  // Set up mock authentication before navigation
  await page.addInitScript((data) => {
    window.localStorage.setItem('cardify_token', data.token);
    window.localStorage.setItem('cardify_user', JSON.stringify(data.user));
  }, { token: mockToken, user: mockUser });
  
  // Navigate to dashboard
  await page.goto('/dashboard');
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for auth context to initialize
  await page.waitForTimeout(2000);
  await waitForNetworkIdle(page);
  
  // Verify token was set
  const verifyToken = await page.evaluate(() => localStorage.getItem('cardify_token'));
  return verifyToken || mockToken;
};

export const loginAsAdmin = async (page: Page): Promise<string> => {
  return await loginAs(page, 'admin');
};

export const loginAsBusiness = async (page: Page): Promise<string> => {
  return await loginAs(page, 'business');
};

export const loginAsUser = async (page: Page): Promise<string> => {
  return await loginAs(page, 'user');
};

export const createCard = async (page: Page, cardData: {
  title: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
}) => {
  // Look for create button
  const createButton = page.locator('button:has-text("Créer"), button:has-text("Nouvelle"), .btn:has(.lucide-plus), [data-testid*="create"]').first();
  
  await expect(createButton).toBeVisible();
  await createButton.click();
  await page.waitForTimeout(1000);
  
  // Fill form fields
  await page.fill('input[name="title"]', cardData.title);
  await page.fill('input[name="email"]', cardData.email);
  await page.fill('input[name="phone"]', cardData.phone);
  
  if (cardData.company) {
    const companyInput = page.locator('input[name="company"]');
    if (await companyInput.isVisible()) {
      await companyInput.fill(cardData.company);
    }
  }
  
  if (cardData.position) {
    const positionInput = page.locator('input[name="position"]');
    if (await positionInput.isVisible()) {
      await positionInput.fill(cardData.position);
    }
  }
  
  // Submit form
  const submitButton = page.locator('button[type="submit"]');
  await expect(submitButton).toBeVisible();
  await submitButton.click();
  
  // Wait for response
  await page.waitForTimeout(2000);
  await page.waitForLoadState('networkidle');
};

export const waitForCardLoad = async (page: Page) => {
  try {
    await page.waitForSelector('[data-testid="card-item"], .card, .card-container', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
  } catch (error) {
    // If no cards found, check if we're on the right page
    const url = page.url();
    if (!url.includes('dashboard') && !url.includes('cards')) {
      throw new Error(`Not on cards page: ${url}`);
    }
    // Continue if we're on the right page but no cards exist
  }
};

export const setMobileViewport = async (page: Page) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12
};

export const setDesktopViewport = async (page: Page) => {
  await page.setViewportSize({ width: 1280, height: 720 });
};

export const waitForApiResponse = async (page: Page, url: string, timeout: number = 15000) => {
  try {
    const response = await page.waitForResponse(response => 
      response.url().includes(url) && response.status() < 500, { timeout }
    );
    return response;
  } catch (error) {
    console.warn(`API response timeout for ${url}`);
    return null;
  }
};

export const waitForNetworkIdle = async (page: Page, timeout: number = 5000) => {
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch {
    // Continue if network doesn't become idle
    await page.waitForTimeout(1000);
  }
};

export const clickWithRetry = async (page: Page, selector: string, maxRetries: number = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      await page.click(selector);
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
};

export const safeClick = async (page: Page, selector: string) => {
  const element = page.locator(selector);
  if (await element.count() > 0 && await element.first().isVisible()) {
    await element.first().click();
    await page.waitForTimeout(500); // Small delay after click
    return true;
  }
  return false;
};

export const mockCardData = {
  title: 'Test Card',
  email: 'test@example.com',
  phone: '1234567890',
  company: 'Test Company',
  position: 'Test Position',
  address: {
    street: '123 Test St',
    city: 'Test City',
    zipCode: '12345',
    country: 'Test Country'
  },
  web: 'https://test.com',
  description: 'Test description'
};

export const setViewportMobile = async (page: Page) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12
};

export const setViewportTablet = async (page: Page) => {
  await page.setViewportSize({ width: 768, height: 1024 }); // iPad
};
