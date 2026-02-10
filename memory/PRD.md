# DynoPay - Payment Processing Application

## Problem Statement
Set up and install needed dependencies for the existing DynoPay Next.js payment application. Add new cryptocurrency currencies (SOL, XRP, POLYGON, Polygon USDT, BCH, RLUSD, RLUSD-ERC20) with icons. Add memo/destination tag support for XRP and RLUSD.

## Architecture
- **Frontend**: Next.js 16 (Pages Router) with MUI, Redux Toolkit, i18next (6 locales)
- **Backend**: FastAPI (minimal health check; real APIs on external servers)
- **Database**: MongoDB (running locally)
- **External APIs**: NEXT_PUBLIC_BASE_URL (install-manager), NEXT_PUBLIC_SERVER_URL (get-ready)

## What's Been Implemented

### 2026-02-10 — Session 1: Setup
- [x] Installed all Node.js dependencies via `yarn install`
- [x] Created `/app/.env` with NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_CYPHER_KEY, NEXT_PUBLIC_SERVER_URL
- [x] Created `/app/backend/.env` with MONGO_URL, DB_NAME
- [x] Verified frontend (port 3000) and backend (port 8001) running

### 2026-02-10 — Session 2: New Crypto Currencies
- [x] Created SVG icon components: SOL.tsx, XRP.tsx, POLYGON.tsx, RLUSD.tsx in /app/assets/Icons/coins/
- [x] Added SOL, XRP, POLYGON, RLUSD to cryptoOptions array
- [x] Extended USDT network options to include POLYGON (TRC20, ERC20, POLYGON)
- [x] Added RLUSD network selection (XRPL, ERC20) mirroring USDT pattern
- [x] Updated configured currencies parser for USDT-POLYGON, RLUSD-XRPL, RLUSD-ERC20
- [x] Updated getApiCurrency, polling intervals, formatAmount for new currencies

### 2026-02-10 — Session 3: Memo/Tag Support
- [x] Added optional `memo` field to CryptoDetails interface
- [x] Created `requiresMemo()` helper (returns true for XRP, RLUSD+XRPL)
- [x] Created `handleCopyMemo()` function
- [x] Added memo/tag UI section with orange styling, copy button, mandatory warning
- [x] Conditional rendering: only shown when requiresMemo()=true AND memo exists

## Key Files Modified
- `/app/Components/Page/Pay3Components/cryptoTransfer.tsx` — main crypto payment component
- `/app/assets/Icons/coins/SOL.tsx` — new
- `/app/assets/Icons/coins/XRP.tsx` — new
- `/app/assets/Icons/coins/POLYGON.tsx` — new
- `/app/assets/Icons/coins/RLUSD.tsx` — new

## Backlog
- P0: None
- P1: Add i18n translations for memo-related keys across all locales
- P1: Backend must return `memo` field for XRP/RLUSD-XRPL payments
- P2: Memo verification confirmation step to prevent lost funds
- P2: Add BNB network support for USDT if needed
