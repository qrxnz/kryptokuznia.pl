import type { CoinGeckoMarket } from "@/lib/types";
import { commify, fmtPct, fmtUSD, pctColorClass } from "@/lib/format";

export function AthCard({ markets }: { markets: CoinGeckoMarket[] }) {
  const bitcoin = markets.find((m) => m.id === "bitcoin");
  if (!bitcoin) return null;

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="mb-3 font-bold text-yellow-400">BITCOIN ATH</h2>
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-400">All-Time High:</dt>
          <dd>{fmtUSD(bitcoin.ath)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-400">Odległość od ATH:</dt>
          <dd className={pctColorClass(bitcoin.ath_change_percentage)}>
            {fmtPct(bitcoin.ath_change_percentage)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-400">Podaż w obiegu:</dt>
          <dd>{commify(bitcoin.circulating_supply)} / 21,000,000 BTC</dd>
        </div>
      </dl>
    </section>
  );
}
