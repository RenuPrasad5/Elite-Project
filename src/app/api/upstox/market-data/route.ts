import { NextRequest, NextResponse } from 'next/server';

const UPSTOX_API_BASE_URL = 'https://api.upstox.com/v2';
const UPSTOX_API_KEY = process.env.UPSTOX_API_KEY;
const UPSTOX_API_SECRET = process.env.UPSTOX_API_SECRET;

// Simple in-memory rate limiting map
// NOTE: For production deployments (especially serverless), use Redis or a similar persistent store
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // Max 60 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }
  
  if (now - record.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count += 1;
  return false;
}

export async function GET(request: NextRequest) {
  try {
    // Extract IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // Ensure environment variables are loaded
    if (!UPSTOX_API_KEY || !UPSTOX_API_SECRET) {
      console.warn('Upstox API credentials not found in environment variables');
      return NextResponse.json(
        { error: 'API credentials misconfigured on server' },
        { status: 500 }
      );
    }

    // Get search parameters
    const { searchParams } = new URL(request.url);
    const instruments = searchParams.get('instruments');
    
    if (!instruments) {
      return NextResponse.json(
        { error: 'Missing instruments parameter (e.g. ?instruments=NSE_EQ|INE002A01018)' },
        { status: 400 }
      );
    }

    // Most Upstox API v2 endpoints require an OAuth2 access token.
    // If an access token is passed by the client, use it. Otherwise, return an error.
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header with Bearer token' },
        { status: 401 }
      );
    }

    // Fetch market quotes from Upstox
    const upstoxUrl = `${UPSTOX_API_BASE_URL}/market-quote/quotes?instrument_key=${encodeURIComponent(instruments)}`;
    
    const response = await fetch(upstoxUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Api-Version': '2.0',
        'Authorization': authHeader,
      },
      // Cache response for 5 seconds to minimize duplicate API calls
      next: { revalidate: 5 }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Upstox API Error:', response.status, errorData);
      
      return NextResponse.json(
        { 
          error: `Upstox API responded with status ${response.status}`, 
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return normalized JSON response
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      source: 'upstox',
      data: data.data || {},
    }, { status: 200 });

  } catch (error: any) {
    console.error('Market Data API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error while fetching market data', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
