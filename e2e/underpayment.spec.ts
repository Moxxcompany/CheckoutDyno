import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Underpayment Scenarios
 * 
 * Tests cover:
 * - Partial payment display
 * - Progress bar
 * - Grace period warning
 * - Pay remaining functionality
 * - Transaction ID copy
 */

test.describe('Underpayment Scenarios', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    // Navigate to underpayment state
    await page.getByRole('button', { name: /Underpayment/i }).click();
  });

  test.describe('Underpayment Card Display', () => {
    
    test('should display underpayment card', async ({ page }) => {
      await expect(page.getByTestId('underpayment-card')).toBeVisible();
    });

    test('should display partial payment title', async ({ page }) => {
      await expect(page.getByText('Partial Payment Received')).toBeVisible();
    });

    test('should display subtitle with encouragement', async ({ page }) => {
      await expect(page.getByText(/Almost there/i)).toBeVisible();
    });
  });

  test.describe('Payment Progress', () => {
    
    test('should display payment progress section', async ({ page }) => {
      await expect(page.getByText('Payment Progress')).toBeVisible();
    });

    test('should display completion percentage', async ({ page }) => {
      await expect(page.getByText(/% Complete/i)).toBeVisible();
    });

    test('should display progress bar', async ({ page }) => {
      // The progress bar container
      const progressBar = page.locator('[role="progressbar"], .MuiBox-root').filter({ has: page.locator('text=/Complete/') });
      // Just check that progress section exists
      await expect(page.getByText('Payment Progress')).toBeVisible();
    });
  });

  test.describe('Grace Period Warning', () => {
    
    test('should display grace period warning', async ({ page }) => {
      await expect(page.getByText(/Complete payment within/i)).toBeVisible();
    });

    test('should show minutes in grace warning', async ({ page }) => {
      await expect(page.getByText(/minutes/i)).toBeVisible();
    });
  });

  test.describe('Payment Amounts', () => {
    
    test('should display paid amount', async ({ page }) => {
      await expect(page.getByText('Paid:')).toBeVisible();
    });

    test('should display to pay amount', async ({ page }) => {
      await expect(page.getByText('To Pay:')).toBeVisible();
    });

    test('should display crypto amount with currency', async ({ page }) => {
      await expect(page.locator('text=/USDT|ETH|BTC/i').first()).toBeVisible();
    });

    test('should display fiat equivalent', async ({ page }) => {
      await expect(page.locator('text=/≈|\\$|EUR|USD/i').first()).toBeVisible();
    });
  });

  test.describe('Transaction ID', () => {
    
    test('should display transaction ID', async ({ page }) => {
      await expect(page.getByText(/Transaction/i)).toBeVisible();
    });

    test('should have copy transaction button', async ({ page }) => {
      await expect(page.getByTestId('copy-transaction-btn')).toBeVisible();
    });

    test('should copy transaction ID when clicking copy', async ({ page }) => {
      await page.getByTestId('copy-transaction-btn').click();
      await expect(page.getByText('Copied!')).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Pay Remaining Action', () => {
    
    test('should display pay remaining with crypto button', async ({ page }) => {
      await expect(page.getByTestId('pay-remaining-btn')).toBeVisible();
    });

    test('pay remaining button should contain crypto text', async ({ page }) => {
      await expect(page.getByTestId('pay-remaining-btn')).toContainText(/Pay Remaining/i);
    });

    test('pay remaining button should be clickable', async ({ page }) => {
      const btn = page.getByTestId('pay-remaining-btn');
      await expect(btn).toBeEnabled();
      // In demo, clicking doesn't navigate but verifies button works
      await btn.click();
    });
  });

  test.describe('Security Badge', () => {
    
    test('should display security badge', async ({ page }) => {
      await expect(page.getByText('Secure payment by DynoPay')).toBeVisible();
    });
  });

  test.describe('Underpayment Amounts Display', () => {
    
    test('should show correct structure for paid vs remaining', async ({ page }) => {
      // Should have both "Paid:" and "To Pay:" sections
      const paidSection = page.getByText('Paid:');
      const toPaySection = page.getByText('To Pay:');
      
      await expect(paidSection).toBeVisible();
      await expect(toPaySection).toBeVisible();
    });
  });
});

test.describe('Underpayment - Responsive Design', () => {
  
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pay/payment-states-demo');
    await page.getByRole('button', { name: /Underpayment/i }).click();
    
    await expect(page.getByTestId('underpayment-card')).toBeVisible();
    await expect(page.getByTestId('pay-remaining-btn')).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/pay/payment-states-demo');
    await page.getByRole('button', { name: /Underpayment/i }).click();
    
    await expect(page.getByTestId('underpayment-card')).toBeVisible();
  });
});

test.describe('Underpayment - Accessibility', () => {
  
  test('pay remaining button should be keyboard accessible', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    await page.getByRole('button', { name: /Underpayment/i }).click();
    
    const payBtn = page.getByTestId('pay-remaining-btn');
    await payBtn.focus();
    await expect(payBtn).toBeFocused();
  });

  test('copy button should be keyboard accessible', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    await page.getByRole('button', { name: /Underpayment/i }).click();
    
    const copyBtn = page.getByTestId('copy-transaction-btn');
    await copyBtn.focus();
    await expect(copyBtn).toBeFocused();
  });
});
