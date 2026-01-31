# DynoPay Payment Application - PRD

## Original Problem Statement
Setup and install necessary dependencies for the Next.js DynoPay payment application.

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

## What's Been Implemented

### Jan 31, 2026 - Initial Setup
- Installed 471 npm packages
- Development server running on localhost:3000
- All dependencies resolved successfully

## Backlog / Future Enhancements
- P1: Add loading states for payment forms
- P2: Improve mobile drawer dark mode toggle UI
- P3: Add more language options beyond EN/FR

## Next Tasks
- Ready for feature development or deployment
