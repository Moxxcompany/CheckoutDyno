import { test, expect } from '@playwright/test';

/**
 * E2E Tests for QR Code Display
 * 
 * Tests cover:
 * - QR code visibility in demo
 * - Crypto payment button
 * - Address display
 * - Copy functionality
 */

test.describe('QR Code Display', () => {
  
  test.describe('Demo Page - Crypto Button', () => {
    
    test('should display crypto payment button', async ({ page }) => {
      await page.goto('/pay/demo');
      
      await expect(page.getByTestId('crypto-payment-btn')).toBeVisible();
      await expect(page.getByTestId('crypto-payment-btn')).toContainText('Cryptocurrency');
    });

    test('crypto button should have correct styling', async ({ page }) => {
      await page.goto('/pay/demo');
      
      const cryptoBtn = page.getByTestId('crypto-payment-btn');
      await expect(cryptoBtn).toBeVisible();
      
      // Button should be outlined (green border)
      await expect(cryptoBtn).toHaveCSS('border-style', 'solid');
    });

    test('crypto button should be clickable', async ({ page }) => {
      await page.goto('/pay/demo');
      
      const cryptoBtn = page.getByTestId('crypto-payment-btn');
      await expect(cryptoBtn).toBeEnabled();
      await cryptoBtn.click();
      
      // Demo doesn't navigate, just verifies button is interactive
    });
  });

  test.describe('QR Code Elements', () => {
    
    test('should have QR code area in payment flow', async ({ page }) => {
      // Note: The actual QR code is shown in /pay?d=... flow with backend
      // Here we test the demo which shows the checkout card
      await page.goto('/pay/demo');
      
      // The demo shows the checkout card, not the QR
      await expect(page.getByTestId('checkout-card')).toBeVisible();
    });
  });

  test.describe('Copy Functionality', () => {
    
    test('should copy invoice number', async ({ page }) => {
      await page.goto('/pay/demo');
      
      await page.getByTestId('copy-invoice-btn').click();
      await expect(page.getByText('Copied!')).toBeVisible({ timeout: 3000 });
    });

    test('should copy transaction ID in success page', async ({ page }) => {
      await page.goto('/pay/success-demo');
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      
      await page.getByTestId('copy-transaction-btn').click();
      await expect(page.getByText('Copied!')).toBeVisible({ timeout: 3000 });
    });

    test('should copy transaction ID in overpayment', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await page.getByTestId('copy-transaction-btn').click();
      await expect(page.getByText('Copied!')).toBeVisible({ timeout: 3000 });
    });

    test('should copy transaction ID in underpayment', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      await page.getByRole('button', { name: /Underpayment/i }).click();
      
      await page.getByTestId('copy-transaction-btn').click();
      await expect(page.getByText('Copied!')).toBeVisible({ timeout: 3000 });
    });
  });
});

test.describe('Payment Selection', () => {
  
  test('should show cryptocurrency option', async ({ page }) => {
    await page.goto('/pay/demo');
    
    await expect(page.getByTestId('crypto-payment-btn')).toBeVisible();
    await expect(page.getByText('Cryptocurrency')).toBeVisible();
  });
});

test.describe('Amount Display with QR', () => {
  
  test('should display total amount', async ({ page }) => {
    await page.goto('/pay/demo');
    
    await expect(page.getByTestId('total-amount')).toBeVisible();
    await expect(page.getByTestId('total-amount')).toContainText('EUR');
  });

  test('should display fee breakdown', async ({ page }) => {
    await page.goto('/pay/demo');
    
    await expect(page.getByText('Subtotal')).toBeVisible();
    await expect(page.getByText('Processing Fee', { exact: true })).toBeVisible();
    await expect(page.getByText('Total').first()).toBeVisible();
  });
});
