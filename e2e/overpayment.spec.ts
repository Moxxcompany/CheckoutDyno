import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Overpayment Scenarios
 * 
 * Tests cover:
 * - Overpayment display
 * - Excess amount calculation
 * - Refund notice
 * - Different redirect scenarios
 */

test.describe('Overpayment Scenarios', () => {
  
  test.describe('Overpayment Card Display', () => {
    
    test('should display overpayment card on default state', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Default state is overpay-redirect-email
      await expect(page.getByTestId('overpayment-card')).toBeVisible();
    });

    test('should display overpayment title', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText('Overpayment Received')).toBeVisible();
    });

    test('should display overpayment subtitle', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText(/paid a bit extra/i)).toBeVisible();
    });
  });

  test.describe('Payment Amounts', () => {
    
    test('should display paid amount', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText('Paid:')).toBeVisible();
    });

    test('should display total due amount', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText('Total Due:')).toBeVisible();
    });

    test('should display excess amount', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText('Excess:')).toBeVisible();
    });

    test('should display crypto amounts', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Should show currency amounts (USDT or ETH)
      await expect(page.locator('text=/USDT|ETH|BTC/i').first()).toBeVisible();
    });

    test('should display fiat equivalents', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Should show approximate fiat values (≈ or $ or EUR)
      await expect(page.locator('text=/≈|\\$|EUR|USD/i').first()).toBeVisible();
    });
  });

  test.describe('Refund Notice', () => {
    
    test('should display refund notice', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText(/Excess amount will be refunded/i)).toBeVisible();
    });

    test('should show checkmark icon with refund notice', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Refund notice section should exist
      await expect(page.getByText(/refunded/i)).toBeVisible();
    });
  });

  test.describe('Transaction ID', () => {
    
    test('should display transaction ID', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText(/Transaction/i)).toBeVisible();
    });

    test('should have copy transaction button', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByTestId('copy-transaction-btn')).toBeVisible();
    });

    test('should copy transaction ID on click', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await page.getByTestId('copy-transaction-btn').click();
      await expect(page.getByText('Copied!')).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Redirect Scenarios', () => {
    
    test('should show redirect countdown with redirect URL', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Default has redirect URL
      await expect(page.getByText(/Redirecting to/i)).toBeVisible();
    });

    test('should show return button with merchant name', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByTestId('return-btn')).toBeVisible();
      await expect(page.getByTestId('return-btn')).toContainText(/Return to/i);
    });

    test('should show Done button when no redirect URL', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Switch to done only scenario
      await page.getByRole('button', { name: /Overpay: Done Only/i }).click();
      
      await expect(page.getByTestId('return-btn')).toContainText('Done');
    });
  });

  test.describe('Email Confirmation', () => {
    
    test('should show email confirmation with email', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Default scenario has email
      await expect(page.getByText(/Confirmation sent to/i)).toBeVisible();
    });

    test('should not show email confirmation without email', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Switch to redirect only (no email)
      await page.getByRole('button', { name: /Overpay: Redirect Only/i }).click();
      
      await expect(page.getByText(/Confirmation sent to/i)).not.toBeVisible();
    });
  });

  test.describe('Click If Not Redirected', () => {
    
    test('should show click here text when redirect URL exists', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText(/Click here if not redirected/i)).toBeVisible();
    });
  });

  test.describe('Security Badge', () => {
    
    test('should display security badge', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText('Secure payment by DynoPay')).toBeVisible();
    });
  });
});

test.describe('Overpayment - All Scenarios', () => {
  
  test('Overpay: Redirect + Email scenario', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    
    // Already default
    await expect(page.getByTestId('overpayment-card')).toBeVisible();
    await expect(page.getByText(/Redirecting to/i)).toBeVisible();
    await expect(page.getByText(/Confirmation sent to/i)).toBeVisible();
    await expect(page.getByTestId('return-btn')).toContainText(/Return to/i);
  });

  test('Overpay: Redirect Only scenario', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    
    await page.getByRole('button', { name: /Overpay: Redirect Only/i }).click();
    
    await expect(page.getByTestId('overpayment-card')).toBeVisible();
    await expect(page.getByText(/Redirecting to/i)).toBeVisible();
    await expect(page.getByText(/Confirmation sent to/i)).not.toBeVisible();
  });

  test('Overpay: Email Only scenario', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    
    await page.getByRole('button', { name: /Overpay: Email Only/i }).click();
    
    await expect(page.getByTestId('overpayment-card')).toBeVisible();
    await expect(page.getByText(/Confirmation sent to/i)).toBeVisible();
    // No redirect countdown when no redirect URL
    await expect(page.getByText(/Redirecting to/i)).not.toBeVisible();
  });

  test('Overpay: Done Only scenario', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    
    await page.getByRole('button', { name: /Overpay: Done Only/i }).click();
    
    await expect(page.getByTestId('overpayment-card')).toBeVisible();
    await expect(page.getByTestId('return-btn')).toContainText('Done');
    await expect(page.getByText(/Confirmation sent to/i)).not.toBeVisible();
    await expect(page.getByText(/Redirecting to/i)).not.toBeVisible();
  });
});

test.describe('Overpayment - Responsive Design', () => {
  
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pay/payment-states-demo');
    
    await expect(page.getByTestId('overpayment-card')).toBeVisible();
    await expect(page.getByTestId('return-btn')).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/pay/payment-states-demo');
    
    await expect(page.getByTestId('overpayment-card')).toBeVisible();
  });
});
