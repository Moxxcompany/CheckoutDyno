# DynoPay Payment Application - PRD

## Original Problem Statement
Setup and install dependencies, then perform UI responsive, scroll depth & heatmap analysis and visual regression testing ensuring it appears correctly and pixel perfect on all devices, web and mobile. Ensure dark mode covers all pages.

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

## What's Been Implemented (Jan 31, 2026)

### Build Fixes
- Fixed `axiosConfig.ts` URL handling for undefined `NEXT_PUBLIC_BASE_URL`
- Added `sharp` package for image optimization
- Added `eslint` as explicit dependency
- Made `useThemeMode` hook SSR-safe with fallback values
- Moved `layout.tsx` from pages to components to fix static generation

### UI/UX Improvements
- Created proper homepage with DynoPay branding
- Added meaningful fallback message on `/pay` when no payment link
- Added `data-testid` attributes for dark mode toggles
- Added `data-testid` for mobile menu button

### Testing Completed
- Responsive design: Desktop (1920x1080, 1440x900), Tablet (768x1024), Mobile (375x667, 390x844)
- Dark mode toggle functionality verified
- Visual regression testing passed
- All pages accessible and scrollable

## Backlog / Future Enhancements
- P1: Add loading states for payment forms
- P2: Improve mobile drawer dark mode toggle UI
- P3: Add more language options beyond EN/FR

## Next Tasks
- Ready for deployment on Railway

## Update: Redirect URL Implementation (Jan 31, 2026)

### Feature: Merchant Redirect URL Support
When merchants create payment links with a `redirect_url`, users are automatically redirected back to the merchant's site after successful payment.

### Data Flow
1. User visits payment link
2. `/api/pay/getData` returns data INCLUDING `redirect_url`
3. `pages/pay/index.tsx` stores `redirect_url` in state
4. User completes payment (crypto or bank)
5. On success → Check redirect_url
   - If exists → Redirect to: `{redirect_url}?transaction_id=xxx&status=success`
   - If not → Show default success page

### Files Modified
- `pages/pay/index.tsx` - Store redirect_url, pass to child components
- `Components/Page/Pay3Components/cryptoTransfer.tsx` - Accept redirectUrl prop, redirect on success
- `Components/Page/Pay3Components/bankTransferCompo.tsx` - Accept redirectUrl prop, redirect on success  
- `Components/Page/Pay3Components/success.tsx` - Auto-redirect after 3 seconds
- `Components/UI/TransferExpectedCard/Index.tsx` - Auto-redirect with countdown UI
