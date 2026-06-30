export function commify(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtUSD(v: number): string {
  if (v >= 1_000_000_000_000) return `$${(v / 1_000_000_000_000).toFixed(2)}T`;
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  return `$${v.toFixed(2)}`;
}

export function fmtPrice(v: number): string {
  if (v >= 1000) return `$${commify(v)}`;
  return `$${v.toFixed(4)}`;
}

export function fmtPct(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function pctColorClass(pct: number): string {
  return pct >= 0 ? "text-emerald-400" : "text-red-400";
}

export function fearGreedColorClass(val: number): string {
  if (val <= 24) return "text-red-400";
  if (val <= 44) return "text-yellow-400";
  if (val <= 54) return "text-zinc-200";
  if (val <= 74) return "text-emerald-400";
  return "text-emerald-300";
}

export function fearGreedHint(val: number): { text: string; colorClass: string } {
  if (val <= 20) {
    return {
      text: "✅ Extreme Fear – historycznie dobra strefa akumulacji BTC",
      colorClass: "text-emerald-400",
    };
  }
  if (val <= 40) {
    return {
      text: "⚠️ Fear – rynek w stresie, warto obserwować inne wskaźniki",
      colorClass: "text-yellow-400",
    };
  }
  if (val <= 60) {
    return {
      text: "➖ Neutral – brak wyraźnego sygnału kierunkowego",
      colorClass: "text-zinc-300",
    };
  }
  if (val <= 80) {
    return {
      text: "⚠️ Greed – ostrożnie, rynek może być przegrzany",
      colorClass: "text-yellow-400",
    };
  }
  return {
    text: "❌ Extreme Greed – historycznie okolice szczytów cyklicznych",
    colorClass: "text-red-400",
  };
}
