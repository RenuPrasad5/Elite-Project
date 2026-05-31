import React from 'react';
import { 
  TVTickerTape, 
  TVMarketOverview, 
  TVTimeline 
} from '@/components/markets/TradingViewWidgets';
import { Activity, Globe, Zap } from 'lucide-react';

export default function MarketsOverviewPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Ticker Tape */}
      <div className="w-full overflow-hidden border border-zinc-800 rounded-sm">
        <TVTickerTape />
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-widest text-zinc-100 uppercase">
              Global Markets
            </h1>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            SYS_OVERWATCH // LIVE_FEED // MACRO_ECONOMICS
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#111111] border border-zinc-800 px-3 py-1.5 rounded-sm">
            <Activity className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[10px] font-mono text-zinc-300 tracking-wider">MARKETS: <strong className="text-emerald-400">OPEN</strong></span>
          </div>
        </div>
      </div>

      {/* Grid Layout for Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Market Overview (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-bold font-mono tracking-widest text-zinc-300 uppercase">Macro Overview</h2>
          </div>
          <div className="w-full bg-[#0B0B0B] border border-zinc-800 p-1 rounded-sm shadow-xl h-[600px]">
            <TVMarketOverview />
          </div>
        </div>

        {/* Right Column: Global News Feed (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-bold font-mono tracking-widest text-zinc-300 uppercase">Live News Feed</h2>
          </div>
          <div className="w-full bg-[#0B0B0B] border border-zinc-800 p-1 rounded-sm shadow-xl h-[600px]">
            <TVTimeline />
          </div>
        </div>

      </div>
    </div>
  );
}
