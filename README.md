# CoinPulse - Real-Time Cryptocurrency Dashboard

A live cryptocurrency market intelligence dashboard that displays real-time prices, interactive charts, order books, and trade feeds for the top 12 cryptocurrencies. Built with Next.js 16, React 19, and the Coinbase public API.

No API keys or authentication required — it uses Coinbase's public market data endpoints.

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build

```bash
npm run build   # Create optimized production build
npm start       # Serve the production build
```

## Features

- **Live Market Data** — Prices auto-refresh every 5 seconds across 12 major cryptocurrencies (BTC, ETH, SOL, DOGE, ADA, AVAX, LINK, DOT, MATIC, UNI, ATOM, XRP)
- **Interactive Price Charts** — Area charts with 5 time granularities (1 hour, 1 day, 1 week, 1 month, 1 year)
- **Order Book** — Real-time bid/ask visualization with spread and mid-price, refreshing every 3 seconds
- **Recent Trades Feed** — Live stream of market trades with buy/sell indicators
- **Watchlist** — Star coins to filter your view, persisted in localStorage
- **Portfolio Tracker** — Track holdings, cost basis, current value, and P&L (stored in localStorage)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — navbar + footer
│   ├── page.tsx                # Home page — market grid + portfolio sidebar
│   ├── globals.css             # Tailwind imports + custom scrollbar styles
│   ├── coin/[id]/page.tsx      # Coin detail page — chart, order book, trades
│   └── api/
│       ├── products/route.ts   # GET /api/products — list of tracked coins
│       ├── candles/route.ts    # GET /api/candles — OHLC chart data
│       ├── orderbook/route.ts  # GET /api/orderbook — bid/ask depth
│       └── trades/route.ts     # GET /api/trades — recent trade history
├── components/
│   ├── PriceCard.tsx           # Coin card with price, 24h change, watchlist toggle
│   ├── PriceChart.tsx          # Recharts area chart with time granularity controls
│   ├── OrderBook.tsx           # Bid/ask table with visual size bars
│   ├── RecentTrades.tsx        # Scrollable trade list with buy/sell coloring
│   └── Portfolio.tsx           # Add/remove holdings, track value + P&L
└── lib/
    ├── coinbase.ts             # Coinbase API wrapper (public endpoints)
    └── portfolio.ts            # localStorage helpers for portfolio + watchlist
```

## Pages

| Route | What it shows |
|---|---|
| `/` | Market overview grid with filtering (All, Watchlist, Gainers, Losers), market stats summary, and portfolio tracker sidebar |
| `/coin/[id]` | Detail view for a single coin — price header, stats cards, interactive chart, live order book, and recent trades |

## How Data Flows

1. **Client components** fetch from the Next.js API routes on mount and at intervals
2. **API routes** (`/api/*`) proxy requests to the [Coinbase Advanced Trade API](https://docs.cdp.coinbase.com/advanced-trade/docs/rest-api-overview/) (public endpoints, no auth needed)
3. **Portfolio and watchlist** data is stored entirely in the browser's `localStorage`

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **UI:** React 19 + Tailwind CSS 4
- **Charts:** Recharts 3
- **Data Source:** Coinbase Advanced Trade API (public)
- **Linting:** ESLint 9

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Create production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |
