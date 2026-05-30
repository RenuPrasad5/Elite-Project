import React, { useState, useEffect, useMemo } from 'react';
import { ShieldAlert, RefreshCw, Copy, Check } from 'lucide-react';

export const RiskCalculator = () => {
  const [accountSize, setAccountSize] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1);
  const [stopLossSize, setStopLossSize] = useState<number>(50); // e.g. 50 pips/ticks
  const [tickValue, setTickValue] = useState<number>(10); // Default to NQ/ES standard tick/point multiplier
  const [copied, setCopied] = useState(false);

  // Persistence
  useEffect(() => {
    const stored = localStorage.getItem('ee_risk_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAccountSize(parsed.accountSize || 100000);
        setRiskPercent(parsed.riskPercent || 1);
        setTickValue(parsed.tickValue || 10);
      } catch (e) {
        console.error('Failed to parse risk settings');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ee_risk_settings', JSON.stringify({ accountSize, riskPercent, tickValue }));
  }, [accountSize, riskPercent, tickValue]);

  // Calculations
  const riskAmount = useMemo(() => accountSize * (riskPercent / 100), [accountSize, riskPercent]);
  const positionSize = useMemo(() => {
    if (stopLossSize <= 0 || tickValue <= 0) return 0;
    return riskAmount / (stopLossSize * tickValue);
  }, [riskAmount, stopLossSize, tickValue]);

  // Visual Risk Status
  const riskStatus = useMemo(() => {
    if (riskPercent > 5) return { text: 'EXTREME RISK', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    if (riskPercent > 2) return { text: 'HIGH RISK', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    return { text: 'CONTROLLED RISK', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  }, [riskPercent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(positionSize.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="w-6 h-6 text-gold-400" />
        <div>
          <h2 className="text-xl font-bold font-mono tracking-widest text-zinc-100 uppercase">Risk Engine</h2>
          <p className="text-xs text-zinc-500 font-mono">Institutional Position Sizing Matrix</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-8 p-6 bg-[#050505] border border-zinc-900 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Account Capital ($)
              </label>
              <input
                type="number"
                value={accountSize}
                onChange={(e) => setAccountSize(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-gold-400 font-mono text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex justify-between">
                <span>Risk Percentage</span>
                <span className={riskStatus.color}>{riskPercent.toFixed(1)}%</span>
              </label>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Stop Loss (Ticks/Pips)
              </label>
              <input
                type="number"
                value={stopLossSize}
                onChange={(e) => setStopLossSize(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 font-mono text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Multiplier / Tick Value ($)
              </label>
              <input
                type="number"
                value={tickValue}
                onChange={(e) => setTickValue(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 font-mono text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
              />
              <p className="text-[9px] text-zinc-600 mt-1 font-mono">NQ = $20, ES = $12.50, Micro = $2</p>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-4 p-6 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col justify-between">
          <div>
            <div className={`text-[10px] font-bold tracking-widest uppercase mb-4 px-3 py-1 rounded border inline-block ${riskStatus.bg} ${riskStatus.color} ${riskStatus.border}`}>
              {riskStatus.text}
            </div>
            
            <div className="mb-6">
              <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Max Capital Risk</span>
              <span className="text-3xl font-mono font-bold text-rose-500">
                ${riskAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="mb-6">
              <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Recommended Position Size</span>
              <span className="text-4xl font-mono font-bold text-gold-400">
                {positionSize.toFixed(2)}
              </span>
              <span className="text-xs text-zinc-500 ml-2 font-mono uppercase">Contracts/Lots</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3 mt-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-bold uppercase tracking-widest border border-zinc-800 hover:border-gold-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy Size'}
          </button>
        </div>
      </div>
    </div>
  );
};
