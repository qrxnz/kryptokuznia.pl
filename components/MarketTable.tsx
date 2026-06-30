import type { CoinGeckoMarket } from "@/lib/types";
import { fmtPct, fmtPrice, pctColorClass } from "@/lib/format";

export function MarketTable({
  markets,
  error,
}: {
  markets: CoinGeckoMarket[];
  error?: string;
}) {
  if (markets.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="mb-2 font-bold text-fuchsia-400">
          RYNEK KRYPTOWALUT · CoinGecko
        </h2>
        <p className="text-red-400">[CoinGecko] {error ?? "brak danych"}</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="mb-3 font-bold text-fuchsia-400">
        RYNEK KRYPTOWALUT · CoinGecko
      </h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-700 text-left text-zinc-400">
            <th className="pb-1 pr-2 font-normal">#</th>
            <th className="pb-1 pr-2 font-normal">Coin</th>
            <th className="pb-1 pr-2 text-right font-normal">Cena</th>
            <th className="pb-1 pr-2 text-right font-normal">24h</th>
            <th className="pb-1 text-right font-normal">7d</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((c) => (
            <tr key={c.id} className="border-b border-zinc-900">
              <td className="py-1.5 pr-2 text-zinc-500">{c.market_cap_rank}</td>
              <td className="py-1.5 pr-2">
                <span className="text-cyan-400">[{c.symbol}]</span> {c.name}
              </td>
              <td className="py-1.5 pr-2 text-right">{fmtPrice(c.current_price)}</td>
              <td
                className={`py-1.5 pr-2 text-right ${pctColorClass(c.price_change_percentage_24h)}`}
              >
                {fmtPct(c.price_change_percentage_24h)}
              </td>
              <td
                className={`py-1.5 text-right ${pctColorClass(c.price_change_percentage_7d_in_currency)}`}
              >
                {fmtPct(c.price_change_percentage_7d_in_currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
