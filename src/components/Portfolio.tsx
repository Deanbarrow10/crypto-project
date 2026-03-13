"use client";

import { useState, useEffect } from "react";
import {
  getPortfolio,
  addHolding,
  removeHolding,
  type Holding,
} from "@/lib/portfolio";

interface Product {
  product_id: string;
  price: string;
  base_display_symbol: string;
}

export default function Portfolio({ products }: { products: Product[] }) {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setHoldings(getPortfolio());
  }, []);

  const priceMap: Record<string, number> = {};
  products.forEach((p) => {
    priceMap[p.product_id] = parseFloat(p.price);
  });

  const handleAdd = () => {
    if (!selectedCoin || !amount || parseFloat(amount) <= 0) return;
    const currentPrice = priceMap[selectedCoin] || 0;
    const updated = addHolding({
      symbol: selectedCoin,
      amount: parseFloat(amount),
      buyPrice: currentPrice,
    });
    setHoldings(updated);
    setShowForm(false);
    setSelectedCoin("");
    setAmount("");
  };

  const handleRemove = (index: number) => {
    const updated = removeHolding(index);
    setHoldings(updated);
  };

  const totalValue = holdings.reduce((sum, h) => {
    const currentPrice = priceMap[h.symbol] || 0;
    return sum + h.amount * currentPrice;
  }, 0);

  const totalCost = holdings.reduce(
    (sum, h) => sum + h.amount * h.buyPrice,
    0
  );
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Portfolio Tracker</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg space-y-2">
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
          >
            <option value="">Select a coin...</option>
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.base_display_symbol} - ${parseFloat(p.price).toLocaleString()}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount (e.g. 0.5)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm"
            step="any"
            min="0"
          />
          <button
            onClick={handleAdd}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-semibold transition-colors"
          >
            Add to Portfolio
          </button>
        </div>
      )}

      {holdings.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No holdings yet. Add some coins to track your portfolio!
        </p>
      ) : (
        <>
          {/* Portfolio Summary */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-500">Total Value</p>
            <p className="text-2xl font-bold text-white">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p
              className={`text-sm font-semibold ${
                totalPnL >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)} (
              {totalPnLPct >= 0 ? "+" : ""}
              {totalPnLPct.toFixed(2)}%)
            </p>
          </div>

          {/* Holdings List */}
          <div className="space-y-2">
            {holdings.map((h, i) => {
              const currentPrice = priceMap[h.symbol] || 0;
              const value = h.amount * currentPrice;
              const pnl = (currentPrice - h.buyPrice) * h.amount;
              const symbol = h.symbol.replace("-USD", "");
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                      {symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{symbol}</p>
                      <p className="text-xs text-gray-500">
                        {h.amount} @ ${h.buyPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm text-white">${value.toFixed(2)}</p>
                      <p
                        className={`text-xs ${
                          pnl >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(i)}
                      className="text-gray-600 hover:text-red-400 text-lg transition-colors"
                      title="Remove"
                    >
                      x
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
