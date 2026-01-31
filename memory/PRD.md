# DynoPay Payment Application - PRD

## Original Problem Statement
Enhance the checkout page with: context-aware title, merchant subtitle, merchant logo, order summary with description and invoice, fee breakdown (subtotal, processing fee, tax), fee payer indicator, expiry countdown, and security badge.

## Architecture
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: MUI (Material-UI) v5
- **State Management**: Redux Toolkit + Redux Saga
- **Internationalization**: next-i18next (EN/FR)
- **Styling**: MUI ThemeProvider with light/dark mode support

## Tech Stack
- React 18
- Next.js 14.2.35
- TypeScript 5
- MUI Material 5.15
- Axios for API calls
- JWT for token handling

## Core Pages
1. `/` - Homepage (landing page)
2. `/pay` - Payment checkout (requires payment link query param)
3. `/pay/terms-of-service` - Terms of Service
4. `/pay/aml-policy` - AML Policy
5. `/pay2/*` - Alternative payment flow

## What's Been Implemented

### Jan 31, 2026 - Enhanced Checkout UI
- **Context-Aware Title**: Shows "Review Your Order", "Checkout", or "Complete Your Payment" based on context
- **Merchant Subtitle**: "Complete your payment to {merchant}" with dynamic merchant name
- **Merchant Logo**: Displays merchant logo if available, falls back to DynoPay logo
- **Order Details Section**: Shows description and invoice number (INV-xxxx) with copy button
- **Fee Breakdown**: Itemized subtotal, processing fee, tax (VAT with rate/country)
- **Fee Payer Indicator**: "Processing fees included" or "Merchant pays fees"
- **Expiry Countdown**: Live timer showing "Expires in Xd:Xh:Xm:Xs"
- **Security Badge**: "🔒 Secure payment by DynoPay"
- **Translations**: Added 15+ new keys for EN and FR

### New State Variables Added
1. `description` - Purchase description
2. `orderReference` - Invoice number (INV-2026-xxx)
3. `feeInfo` - { processing_fee, fee_payer }
4. `taxInfo` - { rate, amount, country, type }
5. `expiryInfo` - { countdown, expires_at }
6. `merchantInfo` - { name, company_logo }
7. `countdown` - Live countdown string
8. `copySnackbar` - Copy success feedback

### Data Flow
1. User visits payment link with `?d=` query param
2. `/api/pay/getData` returns data with new fields
3. `pages/pay/index.tsx` captures all fields in state
4. Enhanced UI displays all information

### Backend Data Expected
```json
{
  "description": "Monthly Pro Subscription",
  "order_reference": "INV-2026-A1B2C3",
  "fee_info": { "processing_fee": 2.50, "fee_payer": "customer" },
  "tax_info": { "rate": 23, "amount": 23.00, "country": "Portugal" },
  "expiry": { "countdown": "6d:23h:45m", "expires_at": "2026-02-07T..." },
  "merchant": { "name": "Acme Store", "company_logo": "https://..." }
}
```

## Testing Status
- ✅ Page loads without errors (95% pass rate)
- ✅ Translation files valid JSON
- ✅ All data-testid attributes present
- ✅ EN/FR localization works

## Backlog / Future Enhancements
- P0: Test with real backend data
- P1: Add payment method icons preview
- P2: Animated success states
- P3: Add more language options beyond EN/FR

## Next Tasks
- Verify backend returns all new fields
- Test full payment flow with enhanced UI
