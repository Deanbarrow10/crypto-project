"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PriceChart from "@/components/PriceChart";
import OrderBook from "@/components/OrderBook";
import RecentTrades from "@/components/RecentTrades";

interface Product {
  product_id: string;
  price: string;
  price_percentage_change_24h: string;
  volume_24h: string;
  base_display_symbol: string;
  quote_display_symbol: string;
}

export default function CoinDetail() {
  const params = useParams();
  const productId = decodeURIComponent(params.id as string);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch(`/api/products`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const found = data.find(
              (p: Product) => p.product_id === productId
            );
            if (found) setProduct(found);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Product not found: {productId}</p>
        <Link href="/" className="text-blue-400 hover:underline">
          Back to Markets
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const change = parseFloat(product.price_percentage_change_24h);
  const volume = parseFloat(product.volume_24h);
  const isPositive = change >= 0;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-gray-500 hover:text-white text-sm transition-colors"
        >
          Markets
        </Link>
        <span className="text-gray-700 mx-2">/</span>
        <span className="text-white text-sm">{product.base_display_symbol}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xl">
            {product.base_display_symbol.slice(0, 2)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {product.base_display_symbol}
              <span className="text-gray-500 text-lg ml-2">
                / {product.quote_display_symbol}
              </span>
            </h1>
            <p className="text-gray-500 text-sm">{product.product_id}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">
            $
            {price >= 1000
              ? price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : price.toFixed(price >= 1 ? 2 : 4)}
          </p>
          <p
            className={`text-lg font-semibold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(2)}% (24h)
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500">24h Volume</p>
          <p className="text-lg font-bold">
            $
            {volume >= 1_000_000_000
              ? `${(volume / 1_000_000_000).toFixed(2)}B`
              : volume >= 1_000_000
              ? `${(volume / 1_000_000).toFixed(2)}M`
              : `${(volume / 1_000).toFixed(2)}K`}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500">24h Change</p>
          <p
            className={`text-lg font-bold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(2)}%
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500">Price</p>
          <p className="text-lg font-bold">${price.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-xs text-gray-500">Pair</p>
          <p className="text-lg font-bold">{product.product_id}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <PriceChart productId={productId} />
      </div>

      {/* Order Book + Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderBook productId={productId} />
        <RecentTrades productId={productId} />
      </div>

      {/* Coinbase API Attribution */}
      <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-600">
          All data sourced from{" "}
          <a
            href="https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Coinbase Advanced Trade API
          </a>{" "}
          public endpoints. Prices update every 5 seconds. Order book and
          trades refresh every 3 seconds.
        </p>
      </div>
    </div>
  );
}
