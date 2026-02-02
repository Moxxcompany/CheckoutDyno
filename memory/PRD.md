# DynoPay - Payment Solutions Application

## Project Overview
DynoPay is a secure crypto payment solution built with Next.js 14, TypeScript, Material UI, and Redux.

## Tech Stack
- **Framework**: Next.js 14.2.35
- **Language**: TypeScript
- **UI Library**: Material UI (MUI) 5.15
- **State Management**: Redux Toolkit 2.2.5
- **Testing**: Playwright (E2E)
- **Internationalization**: next-i18next

## What's Been Implemented (Feb 2026)

### Dependencies Setup
- ✅ All dependencies installed via yarn
- ✅ Next.js development server running on port 3000
- ✅ Environment variables configured

### E2E Testing with Playwright
- ✅ Playwright installed with chromium browser
- ✅ 136 comprehensive E2E tests covering:

#### Payment Flow Tests (`payment-flow.spec.ts`)
- Demo page checkout card display
- Invoice copying functionality
- Payment states demo (overpayment scenarios)
- Success demo (redirect, email scenarios)
- Underpayment scenarios

#### Redirect Scenarios (`redirect-scenarios.spec.ts`)
- With Redirect URL + Email
- Redirect URL Only
- Email Only (Done button)
- No Redirect/Email

#### Underpayment Tests (`underpayment.spec.ts`)
- Partial payment display
- Progress bar
- Grace period warning
- Pay remaining button
- Transaction ID copy

#### Overpayment Tests (`overpayment.spec.ts`)
- Overpayment card display
- Excess amount calculation
- Refund notice
- All redirect scenarios

#### Language Switching (`language-switching.spec.ts`)
- English locale tests
- Portuguese, Spanish, French URLs
- Translation completeness
- Language persistence

#### QR Code Display (`qr-code.spec.ts`)
- Crypto payment button
- Copy functionality
- Amount display

## Test Coverage Summary
- Payment Success: redirect, done, email scenarios ✅
- Underpayment: progress, grace period, pay remaining ✅
- Overpayment: refund notice, redirect scenarios ✅
- Language Switching: URL-based i18n ✅
- QR Code Display: crypto button, copy ✅
- Responsive Design: mobile, tablet ✅
- Accessibility: keyboard navigation ✅

## Running Tests
```bash
yarn test:e2e          # Run all tests
yarn test:e2e:ui       # Run with UI mode
yarn test:e2e:report   # View HTML report
```

## Next Action Items
- Add more integration tests with backend API
- Configure CI/CD pipeline for automated testing

## Backlog
- P0: Backend API integration tests
- P1: Visual regression tests
- P2: Performance testing
