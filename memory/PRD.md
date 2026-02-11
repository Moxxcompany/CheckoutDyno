# DynoPay - PRD

## Original Problem Statement
Set up and install dependencies for existing DynoPay payment application.

## Architecture
- **Frontend**: Next.js (Pages Router) + TypeScript + MUI + Redux Toolkit + i18next (6 locales) + Axios
- **Backend**: FastAPI (Python) on port 8001
- **Database**: MongoDB (configured, DB: dynopay)
- **Deployment**: Railway/Nixpacks ready, Supervisor-managed services

## Core Requirements
- Payment processing UI with card payments, QR codes
- Multi-language support (en, fr, pt, es, de, nl)
- Light/Dark theme support
- Responsive design with MUI components
- JWT-based token handling

## What's Been Implemented
- [2025-02-11] Initial setup: installed all Node.js dependencies (yarn install), verified Python backend deps, restarted frontend service. Both frontend (port 3000) and backend (port 8001) are running and healthy.

## Key Pages
- `/` - Landing page
- `/pay` - Payment flow (multiple sub-pages: demo, success-demo, payment-states-demo, aml-policy, terms-of-service)

## Backlog / Next Tasks
- P0: No blocking issues currently
- P1: Implement actual payment processing logic
- P2: Add more test coverage, e2e tests
