"use client";

import { useEffect, useState } from "react";
import type { DashboardData } from "@/lib/types";
import { BinanceCard } from "./BinanceCard";
import { MarketTable } from "./MarketTable";
import { GlobalMarketCard } from "./GlobalMarketCard";
import { FearGreedGauge } from "./FearGreedGauge";
import { AthCard } from "./AthCard";

const REFRESH_INTERVAL_MS = 60_000;

export function Dashboard({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      setIsRefreshing(true);
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (res.ok) {
          setData(await res.json());
        }
      } finally {
        setIsRefreshing(false);
      }
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const fetchedAt = new Date(data.fetchedAt).toLocaleString("pl-PL");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 font-mono text-zinc-200">
      <header className="mb-6 border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold text-cyan-400">₿ BTC DASHBOARD</h1>
        <p className="text-sm text-zinc-500">
          {fetchedAt} {isRefreshing && "· odświeżanie…"}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BinanceCard binance={data.binance} error={data.errors.binance} />
        <GlobalMarketCard
          global={data.global}
          markets={data.coingecko}
          error={data.errors.global}
        />
        <FearGreedGauge fearGreed={data.fearGreed} error={data.errors.feargreed} />
        <AthCard markets={data.coingecko} />
        <div className="md:col-span-2">
          <MarketTable markets={data.coingecko} error={data.errors.coingecko} />
        </div>
      </div>

      <footer className="mt-8 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
        <p>Źródła: Binance API · CoinGecko API · Alternative.me</p>
        <p>⚠️ Dane mają charakter informacyjny. Nie stanowią porady inwestycyjnej.</p>
      </footer>
    </div>
  );
}
