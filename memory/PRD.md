# DynoPay - Payment Application PRD

## Original Problem Statement
1. Add more languages (Spanish, Portuguese, Dutch, German)
2. Translate static pages (Terms of Service, AML Policy content)
3. Add theme-aware logo that switches between light/dark variants

## Architecture
- **Frontend**: Next.js 14 with TypeScript
- **UI Framework**: Material UI v5
- **State Management**: Redux Toolkit + Redux Saga
- **Internationalization**: next-i18next with 6 locales
- **Theme**: Light/Dark mode with MUI ThemeProvider

## What's Been Implemented
- [2026-01-31] Initial dependency installation
- [2026-01-31] Multi-language support (EN, FR, ES, PT, DE, NL)
- [2026-01-31] Full translations for Terms of Service and AML Policy in all languages
- [2026-01-31] Theme-aware Logo component integrated in header and BrandLogo

## Core Requirements (Completed)
- ✅ 6 languages configured: English, French, Spanish, Portuguese, German, Dutch
- ✅ Terms of Service translated (14 sections each language)
- ✅ AML Policy translated (9 sections each language)
- ✅ Theme-aware logo: Dark blue (#444CE7) in light mode, Light purple (#A5B4FC) in dark mode

## Files Modified
- `/app/Components/BrandLogo/index.tsx` - Now uses theme-aware Logo
- `/app/Components/Page/Pay3Components/header.tsx` - Uses Logo component, all 6 languages in selector

## Prioritized Backlog
- P1: Additional language support if needed
- P2: RTL language support (Arabic, Hebrew)

## Next Tasks
- Application ready for production use
