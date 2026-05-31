'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export interface StockCardProps {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number | string;
  sparklineData?: number[];
  isLive?: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  volume,
  sparklineData = [],
  isLive = false,
}) => {
  const isPositive = change >= 0;

  // Format currency
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  // Format chart data for recharts
  const chartData = useMemo(() => {
    return sparklineData.map((val, i) => ({ value: val, index: i }));
  }, [sparklineData]);

  // Determine colors based on positive/negative state
  const colorHex = isPositive ? '#10B981' : '#F43F5E'; // emerald-500 / rose-500
  const bgGradient = isPositive 
    ? 'from-emerald-500/10 to-transparent' 
    : 'from-rose-500/10 to-transparent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.3 }}
      className="relative w-full bg-[#0B0B0B] border border-zinc-800/80 hover:border-gold-500/40 rounded-sm overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col cursor-pointer transition-colors select-none"
    >
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${isPositive ? 'bg-emerald-500/80' : 'bg-rose-500/80'}`} />

      <div className="p-4 flex flex-col h-full z-10 relative">
        {/* Header: Symbol & Live Indicator */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-sm font-display font-bold text-zinc-100 uppercase tracking-widest">{symbol}</h3>
            {name && <p className="text-[9px] text-zinc-500 font-sans line-clamp-1">{name}</p>}
          </div>
          {isLive && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#111111] border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7.5px] font-mono text-zinc-400 font-bold uppercase">LIVE</span>
            </div>
          )}
        </div>

        {/* Price & Change Metrics */}
        <div className="mt-3 flex items-end gap-3 font-mono">
          <span className="text-xl font-bold text-zinc-100 leading-none">{formattedPrice}</span>
          
          <div className={`flex items-center gap-1 text-xs font-bold leading-none pb-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isPositive ? '+' : ''}{change.toFixed(2)}</span>
            <span className="px-1.5 py-0.5 rounded-[2px] bg-black/40 border border-current opacity-90 text-[9px] ml-1">
              {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Volume Metric */}
        {volume && (
          <div className="mt-3 flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-wider">
            <BarChart2 className="w-3 h-3 text-gold-500" />
            <span>VOL: <strong className="text-zinc-300">{volume}</strong></span>
          </div>
        )}
      </div>

      {/* Mini Sparkline Chart (Bottom Area) */}
      {sparklineData.length > 0 && (
        <div className="h-16 w-full relative mt-auto border-t border-zinc-900/60">
          {/* Subtle gradient background based on trend */}
          <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} opacity-50`} />
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorGradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorHex} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colorHex} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colorHex} 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill={`url(#colorGradient-${symbol})`} 
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};
