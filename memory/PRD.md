# DynoPay - Payment Processing Application

## Problem Statement
Set up and install needed dependencies for the existing DynoPay Next.js payment application.

## Architecture
- **Frontend**: Next.js 16 (Pages Router) with MUI, Redux Toolkit, i18next (6 locales), react-credit-cards-2
- **Backend**: FastAPI (minimal health check endpoint)
- **Database**: MongoDB (running locally)
- **Styling**: MUI Theme (light/dark), Space Grotesk + Poppins fonts
- **State**: Redux Toolkit + React Context (ThemeContext)

## Core Features
- Cryptocurrency payment flow (BTC, etc.)
- Bank transfer flow
- Multi-currency support (37 currencies with flag icons)
- i18n: EN, FR, PT, ES, DE, NL
- Dark/Light theme toggle
- Payment link expiry countdown
- Incomplete payment detection & lock
- Fee breakdown (subtotal, processing fee, tax)
- QR code generation for crypto payments
- Merchant branding (custom logos)

## What's Been Implemented (2026-02-10)
- [x] Installed all Node.js dependencies via `yarn install`
- [x] Created `/app/.env` with NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_CYPHER_KEY, NEXT_PUBLIC_SERVER_URL
- [x] Created `/app/backend/.env` with MONGO_URL, DB_NAME
- [x] Created `/app/frontend/.env` with REACT_APP_BACKEND_URL
- [x] Verified frontend (port 3000) and backend (port 8001) running

## Key Files
- `/app/pages/index.tsx` - Homepage
- `/app/pages/pay/index.tsx` - Payment page (main flow)
- `/app/axiosConfig.ts` - API client config
- `/app/styles/theme.ts` - MUI light/dark themes
- `/app/contexts/ThemeContext.tsx` - Theme provider
- `/app/next-i18next.config.js` - i18n config
- `/app/Components/` - UI components
- `/app/Redux/` - State management

## Backlog
- P0: None
- P1: Backend API routes for payment processing
- P2: Webhook endpoint for payment status notifications
