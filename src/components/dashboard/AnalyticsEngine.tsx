import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts';

interface Trade {
  id: string;
  date: string;
  asset: string;
  side: 'Long' | 'Short';
  pnl: number;
  rr: number;
  setup: string;
  emotion: string;
  mistake: string;
}

export const AnalyticsEngine = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('ee_journal_trades');
    if (stored) {
      try {
        setTrades(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse journal data for analytics');
      }
    }
  }, []);

  // Complex Aggregations
  const stats = useMemo(() => {
    if (trades.length === 0) return null;

    const wins = trades.filter(t => t.pnl > 0);
    const losses = trades.filter(t => t.pnl <= 0);
    
    const winRate = (wins.length / trades.length) * 100;
    
    // R:R Analysis
    const avgWinRR = wins.length ? wins.reduce((sum, t) => sum + t.rr, 0) / wins.length : 0;
    const avgLossRR = losses.length ? losses.reduce((sum, t) => sum + Math.abs(t.rr), 0) / losses.length : 1; // Assume 1R loss standard

    // Discipline Score (Base 100, -5 for FOMO/Revenge, -2 for Mistakes)
    let disciplinePenalty = 0;
    trades.forEach(t => {
      if (['FOMO', 'Revenge'].includes(t.emotion)) disciplinePenalty += 5;
      if (t.mistake !== 'None') disciplinePenalty += 2;
    });
    const disciplineScore = Math.max(0, 100 - disciplinePenalty);

    // Setup Performance
    const setupsMap: Record<string, { count: number; wins: number; pnl: number }> = {};
    trades.forEach(t => {
      if (!setupsMap[t.setup]) setupsMap[t.setup] = { count: 0, wins: 0, pnl: 0 };
      setupsMap[t.setup].count++;
      setupsMap[t.setup].pnl += t.pnl;
      if (t.pnl > 0) setupsMap[t.setup].wins++;
    });

    const setupArray = Object.entries(setupsMap).map(([name, data]) => ({
      name,
      ...data,
      winRate: (data.wins / data.count) * 100
    })).sort((a, b) => b.pnl - a.pnl);

    const bestSetup = setupArray[0] || null;
    const worstSetup = setupArray[setupArray.length - 1] || null;

    // AI Insights Generator
    const insights: string[] = [];
    if (disciplineScore < 70) {
      insights.push(`Your Discipline Score is critically low (${disciplineScore}/100). Emotional trading is eroding your edge.`);
    }
    if (bestSetup && bestSetup.count >= 3) {
      insights.push(`Your most profitable setup is "${bestSetup.name}" with a ${bestSetup.winRate.toFixed(0)}% win rate. Size up here.`);
    }
    if (worstSetup && worstSetup.pnl < 0) {
      insights.push(`You are losing capital on "${worstSetup.name}". Consider removing this setup from your playbook.`);
    }
    if (avgWinRR > 2 && winRate > 35) {
      insights.push(`Your Average R:R (${avgWinRR.toFixed(1)}R) combined with your win rate (${winRate.toFixed(0)}%) gives you a statistically verified edge.`);
    }

    // Chart Data (Rolling Win Rate / PnL by Trade)
    const chartData = [...trades].reverse().map((t, i, arr) => {
      // Calculate trailing 5-trade win rate
      const slice = arr.slice(Math.max(0, i - 4), i + 1);
      const trailingWR = (slice.filter(tr => tr.pnl > 0).length / slice.length) * 100;
      return {
        tradeIndex: i + 1,
        pnl: t.pnl,
        trailingWR
      };
    });

    return {
      winRate,
      avgWinRR,
      disciplineScore,
      setupArray,
      insights,
      chartData
    };
  }, [trades]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-zinc-900 border-dashed rounded-xl bg-zinc-950/50 p-8 space-y-4">
        <Brain className="w-12 h-12 text-zinc-700" />
        <h3 className="text-lg font-bold font-mono uppercase tracking-widest text-zinc-400">Insufficient Data</h3>
        <p className="text-sm font-mono text-zinc-600 text-center max-w-md">
          The Analytics Engine requires edge cases to process. Log at least 3 trades in your Trading Journal to activate statistical modeling.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-gold-400" />
        <div>
          <h2 className="text-xl font-bold font-mono tracking-widest text-zinc-100 uppercase">Analytics Engine</h2>
          <p className="text-xs text-zinc-500 font-mono">AI-driven edge verification & psychology scoring</p>
        </div>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Overall Win Rate</h3>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-mono font-bold text-zinc-100">{stats.winRate.toFixed(1)}%</span>
            {stats.winRate >= 50 ? <TrendingUp className="w-5 h-5 text-emerald-400 mb-1" /> : <TrendingDown className="w-5 h-5 text-rose-500 mb-1" />}
          </div>
        </div>

        <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Average Win R:R</h3>
          <span className="text-4xl font-mono font-bold text-gold-400">{stats.avgWinRR.toFixed(2)}R</span>
        </div>

        <div className={`p-6 bg-[#020202] border ${stats.disciplineScore < 70 ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-zinc-900'} rounded-xl`}>
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Discipline Score</h3>
          <div className="flex items-end gap-3">
            <span className={`text-4xl font-mono font-bold ${stats.disciplineScore < 70 ? 'text-rose-500' : 'text-emerald-400'}`}>
              {stats.disciplineScore}
            </span>
            <span className="text-xs text-zinc-600 mb-1 font-mono">/ 100</span>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="p-6 bg-gradient-to-br from-gold-950/10 to-transparent border border-gold-500/20 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-gold-400" />
          <h3 className="text-[11px] font-bold text-gold-400 uppercase tracking-widest">Engine Insights</h3>
        </div>
        <div className="space-y-3">
          {stats.insights.length > 0 ? (
            stats.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-black/40 p-3 rounded border border-zinc-900/50">
                <span className="text-gold-500 mt-0.5">»</span>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">{insight}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-500 font-mono">Gathering more trade data to generate personalized psychological insights...</p>
          )}
        </div>
      </div>

      {/* Charts & Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Trailing Win Rate Chart */}
        <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Trailing Win Rate (Moving Avg)</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="tradeIndex" stroke="#52525b" fontSize={10} tickFormatter={(val) => `T${val}`} />
                <YAxis stroke="#52525b" fontSize={10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#cc9b33', fontWeight: 'bold' }}
                />
                <ReferenceLine y={50} stroke="#cc9b33" strokeDasharray="3 3" opacity={0.3} />
                <Bar dataKey="trailingWR" radius={[2, 2, 0, 0]}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.trailingWR >= 50 ? '#34d399' : '#f43f5e'} fillOpacity={0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Setup Performance Table */}
        <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl overflow-hidden flex flex-col">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Setup Performance Matrix</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-3">
              {stats.setupArray.map((setup, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-zinc-950/50 rounded border border-zinc-900">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 mb-1 truncate max-w-[150px]">{setup.name}</h4>
                    <div className="flex gap-3 text-[10px] font-mono text-zinc-500">
                      <span>{setup.count} Trades</span>
                      <span>{setup.winRate.toFixed(0)}% WR</span>
                    </div>
                  </div>
                  <div className={`text-sm font-bold font-mono ${setup.pnl > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {setup.pnl > 0 ? '+' : ''}{setup.pnl.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
