import React, { useState, useEffect, useMemo } from 'react';
import { Target, AlertTriangle, CheckCircle, Flame, LineChart as LineChartIcon, ArrowUpRight, Scale, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

export const FundedTracker = () => {
  const [initialBalance, setInitialBalance] = useState<number>(100000);
  const [currentBalance, setCurrentBalance] = useState<number>(100000);
  const [dailyStartBalance, setDailyStartBalance] = useState<number>(100000);
  const [balanceHistory, setBalanceHistory] = useState<{ day: number, balance: number }[]>([{ day: 1, balance: 100000 }]);
  const [newEodBalance, setNewEodBalance] = useState<string>('');
  
  // Evaluation Rules
  const [targetPercent, setTargetPercent] = useState<number>(8);
  const [maxDailyLossPercent, setMaxDailyLossPercent] = useState<number>(5);
  const [maxDrawdownPercent, setMaxDrawdownPercent] = useState<number>(10);
  const [consistencyRulePercent, setConsistencyRulePercent] = useState<number>(50); // Max % one day can contribute

  // Persistence
  useEffect(() => {
    const stored = localStorage.getItem('ee_funded_tracker_v2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setInitialBalance(parsed.initialBalance || 100000);
        setCurrentBalance(parsed.currentBalance || 100000);
        setDailyStartBalance(parsed.dailyStartBalance || 100000);
        setTargetPercent(parsed.targetPercent || 8);
        setMaxDailyLossPercent(parsed.maxDailyLossPercent || 5);
        setMaxDrawdownPercent(parsed.maxDrawdownPercent || 10);
        setConsistencyRulePercent(parsed.consistencyRulePercent || 50);
        setBalanceHistory(parsed.balanceHistory || [{ day: 1, balance: parsed.initialBalance || 100000 }]);
      } catch (e) {
        console.error('Failed to parse tracker settings');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ee_funded_tracker_v2', JSON.stringify({
      initialBalance, currentBalance, dailyStartBalance, targetPercent, maxDailyLossPercent, maxDrawdownPercent, consistencyRulePercent, balanceHistory
    }));
  }, [initialBalance, currentBalance, dailyStartBalance, targetPercent, maxDailyLossPercent, maxDrawdownPercent, consistencyRulePercent, balanceHistory]);

  const handleAddEndOfDay = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = Number(newEodBalance);
    if (balance > 0) {
      setBalanceHistory([...balanceHistory, { day: balanceHistory.length + 1, balance }]);
      setCurrentBalance(balance);
      setDailyStartBalance(balance); // EOD balance becomes tomorrow's start
      setNewEodBalance('');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the challenge history?')) {
      setBalanceHistory([{ day: 1, balance: initialBalance }]);
      setCurrentBalance(initialBalance);
      setDailyStartBalance(initialBalance);
    }
  };

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

  // Consistency Math
  const bestDayProfit = useMemo(() => {
    let maxProfit = 0;
    for (let i = 1; i < balanceHistory.length; i++) {
      const dailyPnL = balanceHistory[i].balance - balanceHistory[i-1].balance;
      if (dailyPnL > maxProfit) maxProfit = dailyPnL;
    }
    // Also check current day intraday profit
    const intradayPnL = currentBalance - dailyStartBalance;
    if (intradayPnL > maxProfit) maxProfit = intradayPnL;
    return maxProfit;
  }, [balanceHistory, currentBalance, dailyStartBalance]);

  const bestDayContribution = currentProfit > 0 ? (bestDayProfit / currentProfit) * 100 : 0;
  const isFailedConsistency = currentProfit > 0 && bestDayContribution > consistencyRulePercent;

  // Status Checks
  const isFailedDrawdown = currentBalance <= maxDrawdownLimit;
  const isFailedDaily = currentBalance <= dailyLossLimitValue;
  const isFailed = isFailedDrawdown || isFailedDaily;
  const isPassed = currentProfit >= profitTarget && !isFailed && !isFailedConsistency;

  // Chart Data
  const chartData = useMemo(() => {
    const data = balanceHistory.map((h) => ({
      day: `Day ${h.day}`,
      equity: h.balance,
      maxDD: maxDrawdownLimit,
      dailyDD: h.day === balanceHistory.length ? dailyLossLimitValue : null // Only show daily DD for current day in chart?
    }));
    // Append current intra-day balance if it differs from the last logged EOD
    if (balanceHistory.length > 0 && currentBalance !== balanceHistory[balanceHistory.length - 1].balance) {
       data.push({
         day: 'Now',
         equity: currentBalance,
         maxDD: maxDrawdownLimit,
         dailyDD: dailyLossLimitValue
       });
    }
    return data;
  }, [balanceHistory, currentBalance, maxDrawdownLimit, dailyLossLimitValue]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-gold-400" />
          <div>
            <h2 className="text-xl font-bold font-mono tracking-widest text-zinc-100 uppercase">Evaluation Tracker</h2>
            <p className="text-xs text-zinc-500 font-mono">Institutional scaling & metrics verification</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isPassed && (
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 font-bold font-mono text-xs uppercase flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Allocation Approved
            </div>
          )}
          
          {isFailed && (
            <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded text-rose-500 font-bold font-mono text-xs uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Breach Detected
            </div>
          )}
          <button onClick={handleReset} className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded text-xs font-mono uppercase tracking-widest border border-zinc-800 transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Main Chart Row */}
      <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl relative overflow-hidden h-[300px] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
         <div className="flex items-center justify-between mb-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Equity Curve vs Thresholds</h3>
            <div className="flex gap-4 text-[9px] font-mono tracking-widest uppercase">
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gold-400"></div> Equity</span>
               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500/50"></div> Max DD</span>
            </div>
         </div>
         <div className="w-full h-[calc(100%-30px)]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cc9b33" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#cc9b33" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                <XAxis dataKey="day" stroke="#3f3f46" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} stroke="#3f3f46" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val/1000)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px' }}
                  itemStyle={{ color: '#cc9b33' }}
                />
                <ReferenceLine y={initialBalance} stroke="#52525b" strokeDasharray="3 3" />
                <ReferenceLine y={profitTarget + initialBalance} stroke="#34d399" strokeDasharray="3 3" opacity={0.5} />
                <Area type="monotone" dataKey="maxDD" stroke="#f43f5e" strokeWidth={1} strokeDasharray="4 4" fill="transparent" />
                <Area type="monotone" dataKey="equity" stroke="#cc9b33" strokeWidth={2} fillOpacity={1} fill="url(#equityGrad)" />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Settings Panel (Col 3) */}
        <div className="lg:col-span-3 p-6 bg-[#020202] border border-zinc-900 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-800 pb-2">Tracker Setup</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Init. Balance</label>
                <input type="number" value={initialBalance} onChange={(e) => setInitialBalance(Number(e.target.value))} className="w-full bg-[#050505] border border-zinc-800 focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 rounded px-3 py-2 text-zinc-300 font-mono text-xs transition-all outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Intraday Balance</label>
                <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(Number(e.target.value))} className="w-full bg-[#050505] border border-gold-500/30 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 rounded px-3 py-2 text-gold-400 font-mono text-xs transition-all outline-none shadow-[0_0_10px_rgba(204,155,51,0.05)]" />
              </div>
              <form onSubmit={handleAddEndOfDay} className="pt-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Log EOD Balance</label>
                <div className="flex gap-2">
                  <input type="number" value={newEodBalance} onChange={(e) => setNewEodBalance(e.target.value)} placeholder="End of day..." className="w-full bg-[#050505] border border-zinc-800 focus:border-zinc-500 rounded px-3 py-2 text-zinc-300 font-mono text-xs transition-all outline-none" />
                  <button type="submit" className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 rounded font-bold transition-colors">+</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Core Metrics (Col 6) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Target Progress */}
          <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-full w-1 bg-gold-500/50 group-hover:bg-gold-400 transition-colors" />
            <div className="flex justify-between items-end mb-3 ml-2">
              <div>
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Profit Target <span className="text-zinc-700 ml-1">({targetPercent}%)</span></h4>
                <div className="text-2xl font-mono font-bold text-gold-400">
                  ${currentProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-sm text-zinc-600">/ ${profitTarget.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
              <div className="text-sm font-mono font-bold text-gold-500 bg-gold-500/10 px-2 py-0.5 rounded">{progressToTarget.toFixed(1)}%</div>
            </div>
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden ml-2">
              <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(204,155,51,0.5)]" style={{ width: `${progressToTarget}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Daily Loss Limit */}
            <div className={`p-5 bg-[#020202] border ${isFailedDaily ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-zinc-900'} rounded-xl`}>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 truncate">Daily Loss <span className="text-zinc-700">({maxDailyLossPercent}%)</span></h4>
                  <div className="text-lg font-mono font-bold text-zinc-200">
                    ${Math.max(0, currentBalance - dailyLossLimitValue).toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-[10px] text-zinc-600">Left</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full transition-all duration-1000 ${dailyLossPercentUsed > 80 ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'bg-zinc-500'}`} style={{ width: `${Math.min(100, dailyLossPercentUsed)}%` }} />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase">
                <span>Used: {dailyLossPercentUsed.toFixed(1)}%</span>
                <span className="text-zinc-500">Base: ${(dailyStartBalance/1000).toFixed(1)}k</span>
              </div>
            </div>

            {/* Max Drawdown Limit */}
            <div className={`p-5 bg-[#020202] border ${isFailedDrawdown ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-zinc-900'} rounded-xl`}>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 truncate">Max Drawdown <span className="text-zinc-700">({maxDrawdownPercent}%)</span></h4>
                  <div className="text-lg font-mono font-bold text-zinc-200">
                    ${Math.max(0, currentBalance - maxDrawdownLimit).toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-[10px] text-zinc-600">Left</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mb-2">
                <div className={`h-full rounded-full transition-all duration-1000 ${drawdownPercentUsed > 80 ? 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]' : 'bg-zinc-500'}`} style={{ width: `${Math.min(100, drawdownPercentUsed)}%` }} />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase">
                <span>Used: {drawdownPercentUsed.toFixed(1)}%</span>
                <span className="text-zinc-500">Floor: ${(maxDrawdownLimit/1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>

        </div>

        {/* Projections & Consistency (Col 3) */}
        <div className="lg:col-span-3 space-y-4">
          
          <div className={`p-5 bg-[#020202] border ${isFailedConsistency ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-zinc-900'} rounded-xl relative overflow-hidden`}>
             <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
               <Activity className="w-3.5 h-3.5" /> Consistency Rule
             </h3>
             <div className="mb-2">
               <span className="block text-[9px] font-mono text-zinc-600 uppercase mb-1">Best Day / Total Profit</span>
               <div className="flex items-end gap-2">
                 <span className="text-xl font-mono font-bold text-zinc-100">{bestDayContribution.toFixed(1)}%</span>
                 <span className="text-xs font-mono text-zinc-600 mb-0.5">/ {consistencyRulePercent}% Limit</span>
               </div>
             </div>
             <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
               <div className={`h-full rounded-full transition-all duration-1000 ${isFailedConsistency ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (bestDayContribution/consistencyRulePercent)*100)}%` }} />
             </div>
             {isFailedConsistency && <p className="text-[9px] text-amber-500 mt-2 font-mono uppercase tracking-widest">Soft Breach: One day exceeds 50% of total profits.</p>}
          </div>

          <div className="p-5 bg-gradient-to-br from-emerald-950/20 to-transparent border border-emerald-500/20 rounded-xl relative overflow-hidden group">
             <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-[20px] group-hover:bg-emerald-500/20 transition-all" />
             <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 relative z-10">
               <Scale className="w-3.5 h-3.5" /> Scaling Plan (Phase 2)
             </h3>
             <div className="relative z-10">
               <span className="block text-[9px] font-mono text-zinc-500 uppercase mb-1">Projected Allocation</span>
               <div className="text-2xl font-mono font-bold text-emerald-400 mb-2">
                 ${(initialBalance * 1.25).toLocaleString()}
               </div>
               <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider leading-relaxed">
                 Pass the evaluation with {targetPercent}% profit and maintain consistency to unlock the next funding tier.
               </p>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
