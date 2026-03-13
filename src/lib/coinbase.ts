// Coinbase Advanced Trade API - Public Endpoints (No Auth Required)
// Docs: https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/rest-api

const BASE_URL = "https://api.coinbase.com/api/v3/brokerage";

// Top coins we care about (USD pairs)
export const TOP_PRODUCTS = [
  "BTC-USD",
  "ETH-USD",
  "SOL-USD",
  "DOGE-USD",
  "ADA-USD",
  "AVAX-USD",
  "LINK-USD",
  "DOT-USD",
  "MATIC-USD",
  "UNI-USD",
  "ATOM-USD",
  "XRP-USD",
];

export interface Product {
  product_id: string;
  price: string;
  price_percentage_change_24h: string;
  volume_24h: string;
  base_currency_id: string;
  quote_currency_id: string;
  base_display_symbol: string;
  quote_display_symbol: string;
  status: string;
}

export interface Candle {
  start: string;
  low: string;
  high: string;
  open: string;
  close: string;
  volume: string;
}

export interface OrderBookEntry {
  price: string;
  size: string;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  time: string;
}

export interface Trade {
  trade_id: string;
  product_id: string;
  price: string;
  size: string;
  time: string;
  side: string;
}

// Fetch all products, filter to our top list
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/market/products`, {
    next: { revalidate: 5 },
  });
  if (!res.ok) throw new Error(`Coinbase API error: ${res.status}`);
  const data = await res.json();
  const products: Product[] = data.products || [];
  return products.filter((p) => TOP_PRODUCTS.includes(p.product_id));
}

// Fetch single product details
export async function fetchProduct(productId: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/market/products/${productId}`, {
    next: { revalidate: 5 },
  });
  if (!res.ok) throw new Error(`Coinbase API error: ${res.status}`);
  return res.json();
}

// Fetch OHLC candles for charting
export async function fetchCandles(
  productId: string,
  granularity: string = "ONE_HOUR",
  limit: number = 48
): Promise<Candle[]> {
  const now = Math.floor(Date.now() / 1000);
  const granularitySeconds: Record<string, number> = {
    ONE_MINUTE: 60,
    FIVE_MINUTE: 300,
    FIFTEEN_MINUTE: 900,
    ONE_HOUR: 3600,
    SIX_HOUR: 21600,
    ONE_DAY: 86400,
  };
  const seconds = granularitySeconds[granularity] || 3600;
  const start = now - seconds * limit;

  const res = await fetch(
    `${BASE_URL}/market/products/${productId}/candles?start=${start}&end=${now}&granularity=${granularity}`,
    { next: { revalidate: 10 } }
  );
  if (!res.ok) throw new Error(`Coinbase API error: ${res.status}`);
  const data = await res.json();
  return (data.candles || []).reverse(); // oldest first for charting
}

// Fetch order book (bids and asks)
export async function fetchOrderBook(
  productId: string,
  limit: number = 15
): Promise<OrderBook> {
  const res = await fetch(
    `${BASE_URL}/market/product_book?product_id=${productId}&limit=${limit}`,
    { next: { revalidate: 2 } }
  );
  if (!res.ok) throw new Error(`Coinbase API error: ${res.status}`);
  const data = await res.json();
  return data.pricebook || { bids: [], asks: [], time: "" };
}

// Fetch recent trades
export async function fetchTrades(
  productId: string,
  limit: number = 20
): Promise<Trade[]> {
  const res = await fetch(
    `${BASE_URL}/market/products/${productId}/ticker?limit=${limit}`,
    { next: { revalidate: 2 } }
  );
  if (!res.ok) throw new Error(`Coinbase API error: ${res.status}`);
  const data = await res.json();
  return data.trades || [];
}
