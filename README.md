
#Finora
## Finance Dashboard

### A polished, frontend-first personal finance workspace

![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-persisted-FF6B35?style=flat-square)
![Recharts](https://img.shields.io/badge/Recharts-charts-22C55E?style=flat-square)

<br/>

> **Track. Analyze. Understand.** A beautifully designed finance dashboard built for developers who care about UX, design systems, and frontend architecture.

<br/>

[✦ Features](#-features) · [✦ Pages](#-pages) · [✦ Roles](#-role-based-access) · [✦ Currency](#-currency-system) · [✦ Architecture](#-architecture) · [✦ Getting Started](#-getting-started)

</div>

---

<br/>

## ✦ Overview

**FinDash** is a frontend-focused personal finance workspace demonstrating what great UI engineering looks like — not just lines of code, but intentional design, architecture, and user experience.

Built with **Next.js App Router**, **Zustand**, **Recharts**, and **Tailwind CSS v4**, this project shows how to compose a real product UI from the ground up: state, analytics, theming, routing, and visual polish — all working together.

<br/>

## ✦ Features

| Category | What's Included |
|---|---|
| 🗺️ **Routing** | 5 dedicated App Router pages with a shared sidebar shell |
| 📊 **Charts** | Balance trends, expense mix, monthly breakdowns via Recharts |
| 💱 **Currency** | Live exchange rates from Frankfurter API — 9 currencies supported |
| 🔐 **Roles** | Viewer & Admin modes with persisted UI behavior |
| 🌙 **Dark Mode** | Flash-free theme restore using a `beforeInteractive` script |
| 💾 **Persistence** | Zustand + `localStorage` — state survives refreshes |
| 🧠 **Analytics** | Derived insights, trends, and category analysis from real data |
| ✨ **Animations** | Framer Motion entrance animations across all major sections |
| 📱 **Responsive** | Sidebar-first layout that adapts across screen sizes |

<br/>

## ✦ Pages

```
/               →  Overview      Quick snapshot cards, recent activity, category leaderboard
/finance        →  Finance       Balance trends, expense mix chart, spotlight panel
/transactions   →  Transactions  Full ledger with search, filter, sort, add & delete
/analytics      →  Analytics     Deeper reporting, trend analysis, insight panels
/wallet         →  Wallet        Currency context, exchange rates, holdings summary
```

### Page Highlights

<details>
<summary><strong>🏠 Overview</strong> — The landing dashboard</summary>
<br/>

Designed for fastest possible time-to-insight. Built for breadth, not depth.

- Summary metric cards
- Recent transactions panel
- Category leaderboard
- Compact analytics breakdown
- Compact insights panel

</details>

<details>
<summary><strong>📈 Finance</strong> — The control panel</summary>
<br/>

The most traditional "dashboard" page. Chart-focused and ideal for visual cash flow monitoring.

- Balance trend chart
- Expense mix chart
- Category leaderboard
- Spotlight panel
- Insights panel

</details>

<details>
<summary><strong>🧾 Transactions</strong> — The ledger</summary>
<br/>

A full-featured data management experience.

- Search by description, category, or type
- Filter by type or category
- Sort by date or amount
- Inline calendar for date input
- Category suggestion menu (shadcn-style)
- Add & delete transactions (Admin only)
- Empty and no-results states

</details>

<details>
<summary><strong>🔭 Analytics</strong> — The reporting layer</summary>
<br/>

Interpretation and analysis, not operational controls.

- KPI breakdown cards
- Trend and allocation charts
- Full insights panel
- Category leaderboard
- Spotlight rail

</details>

<details>
<summary><strong>💼 Wallet</strong> — The currency view</summary>
<br/>

Holdings-style summaries with currency focus.

- Available balance
- Income & expense flow
- Savings efficiency
- Live exchange rate panel
- Display currency context

</details>

<br/>

## ✦ Role-Based Access

The app simulates frontend-only roles, switchable from the header — no backend required.

```
👁️  Viewer    Browse all pages · see charts, cards, insights, and transactions
🛠️  Admin     Everything above + add transactions · delete transactions · reset data
```

Role selection persists across sessions via Zustand.

<br/>

## ✦ Currency System

All transaction amounts are stored internally in **USD**. Display conversion happens at render time using the latest rates from [Frankfurter](https://www.frankfurter.app/).

**Supported currencies:**

```
USD  ·  INR  ·  EUR  ·  GBP  ·  JPY  ·  CAD  ·  AUD  ·  SGD  ·  AED
```

**How it works:**

1. User selects a display currency from the header
2. The app fetches the latest daily reference rates
3. All values across cards, charts, tables, and insights are converted on the fly
4. When an Admin adds a transaction in a non-USD currency, the amount is converted back to USD before being saved

> ⚠️ These are daily reference rates — not real-time tick-by-tick forex data.

<br/>

## ✦ Architecture

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # / — Overview
│   ├── finance/page.tsx        # /finance
│   ├── transactions/page.tsx   # /transactions
│   ├── analytics/page.tsx      # /analytics
│   └── wallet/page.tsx         # /wallet
│
├── components/dashboard/       # All dashboard UI components
│   ├── dashboard-shell.tsx     # Route composition selector
│   ├── dashboard-header.tsx    # Role switch · currency picker · theme toggle
│   ├── dashboard-sidebar.tsx   # Nav · portfolio summary · status
│   ├── summary-cards.tsx       # Metric cards
│   ├── dashboard-charts.tsx    # Balance trend + expense mix
│   ├── transactions-section.tsx# Full ledger + add form + filters
│   ├── insights-panel.tsx      # Human-readable derived insights
│   ├── analytics-breakdown.tsx # Analytics KPI cards
│   ├── wallet-overview.tsx     # Wallet route content
│   └── ...                     # + more shared components
│
├── lib/                        # Utilities and domain logic
│   ├── finance-analytics.ts    # All derived metrics and insights
│   ├── finance-format.ts       # Number and currency formatting
│   ├── currency.ts             # Exchange rate fetching + conversion
│   ├── finance-data.ts         # Seed transaction data
│   └── finance-types.ts        # Shared TypeScript types
│
└── store/
    └── use-finance-store.ts    # Zustand store + localStorage persistence
```

### Central Workspace Hook

`use-dashboard-workspace.ts` is the single source of truth for each page. It centralizes:

- Zustand store access
- Theme synchronization
- Exchange rate fetching
- Derived analytics calculations
- Filtered transaction lists

<br/>

## ✦ Data Model

Each transaction is a simple, flat object:

```ts
type Transaction = {
  id:          string
  date:        string        // ISO date string
  description: string
  amount:      number        // Always positive; stored in USD
  category:    string        // e.g. "Groceries", "Salary"
  type:        "income" | "expense"
}
```

> The sign shown in the UI is **derived from `type`** — never stored on the amount.

<br/>

## ✦ Analytics Engine

All analytics are computed client-side from the transaction list — no backend, no pre-aggregated data.

```
📦 Summary Metrics          Total balance · income · expenses · savings rate
📈 Trend Analytics          Monthly balance trend · income vs expense · MoM delta
🏷️  Category Analytics      Expense mix by category · leaderboard · top-spend logic
💡 Insight Generation       Human-readable insights derived from pure analytics helpers
```

<br/>

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.2 (App Router) |
| UI Library | React 19.2.4 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand (with persistence) |
| Charts | Recharts |
| Animation | Framer Motion |
| Primitives | Radix UI |
| Exchange Rates | Frankfurter API |

<br/>

## ✦ Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Verification

```bash
# Lint check
npm run lint

# Type check
node_modules/.bin/tsc --noEmit
```

<br/>

## ✦ Design System

The visual system is intentionally far from a plain starter template.

```
Surfaces     Warm neutral backgrounds with soft gradients and blur layers
Accents      Teal / gold balance — financial without being sterile
Typography   Expressive display type paired with refined body text
Cards        Rounded finance-product style with subtle depth
Layout       Sidebar-first workspace — route-specific content composition
Motion       Framer Motion entrance animations for cohesive page loads
```

<br/>

## ✦ Scope

**In scope (frontend-only):**

- ✅ Route-based pages with shared shell
- ✅ Role-based UI behavior (viewer / admin)
- ✅ Local persistence via Zustand + localStorage
- ✅ Flash-free dark mode
- ✅ Live currency conversion
- ✅ Charts and derived analytics
- ✅ Responsive layout

**Out of scope (intentionally excluded):**

- ❌ Backend / database
- ❌ Authentication
- ❌ Real banking integrations
- ❌ Server-side transaction storage

<br/>

## ✦ Roadmap

Good next steps for extending this further:

- [ ] Real calendar component primitives
- [ ] CSV export and import
- [ ] Budgets and goals tracking
- [ ] Recurring transaction support
- [ ] Server persistence layer
- [ ] Authentication system
- [ ] Unit tests for analytics helpers and store
- [ ] Sidebar actions wired to route-specific tools

<br/>

---

<div align="center">

Built as a frontend portfolio piece demonstrating **component decomposition**, **local-first state architecture**, **derived analytics**, and **polished design system usage**.

<br/>

*Made with care. Designed with intention.*

</div>
