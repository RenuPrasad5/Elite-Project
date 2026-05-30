import React, { useMemo } from 'react';
import { 
  Terminal, ShieldAlert, Crosshair, ArrowUpRight, ArrowDownRight, 
  Calendar, Map, Target, TrendingUp, TrendingDown, Flame, CheckCircle, Circle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';

interface TraderOSProps {
  gamificationState: any;
  subscription: any;
}

// Mock Data
const MOCK_HEATMAP = [
  { symbol: 'BTC', change: 4.2, price: '95,500.00' },
  { symbol: 'ETH', change: 2.1, price: '3,080.20' },
  { symbol: 'SOL', change: -1.5, price: '139.10' },
  { symbol: 'ES=F', change: 0.8, price: '5,310.25' },
  { symbol: 'NQ=F', change: 1.2, price: '18,520.50' },
  { symbol: 'DXY', change: -0.2, price: '104.20' },
  { symbol: 'GOLD', change: 1.1, price: '2,345.10' },
  { symbol: 'OIL', change: -3.4, price: '78.40' },
  { symbol: 'EUR', change: 0.1, price: '1.084' },
  { symbol: 'JPY', change: -0.5, price: '155.20' },
];

const MOCK_CALENDAR = [
  { time: '08:30 AM', event: 'Core CPI (MoM)', impact: 'High', flag: '🇺🇸', actual: '0.3%', forecast: '0.3%' },
  { time: '10:00 AM', event: 'ISM Non-Manufacturing PMI', impact: 'High', flag: '🇺🇸', actual: '-', forecast: '52.1' },
  { time: '14:00 PM', event: 'FOMC Meeting Minutes', impact: 'Extreme', flag: '🇺🇸', actual: '-', forecast: '-' },
  { time: '21:30 PM', event: 'RBA Interest Rate Decision', impact: 'High', flag: '🇦🇺', actual: '-', forecast: '4.35%' },
];

const MOCK_POSITIONS = [
  { id: 1, symbol: 'BTC-USD-PERP', type: 'LONG', size: '2.50 BTC', entry: '$92,400.00', mark: '$95,500.00', pnl: '+$7,750.00', leverage: '100x', positive: true },
  { id: 2, symbol: 'ETH-USD-PERP', type: 'SHORT', size: '32.0 ETH', entry: '$3,120.50', mark: '$3,080.20', pnl: '+$1,289.60', leverage: '50x', positive: true },
  { id: 3, symbol: 'SOL-USD-PERP', type: 'LONG', size: '150.0 SOL', entry: '$142.30', mark: '$139.10', pnl: '-$480.00', leverage: '25x', positive: false },
];

export const TraderOSDashboard: React.FC<TraderOSProps> = ({ gamificationState, subscription }) => {

  // Generate GitHub-style heatmap data for the last 30 days
  const streakData = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      // Create some random PnL days, mostly green to fit the user's ego
      const isWin = Math.random() > 0.3;
      const magnitude = Math.random();
      return {
        day: i + 1,
        isWin,
        intensity: magnitude > 0.7 ? 3 : magnitude > 0.4 ? 2 : 1, // 1 to 3
        pnl: isWin ? (magnitude * 5000) : -(magnitude * 2000)
      };
    });
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 auto-rows-min gap-4 h-full pb-8 font-mono">
      
      {/* 1. Header / Live Metrics Ribbon (Span 12) */}
      <div className="xl:col-span-12 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-display font-bold tracking-widest text-zinc-100 uppercase">
              Terminal Workspace
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Engine
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest flex gap-3">
            <span>Latency: <span className="text-emerald-500">12ms</span></span>
            <span>Uptime: <span className="text-zinc-300">99.9%</span></span>
            <span>Node: <span className="text-zinc-300">EE-US-EAST</span></span>
          </p>
        </div>
        
        {/* Account High-Level Metrics */}
        <div className="flex gap-4">
          <div className="bg-[#020202] border border-zinc-900 rounded p-2.5 min-w-[120px]">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Net Liq Value</span>
            <span className="text-sm font-bold text-zinc-100">$842,910.45</span>
          </div>
          <div className="bg-[#020202] border border-zinc-900 rounded p-2.5 min-w-[120px]">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Daily Delta</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +$11,842.10</span>
          </div>
          <div className="bg-[#020202] border border-zinc-900 rounded p-2.5 min-w-[120px]">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Clearance</span>
            <span className="text-sm font-bold text-gold-400 uppercase">{subscription?.tier || 'Free'}</span>
          </div>
        </div>
      </div>

      {/* 2. Trader Streaks & Heatmap (Span 8) */}
      <div className="xl:col-span-8 bg-[#020202] border border-zinc-900 rounded-xl p-5 relative overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <h3 className="font-bold uppercase tracking-widest text-[11px] text-zinc-300">Performance Heatmap (30D)</h3>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded shadow-[0_0_10px_rgba(249,115,22,0.1)]">
            <span className="text-[10px] font-bold text-orange-400">{gamificationState.streak} Day Hot Streak</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex gap-1 flex-wrap justify-start">
            {streakData.map((d, i) => {
              // Map intensity to opacity
              let bgClass = "bg-zinc-900 border-zinc-800"; // neutral/loss default
              if (d.isWin) {
                if (d.intensity === 3) bgClass = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] border-emerald-400";
                else if (d.intensity === 2) bgClass = "bg-emerald-600 border-emerald-500";
                else bgClass = "bg-emerald-900 border-emerald-800";
              } else {
                if (d.intensity === 3) bgClass = "bg-rose-500 border-rose-400";
                else if (d.intensity === 2) bgClass = "bg-rose-700 border-rose-600";
                else bgClass = "bg-rose-900 border-rose-800";
              }

              return (
                <div 
                  key={i} 
                  title={`Day ${d.day}: ${d.pnl > 0 ? '+' : ''}$${d.pnl.toFixed(0)}`}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-[2px] border ${bgClass} transition-transform hover:scale-110 cursor-crosshair`} 
                />
              );
            })}
          </div>
        </div>
        
        <div className="flex justify-end items-center gap-2 mt-4 text-[9px] text-zinc-500 uppercase tracking-widest">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-zinc-900 rounded-[1px]" />
            <div className="w-3 h-3 bg-emerald-900 rounded-[1px]" />
            <div className="w-3 h-3 bg-emerald-600 rounded-[1px]" />
            <div className="w-3 h-3 bg-emerald-500 rounded-[1px]" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* 3. Account Milestones (Span 4) */}
      <div className="xl:col-span-4 bg-[#020202] border border-zinc-900 rounded-xl p-5 flex flex-col relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-4 h-4 text-gold-500" />
          <h3 className="font-bold uppercase tracking-widest text-[11px] text-zinc-300">Account Milestones</h3>
        </div>
        
        <div className="flex-1 relative flex flex-col justify-between pl-4 border-l border-zinc-800/50 py-2">
           {/* Timeline Items */}
           <div className="relative">
             <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Phase 1: Evaluation</h4>
             <p className="text-[9px] text-zinc-500 mt-1">Status: Passed (+8.2%)</p>
           </div>
           
           <div className="relative">
             <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-gold-400 rounded-full shadow-[0_0_10px_rgba(204,155,51,0.5)]" />
             <h4 className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">Phase 2: Verification</h4>
             <p className="text-[9px] text-zinc-500 mt-1">Status: Active (+4.1% / 5.0%)</p>
           </div>
           
           <div className="relative">
             <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-zinc-800 rounded-full border border-zinc-700" />
             <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Funded</h4>
             <p className="text-[9px] text-zinc-600 mt-1">Status: Locked ($100k Allocation)</p>
           </div>
           
           <div className="relative">
             <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-zinc-800 rounded-full border border-zinc-700" />
             <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Elite Master Tier</h4>
             <p className="text-[9px] text-zinc-600 mt-1">Status: Locked (Profit Split 90%)</p>
           </div>
        </div>
      </div>

      {/* 4. Market Heatmaps (Span 6) */}
      <div className="xl:col-span-6 bg-[#020202] border border-zinc-900 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-zinc-500" />
            <h3 className="font-bold uppercase tracking-widest text-[11px] text-zinc-300">Market Heatmap</h3>
          </div>
          <span className="text-[9px] bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded uppercase">24H Delta</span>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {MOCK_HEATMAP.map((asset, idx) => {
            const isPositive = asset.change > 0;
            // Map magnitude to background color intensity
            const intensity = Math.min(Math.abs(asset.change) / 2, 1);
            
            // Generate color using rgba to control opacity easily
            const bgColor = isPositive 
              ? `rgba(16, 185, 129, ${0.1 + intensity * 0.4})` // emerald 
              : `rgba(244, 63, 94, ${0.1 + intensity * 0.4})`; // rose

            return (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center p-2 rounded-[4px] border border-zinc-900/50 transition-all hover:brightness-125 cursor-crosshair"
                style={{ backgroundColor: bgColor }}
              >
                <span className="text-[10px] font-bold text-zinc-100">{asset.symbol}</span>
                <span className={`text-[9px] font-bold ${isPositive ? 'text-emerald-100' : 'text-rose-100'}`}>
                  {isPositive ? '+' : ''}{asset.change}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Trading Calendar (Span 6) */}
      <div className="xl:col-span-6 bg-[#020202] border border-zinc-900 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <h3 className="font-bold uppercase tracking-widest text-[11px] text-zinc-300">Macro Calendar</h3>
          </div>
          <span className="text-[9px] text-gold-400 uppercase tracking-widest bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">Today</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-600 uppercase tracking-widest text-[9px] border-b border-zinc-900/40">
                <th className="pb-2 font-normal">Time</th>
                <th className="pb-2 font-normal">Event</th>
                <th className="pb-2 font-normal text-center">Impact</th>
                <th className="pb-2 font-normal text-right">Act/For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/30">
              {MOCK_CALENDAR.map((ev, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="py-2.5 text-[10px] text-zinc-400">{ev.time}</td>
                  <td className="py-2.5">
                    <span className="mr-2 text-sm">{ev.flag}</span>
                    <span className="text-[10px] text-zinc-200">{ev.event}</span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest ${
                      ev.impact === 'Extreme' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_5px_rgba(244,63,94,0.3)]' :
                      ev.impact === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {ev.impact}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[10px]">
                    <span className="text-emerald-400 font-bold">{ev.actual}</span>
                    <span className="text-zinc-600 mx-1">/</span>
                    <span className="text-zinc-500">{ev.forecast}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Active Positions (Span 12) */}
      <div className="xl:col-span-12 bg-[#020202] border border-zinc-900 rounded-xl p-5 flex flex-col mt-2">
        <div className="flex justify-between items-center mb-4 border-b border-zinc-900/50 pb-3">
          <div className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-zinc-500" />
            <h4 className="font-bold uppercase tracking-widest text-[11px] text-zinc-300">Active Positions</h4>
          </div>
          <span className="text-[9px] text-emerald-400 px-1.5 py-0.5 border border-emerald-500/30 rounded bg-emerald-500/10 uppercase font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Executing
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="text-zinc-600 uppercase tracking-widest text-[9px] border-b border-zinc-900/40">
                <th className="pb-2 font-normal">Instrument</th>
                <th className="pb-2 font-normal">Side/Size</th>
                <th className="pb-2 text-right font-normal">Entry / Mark</th>
                <th className="pb-2 text-right font-normal">Unrealized PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/30">
              {MOCK_POSITIONS.map((pos) => (
                <tr key={pos.id} className="hover:bg-zinc-900/20 group transition-colors">
                  <td className="py-3">
                    <span className="font-bold text-zinc-200 block">{pos.symbol}</span>
                    <span className="text-[9px] text-zinc-500">{pos.leverage} Isolated</span>
                  </td>
                  <td className="py-3">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mr-1.5 ${pos.type === 'LONG' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                      {pos.type}
                    </span>
                    <span className="text-zinc-400">{pos.size}</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="text-zinc-300 font-bold">{pos.entry}</div>
                    <div className="text-[9px] text-zinc-500 group-hover:text-zinc-400 transition-colors">{pos.mark}</div>
                  </td>
                  <td className={`py-3 text-right font-bold ${pos.positive ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]' : 'text-rose-400'}`}>
                    {pos.pnl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
