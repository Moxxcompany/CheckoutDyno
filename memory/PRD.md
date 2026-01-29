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
