import { RatesResponse } from '@/types';

const WORKER_BASE_URL = 'https://vzla-fx-gap-monitor.miguel-vzla-fx-monitor.workers.dev';
const USD_AMOUNT = 25; // Monto en USD a convertir según tasa BCV

interface BCVResponse {
  dollar: string;
}

interface BinanceResponse {
  code: string;
  message: string;
  messageDetail: null;
  data: Array<{
    adv: {
      price: string;
      tradableQuantity: string;
    };
  }>;
}

async function fetchBCVRate(): Promise<number> {
  const response = await fetch('https://bcv-api.rafnixg.dev/rates/', {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`BCV request failed: ${response.status}`);
  }

  const data = (await response.json()) as BCVResponse;
  const rate = Number.parseFloat(data.dollar);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Invalid BCV rate');
  }

  // Bank rounding to 2 decimals
  return Math.round(rate * 100) / 100;
}

async function fetchBinanceRate(bcvRate: number): Promise<{ rate: number; amountUsed: number }> {
  // Calcular el monto en VES equivalente a 25 USD según la tasa BCV
  const amountInVES = USD_AMOUNT * bcvRate;

  const payload = {
    fiat: 'VES',
    page: 1,
    rows: 10,
    tradeType: 'SELL',
    asset: 'USDT',
    countries: [],
    proMerchantAds: false,
    shieldMerchantAds: false,
    filterType: 'tradable',
    periods: [],
    additionalKycVerifyFilter: 0,
    publisherType: 'merchant',
    payTypes: ['Pago Movil'], // Filtrar por método de pago "Pago Móvil"
    classifies: ['mass', 'profession', 'fiat_trade'],
    tradedWith: false,
    followed: false,
    transAmount: amountInVES.toString(), // Filtrar por el monto calculado en VES
  };

  const response = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      Origin: 'https://p2p.binance.com',
      Referer: 'https://p2p.binance.com/',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Binance request failed: ${response.status}`);
  }

  const data = (await response.json()) as BinanceResponse;

  if (data.code !== '000000' || !data.data || data.data.length === 0) {
    throw new Error('Invalid Binance response');
  }

  // Calculate weighted average of filtered merchant offers
  let totalPrice = 0;
  let totalQuantity = 0;

  for (const item of data.data.slice(0, 10)) {
    const price = Number.parseFloat(item.adv.price);
    const quantity = Number.parseFloat(item.adv.tradableQuantity);

    if (Number.isFinite(price) && price > 0 && Number.isFinite(quantity) && quantity > 0) {
      totalPrice += price * quantity;
      totalQuantity += quantity;
    }
  }

  if (totalQuantity === 0) {
    throw new Error('No valid Binance offers found');
  }

  const averageRate = totalPrice / totalQuantity;
  // Bank rounding to 2 decimals
  return {
    rate: Math.round(averageRate * 100) / 100,
    amountUsed: Math.round(amountInVES * 100) / 100,
  };
}

async function computeRates(
  bcv: number,
  binance: number
): Promise<Omit<RatesResponse, 'binanceAmountUsed'>> {
  const response = await fetch(`${WORKER_BASE_URL}/api/compute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bcv, binance }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Compute failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
  }

  return response.json();
}

export async function fetchRates(): Promise<RatesResponse> {
  // Primero obtener la tasa BCV
  const bcv = await fetchBCVRate();

  // Luego obtener la tasa de Binance con el filtrado adecuado usando la tasa BCV
  const { rate: binance, amountUsed } = await fetchBinanceRate(bcv);

  // Compute gap metrics via Worker
  const computedRates = await computeRates(bcv, binance);

  // Agregar el monto usado a la respuesta
  return {
    ...computedRates,
    binanceAmountUsed: amountUsed,
  };
}
