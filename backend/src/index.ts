export interface Env {
  // Add bindings here if needed (KV, D1, etc.)
}

interface RatesResponse {
  bcv: number;
  binance: number;
  gap_spread: number;
  purchasing_power: number;
  recommendation: 'BUY_BCV' | 'NEUTRAL' | 'SELL_USDT';
  last_update: string;
}

function calculateGap(
  bcv: number,
  binance: number
): {
  gap_spread: number;
  purchasing_power: number;
  recommendation: 'BUY_BCV' | 'NEUTRAL' | 'SELL_USDT';
} {
  // Gap spread: How much more expensive is the parallel market (as percentage)
  const gap_spread = ((binance - bcv) / bcv) * 100;

  // Purchasing power: What percentage of purchasing power you have with BCV vs Binance
  const purchasing_power = (bcv / binance) * 100;

  // Recommendation logic
  let recommendation: 'BUY_BCV' | 'NEUTRAL' | 'SELL_USDT';
  if (purchasing_power < 60) {
    recommendation = 'BUY_BCV'; // High gap, official dollar is cheap
  } else if (purchasing_power > 90) {
    recommendation = 'SELL_USDT'; // Rates are almost equal
  } else {
    recommendation = 'NEUTRAL';
  }

  return {
    gap_spread: Math.round(gap_spread * 100) / 100,
    purchasing_power: Math.round(purchasing_power * 100) / 100,
    recommendation,
  };
}

export default {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/compute') {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = (await request.json()) as { bcv: number; binance: number };

      const bcv = Number(body.bcv);
      const binance = Number(body.binance);

      // Validate inputs
      if (!Number.isFinite(bcv) || bcv <= 0 || !Number.isFinite(binance) || binance <= 0) {
        return new Response(
          JSON.stringify({
            error: 'Invalid input',
            message: 'Both bcv and binance must be positive numbers',
          }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      // Calculate gap metrics
      const { gap_spread, purchasing_power, recommendation } = calculateGap(bcv, binance);

      const response: RatesResponse = {
        bcv: Math.round(bcv * 100) / 100,
        binance: Math.round(binance * 100) / 100,
        gap_spread,
        purchasing_power,
        recommendation,
        last_update: new Date().toISOString(),
      };

      return new Response(JSON.stringify(response), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to compute rates.',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  },
};
