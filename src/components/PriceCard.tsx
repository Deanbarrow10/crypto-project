"use client";

import Link from "next/link";

interface PriceCardProps {
  productId: string;
  symbol: string;
  price: string;
  change24h: string;
  volume24h: string;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
}

function formatPrice(price: string): string {
  const num = parseFloat(price);
  if (num >= 1000) return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (num >= 1) return num.toFixed(2);
  return num.toFixed(4);
}

function formatVolume(volume: string): string {
  const num = parseFloat(volume);
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

export default function PriceCard({
  productId,
  symbol,
  price,
  change24h,
  volume24h,
  isWatchlisted,
  onToggleWatchlist,
}: PriceCardProps) {
  const changeNum = parseFloat(change24h);
  const isPositive = changeNum >= 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <Link href={`/coin/${productId}`} className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
            {symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
              {symbol}
            </h3>
            <p className="text-xs text-gray-500">{productId}</p>
          </div>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleWatchlist(productId);
          }}
          className="text-xl hover:scale-110 transition-transform"
          title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
        >
          {isWatchlisted ? "★" : "☆"}
        </button>
      </div>

      <Link href={`/coin/${productId}`}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white">${formatPrice(price)}</p>
            <p className="text-xs text-gray-500 mt-1">Vol: {formatVolume(volume24h)}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              isPositive
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {changeNum.toFixed(2)}%
          </div>
        </div>
      </Link>
    </div>
  );
}
