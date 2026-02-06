# DynoPay - PRD

## Problem Statement
Setup and install dependencies for the existing Next.js DynoPay payment application.

## Architecture
- **Frontend**: Next.js (Pages Router) with TypeScript, MUI, Redux, i18next
- **Backend**: FastAPI (minimal health endpoint)
- **Database**: MongoDB (available via supervisor)
- **Runtime**: Node.js v20, Python 3.11

## What's Been Implemented
- **2026-02-06**: Initial setup & dependency installation
  - Installed 776 npm packages from package.json
  - Created supervisor-compatible wrapper (`/app/frontend/package.json`) to run Next.js from `/app`
  - Created minimal FastAPI backend at `/app/backend/server.py`
  - Verified both services running (frontend:3000, backend:8001)
  - Homepage renders correctly (DynoPay landing page)

## Core Features (Existing)
- Payment flow (card payments, QR codes)
- Multi-language support (i18next)
- Theme context (dark/light)
- Redux state management
- Credit card UI components

## Backlog / Next Steps
- P0: Implement payment flow features
- P1: API integrations for payment processing
- P2: Testing & E2E coverage
