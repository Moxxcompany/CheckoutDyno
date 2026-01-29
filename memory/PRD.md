# Project: Dyno Checkout Frontend

## Original Problem Statement
Set up environment variables and install dependencies for Next.js payment checkout application.

## Architecture
- **Framework**: Next.js 14 with TypeScript
- **State Management**: Redux Toolkit + Redux Saga
- **UI**: MUI (Material-UI) + Emotion
- **Payment**: Custom payment integration with credit cards

## What's Been Implemented
- [Jan 2026] Environment setup: `.env.local` configured with all required variables
- [Jan 2026] Dependencies installed via yarn

## Core Requirements
- Payment checkout flow
- Credit card handling
- Integration with external server API
- Google OAuth support
- Telegram bot integration

## Environment Variables
- NEXT_PUBLIC_BASE_URL
- NEXT_PUBLIC_CYPHER_KEY
- NEXT_PUBLIC_GOOGLE_CLIENT_ID
- NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
- NEXT_PUBLIC_SERVER_URL
- NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
- NEXTAUTH_SECRET

## Next Tasks
- Test development server runs correctly
- Verify API connectivity to Railway backend

## Updates - Jan 2026

### Bug Fixes Implemented
1. **Fee Calculation Fix**: Added `fee_payer` parameter to `getCurrencyRates` API call in crypto transfer flow. Now uses `total_amount` when customer pays fees.
2. **Link ID Fix**: Replaced hardcoded `#ABC123456` with dynamic transaction ID from JWT token.

### Files Modified
- `/app/pages/pay/index.tsx` - Added feePayer and linkId state management
- `/app/Components/Page/Pay3Components/cryptoTransfer.tsx` - Added feePayer prop and API parameter
