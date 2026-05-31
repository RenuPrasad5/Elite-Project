'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, TrendingUp, BarChart2, DollarSign, Activity } from 'lucide-react';

export const MarketTabs = () => {
  const pathname = usePathname();

  const tabs = [
    { name: 'OVERVIEW', path: '/markets', icon: Activity, exact: true },
    { name: 'STOCKS', path: '/markets/stocks', icon: TrendingUp },
    { name: 'CRYPTO', path: '/markets/crypto', icon: BarChart2 },
    { name: 'FOREX', path: '/markets/forex', icon: DollarSign },
  ];

  return (
    <div className="w-full bg-[#0B0B0B] border-b border-zinc-800/80 sticky top-20 z-40">
      <div className="max-w-[1512px] mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-4 py-3">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar font-mono text-[10px] tracking-widest font-bold">
          {tabs.map((tab) => {
            const isActive = tab.exact 
              ? pathname === tab.path 
              : pathname.startsWith(tab.path);
            
            const Icon = tab.icon;

            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-sm transition-all whitespace-nowrap uppercase
                  ${isActive 
                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30 shadow-[0_0_10px_rgba(212,175,55,0.05)]' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#111111] border border-transparent'}
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.name}
              </Link>
            );
          })}
        </div>

        {/* Dense Search Bar */}
        <div className="relative w-full md:w-64 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search Ticker (e.g. AAPL, BTC)..."
            className="w-full bg-[#111111] border border-zinc-800 text-zinc-200 text-[10px] font-mono rounded-sm pl-8 pr-3 py-2 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all placeholder:text-zinc-600 uppercase"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <span className="text-[8px] font-mono text-zinc-600 border border-zinc-800 px-1 rounded-[2px] bg-[#050505]">⌘K</span>
          </div>
        </div>

      </div>
    </div>
  );
};
