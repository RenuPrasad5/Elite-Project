import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js App Router API endpoint for fetching NSE/BSE stock quotes via Upstox API.
 * 
 * Route: GET /api/markets/stocks
 * Query Params:
 *  - instruments: Comma-separated list of instrument keys (e.g., NSE_EQ|INE002A01018)
 * 
 * Environment Variables Required:
 *  - UPSTOX_API_TOKEN: Bearer token for authenticating with the Upstox API v2
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Validate Environment Variables
    const apiToken = process.env.UPSTOX_API_TOKEN;
    
    if (!apiToken) {
      console.error('[Upstox API] Missing UPSTOX_API_TOKEN environment variable.');
      return NextResponse.json(
        { error: 'Server configuration error. API token is missing.' },
        { status: 500 }
      );
    }

    // 2. Parse Query Parameters
    const { searchParams } = new URL(req.url);
    const instruments = searchParams.get('instruments');

    if (!instruments) {
      return NextResponse.json(
        { error: 'Bad Request. Missing "instruments" query parameter (e.g. NSE_EQ|INE002A01018,BSE_EQ|INE002A01018)' },
        { status: 400 }
      );
    }

    // 3. Construct API Request
    const upstoxEndpoint = `https://api.upstox.com/v2/market-quote/quotes?instrument_key=${encodeURIComponent(instruments)}`;
    
    const response = await fetch(upstoxEndpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      // Ensure we don't aggressively cache live financial data across requests
      next: { revalidate: 10 } 
    });

    // 4. Handle Rate Limiting & External Errors
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('[Upstox API] Rate limit exceeded.');
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      if (response.status === 401) {
        console.error('[Upstox API] Unauthorized. Invalid or expired token.');
        return NextResponse.json(
          { error: 'Authentication failure with market data provider.' },
          { status: 401 }
        );
      }

      const errorText = await response.text();
      console.error(`[Upstox API] Upstream error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch market data from provider.' },
        { status: response.status }
      );
    }

    // 5. Normalize & Return Data
    const data = await response.json();
    
    // Check if Upstox returned a successful data payload
    if (data.status !== 'success' || !data.data) {
      console.error('[Upstox API] Unexpected payload structure:', data);
      return NextResponse.json(
        { error: 'Invalid data format received from market data provider.' },
        { status: 502 }
      );
    }

    // Return the normalized data payload safely to the client
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: data.data
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
      }
    });

  } catch (error: any) {
    // Catch-all for network or parsing exceptions
    console.error('[Upstox API] Internal Server Error:', error);
    
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
