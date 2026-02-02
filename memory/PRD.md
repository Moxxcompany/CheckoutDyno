# DynoPay - Product Requirements Document

## Original Problem Statement
Set up and install all needed dependencies for the existing Next.js payment application.

## Architecture
- **Frontend**: Next.js 14 + TypeScript + MUI + Redux
- **Internationalization**: i18next with 6 languages (en, fr, pt, es, de, nl)
- **Payment UI**: react-credit-cards-2, payment library

## User Personas
- Business users processing payments
- International customers (multi-language support)

## Core Requirements (Static)
- Payment page UI at `/pay`
- Credit card input components
- Multi-language support
- Redux state management

## What's Been Implemented
- [2026-02-02] Initial dependency installation and setup
- [2026-02-02] Verified application runs on port 3000
- [2026-02-02] **BUG FIX**: Fixed payment status stuck on "detected payment" after language switch
  - Root cause: `useEffect` polling hook in `cryptoTransfer.tsx` unconditionally reset `paymentStatus` to "waiting" on re-renders
  - Fix: Added guard condition checking `hasCompletedPaymentRef.current` to prevent state reset after payment completion
  - File modified: `/app/Components/Page/Pay3Components/cryptoTransfer.tsx` (lines 711-717)

## Known Issues (Fixed)
- ~~Payment status gets stuck on "detected payment" and never reaches success screen when language is switched~~ (FIXED)

## Prioritized Backlog
- P0: Test payment flow with actual crypto transactions (end-to-end verification)
- P1: Backend API server for payment processing  
- P1: Payment gateway integration (Stripe/PayPal)
- P2: User authentication
- P2: Transaction history
- P3: Refactor `cryptoTransfer.tsx` into smaller components for maintainability

## Next Tasks
1. Test the payment flow end-to-end with language switching and page refresh
2. Complete backend repository analysis (verify status consistency)
3. Configure backend environment if needed

## Session Log
- [2026-02-02] Dependencies re-installed and verified
- [2026-02-02] Supervisor configuration updated to point to `/app` directory
- [2026-02-02] Frontend running successfully on port 3000
