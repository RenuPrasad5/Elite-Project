import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useGamification } from '@/context/GamificationContext';

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

export const TradingJournal = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const { logTrade } = useGamification();

  // Form State
  const [asset, setAsset] = useState('BTC/USD');
  const [side, setSide] = useState<'Long' | 'Short'>('Long');
  const [pnl, setPnl] = useState('');
  const [rr, setRr] = useState('');
  const [setup, setSetup] = useState('');
  const [emotion, setEmotion] = useState('Neutral');
  const [mistake, setMistake] = useState('None');

  // Persistence
  useEffect(() => {
    const stored = localStorage.getItem('ee_journal_trades');
    if (stored) {
      try {
        setTrades(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse journal');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ee_journal_trades', JSON.stringify(trades));
  }, [trades]);

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const newTrade: Trade = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      asset,
      side,
      pnl: Number(pnl),
      rr: Number(rr),
      setup,
      emotion,
      mistake,
    };
    setTrades([newTrade, ...trades]);
    setIsAdding(false);
    logTrade();
    setPnl('');
    setRr('');
    setSetup('');
  };

  // Compute Chart Data (Cumulative PnL over time)
  const chartData = [...trades].reverse().reduce((acc: any[], trade, index) => {
    const prevTotal = index > 0 ? acc[index - 1].total : 0;
    acc.push({
      date: trade.date,
      tradeId: trade.id,
      total: prevTotal + trade.pnl
    });
    return acc;
  }, []);

  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate = trades.length > 0 ? (trades.filter(t => t.pnl > 0).length / trades.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-gold-400" />
          <div>
            <h2 className="text-xl font-bold font-mono tracking-widest text-zinc-100 uppercase">Trading Journal</h2>
            <p className="text-xs text-zinc-500 font-mono">Log setups, track emotions, analyze edges</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gold-500 hover:bg-gold-400 text-zinc-950 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Log Trade</>}
        </button>
      </div>

      {isAdding && (
        <div className="p-6 bg-[#050505] border border-gold-500/30 rounded-xl mb-6 shadow-[0_0_15px_rgba(204,155,51,0.05)]">
          <form onSubmit={handleAddTrade} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Asset</label>
              <input type="text" value={asset} onChange={e => setAsset(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Direction</label>
              <select value={side} onChange={e => setSide(e.target.value as any)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono text-sm">
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">PnL ($)</label>
              <input type="number" step="0.01" value={pnl} onChange={e => setPnl(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">R:R</label>
              <input type="number" step="0.01" value={rr} onChange={e => setRr(e.target.value)} placeholder="e.g. 2.5" className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono text-sm" />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Setup / Strategy</label>
              <input type="text" value={setup} onChange={e => setSetup(e.target.value)} placeholder="e.g. 1H FVG Bounce" required className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Emotion</label>
              <select value={emotion} onChange={e => setEmotion(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono text-sm">
                <option>Neutral</option><option>FOMO</option><option>Revenge</option><option>Confident</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Mistake</label>
              <select value={mistake} onChange={e => setMistake(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-100 font-mono text-sm">
                <option>None</option><option>Early Entry</option><option>Late Exit</option><option>Overleveraged</option><option>Moved Stop Loss</option>
              </select>
            </div>
            <div className="lg:col-span-4 flex justify-end mt-2">
              <button type="submit" className="bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2 rounded text-xs font-bold uppercase tracking-widest cursor-pointer">
                Save Entry to Ledger
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-[#020202] border border-zinc-900 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Cumulative Equity Curve</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cc9b33" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#cc9b33" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#cc9b33', fontWeight: 'bold' }}
                />
                <Area type="step" dataKey="total" stroke="#cc9b33" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Performance Metrics</h3>
            <div className="mb-4">
              <span className="block text-xs text-zinc-400 mb-1">Net PnL</span>
              <span className={`text-2xl font-mono font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                {totalPnL >= 0 ? '+' : '-'}${Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="block text-xs text-zinc-400 mb-1">Win Rate</span>
              <span className="text-2xl font-mono font-bold text-zinc-100">{winRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="text-[9px] text-zinc-600 font-mono mt-4 pt-4 border-t border-zinc-900">
            Total Trades Logged: {trades.length}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#020202] border border-zinc-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-900 text-[10px] uppercase tracking-widest text-zinc-500">
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Asset</th>
                <th className="p-4 font-bold">Side</th>
                <th className="p-4 font-bold">Setup</th>
                <th className="p-4 font-bold">Emotion</th>
                <th className="p-4 font-bold text-right">R:R</th>
                <th className="p-4 font-bold text-right">PnL</th>
              </tr>
            </thead>
            <tbody className="text-xs font-mono">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-600">No trades logged in the secure ledger.</td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-colors">
                    <td className="p-4 text-zinc-400">{trade.date}</td>
                    <td className="p-4 font-bold text-zinc-300">{trade.asset}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${trade.side === 'Long' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-400 truncate max-w-[150px]">{trade.setup}</td>
                    <td className="p-4">
                      {trade.emotion !== 'Neutral' && (
                         <span className="text-zinc-500 text-[10px] border border-zinc-800 px-1.5 py-0.5 rounded">{trade.emotion}</span>
                      )}
                      {trade.mistake !== 'None' && (
                         <span className="text-rose-500/70 text-[10px] border border-rose-500/20 ml-2 px-1.5 py-0.5 rounded">{trade.mistake}</span>
                      )}
                    </td>
                    <td className="p-4 text-right text-zinc-400">{trade.rr > 0 ? trade.rr.toFixed(2) : '-'}R</td>
                    <td className={`p-4 text-right font-bold ${trade.pnl > 0 ? 'text-emerald-400' : trade.pnl < 0 ? 'text-rose-500' : 'text-zinc-500'}`}>
                      {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
