import type { CoinGeckoGlobal, CoinGeckoMarket } from "@/lib/types";
import { commify, fmtPct, fmtUSD, pctColorClass } from "@/lib/format";

function Bar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const width = 20;
  const filled = Math.min(width, Math.round((value / max) * width));
  return (
    <span className={`font-mono ${colorClass}`}>
      {"█".repeat(filled)}
      <span className="text-zinc-700">{"░".repeat(width - filled)}</span>
    </span>
  );
}

export function GlobalMarketCard({
  global,
  markets,
  error,
}: {
  global: CoinGeckoGlobal | null;
  markets: CoinGeckoMarket[];
  error?: string;
}) {
  if (!global) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="mb-2 font-bold text-blue-400">GLOBALNY RYNEK</h2>
        <p className="text-red-400">[Global] {error ?? "brak danych"}</p>
      </section>
    );
  }

  const { market_cap_percentage, market_cap_change_percentage_24h_usd, active_cryptocurrencies } =
    global.data;
  const btcDom = market_cap_percentage.btc ?? 0;
  const ethDom = market_cap_percentage.eth ?? 0;

  const bitcoin = markets.find((m) => m.id === "bitcoin");
  const totalMcap = bitcoin && btcDom > 0 ? bitcoin.market_cap / (btcDom / 100) : 0;

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="mb-3 font-bold text-blue-400">GLOBALNY RYNEK</h2>
      <dl className="space-y-1.5 text-sm">
        {totalMcap > 0 && (
          <Row label="Całkowita kapitalizacja:">{fmtUSD(totalMcap)}</Row>
        )}
        <Row label="Zmiana mkt cap 24h:">
          <span className={pctColorClass(market_cap_change_percentage_24h_usd)}>
            {fmtPct(market_cap_change_percentage_24h_usd)}
          </span>
        </Row>
        <Row label="Dominacja BTC:">
          {btcDom.toFixed(1)}% <Bar value={btcDom} max={100} colorClass="text-yellow-400" />
        </Row>
        <Row label="Dominacja ETH:">
          {ethDom.toFixed(1)}% <Bar value={ethDom} max={100} colorClass="text-blue-400" />
        </Row>
        <Row label="Aktywne kryptowaluty:">{commify(active_cryptocurrencies)}</Row>
      </dl>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="flex items-center gap-2">{children}</dd>
    </div>
  );
}
