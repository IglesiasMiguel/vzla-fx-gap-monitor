export interface RatesResponse {
  bcv: number;
  binance: number;
  gap_spread: number;
  purchasing_power: number;
  recommendation: 'BUY_BCV' | 'NEUTRAL' | 'SELL_USDT';
  last_update: string;
}

export type DisplayMode = 'purchasing_power' | 'gap_spread';
