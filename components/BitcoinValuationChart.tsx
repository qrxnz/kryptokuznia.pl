"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import type { BitcoinValuationData } from "@/lib/types";
import { fmtPrice } from "@/lib/format";

const REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;

const LEGEND = [
  { label: "Bardzo tanio", color: "#0f3d2e" },
  { label: "Tanio", color: "#1f6b3a" },
  { label: "Wartość godziwa", color: "#8a7a1f" },
  { label: "Drogo", color: "#b5651d" },
  { label: "Bardzo drogo", color: "#7f1d1d" },
] as const;

function yearTick(ts: number): string {
  return new Date(ts).getFullYear().toString();
}

export function BitcoinValuationChart({
  initialData,
  initialError,
}: {
  initialData: BitcoinValuationData | null;
  initialError?: string;
}) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(initialError);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/bitcoin-valuation", { cache: "no-store" });
        if (res.ok) {
          setData(await res.json());
          setError(undefined);
        }
      } catch {
        // keep showing the last known data
      }
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="mb-2 font-bold text-orange-400">
          WYCENA BTC · 200-TYGODNIOWA MA
        </h2>
        <p className="text-red-400">[Bitcoin Valuation] {error ?? "brak danych"}</p>
      </section>
    );
  }

  const { points, currentPrice, currentMA, bands } = data;
  const yMax = Math.max(...points.map((p) => p.price), bands.expensive) * 1.08;

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="mb-1 font-bold text-orange-400">
        WYCENA BTC · 200-TYGODNIOWA MA
      </h2>
      <p className="mb-3 text-sm text-zinc-400">
        Cena: <span className="text-orange-300">{fmtPrice(currentPrice)}</span>{" "}
        · 200W MA: <span className="text-zinc-200">{fmtPrice(currentMA)}</span>
      </p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={points} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
            <XAxis
              dataKey="ts"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={yearTick}
              stroke="#71717a"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[0, yMax]}
              tickFormatter={(v: number) => fmtPrice(v)}
              stroke="#71717a"
              width={70}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "#18181b",
                border: "1px solid #3f3f46",
                fontSize: 12,
              }}
              labelFormatter={(ts) => new Date(Number(ts)).toLocaleDateString("pl-PL")}
              formatter={(value, name) => [
                fmtPrice(Number(value)),
                name === "price" ? "BTC" : "200W MA",
              ]}
            />

            <ReferenceArea y1={0} y2={bands.veryCheap} fill="#0f3d2e" fillOpacity={0.6} />
            <ReferenceArea
              y1={bands.veryCheap}
              y2={bands.cheap}
              fill="#1f6b3a"
              fillOpacity={0.6}
            />
            <ReferenceArea
              y1={bands.cheap}
              y2={bands.fair}
              fill="#8a7a1f"
              fillOpacity={0.5}
            />
            <ReferenceArea
              y1={bands.fair}
              y2={bands.expensive}
              fill="#b5651d"
              fillOpacity={0.5}
            />
            <ReferenceArea y1={bands.expensive} y2={yMax} fill="#7f1d1d" fillOpacity={0.5} />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#f7931a"
              dot={false}
              strokeWidth={1.5}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="ma200w"
              stroke="#f4f4f5"
              dot={false}
              strokeWidth={1.5}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-zinc-400">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: l.color }}
            />
            {l.label}
          </span>
        ))}
      </div>
    </section>
  );
}
