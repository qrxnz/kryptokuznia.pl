import type { BitcoinValuationData, BitcoinValuationPoint } from "./types";

const MA_WEEKS = 200;

// Valuation zones expressed as multiples of the current 200-week MA.
// Calibrated so the all-time-high weekly close (ratio ~1.97x today's MA)
// actually lands inside "Very Expensive" instead of grazing its boundary.
const BAND_MULTIPLIERS = {
  veryCheap: 1.0,
  cheap: 1.25,
  fair: 1.5,
  expensive: 1.75,
};

// Binance klines row: [openTime, open, high, low, close, volume, closeTime, ...]
type Kline = [number, string, string, string, string, ...unknown[]];

export async function fetchBitcoinValuation(): Promise<BitcoinValuationData> {
  const res = await fetch(
    "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1w&limit=1000",
    {
      headers: {
        "User-Agent": "btc-dashboard-web/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 21_600 },
    },
  );
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from Binance klines`);
  }

  const klines = (await res.json()) as Kline[];
  if (klines.length === 0) {
    throw new Error("Brak danych historycznych z Binance");
  }

  const weekly = klines.map((k) => ({ weekStart: k[0], price: parseFloat(k[4]) }));

  // Rolling 200-week simple moving average.
  const points: BitcoinValuationPoint[] = [];
  let windowSum = 0;
  for (let i = 0; i < weekly.length; i++) {
    windowSum += weekly[i].price;
    if (i >= MA_WEEKS) windowSum -= weekly[i - MA_WEEKS].price;
    if (i >= MA_WEEKS - 1) {
      points.push({
        ts: weekly[i].weekStart,
        price: weekly[i].price,
        ma200w: windowSum / MA_WEEKS,
      });
    }
  }

  if (points.length === 0) {
    throw new Error("Za mało historii, by policzyć 200-tygodniową MA");
  }

  const latest = points[points.length - 1];

  return {
    points,
    currentPrice: latest.price,
    currentMA: latest.ma200w,
    bands: {
      veryCheap: latest.ma200w * BAND_MULTIPLIERS.veryCheap,
      cheap: latest.ma200w * BAND_MULTIPLIERS.cheap,
      fair: latest.ma200w * BAND_MULTIPLIERS.fair,
      expensive: latest.ma200w * BAND_MULTIPLIERS.expensive,
    },
    fetchedAt: new Date().toISOString(),
  };
}
