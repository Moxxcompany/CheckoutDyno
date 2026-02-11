# DynoPay - Payment Processing Application

## Problem Statement
Set up DynoPay Next.js payment app. Add crypto currencies (SOL, XRP, POLYGON, Polygon USDT, RLUSD, RLUSD-ERC20). Add memo/destination tag support for XRP/RLUSD. Fix checkout issues.

## Architecture
- **Frontend**: Next.js 16 (Pages Router) with MUI, Redux, i18next (6 locales)
- **Backend**: FastAPI (health check; real APIs on external servers)
- **External APIs**: NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_SERVER_URL

## What's Been Implemented

### Session 1: Setup (2026-02-10)
- [x] Installed Node.js deps, created .env files, verified services

### Session 2: New Crypto Currencies (2026-02-10)
- [x] SVG icons: SOL, XRP, POLYGON, RLUSD in /app/assets/Icons/coins/
- [x] Added to cryptoOptions; USDT-POLYGON network; RLUSD XRPL/ERC20 selection

### Session 3: Memo/Tag in CryptoTransfer (2026-02-10)
- [x] CryptoDetails interface + state includes memo field
- [x] requiresMemo() helper for XRP/RLUSD-XRPL
- [x] Memo UI with copy button + warning below address
- [x] Explicit memo extraction from addPayment response (memo|tag|destination_tag|dt)

### Session 4: Checkout Fixes (2026-02-10)
- [x] unAuthorizedHelper.ts — throws Error instead of redirecting to /auth/login on 403
- [x] incompletePayment state — added memo + destination_tag fields
- [x] setIncompletePayment captures memo/tag from getData response
- [x] Incomplete payment alert displays memo/tag in orange when present

## Backlog
- P1: i18n translations for memo-related keys across all locales
- P1: Backend getData must return memo/destination_tag in incomplete_payment object
- P2: Memo verification confirmation step
