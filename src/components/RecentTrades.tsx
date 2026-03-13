"use client";

import { useEffect, useState } from "react";

interface Trade {
  trade_id: string;
  product_id: string;
  price: string;
  size: string;
  time: string;
  side: string;
}

export default function RecentTrades({ productId }: { productId: string }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch(`/api/trades?product_id=${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setTrades(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [productId]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white mb-4">
        Recent Trades{" "}
        <span className="text-xs text-gray-500 font-normal">Live</span>
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-0">
          <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
            <span>Price</span>
            <span>Size</span>
            <span>Time</span>
          </div>
          {trades.slice(0, 15).map((trade, i) => {
            const isBuy = trade.side === "BUY";
            return (
              <div
                key={trade.trade_id || i}
                className="flex justify-between text-xs py-1 px-1 font-mono hover:bg-gray-800/50 rounded"
              >
                <span className={isBuy ? "text-green-400" : "text-red-400"}>
                  ${parseFloat(trade.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-gray-400">
                  {parseFloat(trade.size).toFixed(4)}
                </span>
                <span className="text-gray-500">
                  {new Date(trade.time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
