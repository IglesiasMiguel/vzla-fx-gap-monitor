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
  // Redondear a número entero para evitar problemas de precisión de punto flotante
  // y asegurar que Binance encuentre publicaciones que coincidan
  const transAmountRounded = Math.round(amountInVES);

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
    payTypes: ['PagoMovil'], // Filtrar por método de pago "Pago Móvil"
    classifies: ['mass', 'profession', 'fiat_trade'],
    tradedWith: false,
    followed: false,
    transAmount: transAmountRounded.toString(), // Filtrar por el monto calculado en VES (redondeado a entero)
  };

  // DEBUG: Descomentar para ver logs de debugging de Binance
  // console.log('[Binance] Request payload:', JSON.stringify(payload, null, 2));
  // console.log('[Binance] Amount in VES (calculated):', amountInVES);
  // console.log('[Binance] Amount in VES (rounded for request):', transAmountRounded);
  // console.log('[Binance] BCV Rate used:', bcvRate);

  try {
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

    // DEBUG: Descomentar para ver logs de respuesta de Binance
    // console.log('[Binance] Response status:', response.status);
    // console.log('[Binance] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      // DEBUG: Descomentar para ver logs de error de Binance
      // console.error('[Binance] Request failed with status:', response.status);
      // console.error('[Binance] Error response body:', errorText);
      throw new Error(`Binance request failed: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as BinanceResponse;
    
    // DEBUG: Descomentar para ver logs de respuesta de Binance
    // console.log('[Binance] Response code:', data.code);
    // console.log('[Binance] Response message:', data.message);
    // console.log('[Binance] Data array length:', data.data?.length ?? 0);
    // console.log('[Binance] Full response:', JSON.stringify(data, null, 2));

    if (data.code !== '000000') {
      // DEBUG: Descomentar para ver logs de error de Binance
      // console.error('[Binance] Invalid response code:', data.code);
      // console.error('[Binance] Error message:', data.message);
      // console.error('[Binance] Message detail:', data.messageDetail);
      throw new Error(`Invalid Binance response: code=${data.code}, message=${data.message || 'Unknown error'}`);
    }

    if (!data.data || data.data.length === 0) {
      // DEBUG: Descomentar para ver logs de error de Binance
      // console.error('[Binance] No data in response');
      // console.error('[Binance] Full response:', JSON.stringify(data, null, 2));
      throw new Error('Invalid Binance response: No data returned');
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
      // DEBUG: Descomentar para ver logs de error de Binance
      // console.error('[Binance] No valid offers found after processing');
      // console.error('[Binance] Processed items:', data.data.slice(0, 10).map(item => ({
      //   price: item.adv.price,
      //   quantity: item.adv.tradableQuantity,
      // })));
      throw new Error('No valid Binance offers found');
    }

    const averageRate = totalPrice / totalQuantity;
    // DEBUG: Descomentar para ver logs de éxito de Binance
    // console.log('[Binance] Success - Average rate:', averageRate, 'Total quantity:', totalQuantity);
    
    // Bank rounding to 2 decimals
    return {
      rate: Math.round(averageRate * 100) / 100,
      amountUsed: Math.round(amountInVES * 100) / 100,
    };
  } catch (error) {
    // DEBUG: Descomentar para ver logs de error de Binance
    // console.error('[Binance] Error in fetchBinanceRate:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error in fetchBinanceRate: ${String(error)}`);
  }
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
  try {
    // DEBUG: Descomentar para ver logs de debugging de rates
    // console.log('[Rates] Starting to fetch rates...');
    
    // Primero obtener la tasa BCV
    // console.log('[Rates] Fetching BCV rate...');
    const bcv = await fetchBCVRate();
    // console.log('[Rates] BCV rate obtained:', bcv);

    // Luego obtener la tasa de Binance con el filtrado adecuado usando la tasa BCV
    // console.log('[Rates] Fetching Binance rate...');
    const { rate: binance, amountUsed } = await fetchBinanceRate(bcv);
    // console.log('[Rates] Binance rate obtained:', binance, 'Amount used:', amountUsed);

    // Compute gap metrics via Worker
    // console.log('[Rates] Computing rates via worker...');
    const computedRates = await computeRates(bcv, binance);
    // console.log('[Rates] Computed rates:', computedRates);

    // Agregar el monto usado a la respuesta
    const result = {
      ...computedRates,
      binanceAmountUsed: amountUsed,
    };
    
    // console.log('[Rates] Final rates result:', result);
    return result;
  } catch (error) {
    // DEBUG: Descomentar para ver logs de error de rates
    // console.error('[Rates] Error in fetchRates:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error in fetchRates: ${String(error)}`);
  }
}
