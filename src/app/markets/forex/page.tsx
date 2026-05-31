import React from 'react';
import { 
  TVAdvancedChart, 
  TVScreener,
  TVForexCrossRates
} from '@/components/markets/TradingViewWidgets';
import { TrendingUp, BarChart2, DollarSign } from 'lucide-react';

export default function ForexPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-widest text-zinc-100 uppercase">
              Foreign Exchange
            </h1>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            SYS_OVERWATCH // FOREX // MAJOR_PAIRS
          </p>
        </div>
      </div>

      {/* Grid Layout for Widgets */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Top: Advanced Real Time Chart */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-bold font-mono tracking-widest text-zinc-300 uppercase">Terminal Chart: EUR/USD</h2>
          </div>
          <div className="w-full bg-[#0B0B0B] border border-zinc-800 p-1 rounded-sm shadow-xl h-[600px]">
            <TVAdvancedChart symbol="FX_IDC:EURUSD" />
          </div>
        </div>

        {/* Middle: Forex Cross Rates */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-bold font-mono tracking-widest text-zinc-300 uppercase">Forex Cross Rates</h2>
          </div>
          <div className="w-full bg-[#0B0B0B] border border-zinc-800 p-1 rounded-sm shadow-xl h-[600px]">
            <TVForexCrossRates />
          </div>
        </div>

        {/* Bottom: Forex Screener */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-gold-500" />
            <h2 className="text-sm font-bold font-mono tracking-widest text-zinc-300 uppercase">Forex Screener</h2>
          </div>
          <div className="w-full bg-[#0B0B0B] border border-zinc-800 p-1 rounded-sm shadow-xl h-[600px]">
            <TVScreener market="forex" />
          </div>
        </div>

      </div>
    </div>
  );
}
