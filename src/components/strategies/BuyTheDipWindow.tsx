import React, { useState } from "react";
import { useMockPriceFeed } from "@/hooks/useMockPriceFeed";

const BuyTheDipWindow: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const { currentPrice, priceHistory, trades } = useMockPriceFeed(isActive);

  const estimatedApr = "~18.5%";

  return (
    <div className="space-y-2">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-3 h-3 ${
              isActive ? "bg-win95-green" : "bg-win95-red"
            }`}
          />
          <span className="font-pixel text-lg">
            {isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
        <span className="font-pixel text-base text-muted-foreground">
          Est. APR: <span className="text-win95-green font-bold">{estimatedApr}</span>
        </span>
      </div>

      {/* Price Display */}
      <div className="win95-inset bg-input p-2">
        <div className="flex justify-between items-center">
          <span className="font-pixel text-xl">ETH/USD</span>
          <span className="font-pixel text-2xl font-bold">
            ${currentPrice.price.toFixed(2)}
          </span>
        </div>
        <div className="flex gap-4 mt-1 text-xs font-mono">
          <span
            className={
              currentPrice.change1m < 0 ? "text-win95-red" : "text-win95-green"
            }
          >
            1m: {currentPrice.change1m >= 0 ? "+" : ""}
            {currentPrice.change1m.toFixed(2)}%
          </span>
          <span
            className={
              currentPrice.change5m < 0 ? "text-win95-red" : "text-win95-green"
            }
          >
            5m: {currentPrice.change5m >= 0 ? "+" : ""}
            {currentPrice.change5m.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Mini Price Chart (text-based) */}
      <div className="win95-inset bg-win95-shadow p-1 h-16 flex items-end gap-px overflow-hidden">
        {priceHistory.slice(-40).map((tick, i) => {
          const min = Math.min(...priceHistory.map((t) => t.price));
          const max = Math.max(...priceHistory.map((t) => t.price));
          const range = max - min || 1;
          const height = ((tick.price - min) / range) * 100;
          return (
            <div
              key={i}
              className={`flex-1 min-w-[2px] ${
                tick.change1m >= 0 ? "bg-win95-green" : "bg-win95-red"
              }`}
              style={{ height: `${Math.max(height, 5)}%` }}
            />
          );
        })}
        {priceHistory.length === 0 && (
          <span className="text-win95-green font-mono text-xs m-auto animate-blink">
            Waiting for data...
          </span>
        )}
      </div>

      {/* Strategy Rules */}
      <div className="win95-inset bg-input p-2 text-xs font-mono space-y-0.5">
        <div className="font-pixel text-base mb-1">📋 Strategy Rules:</div>
        <div>• BUY if price drops ≥1% in 1min</div>
        <div>• BUY if price drops ≥5% in 5min</div>
        <div>• SELL if price rises ≥1% in 1min</div>
        <div>• Trade size: 0.01 ETH</div>
      </div>

      {/* Deposit / Redeem */}
      <div className="flex gap-1">
        <input
          className="win95-inset bg-input px-2 py-1 flex-1 font-mono text-xs"
          placeholder="Amount (ETH)"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <button className="win95-button text-xs">Deposit</button>
        <button className="win95-button text-xs">Redeem</button>
      </div>

      {/* Start/Stop */}
      <button
        className={`win95-button w-full font-pixel text-lg ${
          isActive ? "!bg-win95-red text-primary-foreground" : ""
        }`}
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? "⏹ STOP STRATEGY" : "▶ START STRATEGY"}
      </button>

      {/* Trade Log */}
      <div className="win95-inset bg-input p-1 max-h-32 overflow-y-auto">
        <div className="font-pixel text-base mb-1">📝 Trade Log:</div>
        {trades.length === 0 ? (
          <div className="text-xs text-muted-foreground font-mono p-1">
            No trades yet. Start the strategy to begin.
          </div>
        ) : (
          <div className="space-y-0.5">
            {trades.slice(0, 20).map((trade) => (
              <div
                key={trade.id}
                className={`text-[11px] font-mono px-1 ${
                  trade.type === "BUY"
                    ? "text-win95-green"
                    : "text-win95-red"
                }`}
              >
                [{new Date(trade.timestamp).toLocaleTimeString()}]{" "}
                {trade.type} {trade.amount} ETH @ ${trade.price.toFixed(2)} —{" "}
                {trade.reason}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyTheDipWindow;
