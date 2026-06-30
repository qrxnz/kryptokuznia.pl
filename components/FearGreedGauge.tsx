import type { FearGreedResponse } from "@/lib/types";
import { fearGreedColorClass, fearGreedHint } from "@/lib/format";

export function FearGreedGauge({
  fearGreed,
  error,
}: {
  fearGreed: FearGreedResponse | null;
  error?: string;
}) {
  const entry = fearGreed?.data?.[0];
  if (!entry) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="mb-2 font-bold text-cyan-400">
          INDEKS STRACHU I CHCIWOŚCI · Alternative.me
        </h2>
        <p className="text-red-400">[Fear&Greed] {error ?? "brak danych"}</p>
      </section>
    );
  }

  const val = parseInt(entry.value, 10);
  const colorClass = fearGreedColorClass(val);
  const hint = fearGreedHint(val);
  const width = 30;
  const filled = Math.min(width, Math.round((val / 100) * width));

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <h2 className="mb-3 font-bold text-cyan-400">
        INDEKS STRACHU I CHCIWOŚCI · Alternative.me
      </h2>
      <p className="mb-2 text-sm">
        Wartość:{" "}
        <span className={`font-bold ${colorClass}`}>
          {entry.value_classification} {val} / 100
        </span>
      </p>
      <p className="mb-3 font-mono text-sm">
        <span className="text-red-400">[Fear]</span>{" "}
        <span className={colorClass}>
          {"█".repeat(filled)}
          <span className="text-zinc-700">{"░".repeat(width - filled)}</span>
        </span>{" "}
        <span className="text-emerald-400">[Greed]</span>
      </p>
      <p className={`text-sm ${hint.colorClass}`}>{hint.text}</p>
    </section>
  );
}
