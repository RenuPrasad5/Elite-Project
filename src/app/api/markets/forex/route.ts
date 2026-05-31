import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js App Router API endpoint for fetching live Forex & Metals data via Twelve Data API.
 * 
 * Route: GET /api/markets/forex
 * Query Params:
 *  - symbols: Comma-separated list of pairs (e.g., EUR/USD,GBP/USD,USD/JPY,XAU/USD)
 *    Defaults to EUR/USD, GBP/USD, USD/JPY, XAU/USD if omitted.
 * 
 * Environment Variables Required:
 *  - TWELVE_DATA_API_KEY: Your Twelve Data API Key
 */

const DEFAULT_SYMBOLS = 'EUR/USD,GBP/USD,USD/JPY,XAU/USD';

export async function GET(req: NextRequest) {
  try {
    // 1. Validate Environment Variables
    const apiKey = process.env.TWELVE_DATA_API_KEY;
    
    if (!apiKey) {
      console.error('[TwelveData API] Missing TWELVE_DATA_API_KEY environment variable.');
      return NextResponse.json(
        { error: 'Server configuration error. API key is missing.' },
        { status: 500 }
      );
    }

    // 2. Parse Query Parameters
    const { searchParams } = new URL(req.url);
    // User can pass EURUSD or EUR/USD. Let's normalize it if they forget the slash for standard pairs.
    let rawSymbols = searchParams.get('symbols') || DEFAULT_SYMBOLS;
    
    // Normalize basic cases (EURUSD -> EUR/USD) if they are 6 characters without a slash
    const symbols = rawSymbols
      .split(',')
      .map(s => {
        const trimmed = s.trim();
        if (trimmed.length === 6 && !trimmed.includes('/')) {
          return `${trimmed.substring(0, 3)}/${trimmed.substring(3, 6)}`;
        }
        return trimmed;
      })
      .join(',');

    // 3. Construct API Request
    // Twelve Data /quote endpoint gets current price, change, percent change, high, low, close, volume
    const twelveDataEndpoint = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbols)}&apikey=${apiKey}`;
    
    const response = await fetch(twelvedataEndpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      // Real-time market data should not be heavily cached, but 10s prevents hammering
      next: { revalidate: 10 } 
    });

    // 4. Handle Rate Limiting & External Errors
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('[TwelveData API] Rate limit exceeded.');
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }

      const errorText = await response.text();
      console.error(`[TwelveData API] Upstream error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch market data from provider.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Twelve Data returns { code, message } on API-level logic errors (e.g. invalid key)
    if (data.code && data.code >= 400) {
      console.error('[TwelveData API] Error response:', data.message);
      return NextResponse.json(
        { error: data.message || 'Error from market data provider.' },
        { status: data.code === 401 ? 401 : 400 }
      );
    }

    // 5. Normalize & Return Data
    // Twelve Data returns a direct object if 1 symbol is requested, or an object of objects if multiple
    // We normalize it to always return a dictionary/map of symbols to their data.
    const normalizedData: Record<string, any> = {};

    if (data.symbol) {
      // Single symbol response
      normalizedData[data.symbol] = data;
    } else {
      // Multi-symbol response
      Object.keys(data).forEach(key => {
        if (data[key].symbol) {
          normalizedData[data[key].symbol] = data[key];
        }
      });
    }

    // Return the payload safely to the client
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: normalizedData
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
      }
    });

  } catch (error: any) {
    // Catch-all for network or parsing exceptions
    console.error('[TwelveData API] Internal Server Error:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
