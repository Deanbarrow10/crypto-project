// Portfolio management using localStorage

export interface Holding {
  symbol: string; // e.g. "BTC-USD"
  amount: number;
  buyPrice: number; // price when added
}

const PORTFOLIO_KEY = "coinpulse_portfolio";
const WATCHLIST_KEY = "coinpulse_watchlist";

export function getPortfolio(): Holding[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PORTFOLIO_KEY);
  return data ? JSON.parse(data) : [];
}

export function addHolding(holding: Holding): Holding[] {
  const portfolio = getPortfolio();
  portfolio.push(holding);
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  return portfolio;
}

export function removeHolding(index: number): Holding[] {
  const portfolio = getPortfolio();
  portfolio.splice(index, 1);
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  return portfolio;
}

export function getWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(WATCHLIST_KEY);
  return data ? JSON.parse(data) : [];
}

export function toggleWatchlist(symbol: string): string[] {
  const watchlist = getWatchlist();
  const index = watchlist.indexOf(symbol);
  if (index >= 0) {
    watchlist.splice(index, 1);
  } else {
    watchlist.push(symbol);
  }
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  return watchlist;
}
