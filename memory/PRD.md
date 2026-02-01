# DynoPay - Product Requirements Document

## Overview
DynoPay is a Next.js-based secure payment solutions platform for modern businesses.

## Tech Stack
- **Framework:** Next.js 14
- **UI:** React 18, Material UI, Emotion
- **State Management:** Redux Toolkit, Redux Saga
- **Language:** TypeScript
- **Internationalization:** i18n (en, fr, pt, es, de, nl)
- **Other:** Axios, Yup validation, QR codes, Credit card handling

## Architecture
- `/pages` - Next.js pages (index, pay/, pay2/)
- `/Components` - Reusable UI components
- `/Containers` - Container components
- `/Redux` - State management
- `/contexts` - React contexts
- `/hooks` - Custom hooks
- `/utils` - Utility functions
- `/public/locales` - Translation files

## What's Been Implemented
- [2026-02-01] Initial setup and dependency installation
- Landing page with "Welcome to DynoPay"
- Payment flows (pay/, pay2/)
- Multi-language support
- Health check API

## Backlog / Next Steps
- Awaiting user requirements for feature additions or modifications

## User Personas
- Business owners needing payment integration
- End users making secure payments
