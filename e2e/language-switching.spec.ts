import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Language Switching and i18n
 * 
 * Tests cover:
 * - Default English locale
 * - Language switching via URL
 * - Translation key presence
 * - Language persistence
 */

test.describe('Language Switching - i18n', () => {
  
  test.describe('Default English Locale', () => {
    
    test('should load demo page in English', async ({ page }) => {
      await page.goto('/pay/demo');
      
      // English text verification
      await expect(page.getByTestId('checkout-title')).toContainText('Review Your Order');
      await expect(page.getByText('Cryptocurrency')).toBeVisible();
      await expect(page.getByText('Secure payment by DynoPay')).toBeVisible();
    });

    test('should display English fee labels', async ({ page }) => {
      await page.goto('/pay/demo');
      
      await expect(page.getByText('Subtotal')).toBeVisible();
      await expect(page.getByText('Processing Fee')).toBeVisible();
      await expect(page.getByText('Total')).toBeVisible();
    });

    test('should display English VAT label', async ({ page }) => {
      await page.goto('/pay/demo');
      
      await expect(page.getByText(/VAT/i)).toBeVisible();
    });

    test('should display English order details', async ({ page }) => {
      await page.goto('/pay/demo');
      
      await expect(page.getByText('ORDER DETAILS')).toBeVisible();
      await expect(page.getByText('INVOICE')).toBeVisible();
    });
  });

  test.describe('Payment States - English', () => {
    
    test('should display English overpayment text', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText('Overpayment Received')).toBeVisible();
      await expect(page.getByText(/paid a bit extra/i)).toBeVisible();
    });

    test('should display English underpayment text', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      await page.getByRole('button', { name: /Underpayment/i }).click();
      
      await expect(page.getByText('Partial Payment Received')).toBeVisible();
      await expect(page.getByText(/Almost there/i)).toBeVisible();
    });

    test('should display English refund notice', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      await expect(page.getByText(/Excess amount will be refunded/i)).toBeVisible();
    });

    test('should display English grace period warning', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      await page.getByRole('button', { name: /Underpayment/i }).click();
      
      await expect(page.getByText(/Complete payment within/i)).toBeVisible();
    });
  });

  test.describe('Success Page - English', () => {
    
    test('should display English success text', async ({ page }) => {
      await page.goto('/pay/success-demo');
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      
      await expect(page.getByText('Payment Successful')).toBeVisible();
    });

    test('should display English transaction text', async ({ page }) => {
      await page.goto('/pay/success-demo');
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      
      await expect(page.getByText('Transaction')).toBeVisible();
    });

    test('should display English redirect text', async ({ page }) => {
      await page.goto('/pay/success-demo');
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      
      await expect(page.getByText(/Redirecting to/i)).toBeVisible();
    });

    test('should display English done button', async ({ page }) => {
      await page.goto('/pay/success-demo');
      await page.getByRole('button', { name: /Email Only/i }).click();
      
      await expect(page.getByTestId('done-btn')).toContainText('Done');
    });
  });

  test.describe('URL-Based Language Switching', () => {
    
    test('should load Portuguese locale via URL', async ({ page }) => {
      await page.goto('/pt/pay/demo');
      
      // Page should load (may have different translations)
      await expect(page.getByTestId('checkout-card')).toBeVisible();
    });

    test('should load Spanish locale via URL', async ({ page }) => {
      await page.goto('/es/pay/demo');
      
      // Page should load
      await expect(page.getByTestId('checkout-card')).toBeVisible();
    });

    test('should load French locale via URL', async ({ page }) => {
      await page.goto('/fr/pay/demo');
      
      // Page should load
      await expect(page.getByTestId('checkout-card')).toBeVisible();
    });
  });

  test.describe('Common Elements Across Languages', () => {
    
    test('should display security badge in all locales', async ({ page }) => {
      // English
      await page.goto('/pay/demo');
      await expect(page.getByTestId('security-badge')).toBeVisible();
      
      // Portuguese
      await page.goto('/pt/pay/demo');
      await expect(page.getByTestId('security-badge')).toBeVisible();
      
      // Spanish
      await page.goto('/es/pay/demo');
      await expect(page.getByTestId('security-badge')).toBeVisible();
    });

    test('should display crypto payment button in all locales', async ({ page }) => {
      // English
      await page.goto('/pay/demo');
      await expect(page.getByTestId('crypto-payment-btn')).toBeVisible();
      
      // Portuguese
      await page.goto('/pt/pay/demo');
      await expect(page.getByTestId('crypto-payment-btn')).toBeVisible();
    });

    test('should display copy button in all locales', async ({ page }) => {
      // English
      await page.goto('/pay/demo');
      await expect(page.getByTestId('copy-invoice-btn')).toBeVisible();
      
      // Portuguese  
      await page.goto('/pt/pay/demo');
      await expect(page.getByTestId('copy-invoice-btn')).toBeVisible();
    });
  });

  test.describe('Language Persistence', () => {
    
    test('should maintain English when navigating between pages', async ({ page }) => {
      await page.goto('/pay/demo');
      await expect(page.getByText('Cryptocurrency')).toBeVisible();
      
      await page.goto('/pay/payment-states-demo');
      await expect(page.getByText('Overpayment Received')).toBeVisible();
      
      await page.goto('/pay/success-demo');
      await expect(page.getByText('Payment Successful')).toBeVisible();
    });
  });
});

test.describe('Translation Completeness', () => {
  
  test('should have all checkout translations', async ({ page }) => {
    await page.goto('/pay/demo');
    
    // These keys should not show as-is (would indicate missing translation)
    const checkoutCard = page.getByTestId('checkout-card');
    await expect(checkoutCard).not.toContainText('checkout.title');
    await expect(checkoutCard).not.toContainText('checkout.subtitle');
  });

  test('should have all success translations', async ({ page }) => {
    await page.goto('/pay/success-demo');
    await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
    
    const successCard = page.getByTestId('success-card');
    await expect(successCard).not.toContainText('success.paymentSuccessful');
    await expect(successCard).not.toContainText('success.transactionId');
  });

  test('should have all underpayment translations', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    await page.getByRole('button', { name: /Underpayment/i }).click();
    
    const underpayCard = page.getByTestId('underpayment-card');
    await expect(underpayCard).not.toContainText('underpayment.title');
    await expect(underpayCard).not.toContainText('underpayment.subtitle');
  });

  test('should have all overpayment translations', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    
    const overpayCard = page.getByTestId('overpayment-card');
    await expect(overpayCard).not.toContainText('overpayment.title');
    await expect(overpayCard).not.toContainText('overpayment.subtitle');
  });
});
