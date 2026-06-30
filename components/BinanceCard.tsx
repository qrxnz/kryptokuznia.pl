import type { BinanceTicker } from "@/lib/types";
import { commify, fmtPct, fmtUSD, pctColorClass } from "@/lib/format";

export function BinanceCard({
  binance,
  error,
}: {
  binance: BinanceTicker | null;
  error?: string;
}) {
  if (!binance) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="mb-2 font-bold text-yellow-400">
          BINANCE SPOT · BTC/USDT
        </h2>
        <p className="text-red-400">[Binance] {error ?? "brak danych"}</p>
      </section>
    );
  }

  const price = parseFloat(binance.lastPrice);
  const pct = parseFloat(binance.priceChangePercent);
  const high = parseFloat(binance.highPrice);
  const low = parseFloat(binance.lowPrice);
  const volume = parseFloat(binance.volume);
  const quoteVolume = parseFloat(binance.quoteVolume);

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="mb-3 font-bold text-yellow-400">
        BINANCE SPOT · BTC/USDT
      </h2>
      <dl className="space-y-1.5 text-sm">
        <Row label="Cena:">
          <span className="text-lg font-bold text-yellow-300">
            ${commify(price)}
          </span>
        </Row>
        <Row label="Zmiana 24h:">
          <span className={pctColorClass(pct)}>{fmtPct(pct)}</span>
        </Row>
        <Row label="24h High / Low:">
          ${commify(high)} / ${commify(low)}
        </Row>
        <Row label="Wolumen 24h:">
          {volume.toFixed(2)} BTC ({fmtUSD(quoteVolume)})
        </Row>
      </dl>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-zinc-400">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
