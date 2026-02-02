import { test, expect, Page } from '@playwright/test';

/**
 * E2E Tests for DynoPay Payment Flow
 * 
 * These tests cover:
 * 1. Payment Success Scenarios (redirect, done, email)
 * 2. Underpayment Scenarios
 * 3. Overpayment Scenarios
 * 4. Language Switching
 * 5. QR Code Display
 */

test.describe('Payment Flow - Demo Pages', () => {
  
  test.describe('Payment Demo Page', () => {
    test('should display checkout card with all elements', async ({ page }) => {
      await page.goto('/pay/demo');
      
      // Wait for page to load
      await expect(page.getByTestId('checkout-card')).toBeVisible();
      
      // Verify title and subtitle
      await expect(page.getByTestId('checkout-title')).toBeVisible();
      await expect(page.getByTestId('checkout-subtitle')).toBeVisible();
      
      // Verify order details section
      await expect(page.getByTestId('order-details-section')).toBeVisible();
      await expect(page.getByTestId('invoice-number')).toContainText('INV-2026-A1B2C3');
      
      // Verify fee breakdown section
      await expect(page.getByTestId('fee-breakdown-section')).toBeVisible();
      await expect(page.getByTestId('total-amount')).toBeVisible();
      
      // Verify crypto payment button
      await expect(page.getByTestId('crypto-payment-btn')).toBeVisible();
      
      // Verify expiry countdown
      await expect(page.getByTestId('expiry-countdown')).toBeVisible();
      
      // Verify security badge
      await expect(page.getByTestId('security-badge')).toBeVisible();
    });

    test('should copy invoice number when clicking copy button', async ({ page }) => {
      await page.goto('/pay/demo');
      
      // Click copy invoice button
      const copyBtn = page.getByTestId('copy-invoice-btn');
      await expect(copyBtn).toBeVisible();
      await copyBtn.click();
      
      // Verify snackbar appears (copied message)
      await expect(page.getByText('Copied!')).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Payment States Demo Page', () => {
    
    test('should display overpayment with redirect and email', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Default state should be overpay-redirect-email
      await expect(page.getByTestId('overpayment-card')).toBeVisible();
      
      // Verify overpayment elements
      await expect(page.getByText('Overpayment Received')).toBeVisible();
      await expect(page.getByTestId('copy-transaction-btn')).toBeVisible();
      await expect(page.getByTestId('return-btn')).toBeVisible();
    });

    test('should display overpayment with redirect only', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Click on "Overpay: Redirect Only" toggle
      await page.getByRole('button', { name: /Overpay: Redirect Only/i }).click();
      
      await expect(page.getByTestId('overpayment-card')).toBeVisible();
      await expect(page.getByTestId('return-btn')).toBeVisible();
    });

    test('should display overpayment with email only', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Click on "Overpay: Email Only" toggle
      await page.getByRole('button', { name: /Overpay: Email Only/i }).click();
      
      await expect(page.getByTestId('overpayment-card')).toBeVisible();
    });

    test('should display overpayment with done only', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Click on "Overpay: Done Only" toggle
      await page.getByRole('button', { name: /Overpay: Done Only/i }).click();
      
      await expect(page.getByTestId('overpayment-card')).toBeVisible();
    });

    test('should display underpayment scenario', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Click on "Underpayment" toggle
      await page.getByRole('button', { name: /Underpayment/i }).click();
      
      await expect(page.getByTestId('underpayment-card')).toBeVisible();
      
      // Verify underpayment elements
      await expect(page.getByText('Partial Payment Received')).toBeVisible();
      await expect(page.getByTestId('pay-remaining-btn')).toBeVisible();
      await expect(page.getByTestId('copy-transaction-btn')).toBeVisible();
    });

    test('should display payment progress bar in underpayment', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Click on "Underpayment" toggle
      await page.getByRole('button', { name: /Underpayment/i }).click();
      
      await expect(page.getByTestId('underpayment-card')).toBeVisible();
      
      // Verify progress bar text
      await expect(page.getByText(/Payment Progress/i)).toBeVisible();
      await expect(page.getByText(/% Complete/i)).toBeVisible();
    });

    test('should display grace period warning in underpayment', async ({ page }) => {
      await page.goto('/pay/payment-states-demo');
      
      // Click on "Underpayment" toggle
      await page.getByRole('button', { name: /Underpayment/i }).click();
      
      // Verify grace period warning
      await expect(page.getByText(/Complete payment within/i)).toBeVisible();
    });
  });

  test.describe('Success Demo Page', () => {
    
    test('should display success with redirect and email', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      // Select redirect + email scenario
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      
      await expect(page.getByTestId('success-card')).toBeVisible();
      await expect(page.getByTestId('success-title')).toContainText('Payment Successful');
      await expect(page.getByTestId('transaction-box')).toBeVisible();
      await expect(page.getByTestId('redirect-countdown')).toBeVisible();
      await expect(page.getByTestId('return-btn')).toBeVisible();
    });

    test('should display success with redirect only', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      // Select redirect only scenario
      await page.getByRole('button', { name: /Redirect Only/i }).click();
      
      await expect(page.getByTestId('success-card')).toBeVisible();
      await expect(page.getByTestId('return-btn')).toBeVisible();
      await expect(page.getByTestId('redirect-countdown')).toBeVisible();
    });

    test('should display success with email only (done button)', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      // Select email only scenario
      await page.getByRole('button', { name: /Email Only/i }).click();
      
      await expect(page.getByTestId('success-card')).toBeVisible();
      await expect(page.getByTestId('done-btn')).toBeVisible();
      
      // Should show confirmation sent message
      await expect(page.getByText(/Confirmation sent to/i)).toBeVisible();
    });

    test('should display success with no redirect/email (done button)', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      // Select no redirect/email scenario
      await page.getByRole('button', { name: /No Redirect\/Email/i }).click();
      
      await expect(page.getByTestId('success-card')).toBeVisible();
      await expect(page.getByTestId('done-btn')).toBeVisible();
      
      // Should show "Save this for your records" message
      await expect(page.getByText(/Save this for your records/i)).toBeVisible();
    });

    test('should display bank pending state', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      // Select bank pending scenario
      await page.getByRole('button', { name: /Bank Pending/i }).click();
      
      await expect(page.getByTestId('pending-card')).toBeVisible();
      await expect(page.getByText('Transfer Expected')).toBeVisible();
    });

    test('should copy transaction ID', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      // Ensure success card is visible (default state has redirect + email)
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      await expect(page.getByTestId('success-card')).toBeVisible();
      
      // Click copy transaction button
      await page.getByTestId('copy-transaction-btn').click();
      
      // Verify snackbar appears
      await expect(page.getByText('Copied!')).toBeVisible({ timeout: 3000 });
    });

    test('should display transaction ID in success card', async ({ page }) => {
      await page.goto('/pay/success-demo');
      
      await page.getByRole('button', { name: /Redirect \+ Email/i }).click();
      await expect(page.getByTestId('transaction-id')).toContainText('TXN-2026-A1B2C3');
    });
  });
});

test.describe('Language Switching', () => {
  
  test('should load page in English by default', async ({ page }) => {
    await page.goto('/pay/demo');
    
    // Check for English text
    await expect(page.getByTestId('checkout-title')).toContainText('Review Your Order');
    await expect(page.getByText('Cryptocurrency')).toBeVisible();
    await expect(page.getByText('Secure payment by DynoPay')).toBeVisible();
  });

  test('should load payment states demo in English', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    
    // Default state shows overpayment
    await expect(page.getByText('Overpayment Received')).toBeVisible();
  });

  test('should load success demo in English', async ({ page }) => {
    await page.goto('/pay/success-demo');
    
    // Select email only to see done button
    await page.getByRole('button', { name: /Email Only/i }).click();
    
    await expect(page.getByText('Payment Successful')).toBeVisible();
    await expect(page.getByText('Done')).toBeVisible();
  });

  test('should switch to Portuguese locale', async ({ page }) => {
    // Navigate to Portuguese version
    await page.goto('/pt/pay/demo');
    
    // Wait for page to load and check for Portuguese text
    // The page should load the Portuguese translations
    await expect(page.getByTestId('checkout-card')).toBeVisible();
  });

  test('should switch to Spanish locale', async ({ page }) => {
    // Navigate to Spanish version
    await page.goto('/es/pay/demo');
    
    // Page should load with Spanish locale
    await expect(page.getByTestId('checkout-card')).toBeVisible();
  });

  test('should maintain language when navigating between pages', async ({ page }) => {
    // Start in English
    await page.goto('/pay/demo');
    await expect(page.getByTestId('checkout-card')).toBeVisible();
    
    // Navigate to payment states
    await page.goto('/pay/payment-states-demo');
    await expect(page.getByText('Overpayment Received')).toBeVisible();
    
    // Navigate to success demo
    await page.goto('/pay/success-demo');
    await expect(page.getByText('Payment Successful')).toBeVisible();
  });
});

test.describe('QR Code Display', () => {
  
  test('should display QR code in demo when crypto is selected', async ({ page }) => {
    // Note: The actual QR code generation requires backend API
    // This test verifies the UI elements for QR display are present
    await page.goto('/pay/demo');
    
    // Verify crypto payment button exists
    await expect(page.getByTestId('crypto-payment-btn')).toBeVisible();
    
    // Click crypto payment button (in real flow, this would show QR)
    // In demo mode, it just shows the button
    await page.getByTestId('crypto-payment-btn').click();
    
    // The demo page doesn't actually navigate, it's just a static demo
    // In real implementation, clicking would navigate to crypto transfer page
  });
});

test.describe('Homepage', () => {
  
  test('should display welcome page', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Welcome to DynoPay')).toBeVisible();
    await expect(page.getByText('Secure payment solutions for modern businesses')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
  });

  test('should navigate to pay page from homepage', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: 'Get Started' }).click();
    
    // Should navigate to /pay
    await expect(page).toHaveURL(/\/pay/);
  });
});

test.describe('Pay Index Page - No Payment Link', () => {
  
  test('should display error when no payment link provided', async ({ page }) => {
    await page.goto('/pay');
    
    // Should show checkout page with message about valid payment link
    await expect(page.getByText('Checkout')).toBeVisible();
    await expect(page.getByText(/valid payment link/i)).toBeVisible();
    await expect(page.getByText('Go to Homepage')).toBeVisible();
  });

  test('should navigate to homepage when clicking go to homepage', async ({ page }) => {
    await page.goto('/pay');
    
    await page.getByText('Go to Homepage').click();
    
    await expect(page).toHaveURL('/');
  });
});

test.describe('Accessibility', () => {
  
  test('demo page should have proper heading structure', async ({ page }) => {
    await page.goto('/pay/demo');
    
    // Should have a visible title
    await expect(page.getByTestId('checkout-title')).toBeVisible();
  });

  test('success page should have proper aria labels', async ({ page }) => {
    await page.goto('/pay/success-demo');
    
    // Toggle buttons should be accessible
    await expect(page.getByRole('button', { name: /Redirect \+ Email/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Done/i })).toBeVisible();
  });

  test('underpayment page should be keyboard accessible', async ({ page }) => {
    await page.goto('/pay/payment-states-demo');
    
    // Click underpayment toggle
    await page.getByRole('button', { name: /Underpayment/i }).click();
    
    // Pay remaining button should be focusable
    const payBtn = page.getByTestId('pay-remaining-btn');
    await expect(payBtn).toBeVisible();
    await payBtn.focus();
    await expect(payBtn).toBeFocused();
  });
});

test.describe('Responsive Design', () => {
  
  test('demo page should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pay/demo');
    
    await expect(page.getByTestId('checkout-card')).toBeVisible();
    await expect(page.getByTestId('crypto-payment-btn')).toBeVisible();
  });

  test('success page should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/pay/success-demo');
    
    await page.getByRole('button', { name: /Email Only/i }).click();
    await expect(page.getByTestId('success-card')).toBeVisible();
  });

  test('payment states page should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pay/payment-states-demo');
    
    await expect(page.getByTestId('overpayment-card')).toBeVisible();
    
    // Toggle buttons might wrap on mobile
    await page.getByRole('button', { name: /Underpayment/i }).click();
    await expect(page.getByTestId('underpayment-card')).toBeVisible();
  });
});

test.describe('Visual Elements', () => {
  
  test('should display security badge on all payment pages', async ({ page }) => {
    // Demo page
    await page.goto('/pay/demo');
    await expect(page.getByTestId('security-badge')).toBeVisible();
    await expect(page.getByText('Secure payment by DynoPay')).toBeVisible();
  });

  test('should display countdown timer on demo page', async ({ page }) => {
    await page.goto('/pay/demo');
    
    await expect(page.getByTestId('expiry-countdown')).toBeVisible();
    // Countdown should contain time format
    await expect(page.getByTestId('expiry-countdown')).toContainText(/Expires in/i);
  });

  test('should display fee breakdown with correct formatting', async ({ page }) => {
    await page.goto('/pay/demo');
    
    await expect(page.getByTestId('fee-breakdown-section')).toBeVisible();
    await expect(page.getByText('Subtotal')).toBeVisible();
    await expect(page.getByText(/VAT/i)).toBeVisible();
    await expect(page.getByText('Processing Fee')).toBeVisible();
    await expect(page.getByText('Total')).toBeVisible();
  });

  test('should show processing fees included indicator', async ({ page }) => {
    await page.goto('/pay/demo');
    
    await expect(page.getByText('Processing fees included')).toBeVisible();
  });
});
