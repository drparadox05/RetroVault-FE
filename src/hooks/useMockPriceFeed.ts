import { useState, useEffect, useRef, useCallback } from "react";

export interface PriceTick {
  price: number;
  timestamp: number;
  change1m: number;
  change5m: number;
}

export interface TradeLog {
  id: string;
  type: "BUY" | "SELL";
  price: number;
  amount: number;
  timestamp: number;
  reason: string;
}

const BASE_PRICE = 3200;

export function useMockPriceFeed(active: boolean = false) {
  const [currentPrice, setCurrentPrice] = useState<PriceTick>({
    price: BASE_PRICE,
    timestamp: Date.now(),
    change1m: 0,
    change5m: 0,
  });
  const [priceHistory, setPriceHistory] = useState<PriceTick[]>([]);
  const [trades, setTrades] = useState<TradeLog[]>([]);
  const pricesRef = useRef<{ price: number; ts: number }[]>([]);

  const addTrade = useCallback((trade: Omit<TradeLog, "id">) => {
    setTrades((prev) => [
      { ...trade, id: `trade-${Date.now()}-${Math.random().toString(36).slice(2)}` },
      ...prev,
    ]);
  }, []);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const volatility = (Math.random() - 0.48) * 40; // slight downward bias for dips
      const prevPrice = pricesRef.current.length > 0
        ? pricesRef.current[pricesRef.current.length - 1].price
        : BASE_PRICE;

      const newPrice = Math.max(prevPrice + volatility, prevPrice * 0.9);

      pricesRef.current.push({ price: newPrice, ts: now });
      // Keep last 5 minutes of data
      pricesRef.current = pricesRef.current.filter((p) => now - p.ts < 300000);

      const price1mAgo = pricesRef.current.find((p) => now - p.ts >= 58000);
      const price5mAgo = pricesRef.current.find((p) => now - p.ts >= 295000);

      const change1m = price1mAgo
        ? ((newPrice - price1mAgo.price) / price1mAgo.price) * 100
        : 0;
      const change5m = price5mAgo
        ? ((newPrice - price5mAgo.price) / price5mAgo.price) * 100
        : 0;

      const tick: PriceTick = { price: newPrice, timestamp: now, change1m, change5m };

      setCurrentPrice(tick);
      setPriceHistory((prev) => [...prev.slice(-60), tick]);

      // Strategy logic: Buy the Dip
      if (change1m <= -1 || change5m <= -5) {
        const reason =
          change5m <= -5
            ? `5min drop ${change5m.toFixed(2)}%`
            : `1min drop ${change1m.toFixed(2)}%`;
        addTrade({
          type: "BUY",
          price: newPrice,
          amount: 0.01,
          timestamp: now,
          reason,
        });
      } else if (change1m >= 1) {
        addTrade({
          type: "SELL",
          price: newPrice,
          amount: 0.01,
          timestamp: now,
          reason: `1min rise ${change1m.toFixed(2)}%`,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [active, addTrade]);

  return { currentPrice, priceHistory, trades };
}
