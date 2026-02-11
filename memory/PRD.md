# DynoPay - PRD

## Original Problem Statement
1. Set up and install dependencies for existing DynoPay payment application
2. Show fee breakdown (subtotal, tax, processing fee) on the crypto payment page when customer is paying the fee

## Architecture
- **Frontend**: Next.js (Pages Router) + TypeScript + MUI + Redux Toolkit + i18next (6 locales) + Axios
- **Backend**: FastAPI (Python) on port 8001
- **Database**: MongoDB (configured, DB: dynopay)
- **Deployment**: Railway/Nixpacks ready, Supervisor-managed services

## User Personas
- **Customer**: End user making crypto payments (sees fee breakdown during checkout)
- **Merchant**: Business using DynoPay to accept payments (configures fee_payer as customer/merchant)

## Core Requirements
- Payment processing UI with crypto payments, QR codes
- Multi-language support (en, fr, pt, es, de, nl)
- Light/Dark theme support
- Responsive design with MUI components
- Fee transparency: show subtotal + tax + processing fee breakdown

## What's Been Implemented
- [2025-02-11] Initial setup: installed all Node.js dependencies, verified Python backend deps, restarted frontend
- [2025-02-11] Updated .env with NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_CYPHER_KEY, NEXT_PUBLIC_SERVER_URL
- [2025-02-11] **Fee breakdown enhancement**: Modified cryptoTransfer.tsx to show fee breakdown (subtotal, tax, processing fee) when customer pays processing fees, not just when tax is present. Previously the breakdown was gated by `taxInfo && taxInfo.amount > 0`; now it also shows when `feeInfo.fee_payer === 'customer'` with a processing fee > 0.

## Key Pages
- `/` - Landing page
- `/pay` - Payment flow (requires valid encrypted payment link)
- `/pay/demo` - Demo checkout page with mock data

## Backlog / Next Tasks
- P0: No blocking issues currently
- P1: Consider showing fee breakdown on bank transfer flow too (if not already)
- P2: Add more test coverage, e2e tests
