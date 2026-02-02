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
- [2026-02-02] **LEGACY CODE CLEANUP**: Removed deprecated files and modernized codebase
  - Removed `/app/pages/pay2/` directory (legacy payment flow)
  - Removed `/app/Components/Page/Payment/` directory (superseded by Pay3Components)
  - Removed unused HOCs: `withAuth.tsx`, `paymentProcessAuth.tsx`
  - Removed unused `TelegramLogin` component
  - Fixed typo: renamed `unAutorizedHelper.ts` → `unAuthorizedHelper.ts`
  - Removed unused React imports from hooks
  - Removed console.log statements from production code
  - Modernized Redux: Updated to use `createSlice` pattern
  - Updated store.ts to use RTK's built-in devTools
  - Cleaned up unused TypeScript interfaces
  - Removed unused `redux-saga` dependency
- [2026-02-02] **PAYMENT ERROR HANDLING IMPROVEMENTS**:
  - Changed grace_period_minutes default from 15 to 30 (matches backend)
  - Added "failed" payment status type for better error handling
  - Added "failed" case handler in polling switch
  - Added Failed Payment UI component with retry functionality
  - Improved API error handling for expired/invalid payment links
  - Added toast notification when countdown timer expires
  - Added translation keys for error states (crypto.paymentFailed, failed.*, checkout.paymentLinkExpired)

## Known Issues (Fixed)
- ~~Payment status gets stuck on "detected payment" and never reaches success screen when language is switched~~ (FIXED)
- ~~Legacy code and deprecated patterns throughout codebase~~ (CLEANED UP)

## Prioritized Backlog
- P0: Test payment flow with actual crypto transactions (end-to-end verification)
- P1: Backend API server for payment processing  
- P1: Payment gateway integration (Stripe/PayPal)
- P2: User authentication
- P2: Transaction history

## Next Tasks
1. Test the payment flow end-to-end with language switching and page refresh
2. Complete backend repository analysis (verify status consistency)
3. Configure backend environment if needed

## Session Log
- [2026-02-02] Dependencies re-installed and verified
- [2026-02-02] Supervisor configuration updated to point to `/app` directory
- [2026-02-02] Frontend running successfully on port 3000
