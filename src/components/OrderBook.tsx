"use client";

import { useEffect, useState } from "react";

interface OrderBookEntry {
  price: string;
  size: string;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export default function OrderBook({ productId }: { productId: string }) {
  const [book, setBook] = useState<OrderBookData>({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch(`/api/orderbook?product_id=${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setBook(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    load();
    const interval = setInterval(load, 3000); // refresh every 3s
    return () => clearInterval(interval);
  }, [productId]);

  const maxSize = Math.max(
    ...book.bids.map((b) => parseFloat(b.size)),
    ...book.asks.map((a) => parseFloat(a.size)),
    0.001
  );

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Order Book</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <h3 className="text-lg font-semibold text-white mb-4">
        Order Book{" "}
        <span className="text-xs text-gray-500 font-normal">Live</span>
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Bids (Buy Orders) */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
            <span>Price (USD)</span>
            <span>Size</span>
          </div>
          {book.bids.slice(0, 12).map((bid, i) => {
            const pct = (parseFloat(bid.size) / maxSize) * 100;
            return (
              <div
                key={i}
                className="relative flex justify-between text-xs py-1 px-1 font-mono"
              >
                <div
                  className="absolute inset-0 bg-green-500/10 rounded"
                  style={{ width: `${pct}%` }}
                />
                <span className="relative text-green-400">
                  {parseFloat(bid.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className="relative text-gray-400">
                  {parseFloat(bid.size).toFixed(4)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Asks (Sell Orders) */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
            <span>Price (USD)</span>
            <span>Size</span>
          </div>
          {book.asks.slice(0, 12).map((ask, i) => {
            const pct = (parseFloat(ask.size) / maxSize) * 100;
            return (
              <div
                key={i}
                className="relative flex justify-between text-xs py-1 px-1 font-mono"
              >
                <div
                  className="absolute inset-0 bg-red-500/10 rounded right-0"
                  style={{ width: `${pct}%`, marginLeft: "auto" }}
                />
                <span className="relative text-red-400">
                  {parseFloat(ask.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className="relative text-gray-400">
                  {parseFloat(ask.size).toFixed(4)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between text-xs text-gray-500">
        <span>
          Spread:{" "}
          {book.asks[0] && book.bids[0]
            ? `$${(parseFloat(book.asks[0].price) - parseFloat(book.bids[0].price)).toFixed(2)}`
            : "N/A"}
        </span>
        <span>
          Mid:{" "}
          {book.asks[0] && book.bids[0]
            ? `$${((parseFloat(book.asks[0].price) + parseFloat(book.bids[0].price)) / 2).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
            : "N/A"}
        </span>
      </div>
    </div>
  );
}
