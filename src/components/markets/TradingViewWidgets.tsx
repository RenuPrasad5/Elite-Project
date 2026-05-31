'use client';

import React, { useEffect, useState } from 'react';
import { 
  TickerTape, 
  MarketOverview, 
  AdvancedRealTimeChart, 
  Timeline, 
  Screener, 
  SymbolOverview,
  ForexCrossRates
} from 'react-ts-tradingview-widgets';

// Wrapper to prevent hydration mismatches with TradingView script injection
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;
  return <>{children}</>;
};

// Global Widget Defaults
const tvTheme = "dark";

export const TVTickerTape = () => (
  <ClientOnly>
    <TickerTape 
      colorTheme={tvTheme} 
      displayMode="adaptive"
      symbols={[
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100" },
        { proName: "FX_IDC:EURUSD", title: "EUR/USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" }
      ]}
    />
  </ClientOnly>
);

export const TVMarketOverview = () => (
  <ClientOnly>
    <MarketOverview 
      colorTheme={tvTheme}
      width="100%"
      height={600}
      showChart={true}
      tabs={[
        {
          title: "Indices",
          originalTitle: "Indices",
          symbols: [
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "US 100" },
            { s: "FOREXCOM:DJI", d: "Dow 30" },
            { s: "INDEX:NKY", d: "Nikkei 225" }
          ]
        },
        {
          title: "Commodities",
          originalTitle: "Commodities",
          symbols: [
            { s: "OANDA:XAUUSD", d: "Gold" },
            { s: "OANDA:XAGUSD", d: "Silver" },
            { s: "OANDA:WTICOUSD", d: "Crude Oil" },
          ]
        },
        {
          title: "Bonds",
          originalTitle: "Bonds",
          symbols: [
            { s: "CME:GE1!", d: "Eurodollar" },
            { s: "CBOT:ZB1!", d: "T-Bond" },
            { s: "CBOT:UB1!", d: "Ultra T-Bond" },
          ]
        }
      ]}
    />
  </ClientOnly>
);

export const TVAdvancedChart = ({ symbol = "BINANCE:BTCUSD" }: { symbol?: string }) => (
  <ClientOnly>
    <div className="h-[600px] w-full">
      <AdvancedRealTimeChart 
        theme={tvTheme} 
        symbol={symbol}
        width="100%"
        height="100%"
        allow_symbol_change={true}
        enable_publishing={false}
        hide_top_toolbar={false}
        hide_legend={false}
        save_image={false}
        style="1" // 1 = Candles
        toolbar_bg="#0B0B0B"
      />
    </div>
  </ClientOnly>
);

export const TVTimeline = () => (
  <ClientOnly>
    <Timeline 
      colorTheme={tvTheme} 
      feedMode="all_symbols"
      displayMode="regular"
      width="100%"
      height={600}
    />
  </ClientOnly>
);

export const TVScreener = ({ market = "crypto" }: { market?: "crypto" | "forex" | "america" }) => (
  <ClientOnly>
    <Screener 
      colorTheme={tvTheme} 
      width="100%" 
      height={600} 
      defaultColumn="overview" 
      defaultScreen="general" 
      market={market as any}
    />
  </ClientOnly>
);

export const TVForexCrossRates = () => (
  <ClientOnly>
    <ForexCrossRates 
      colorTheme={tvTheme} 
      width="100%" 
      height={600} 
      currencies={["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD"]}
    />
  </ClientOnly>
);
