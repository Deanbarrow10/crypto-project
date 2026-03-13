"use client";

import { useEffect, useState, useCallback } from "react";
import PriceCard from "@/components/PriceCard";
import Portfolio from "@/components/Portfolio";
import { getWatchlist, toggleWatchlist } from "@/lib/portfolio";

interface Product {
  product_id: string;
  price: string;
  price_percentage_change_24h: string;
  volume_24h: string;
  base_display_symbol: string;
  quote_display_symbol: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "watchlist" | "gainers" | "losers">("all");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadProducts = useCallback(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort by market cap proxy (volume)
          data.sort(
            (a: Product, b: Product) =>
              parseFloat(b.volume_24h) - parseFloat(a.volume_24h)
          );
          setProducts(data);
          setLastUpdated(new Date().toLocaleTimeString());
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setWatchlist(getWatchlist());
    loadProducts();
    const interval = setInterval(loadProducts, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [loadProducts]);

  const handleToggleWatchlist = (symbol: string) => {
    const updated = toggleWatchlist(symbol);
    setWatchlist(updated);
  };

  const filtered = products.filter((p) => {
    if (filter === "watchlist") return watchlist.includes(p.product_id);
    if (filter === "gainers")
      return parseFloat(p.price_percentage_change_24h) > 0;
    if (filter === "losers")
      return parseFloat(p.price_percentage_change_24h) < 0;
    return true;
  });

  const totalVolume = products.reduce(
    (sum, p) => sum + parseFloat(p.volume_24h || "0"),
    0
  );
  const avgChange =
    products.length > 0
      ? products.reduce(
          (sum, p) => sum + parseFloat(p.price_percentage_change_24h || "0"),
          0
        ) / products.length
      : 0;

  return (
    <div>
      {/* Hero / Market Summary */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Crypto Markets{" "}
          <span className="text-blue-400">Live</span>
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          Real-time data from Coinbase Advanced Trade API | Last updated:{" "}
          {lastUpdated || "Loading..."}
        </p>

        {/* Market Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500">Tracked Assets</p>
            <p className="text-xl font-bold">{products.length}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500">24h Volume (Total)</p>
            <p className="text-xl font-bold">
              ${(totalVolume / 1_000_000_000).toFixed(2)}B
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <p className="text-xs text-gray-500">Avg 24h Change</p>
            <p
              className={`text-xl font-bold ${
                avgChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {avgChange >= 0 ? "+" : ""}
              {avgChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Market Grid - 2/3 width */}
        <div className="lg:col-span-2">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {(
              [
                { key: "all", label: "All" },
                { key: "watchlist", label: "Watchlist" },
                { key: "gainers", label: "Gainers" },
                { key: "losers", label: "Losers" },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                }`}
              >
                {f.label}
                {f.key === "watchlist" && ` (${watchlist.length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse h-32"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
              {filter === "watchlist"
                ? "No coins in your watchlist yet. Star some coins!"
                : "No coins match this filter."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((product) => (
                <PriceCard
                  key={product.product_id}
                  productId={product.product_id}
                  symbol={product.base_display_symbol}
                  price={product.price}
                  change24h={product.price_percentage_change_24h}
                  volume24h={product.volume_24h}
                  isWatchlisted={watchlist.includes(product.product_id)}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Portfolio */}
        <div className="lg:col-span-1">
          <Portfolio products={products} />

          {/* API Info Card */}
          <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-2">
              About This Project
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              CoinPulse is powered by the{" "}
              <span className="text-blue-400">
                Coinbase Advanced Trade API
              </span>{" "}
              public endpoints. It fetches real-time prices, OHLC candles,
              order book depth, and recent trades — all without authentication.
            </p>
            <div className="mt-3 space-y-1 text-xs text-gray-600">
              <p>GET /market/products</p>
              <p>GET /market/products/:id/candles</p>
              <p>GET /market/product_book</p>
              <p>GET /market/products/:id/ticker</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
