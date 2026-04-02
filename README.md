# Finance Dashboard

A modern finance dashboard built with Next.js 16, React 19, Zustand, Tailwind CSS v4, shadcn-style UI primitives, and Recharts.

This project is intentionally frontend-focused. It demonstrates:

- responsive dashboard design
- route-based information architecture
- state management with persistence
- role-based UI behavior
- client-side analytics
- live currency conversion
- dark mode with no-flash reload handling
- reusable component structure

## What The Website Includes

The website is a personal finance workspace that helps users track and understand financial activity through multiple dedicated routes instead of one long page.

### Main features

- Overview page with high-level snapshot cards, recent activity, and compact insight panels
- Finance page focused on balances, expense allocation, and trend charts
- Transactions page with search, filtering, sorting, add/delete actions, category suggestions, and inline calendar input
- Analytics page focused on deeper interpretation, performance breakdowns, and chart-heavy reporting
- Wallet page focused on display currency, exchange rate context, and holdings-style summaries
- Frontend-only role switching between `viewer` and `admin`
- Local persistence using `localStorage`
- Currency selection with live exchange-rate conversion
- Dark mode with immediate theme restoration on reload
- Shared sidebar navigation with real Next.js page routes

## Routes

The app is split into dedicated pages under the App Router:

- `/`
  Overview route. Built for quick scanning and summary-level understanding.
- `/finance`
  Core finance dashboard. This is the most traditional “dashboard” page.
- `/transactions`
  Dedicated ledger page for searching, filtering, sorting, adding, and deleting transactions.
- `/analytics`
  Deeper reporting and interpretation route focused on performance and trend analysis.
- `/wallet`
  Currency and holdings route focused on display currency, exchange rates, and wallet-style summaries.

## Role-Based Access

The app simulates frontend-only roles:

- `viewer`
  Can browse all pages, see charts, cards, insights, and transaction data.
- `admin`
  Can do everything a viewer can do, plus:
  - add transactions
  - delete transactions
  - reset demo data

Role switching is available in the shared dashboard header and persists locally.

## Currency System

The app stores transaction amounts internally in `USD` as its base currency.

Users can switch the display currency from the header. Supported currencies currently include:

- `USD`
- `INR`
- `EUR`
- `GBP`
- `JPY`
- `CAD`
- `AUD`
- `SGD`
- `AED`

### How conversion works

- The app fetches latest exchange rates from Frankfurter
- Displayed values across cards, charts, insights, and tables are converted from the internal USD base
- If an admin adds a transaction while another currency is selected, the entered amount is interpreted in that selected currency and converted back into USD before being saved

### Important note

These are latest available daily reference rates, not real-time tick-by-tick forex updates.

## Persistence

The dashboard uses Zustand with persistence.

Persisted values include:

- transactions
- selected role
- selected theme
- selected currency

This means the app remembers the user’s environment across refreshes.

## Dark Mode

Dark mode is handled in two layers:

- persisted theme state in Zustand
- a `beforeInteractive` script in the root layout that reads the saved theme from local storage before hydration

This prevents the “flash of wrong theme” problem on reload.

## Sidebar Navigation

The sidebar is route-aware and highlights the active page.

Navigation entries:

- Overview
- Finance
- Transactions
- Analytics
- Wallet

The sidebar also includes:

- portfolio summary
- current role summary
- sync status
- a small workspace pulse area
- a profile/settings style footer section

## Page-By-Page Breakdown

### 1. Overview Page

Purpose:
Provide the fastest possible read on the user’s finances.

Content on this page:

- summary cards
- recent transactions panel
- category leaderboard
- compact analytics breakdown
- compact insights panel

This page is designed as the “landing dashboard” and focuses on breadth rather than detail.

### 2. Finance Page

Purpose:
Act as the central finance control panel.

Content on this page:

- summary cards
- balance trend chart
- expense mix chart
- category leaderboard
- spotlight panel
- compact insights panel

This page is chart-focused and best for visual monitoring of cash flow and category pressure.

### 3. Transactions Page

Purpose:
Provide a focused ledger experience.

Content on this page:

- summary cards
- recent activity snapshot
- full transactions section

Transactions section supports:

- search by description/category/type
- filter by type
- filter by category
- sort by date
- sort by amount
- add transaction
- delete transaction
- reset demo data
- empty states
- no-results states

### Add transaction form details

The admin add form includes:

- inline calendar layout for date selection
- text input for description
- amount input in the currently selected currency
- category suggestions using themed shadcn-style menu behavior
- themed type picker

### 4. Analytics Page

Purpose:
Surface interpretation and reporting instead of operational controls.

Content on this page:

- analytics breakdown cards
- trend and allocation charts
- full insights panel
- category leaderboard
- spotlight rail

This page is intended to feel more like analysis/reporting than day-to-day management.

### 5. Wallet Page

Purpose:
Focus on currency context and holdings-style summaries.

Content on this page:

- available balance
- income flow
- expense flow
- savings efficiency
- exchange rate panel
- role note
- display currency note

This page acts as a wallet-style dashboard with more emphasis on currency and account context.

## Charts And Analytics

The app includes multiple derived analytics views built entirely from client-side transaction data.

### Summary metrics

- total balance
- total income
- total expenses
- savings rate

### Trend analytics

- monthly grouped balance trend
- monthly income vs expense movement
- month-over-month net change

### Category analytics

- expense mix by category
- category leaderboard
- top-spending category logic

### Insight generation

The app derives human-readable insights such as:

- top spending category
- monthly comparison
- largest recent expense

Insights are generated from pure analytics helpers, not hardcoded UI strings scattered across components.

## Transactions Data Model

Each transaction includes:

- `id`
- `date`
- `description`
- `amount`
- `category`
- `type`

Where:

- `type` is either `income` or `expense`
- `amount` is stored as a positive number
- the sign shown in the UI is derived from `type`

## Seed Data

The app starts with realistic seeded finance data so the dashboard feels meaningful immediately.

Seeded data includes:

- salary entries
- rent
- groceries
- transport
- utilities
- health
- entertainment
- consulting income
- refunds

The user can modify this locally through admin controls.

## Architecture

The project is organized around three main areas:

- `src/app`
  App Router pages and root layout
- `src/components/dashboard`
  Dashboard-specific UI components and route building blocks
- `src/lib`
  types, seed data, formatting, analytics, and currency utilities
- `src/store`
  Zustand store and persisted application state

## Important Files

### App routes

- `src/app/page.tsx`
- `src/app/finance/page.tsx`
- `src/app/transactions/page.tsx`
- `src/app/analytics/page.tsx`
- `src/app/wallet/page.tsx`

### Shared dashboard shell

- `src/components/dashboard/dashboard-shell.tsx`

This file selects the correct layout/content composition for each route.

### Shared workspace hook

- `src/components/dashboard/use-dashboard-workspace.ts`

This file centralizes:

- Zustand store access
- theme synchronization
- exchange-rate fetching
- derived analytics calculations
- filtered transaction lists

### State

- `src/store/use-finance-store.ts`

This store manages:

- transactions
- role
- theme
- currency
- filters
- persistence

### Analytics and formatting

- `src/lib/finance-analytics.ts`
- `src/lib/finance-format.ts`
- `src/lib/currency.ts`
- `src/lib/finance-data.ts`
- `src/lib/finance-types.ts`

## UI Component Breakdown

Important dashboard components:

- `dashboard-header.tsx`
  Shared top control bar with role switch, currency picker, and theme toggle
- `dashboard-sidebar.tsx`
  Shared sidebar navigation and status panels
- `summary-cards.tsx`
  Metric cards for overview pages
- `dashboard-charts.tsx`
  Balance trend and expense mix visualizations
- `transactions-section.tsx`
  Ledger table, filters, add form, suggestions, and inline calendar
- `insights-panel.tsx`
  Human-readable analytical insights
- `dashboard-spotlight.tsx`
  Compact side-rail context panel
- `recent-transactions-panel.tsx`
  Fast snapshot of the latest entries
- `category-leaderboard.tsx`
  Ranked expense categories
- `analytics-breakdown.tsx`
  Analytics-only KPI cards
- `wallet-overview.tsx`
  Wallet route content

## Animations

The dashboard uses motion-based entrance animations across major sections.

The goal is:

- smoother initial load
- clearer page segmentation
- less abrupt route rendering

Sections animate into place together so the page feels cohesive instead of revealing one block at a time in a distracting way.

## Design Direction

The visual system is intentionally not a plain starter dashboard.

It uses:

- warm neutral surfaces
- teal/gold accent balance
- rounded finance-product cards
- sidebar-based workspace layout
- route-specific composition
- expressive typography
- soft background gradients and blur layers

The overall goal is to feel closer to a polished finance product than a demo landing page.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Verification Commands

Useful local checks:

```bash
npm run lint
node_modules/.bin/tsc --noEmit
```

## Tech Stack

- Next.js 16.2.2
- React 19.2.4
- TypeScript
- Zustand
- Recharts
- Tailwind CSS v4
- shadcn-style UI components
- Framer Motion
- Radix UI primitives

## Current Scope

Included:

- frontend-only dashboard
- route-based pages
- role-based UI behavior
- local persistence
- dark mode
- live currency conversion
- responsive layout
- charts and derived insights

Not included:

- backend
- authentication
- database
- real user accounts
- real banking integrations
- server-side transaction storage

## Why This Project Is Useful

This app is a strong frontend portfolio piece because it shows:

- component decomposition
- reusable route-aware UI
- local-first state architecture
- derived analytics from domain data
- non-trivial UI interactions
- consistent design system usage
- thoughtful UX around theming, persistence, and routing

## Future Improvements

Good next steps if you want to extend it further:

- connect sidebar actions to deeper route-specific tools
- add real calendar component primitives
- add CSV export/import
- add budgets and goals
- add recurring transaction support
- add server persistence
- add authentication
- add tests for analytics helpers and store behavior
