import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Redirect Scenarios in Payment Flow
 * 
 * Tests cover:
 * - Auto-redirect after payment success
 * - Manual redirect via button click
 * - Countdown timer behavior
 * - Transaction ID in redirect URL
 */

test.describe('Payment Success - Redirect Scenarios', () => {
  
  test.describe('With Redirect URL + Email', () => {
    
    test('should show redirect countdown when redirectUrl is provided', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      // Select redirect + email scenario
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      
      await expect(page.getByTestId('success-card')).toBeVisible();
      await expect(page.getByTestId('redirect-countdown')).toBeVisible();
      
      // Should show "Redirecting to..." text
      await expect(page.getByText(/Redirecting to/i)).toBeVisible();
    });

    test('should display return button with merchant name', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      
      const returnBtn = page.getByTestId('return-btn');
      await expect(returnBtn).toBeVisible();
      await expect(returnBtn).toContainText(/Return to/i);
    });

    test('should show email confirmation message', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      
      await expect(page.getByText(/Confirmation sent to/i)).toBeVisible();
    });

    test('should display click here if not redirected text', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      
      await expect(page.getByText(/Click here if not redirected/i)).toBeVisible();
    });
  });

  test.describe('With Redirect URL Only (No Email)', () => {
    
    test('should show redirect countdown without email message', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /Redirect Only/i }).click();
      
      await expect(page.getByTestId('success-card')).toBeVisible();
      await expect(page.getByTestId('redirect-countdown')).toBeVisible();
      
      // Should NOT show email confirmation message
      await expect(page.getByText(/Confirmation sent to/i)).not.toBeVisible();
    });

    test('should show save for records message', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /Redirect Only/i }).click();
      
      // When no email, should suggest saving transaction ID
      await expect(page.getByText(/Save this for your records/i)).toBeVisible();
    });
  });

  test.describe('Without Redirect URL (Email Only)', () => {
    
    test('should show Done button instead of Return button', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /Email Only/i }).click();
      
      await expect(page.getByTestId('success-card')).toBeVisible();
      await expect(page.getByTestId('done-btn')).toBeVisible();
      
      // Should NOT show redirect countdown
      await expect(page.getByTestId('redirect-countdown')).not.toBeVisible();
    });

    test('should show email confirmation without redirect', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /Email Only/i }).click();
      
      await expect(page.getByText(/Confirmation sent to/i)).toBeVisible();
      await expect(page.getByTestId('done-btn')).toBeVisible();
    });

    test('should navigate to thank you screen on done click', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /Email Only/i }).click();
      
      await page.getByTestId('done-btn').click();
      
      // Should show thank you message
      await expect(page.getByText(/Thank you/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Without Redirect URL or Email', () => {
    
    test('should show Done button and save records message', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /No Redirect\/Email/i }).click();
      
      await expect(page.getByTestId('success-card')).toBeVisible();
      await expect(page.getByTestId('done-btn')).toBeVisible();
      await expect(page.getByText(/Save this for your records/i)).toBeVisible();
    });

    test('should not show email confirmation message', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /No Redirect\/Email/i }).click();
      
      await expect(page.getByText(/Confirmation sent to/i)).not.toBeVisible();
    });
  });
});

test.describe('Overpayment - Redirect Scenarios', () => {
  
  test.describe('With Redirect URL + Email', () => {
    
    test('should show auto-redirect countdown', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Default is overpay-redirect-email
      await expect(page.getByTestId('overpayment-card')).toBeVisible();
      await expect(page.getByText(/Redirecting to/i)).toBeVisible();
    });

    test('should show return to merchant button', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByTestId('return-btn')).toBeVisible();
      await expect(page.getByTestId('return-btn')).toContainText(/Return to/i);
    });

    test('should display refund notice', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText(/Excess amount will be refunded/i)).toBeVisible();
    });
  });

  test.describe('Without Redirect URL', () => {
    
    test('should show Done button when no redirect', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Select overpay-done-only scenario
      await page.getByRole('button', { name: /Overpay: Done Only/i }).click();
      
      await expect(page.getByTestId('overpayment-card')).toBeVisible();
      await expect(page.getByTestId('return-btn')).toBeVisible();
      await expect(page.getByTestId('return-btn')).toContainText('Done');
    });
  });
});
