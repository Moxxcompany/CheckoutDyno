# Project PRD - Payment Application (DynoPay)

## Original Problem Statement
Set up and install all necessary dependencies for Next.js payment application. Then implement dark mode and language (i18n) functionality for the checkout page.

## Architecture
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: Material UI (MUI) 5
- **State Management**: Redux Toolkit + Redux Saga
- **Styling**: Emotion, Custom CSS
- **HTTP Client**: Axios
- **Validation**: Yup
- **i18n**: next-i18next with react-i18next

## What's Been Implemented
- [2026-01-30] Initial setup - installed all npm dependencies
- [2026-01-31] Fixed turbopack build issue, switched to standard webpack dev server
- [2026-01-31] Added Railway deployment configuration (Dockerfile, railway.json, nixpacks.toml)
- [2026-01-31] **Dark Mode Implementation:**
  - Created ThemeContext with light/dark theme switching
  - Added light and dark theme palettes in MUI theme
  - Theme preference persists in localStorage
  - All checkout page components support both themes
- [2026-01-31] **i18n Implementation:**
  - Installed and configured next-i18next
  - Created translation files for EN and FR locales
  - Updated checkout page with translated text
  - Language selector in header switches locale via URL routing

## Core Features
- Payment checkout page with Bank Transfer and Cryptocurrency options
- Dark/Light theme toggle with localStorage persistence
- Multi-language support (English/French)
- Payment layouts and containers
- Redux store configuration
- Helper utilities (encryption, validation)
- Custom hooks (useTokenData, useWindow)
- Credit card components

## Backlog / Next Tasks
- P1: Add more languages (Spanish, German, etc.)
- P1: Implement remaining payment flows
- P2: Add backend API integration
- P2: Translate Terms of Service and AML Policy pages
