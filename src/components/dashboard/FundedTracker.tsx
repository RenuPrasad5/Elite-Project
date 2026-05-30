import React, { useState, useEffect } from 'react';
import { Target, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

export const FundedTracker = () => {
  const [initialBalance, setInitialBalance] = useState<number>(100000);
  const [currentBalance, setCurrentBalance] = useState<number>(100000);
  const [dailyStartBalance, setDailyStartBalance] = useState<number>(100000);
  
  // Evaluation Rules
  const [targetPercent, setTargetPercent] = useState<number>(8);
  const [maxDailyLossPercent, setMaxDailyLossPercent] = useState<number>(5);
  const [maxDrawdownPercent, setMaxDrawdownPercent] = useState<number>(10);

  // Persistence
  useEffect(() => {
    const stored = localStorage.getItem('ee_funded_tracker');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInitialBalance(parsed.initialBalance || 100000);
        setCurrentBalance(parsed.currentBalance || 100000);
        setDailyStartBalance(parsed.dailyStartBalance || 100000);
        setTargetPercent(parsed.targetPercent || 8);
        setMaxDailyLossPercent(parsed.maxDailyLossPercent || 5);
        setMaxDrawdownPercent(parsed.maxDrawdownPercent || 10);
      } catch (e) {
        console.error('Failed to parse tracker settings');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ee_funded_tracker', JSON.stringify({
      initialBalance, currentBalance, dailyStartBalance, targetPercent, maxDailyLossPercent, maxDrawdownPercent
    }));
  }, [initialBalance, currentBalance, dailyStartBalance, targetPercent, maxDailyLossPercent, maxDrawdownPercent]);

  // Derived Metrics
  const profitTarget = initialBalance * (targetPercent / 100);
  const currentProfit = currentBalance - initialBalance;
  const progressToTarget = Math.max(0, Math.min(100, (currentProfit / profitTarget) * 100));

  const maxDrawdownLimit = initialBalance * (1 - maxDrawdownPercent / 100);
  const currentDrawdown = initialBalance - currentBalance;
  const drawdownPercentUsed = currentDrawdown > 0 ? (currentDrawdown / (initialBalance * (maxDrawdownPercent / 100))) * 100 : 0;
  
  const dailyLossLimitValue = dailyStartBalance * (1 - maxDailyLossPercent / 100);
  const currentDailyLoss = dailyStartBalance - currentBalance;
  const dailyLossPercentUsed = currentDailyLoss > 0 ? (currentDailyLoss / (dailyStartBalance * (maxDailyLossPercent / 100))) * 100 : 0;

  // Status Checks
  const isPassed = currentProfit >= profitTarget;
  const isFailedDrawdown = currentBalance <= maxDrawdownLimit;
  const isFailedDaily = currentBalance <= dailyLossLimitValue;
  const isFailed = isFailedDrawdown || isFailedDaily;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-gold-400" />
          <div>
            <h2 className="text-xl font-bold font-mono tracking-widest text-zinc-100 uppercase">Evaluation Tracker</h2>
            <p className="text-xs text-zinc-500 font-mono">Real-time institutional challenge monitoring</p>
          </div>
        </div>
        
        {isPassed && (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 font-bold font-mono text-xs uppercase flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Challenge Passed
          </div>
        )}
        
        {isFailed && (
          <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded text-rose-500 font-bold font-mono text-xs uppercase flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Rule Violation Detected
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Panel */}
        <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl">
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Tracker Setup</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Initial Balance</label>
              <input type="number" value={initialBalance} onChange={(e) => setInitialBalance(Number(e.target.value))} className="w-full bg-[#020202] border border-zinc-800 rounded px-3 py-2 text-zinc-300 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Daily Start Balance (Reset at 5PM EST)</label>
              <input type="number" value={dailyStartBalance} onChange={(e) => setDailyStartBalance(Number(e.target.value))} className="w-full bg-[#020202] border border-zinc-800 rounded px-3 py-2 text-zinc-300 font-mono text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Balance</label>
              <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(Number(e.target.value))} className="w-full bg-[#020202] border border-gold-500/30 rounded px-3 py-2 text-gold-400 font-mono text-sm" />
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800">
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Target %</label>
                <input type="number" value={targetPercent} onChange={(e) => setTargetPercent(Number(e.target.value))} className="w-full bg-[#020202] border border-zinc-800 rounded px-2 py-1.5 text-zinc-300 font-mono text-xs" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Max Daily %</label>
                <input type="number" value={maxDailyLossPercent} onChange={(e) => setMaxDailyLossPercent(Number(e.target.value))} className="w-full bg-[#020202] border border-zinc-800 rounded px-2 py-1.5 text-zinc-300 font-mono text-xs" />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Max DD %</label>
                <input type="number" value={maxDrawdownPercent} onChange={(e) => setMaxDrawdownPercent(Number(e.target.value))} className="w-full bg-[#020202] border border-zinc-800 rounded px-2 py-1.5 text-zinc-300 font-mono text-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bars Panel */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Target Progress */}
          <div className="p-6 bg-[#050505] border border-zinc-900 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Profit Target Progress</h4>
                <div className="text-2xl font-mono font-bold text-gold-400">
                  ${currentProfit.toLocaleString()} <span className="text-sm text-zinc-600">/ ${profitTarget.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-sm font-mono font-bold text-gold-500">{progressToTarget.toFixed(1)}%</div>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-1000" style={{ width: `${progressToTarget}%` }} />
            </div>
          </div>

          {/* Daily Loss Limit */}
          <div className={`p-6 bg-[#050505] border ${isFailedDaily ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-zinc-900'} rounded-xl`}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Daily Loss Allowance</h4>
                <div className="text-2xl font-mono font-bold text-zinc-200">
                  ${Math.max(0, currentBalance - dailyLossLimitValue).toLocaleString()} <span className="text-sm text-zinc-600">Remaining</span>
                </div>
              </div>
              <div className={`text-sm font-mono font-bold ${dailyLossPercentUsed > 80 ? 'text-rose-500' : 'text-zinc-500'}`}>
                {dailyLossPercentUsed.toFixed(1)}% Utilized
              </div>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${dailyLossPercentUsed > 80 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, dailyLossPercentUsed)}%` }} />
            </div>
            {isFailedDaily && <p className="text-xs text-rose-500 mt-3 font-mono">HARD BREACH: Daily loss limit exceeded.</p>}
          </div>

          {/* Max Drawdown Limit */}
          <div className={`p-6 bg-[#050505] border ${isFailedDrawdown ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-zinc-900'} rounded-xl`}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Max Drawdown Allowance</h4>
                <div className="text-2xl font-mono font-bold text-zinc-200">
                  ${Math.max(0, currentBalance - maxDrawdownLimit).toLocaleString()} <span className="text-sm text-zinc-600">Remaining</span>
                </div>
              </div>
              <div className={`text-sm font-mono font-bold ${drawdownPercentUsed > 80 ? 'text-rose-500' : 'text-zinc-500'}`}>
                {drawdownPercentUsed.toFixed(1)}% Utilized
              </div>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${drawdownPercentUsed > 80 ? 'bg-rose-500' : 'bg-rose-900'}`} style={{ width: `${Math.min(100, drawdownPercentUsed)}%` }} />
            </div>
            {isFailedDrawdown && <p className="text-xs text-rose-500 mt-3 font-mono">HARD BREACH: Maximum drawdown exceeded.</p>}
          </div>

        </div>
      </div>
    </div>
  );
};
