import type {
  BinanceTicker,
  CoinGeckoGlobal,
  CoinGeckoMarket,
  DashboardData,
  FearGreedResponse,
} from "./types";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "btc-dashboard-web/1.0",
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchDashboard(): Promise<DashboardData> {
  const errors: Record<string, string> = {};

  const [binanceResult, coingeckoResult, globalResult, fearGreedResult] =
    await Promise.allSettled([
      fetchJSON<BinanceTicker>(
        "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT",
      ),
      fetchJSON<CoinGeckoMarket[]>(
        "https://api.coingecko.com/api/v3/coins/markets" +
          "?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin" +
          "&price_change_percentage=7d,30d&order=market_cap_desc",
      ),
      fetchJSON<CoinGeckoGlobal>("https://api.coingecko.com/api/v3/global"),
      fetchJSON<FearGreedResponse>(
        "https://api.alternative.me/fng/?limit=1",
      ),
    ]);

  const binance =
    binanceResult.status === "fulfilled" ? binanceResult.value : null;
  if (binanceResult.status === "rejected") {
    errors.binance = String(binanceResult.reason);
  }

  const coingecko =
    coingeckoResult.status === "fulfilled" ? coingeckoResult.value : [];
  if (coingeckoResult.status === "rejected") {
    errors.coingecko = String(coingeckoResult.reason);
  }

  const global = globalResult.status === "fulfilled" ? globalResult.value : null;
  if (globalResult.status === "rejected") {
    errors.global = String(globalResult.reason);
  }

  const fearGreed =
    fearGreedResult.status === "fulfilled" ? fearGreedResult.value : null;
  if (fearGreedResult.status === "rejected") {
    errors.feargreed = String(fearGreedResult.reason);
  }

  return {
    binance,
    coingecko,
    global,
    fearGreed,
    errors,
    fetchedAt: new Date().toISOString(),
  };
}
