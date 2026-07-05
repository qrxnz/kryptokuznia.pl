export interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_30d_in_currency: number;
  circulating_supply: number;
  total_supply: number | null;
  ath: number;
  ath_change_percentage: number;
}

export interface CoinGeckoGlobal {
  data: {
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
  };
}

export interface FearGreedResponse {
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
  }>;
}

export interface DashboardData {
  binance: BinanceTicker | null;
  coingecko: CoinGeckoMarket[];
  global: CoinGeckoGlobal | null;
  fearGreed: FearGreedResponse | null;
  errors: Record<string, string>;
  fetchedAt: string;
}

export interface BitcoinValuationPoint {
  ts: number;
  price: number;
  ma200w: number;
}

export interface BitcoinValuationData {
  points: BitcoinValuationPoint[];
  currentPrice: number;
  currentMA: number;
  bands: {
    veryCheap: number;
    cheap: number;
    fair: number;
    expensive: number;
  };
  fetchedAt: string;
}
