'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Star, 
  Terminal, 
  TrendingUp, 
  Layers, 
  Globe, 
  Clock, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  TrendingDown,
  Users,
  DollarSign,
  Sliders,
  Download,
  ShoppingBag,
  Calculator,
  BookOpen,
  Table,
  LineChart as LucideLineChart,
  Cpu,
  FileText,
  Check,
  Sparkles,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Cell } from 'recharts';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

// Seeded equity curve chart data
const equityData = [
  { day: 'Mon', equity: 1000000 },
  { day: 'Tue', equity: 1024000 },
  { day: 'Wed', equity: 1018000 },
  { day: 'Thu', equity: 1045000 },
  { day: 'Fri', equity: 1084910 }
];

// Seeded dashboard preview performance data
const dashboardPerformanceData = [
  { time: '09:00', profit: 12000, drawdown: 500, tradeCount: 4 },
  { time: '10:00', profit: 24500, drawdown: 800, tradeCount: 8 },
  { time: '11:00', profit: 19800, drawdown: 1200, tradeCount: 12 },
  { time: '12:00', profit: 41200, drawdown: 900, tradeCount: 15 },
  { time: '13:00', profit: 58000, drawdown: 1600, tradeCount: 22 },
  { time: '14:00', profit: 74200, drawdown: 1100, tradeCount: 29 },
  { time: '15:00', profit: 91800, drawdown: 1400, tradeCount: 35 },
  { time: '16:00', profit: 108420, drawdown: 800, tradeCount: 42 }
];

// High-density Bloomberg terminal Price & Volume simulated data
const terminalChartData = [
  { time: '09:30', price: 95120, ema9: 95080, ema21: 95020, volume: 145, volColor: '#00E676' },
  { time: '09:45', price: 95240, ema9: 95140, ema21: 95060, volume: 210, volColor: '#00E676' },
  { time: '10:00', price: 95180, ema9: 95160, ema21: 95090, volume: 185, volColor: '#FF1744' },
  { time: '10:15', price: 95360, ema9: 95220, ema21: 95140, volume: 320, volColor: '#00E676' },
  { time: '10:30', price: 95480, ema9: 95310, ema21: 95200, volume: 410, volColor: '#00E676' },
  { time: '10:45', price: 95410, ema9: 95340, ema21: 95250, volume: 290, volColor: '#FF1744' },
  { time: '11:00', price: 95550, ema9: 95410, ema21: 95310, volume: 350, volColor: '#00E676' },
  { time: '11:15', price: 95680, ema9: 95500, ema21: 95380, volume: 480, volColor: '#00E676' },
  { time: '11:30', price: 95620, ema9: 95540, ema21: 95430, volume: 220, volColor: '#FF1744' },
  { time: '11:45', price: 95500, ema9: 95530, ema21: 95450, volume: 310, volColor: '#FF1744' },
  { time: '12:00', price: 95720, ema9: 95590, ema21: 95500, volume: 540, volColor: '#00E676' }
];

// Seeded sparkline equity curve for the hero account balance card
const sparklineData = [
  { val: 124000 },
  { val: 124500 },
  { val: 123800 },
  { val: 125100 },
  { val: 124900 },
  { val: 125430 }
];

// Seeded vertical payouts chart data (in millions)
const MoMPayoutsData = [
  { month: 'JAN', amount: 4.2 },
  { month: 'FEB', amount: 5.2 },
  { month: 'MAR', amount: 6.0 },
  { month: 'APR', amount: 6.8 },
  { month: 'MAY', amount: 8.0 },
  { month: 'JUN', amount: 8.9 }
];


export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 bg-[#050505] text-zinc-100 flex flex-col relative overflow-hidden font-sans select-none min-h-screen">
      
      {/* Cinematic atmospheric backlights & structural grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.035),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(181,131,32,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(181,131,32,0.012)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none opacity-40" />

      {/* Atmospheric blurred mists */}
      <div className="absolute top-[-100px] left-[5%] w-[600px] h-[600px] bg-gold-950/10 rounded-full blur-[200px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gold-950/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[20%] w-[600px] h-[600px] bg-gold-950/5 rounded-full blur-[180px] pointer-events-none" />

      {/* HEADER NAVIGATION */}
      <PublicNavbar />

      {/* THREE-COLUMN CINEMATIC HERO SECTION WITH CENTRAL BULL OVERLAY */}
      <main className="flex-1 w-full py-10 md:py-16 lg:py-20 relative z-20 overflow-hidden">
        
        {/* Layered scans & grid backgrounds overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-[1512px] w-full mx-auto px-6 md:px-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
            
            {/* LEFT COLUMN: BRAND VALUE PROPOSITION (lg:col-span-5) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6 flex flex-col justify-center text-left relative z-25"
            >
              {/* Bold, Cinematic Prop Firm Headings */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-display font-extrabold tracking-wider uppercase leading-[0.95] text-zinc-100 select-none">
                  WE DON'T FOLLOW <br />
                  THE MARKET. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 drop-shadow-[0_0_25px_rgba(212,175,55,0.3)] block mt-2">
                    WE COMMAND IT.
                  </span>
                </h1>
                
                <p className="max-w-md text-[11px] text-zinc-400 leading-relaxed font-mono">
                  EVILELITE is a next-generation proprietary trading firm built for disciplined traders who think different. Scale allocations and execute contracts with precision.
                </p>
              </div>

              {/* Dual Actions CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm">
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-1.5 glow-gold text-[10px] font-mono tracking-widest uppercase cursor-pointer"
                >
                  GET FUNDED NOW <span className="font-sans font-black">→</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#050505] border border-zinc-800 hover:border-gold-500/35 text-zinc-300 hover:text-gold-400 font-bold rounded-sm transition-all duration-300 flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-widest uppercase cursor-pointer"
                >
                  JOIN EVILELITE <span className="font-sans font-light">↗</span>
                </button>
              </div>

              {/* Social Proof Profiles */}
              <div className="flex items-center gap-3 pt-3 border-t border-zinc-900/60 max-w-sm">
                <div className="flex -space-x-2.5 overflow-hidden">
                  {[
                    { name: 'TR', color: 'from-gold-800 to-gold-600' },
                    { name: 'LD', color: 'from-zinc-800 to-zinc-700' },
                    { name: 'EE', color: 'from-gold-900 to-gold-750' },
                    { name: 'WK', color: 'from-zinc-900 to-zinc-800' }
                  ].map((av, avIdx) => (
                    <div key={avIdx} className={`w-6 h-6 rounded-full bg-gradient-to-r ${av.color} border border-zinc-950 flex items-center justify-center text-[7px] font-bold text-zinc-300 font-mono`}>
                      {av.name}
                    </div>
                  ))}
                </div>
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider">
                  Trusted by <strong className="text-gold-400 font-bold">2,500+</strong> elite traders worldwide
                </span>
              </div>
            </motion.div>

            {/* MIDDLE COLUMN: OVERLAYING 3D CHARGING BLACK BULL CENTERPIECE (lg:col-span-3) */}
            <div className="absolute left-[45%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] lg:max-w-[500px] h-auto pointer-events-none opacity-85 z-10 select-none hover:scale-[1.02] transition-transform duration-700">
              <img 
                src="/trading_bull.png" 
                alt="Charging bull centerpiece"
                className="w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.15)] filter brightness-95 mix-blend-screen" 
                style={{
                  maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
                }}
              />
            </div>

            {/* RIGHT COLUMN: ACCOUNT BALANCE & METRICS CARD (lg:col-span-4 lg:col-start-9) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4 lg:col-start-9 z-25 flex justify-end"
            >
              <div className="w-full max-w-sm bg-[#0B0B0B] border border-zinc-800 rounded-sm p-4 relative overflow-hidden space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-t-[2px] border-t-gold-500/60 font-mono text-[9px]">
                
                <div className="space-y-1">
                  <span className="text-[7.5px] text-zinc-500 tracking-widest uppercase font-bold">ACCOUNT BALANCE</span>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold font-mono text-zinc-100">$125,430.50</span>
                    
                    {/* Small green profit delta */}
                    <div className="flex items-center gap-1">
                      <span className="text-[8.5px] text-emerald-400 font-bold font-mono">+$2,350.75</span>
                      <span className="px-1 py-0.2 rounded-[1px] bg-emerald-950/30 text-emerald-400 border border-emerald-500/10 text-[7px] font-bold">+2.15%</span>
                    </div>
                  </div>
                </div>

                {/* Sparkline Curve */}
                <div className="h-10 w-full pt-1 relative">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineData}>
                        <Line type="monotone" dataKey="val" stroke="#D4AF37" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Param split indicators */}
                <div className="grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-3 text-left">
                  <div>
                    <span className="text-[6.5px] text-zinc-500 block uppercase font-bold mb-0.5">EQUITY</span>
                    <span className="text-[9.5px] font-bold text-zinc-300">$128,980.20</span>
                  </div>
                  <div>
                    <span className="text-[6.5px] text-zinc-500 block uppercase font-bold mb-0.5">PROFIT SPLIT</span>
                    <span className="text-[9.5px] font-bold text-gold-400">90%</span>
                  </div>
                  <div>
                    <span className="text-[6.5px] text-zinc-500 block uppercase font-bold mb-0.5">DRAWDOWN</span>
                    <span className="text-[9.5px] font-bold text-rose-500">4.32%</span>
                  </div>
                </div>

                {/* Big Action View Dashboard CTA */}
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-sm transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-[8.5px] cursor-pointer glow-gold"
                >
                  VIEW DASHBOARD <span className="font-sans font-black">→</span>
                </button>

              </div>
            </motion.div>

          </div>
        </div>
      </main>

      {/* TRUSTED BY TOP TRADERS INTEGRATION RIBBON */}
      <section className="w-full border-y border-zinc-900 bg-zinc-950/20 py-3.5 z-20 relative select-none font-mono text-[8px] tracking-widest text-zinc-500">
        <div className="max-w-[1512px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold text-zinc-400">TRUSTED BY TOP TRADERS</span>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 opacity-45 hover:opacity-75 transition-opacity duration-300">
            {/* Custom stylized inline vector logos */}
            <span className="flex items-center gap-1.5 font-bold hover:text-gold-400 transition-colors">
              <span className="text-zinc-300">//</span> TRADINGVIEW
            </span>
            <span className="flex items-center gap-1.5 font-bold hover:text-gold-400 transition-colors">
              <span className="text-zinc-300">MT5</span> METATRADER 5
            </span>
            <span className="flex items-center gap-1.5 font-bold hover:text-gold-400 transition-colors">
              <span className="text-zinc-300">[M]</span> MATCH-TRADER
            </span>
            <span className="flex items-center gap-1.5 font-bold hover:text-gold-400 transition-colors">
              <span className="text-zinc-300">&Delta;</span> DXFEED
            </span>
            <span className="flex items-center gap-1.5 font-bold hover:text-gold-400 transition-colors">
              <span className="text-zinc-300">#</span> FINVIZ.COM
            </span>
            <span className="flex items-center gap-1.5 font-bold hover:text-gold-400 transition-colors">
              <span className="text-zinc-300">C</span> CTRADER
            </span>
          </div>
        </div>
      </section>

      {/* 5-COLUMN HIGH-PERFORMANCE PROGRAM CHALLENGE GRID */}
      <section className="bg-[#050505] py-12 md:py-16 z-20 relative w-full border-b border-zinc-900/60 overflow-hidden font-mono">
        <div className="max-w-[1512px] mx-auto px-6 md:px-12 space-y-8">
          
          {/* Responsive 5-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Card 1: OUR PROGRAMS */}
            <div className="border border-zinc-800 bg-[#0B0B0B] p-3 rounded-sm relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-gold-500/25 transition-all">
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full shrink-0" />
                  <span className="text-[8.5px] font-bold text-zinc-200 uppercase">EVALUATION PATHS</span>
                </div>
                <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">
                  Select an evaluation path. Prove your edge. Scale institutional capital.
                </p>
              </div>

              {/* Challenge paths grid */}
              <div className="space-y-1 font-mono relative z-10">
                {[
                  { name: '1-STEP CHALLENGE', path: '/pricing' },
                  { name: '2-STEP CHALLENGE', path: '/pricing' },
                  { name: 'INSTANT FUNDING', path: '/pricing' },
                  { name: 'XAUUSD SPECIAL', path: '/pricing' }
                ].map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => router.push(item.path)}
                    className="w-full text-left p-2 bg-[#111111] hover:bg-[#171717] border border-zinc-800 hover:border-gold-500/20 text-zinc-300 hover:text-gold-400 text-[8px] rounded-[1px] font-bold transition-all flex justify-between items-center cursor-pointer select-none"
                  >
                    <span>{item.name}</span>
                    <span className="font-sans text-[9px] font-black">→</span>
                  </button>
                ))}
              </div>

              <Link href="/dashboard" className="text-[8px] text-gold-400 hover:text-gold-300 font-bold uppercase tracking-wider block mt-2 text-left relative z-10">
                VIEW ALL PROGRAMS →
              </Link>

              {/* Bull watermark peeking out */}
              <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 opacity-[0.035] pointer-events-none select-none">
                <img src="/trading_bull.png" alt="watermark" className="w-full h-full object-contain" style={{ maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)' }} />
              </div>
            </div>

            {/* Card 2: WHY EVILELITE? */}
            <div className="border border-zinc-800 bg-[#0B0B0B] p-3 rounded-sm flex flex-col justify-between space-y-4 hover:border-gold-500/25 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full shrink-0" />
                  <span className="text-[8.5px] font-bold text-zinc-200 uppercase">WHY EVILELITE?</span>
                </div>
                <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">
                  The elite infrastructure built specifically for precision execution.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-1.5 font-mono text-[8px] text-zinc-400">
                {[
                  'Up to 90% Profit Split',
                  'Bi-Weekly Payouts',
                  'No Time Limits',
                  'Low Drawdown Limits',
                  'News Trading Allowed',
                  'World-Class Support Node'
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-gold-400 font-bold font-sans">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="/dashboard" className="text-[8px] text-gold-400 hover:text-gold-300 font-bold uppercase tracking-wider block mt-2 text-left">
                LEARN MORE →
              </Link>
            </div>

            {/* Card 3: PAYOUTS */}
            <div className="border border-zinc-800 bg-[#0B0B0B] p-3 rounded-sm flex flex-col justify-between space-y-4 hover:border-gold-500/25 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full shrink-0" />
                  <span className="text-[8.5px] font-bold text-zinc-200 uppercase">PAYOUTS SPEED</span>
                </div>
                
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-zinc-100 font-mono">$8,934,025+</div>
                  <div className="text-[6.5px] text-zinc-500 uppercase">Total Payouts To Our Traders</div>
                </div>
              </div>

              {/* MoM Mini Payouts BarChart */}
              <div className="h-[75px] w-full pt-1">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MoMPayoutsData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                      <XAxis dataKey="month" stroke="#555" fontSize={6} fontFamily="monospace" tickLine={false} />
                      <Bar dataKey="amount" fill="#D4AF37">
                        {MoMPayoutsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#D4AF37" opacity={0.6 + (index * 0.08)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <Link href="/dashboard" className="text-[8px] text-gold-400 hover:text-gold-300 font-bold uppercase tracking-wider block mt-2 text-left">
                SEE ALL PAYOUTS →
              </Link>
            </div>

            {/* Card 4: LIVE TRADING ACCRUALS */}
            <div className="border border-zinc-800 bg-[#0B0B0B] p-3 rounded-sm flex flex-col justify-between space-y-4 hover:border-gold-500/25 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse rounded-full shrink-0" />
                  <span className="text-[8.5px] font-bold text-zinc-200 uppercase">LIVE TRADING FEED</span>
                </div>
                <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">
                  Real-time allocations sweep and market orders clear.
                </p>
              </div>

              {/* Live ticks ladder */}
              <div className="space-y-1 font-mono text-[8px]">
                {[
                  { sym: 'XAUUSD', action: 'BUY', val: '+$1,250.75' },
                  { sym: 'GBPUSD', action: 'BUY', val: '+$980.50' },
                  { sym: 'NAS100', action: 'SELL', val: '+$750.20' },
                  { sym: 'US30', action: 'BUY', val: '+$620.15' },
                  { sym: 'EURUSD', action: 'BUY', val: '+$540.10' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-1 bg-[#111111] rounded-[1px] border border-zinc-800/60 leading-none">
                    <span className="text-zinc-400 font-bold">{item.sym}</span>
                    <span className="text-emerald-400 font-bold px-1 rounded-[1px] text-[6.5px]">{item.action}</span>
                    <span className="text-emerald-400 font-black">{item.val}</span>
                  </div>
                ))}
              </div>

              <Link href="/dashboard" className="text-[8px] text-gold-400 hover:text-gold-300 font-bold uppercase tracking-wider block mt-2 text-left">
                WATCH LIVE FEED →
              </Link>
            </div>

            {/* Card 5: THE EVILELITE EDGE */}
            <div className="border border-zinc-800 bg-[#0B0B0B] p-3 rounded-sm flex flex-col justify-between space-y-4 hover:border-gold-500/25 transition-all">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full shrink-0" />
                  <span className="text-[8.5px] font-bold text-zinc-200 uppercase">EVILELITE EDGE</span>
                </div>
                <p className="text-[9px] text-zinc-500 leading-relaxed font-sans">
                  We do not sell dreams. We provide infrastructure for disciplined operators.
                </p>
              </div>

              {/* Glowing vector dots world map */}
              <div className="h-[75px] w-full flex items-center justify-center relative bg-[#111111]/30 rounded-sm border border-zinc-800/40">
                <svg viewBox="0 0 100 50" className="w-full h-full text-gold-500 opacity-60">
                  {/* Abstract world map outline using points */}
                  <circle cx="20" cy="15" r="1.2" className="fill-gold-500 animate-pulse" />
                  <circle cx="35" cy="25" r="1" className="fill-gold-500" />
                  <circle cx="50" cy="18" r="1.5" className="fill-gold-500 animate-pulse" />
                  <circle cx="65" cy="28" r="1" className="fill-gold-500" />
                  <circle cx="80" cy="20" r="1.3" className="fill-gold-500 animate-pulse" />
                  {/* Grid connecting lines */}
                  <line x1="20" y1="15" x2="35" y2="25" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
                  <line x1="35" y1="25" x2="50" y2="18" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
                  <line x1="50" y1="18" x2="65" y2="28" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
                  <line x1="65" y1="28" x2="80" y2="20" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
                </svg>
              </div>

              <Link href="/dashboard" className="text-[8px] text-gold-400 hover:text-gold-300 font-bold uppercase tracking-wider block mt-2 text-left">
                JOIN THE MOVEMENT →
              </Link>
            </div>

          </div>

          {/* BASE QUOTES & STATS BAR */}
          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left side Quote */}
            <div className="p-3 bg-[#0B0B0B] border border-zinc-800/80 rounded-sm max-w-sm flex items-center gap-3">
              <span className="text-2xl text-gold-500 font-sans font-black select-none leading-none">“</span>
              <p className="text-[9.5px] italic text-gold-400 leading-normal font-sans">
                Emotion is the enemy of execution. Strict mechanics generate absolute alpha. <br />
                This is EVILELITE.
              </p>
            </div>

            {/* Center Monogram Shield Logo & Brand name */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="EvilElite Trading Logo" className="h-10 w-auto object-contain drop-shadow-md" />
              <div className="flex flex-col text-left">
                <span className="font-display font-extrabold tracking-[0.25em] text-[10px] text-zinc-100 uppercase leading-none">EVILELITE</span>
                <span className="text-[6.5px] font-mono tracking-[0.4em] text-gold-400 uppercase font-black pl-0.5 mt-0.5 leading-none">TRADING</span>
              </div>
            </div>

            {/* Right side Monospaced Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center md:text-right font-mono text-[9px] tracking-wider">
              <div className="p-1.5">
                <span className="text-zinc-100 font-bold block text-sm leading-none mb-1">2.5K+</span>
                <span className="text-[6.5px] text-zinc-500 uppercase block leading-none">Funded Traders</span>
              </div>
              <div className="p-1.5">
                <span className="text-gold-400 font-bold block text-sm leading-none mb-1">90%</span>
                <span className="text-[6.5px] text-zinc-500 uppercase block leading-none">Profit Split</span>
              </div>
              <div className="p-1.5">
                <span className="text-zinc-100 font-bold block text-sm leading-none mb-1">50+</span>
                <span className="text-[6.5px] text-zinc-500 uppercase block leading-none">Countries</span>
              </div>
              <div className="p-1.5">
                <span className="text-gold-400 font-bold block text-sm leading-none mb-1">24/7</span>
                <span className="text-[6.5px] text-zinc-500 uppercase block leading-none">Desks Active</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* BRAND MANIFESTO SECTION */}
      <section className="bg-[#020202] py-20 md:py-28 z-20 relative w-full border-b border-zinc-900/60 font-mono">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12 text-center space-y-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-gold-400 mb-2">
            <Lock className="w-5 h-5" />
          </div>
          
          <h2 className="text-2xl md:text-4xl font-display font-extrabold tracking-widest text-zinc-100 uppercase">
            THE OPERATOR'S MANIFESTO
          </h2>
          
          <div className="space-y-6 text-sm md:text-base text-zinc-400 leading-relaxed max-w-3xl mx-auto text-left md:text-center border-l-2 md:border-l-0 border-gold-500/30 pl-4 md:pl-0">
            <p>
              Trading is not gambling. It is not guessing. It is <strong className="text-zinc-200">data ingestion, statistical probability, and ruthless mechanical execution.</strong>
            </p>
            <p>
              The retail market is designed to extract capital from the emotional. EVILELITE was engineered to arm the disciplined. We strip away the noise and provide the elite with <strong className="text-zinc-200">institutional-grade infrastructure, high-leverage allocation pipelines, and bespoke cognitive analytics.</strong>
            </p>
            <p className="text-gold-400 font-bold tracking-wider uppercase text-xs pt-4">
              We do not reward luck. We reward mechanical superiority.
            </p>
          </div>
        </div>
      </section>

      {/* PREMIUM SaaS FEATURES SECTION */}
      <section className="bg-[#050505] py-20 md:py-28 z-20 relative w-full border-b border-zinc-900/60">
        <div className="max-w-[1512px] mx-auto px-6 md:px-12 space-y-16">
          
          {/* Header block */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/20 border border-gold-500/10 text-gold-400 text-[9px] font-mono uppercase tracking-widest block mx-auto font-bold animate-pulse">
              <Activity className="w-3.5 h-3.5 shrink-0 text-gold-400" />
              <span>Proprietary Capabilities</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-b from-zinc-50 to-zinc-400">
              OPERATIONAL SPECIFICATIONS
            </h2>
            
            <p className="text-xs text-zinc-500 leading-relaxed max-w-lg mx-auto">
              Configure, audit, and scale your prop trading allocations using our bespoke suite of institutional risk and calculation terminals.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Sliders,
                title: 'Risk Calculator',
                desc: 'Compute Isolated position sizing, margin parameters, and exact liquidation points up to 100x isolated leverage.'
              },
              {
                icon: Terminal,
                title: 'Trading Journal',
                desc: 'Log mental bias checklists, win ratios, and automatically synthesize performance indicators for review.'
              },
              {
                icon: ShieldCheck,
                title: 'Funded Tracker',
                desc: 'Track allocation curves, evaluation phases, drawdown limits, and clearance payouts from your command panel.'
              },
              {
                icon: Layers,
                title: 'Trading Templates',
                desc: 'Acquire pre-programmed PineScript v5 systems, Excel leveraged risk calculators, and Notion templates.'
              },
              {
                icon: Download,
                title: 'Instant Downloads',
                desc: 'Receive immediate clearance codes and decryption keys to instantly run guides and indicators in-house.'
              },
              {
                icon: TrendingUp,
                title: 'Advanced Analytics',
                desc: 'Compile projection indexes, monthly recurring cohorts, and advanced mathematical win-rate dashboards.'
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-[#0E0E0E]/60 border border-zinc-900/60 hover:border-gold-500/25 p-6 md:p-8 rounded-2xl relative overflow-hidden group hover:bg-[#0E0E0E]/90 transition-all duration-300 backdrop-blur-sm"
                >
                  {/* Subtle top edge highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-500/10 to-transparent group-hover:via-gold-500/35 transition-all duration-300" />
                  
                  {/* Gold Glowing Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gold-950/20 border border-gold-500/10 flex items-center justify-center text-gold-400 group-hover:text-zinc-950 group-hover:bg-gradient-to-r group-hover:from-gold-600 group-hover:to-gold-500 transition-all duration-300 mb-6 glow-gold-hover">
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-200 group-hover:text-gold-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* PREMIUM SaaS DASHBOARD PREVIEW SECTION */}
      <section className="bg-[#050505] py-10 md:py-14 z-20 relative w-full border-b border-zinc-900/60 overflow-hidden select-none">
        {/* Layered background lighting & terminal scanline overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.02),transparent_75%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.004)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none opacity-50 z-30" />
        
        <div className="max-w-[1512px] mx-auto px-6 md:px-12 space-y-6">
          
          {/* Header Block - Extremely Trader Focused */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-950/20 border border-gold-500/10 text-gold-400 text-[8.5px] font-mono uppercase tracking-widest block mx-auto font-bold animate-pulse">
              <Activity className="w-3 h-3 shrink-0 text-gold-400" />
              <span>SYS_OVERWATCH // CAPITAL_DESK // COCKPIT_NODE_04</span>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-display font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-b from-zinc-50 to-zinc-400 leading-none">
              Built For Traders Who <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600">Take Growth Seriously.</span>
            </h2>
            
            <p className="text-[11px] text-zinc-500 leading-relaxed max-w-lg mx-auto font-mono">
              Monitor active contract allocations, risk tolerances, and win indices in real time. Absolute tactical superiority over market volatility.
            </p>
          </div>

          {/* HIGH-DENSITY INSTITUTIONAL COCKPIT (BLOOMBERG TERMINAL AESTHETIC) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full bg-[#0B0B0B] border border-zinc-800 rounded-[2px] p-2 relative overflow-hidden space-y-2 shadow-[0_25px_70px_rgba(0,0,0,0.95)] border-t-[3px] border-t-gold-500/80 font-mono text-[9px]"
          >
            {/* Glass sheen overlay & monitor grid */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.012] to-transparent pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Bloomberg Style Top Header Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-1.5 border-b border-zinc-800 text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-zinc-300 font-bold uppercase tracking-wider text-[8.5px]">EVIL_ELITE // PORTFOLIO_OVERWATCH_DESK // NODE: SG_CORE_04</span>
              </div>
              <div className="flex items-center gap-3 text-[8px] uppercase tracking-widest">
                <span className="text-zinc-600">SYS_AUDIT: <strong className="text-emerald-400">PASSED</strong></span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-600">FEED_LATENCY: <strong className="text-gold-400">0.8ms</strong></span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-600">CLEARANCE: <strong className="text-gold-400">LEVEL_IV</strong></span>
              </div>
            </div>

            {/* Live Command Prompt Input Overlay */}
            <div className="bg-[#111111] border border-zinc-800 p-1 flex items-center justify-between font-mono text-[8px] text-zinc-400 gap-2 rounded-sm hover:border-gold-500/25 transition-all">
              <div className="flex items-center gap-1.5">
                <span className="text-gold-400 font-bold">&gt;</span>
                <span>DESK COMMAND PROMPT: <strong className="text-gold-400">EXECUTE ALLOCATION CHECKLIST --PORTFOLIO_ID=EE_9104 --CHECKPOINT=SECURE</strong></span>
              </div>
              <span className="text-[7.5px] bg-[#171717] px-1.5 py-0.2 border border-zinc-800 text-zinc-500 font-bold">READY</span>
            </div>

            {/* Yellow/Amber Function Key Tabs */}
            <div className="flex flex-wrap gap-1 text-[8.5px] font-bold text-zinc-400 uppercase pb-1 border-b border-zinc-800/65">
              <span className="px-2 py-0.5 bg-gold-950/20 text-gold-400 border border-gold-500/30 rounded-[2px] shadow-[0_0_8px_rgba(212,175,55,0.15)] cursor-pointer select-none">[F1] SUMM OVERWATCH</span>
              <span className="px-2 py-0.5 bg-[#111111] border border-zinc-800 hover:border-gold-500/20 hover:text-gold-400 rounded-[2px] cursor-pointer select-none transition-colors">[F2] ORDER BOOK</span>
              <span className="px-2 py-0.5 bg-[#111111] border border-zinc-800 hover:border-gold-500/20 hover:text-gold-400 rounded-[2px] cursor-pointer select-none transition-colors">[F3] RISK MATRIX</span>
              <span className="px-2 py-0.5 bg-[#111111] border border-zinc-800 hover:border-gold-500/20 hover:text-gold-400 rounded-[2px] cursor-pointer select-none transition-colors">[F4] LEDGER CAPS</span>
              <span className="px-2 py-0.5 bg-[#111111] border border-zinc-800 hover:border-gold-500/20 hover:text-gold-400 rounded-[2px] cursor-pointer select-none transition-colors">[F5] SECURE VAULT</span>
            </div>

            {/* Bloomberg Style Main Terminal Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
              
              {/* LEFT COLUMN: HIGH-DENSITY PROFESSIONAL DATA TABLE (4/12 width) */}
              <div className="lg:col-span-4 border border-zinc-800 bg-[#0B0B0B] p-2 rounded-sm flex flex-col justify-between space-y-2">
                <div className="space-y-1.5 bg-[#111111] p-1.5 rounded-sm border border-zinc-800/80">
                  <div className="flex justify-between items-center pb-1 border-b border-zinc-800 text-zinc-400">
                    <span className="font-bold tracking-wider uppercase text-[7.5px] text-gold-400">1{"<"}GO{">"} ACTIVE_ALLOCATIONS</span>
                    <span className="text-[6.5px] text-zinc-500">4 PIPELINE NODES</span>
                  </div>
                  
                  {/* High Density Professional Data Table */}
                  <div className="overflow-x-auto select-none">
                    <table className="w-full text-[8px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider">
                          <th className="py-0.5 pr-0.5">SYMBOL</th>
                          <th className="py-0.5 px-0.5">LEVERAGE</th>
                          <th className="py-0.5 px-0.5 text-right">SHARPE</th>
                          <th className="py-0.5 pl-0.5 text-right">PROFIT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50 font-mono">
                        {[
                          { sym: 'BTC-USD-PERP', leverage: '100X', sharpe: '3.82', profit: '+$42,840', profitColor: 'text-emerald-400' },
                          { sym: 'ETH-USD-PERP', leverage: '50X', sharpe: '3.14', profit: '+$18,920', profitColor: 'text-emerald-400' },
                          { sym: 'SOL-USD-PERP', leverage: '30X', sharpe: '2.92', profit: '-$2,450', profitColor: 'text-rose-400' },
                          { sym: 'AVAX-USD-PERP', leverage: '25X', sharpe: '3.08', profit: '+$6,110', profitColor: 'text-emerald-400' }
                        ].map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#171717]/60 transition-colors">
                            <td className="py-1 pr-0.5 font-bold text-zinc-200">{row.sym}</td>
                            <td className="py-1 px-0.5 font-bold"><span className="px-1 py-0.2 rounded-[1px] text-[6.5px] bg-[#171717] border border-zinc-800 text-zinc-300">{row.leverage}</span></td>
                            <td className="py-1 px-0.5 text-right text-zinc-400">{row.sharpe}</td>
                            <td className={`py-1 pl-0.5 text-right font-black ${row.profitColor}`}>{row.profit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Professional Order Book & Spread Analytics */}
                <div className="space-y-1.5 border-t border-zinc-800 pt-2 bg-[#0B0B0B]">
                  <div className="flex justify-between items-center text-[7.5px] text-zinc-400 font-bold uppercase tracking-wider pb-0.5">
                    <span>LIQUIDITY BOOK LADDER</span>
                    <span className="text-gold-400 font-bold">SPREAD: 0.12 bps</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-[8px] font-mono">
                    <div className="space-y-0.5 bg-[#111111] p-1 rounded-sm border border-zinc-800/80 relative">
                      <span className="text-zinc-500 block text-[6px] uppercase font-bold text-left mb-0.5">ASK DEPTH QUEUE (SELLS)</span>
                      {[
                        { price: '$95,502.40', size: '12.5 BTC', pct: '85%' },
                        { price: '$95,501.10', size: '8.4 BTC', pct: '50%' },
                        { price: '$95,500.50', size: '4.2 BTC', pct: '25%' }
                      ].map((ask, idx) => (
                        <div key={idx} className="relative flex justify-between px-1 py-0.2 overflow-hidden">
                          <div className="absolute right-0 top-0 bottom-0 bg-rose-950/20 pointer-events-none" style={{ width: ask.pct }} />
                          <span className="text-rose-500 font-bold relative z-10">{ask.price}</span>
                          <span className="text-zinc-400 relative z-10">{ask.size}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-0.5 bg-[#111111] p-1 rounded-sm border border-zinc-800/80 relative">
                      <span className="text-zinc-500 block text-[6px] uppercase font-bold text-left mb-0.5">BID DEPTH QUEUE (BUYS)</span>
                      {[
                        { price: '$95,498.80', size: '15.9 BTC', pct: '60%' },
                        { price: '$95,499.50', size: '19.4 BTC', pct: '78%' },
                        { price: '$95,500.00', size: '22.4 BTC', pct: '90%' }
                      ].map((bid, idx) => (
                        <div key={idx} className="relative flex justify-between px-1 py-0.2 overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 bg-emerald-950/20 pointer-events-none" style={{ width: bid.pct }} />
                          <span className="text-emerald-500 font-bold relative z-10">{bid.price}</span>
                          <span className="text-zinc-400 relative z-10">{bid.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CENTER COLUMN: REALISTIC PRICE-VOLUME CHART (5/12 width) */}
              <div className="lg:col-span-5 border border-zinc-800 bg-[#0B0B0B] p-2 rounded-sm flex flex-col justify-between space-y-2">
                <div className="flex justify-between items-center pb-1 border-b border-zinc-800 font-mono text-[8px] text-zinc-400 bg-[#111111] p-1 rounded-sm">
                  <span className="font-bold uppercase tracking-wider text-gold-400">2{"<"}GO{">"} PRICE-VOLUME TECHNICAL FEEDS</span>
                  <div className="flex items-center gap-2 text-[6.5px] font-bold text-zinc-500 uppercase">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-gold-500 rounded-full" /> Price</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live delta</span>
                  </div>
                </div>
                
                {/* Custom Candlestick & Volume Cartesian Grid Recharts */}
                <div className="h-56 w-full pt-1 relative bg-[#111111]/40 rounded-sm border border-zinc-800/60 overflow-hidden">
                  <div className="absolute top-1 left-2 text-[6px] text-zinc-600 uppercase flex gap-2 font-mono">
                    <span>INDEX: BTC/USD</span>
                    <span>INTERVAL: 15M</span>
                    <span className="text-blue-400">EMA(9)</span>
                    <span className="text-orange-400">EMA(21)</span>
                  </div>
                  
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={terminalChartData} margin={{ top: 12, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="dbProfitGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="1 1" stroke="#1C1C1E" />
                        <XAxis dataKey="time" stroke="#555" fontSize={7} fontFamily="monospace" tickLine={false} />
                        <YAxis yAxisId="price" domain={['dataMin - 100', 'dataMax + 100']} stroke="#555" fontSize={7} fontFamily="monospace" tickLine={false} orientation="left" />
                        <YAxis yAxisId="volume" domain={[0, 2000]} stroke="none" tick={false} orientation="right" />
                        <Tooltip contentStyle={{ backgroundColor: '#0B0B0B', borderColor: '#cc9b33', color: '#f4f4f5', fontFamily: 'monospace', fontSize: 8 }} />
                        <Area yAxisId="price" type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={1.5} fillOpacity={1} fill="url(#dbProfitGrad)" name="Price ($)" />
                        <Line yAxisId="price" type="monotone" dataKey="ema9" stroke="#2979FF" strokeWidth={1} dot={false} name="EMA 9" />
                        <Line yAxisId="price" type="monotone" dataKey="ema21" stroke="#FF9100" strokeWidth={1} dot={false} name="EMA 21" />
                        <Bar yAxisId="volume" dataKey="volume" name="Volume">
                          {terminalChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.volColor} opacity={0.35} />
                          ))}
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Sub-chart telemetry */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-[8px] font-mono">
                  <div className="p-1 bg-[#111111] rounded-sm border border-zinc-800">
                    <span className="text-zinc-500 block text-[5.5px] uppercase font-bold text-left">PROFIT ACCRUALS</span>
                    <span className="text-emerald-400 font-bold">+$108,420.00</span>
                  </div>
                  <div className="p-1 bg-[#111111] rounded-sm border border-zinc-800">
                    <span className="text-zinc-500 block text-[5.5px] uppercase font-bold text-left">CAPITAL MARGIN</span>
                    <span className="text-zinc-100 font-bold">384.2% (SAFE)</span>
                  </div>
                  <div className="p-1 bg-[#111111] rounded-sm border border-zinc-800">
                    <span className="text-zinc-500 block text-[5.5px] uppercase font-bold text-left">CLEARED DISBURSE</span>
                    <span className="text-gold-400 font-bold">+$83,920.45</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PERFORMANCE ANALYTICS, DRAWDOWN & PROGRESS VAULT */}
              <div className="lg:col-span-3 border border-zinc-800 bg-[#0B0B0B] p-2 rounded-sm flex flex-col justify-between space-y-2 font-mono">
                
                {/* Win-Rate & Performance Analytics */}
                <div className="bg-[#111111] p-2 rounded-sm border border-zinc-800/80 space-y-1.5">
                  <div className="flex justify-between items-center text-zinc-400 text-[8px] font-bold uppercase tracking-wider">
                    <span className="text-gold-400 font-bold">3{"<"}GO{">"} DESK PERFORMANCE</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-[8px]">
                    <div className="bg-[#171717] p-1 rounded-sm border border-zinc-800/60">
                      <span className="text-zinc-500 block text-[5.5px] uppercase font-bold">WIN RATE</span>
                      <span className="text-emerald-400 font-black text-[11px]">73.8%</span>
                    </div>
                    <div className="bg-[#171717] p-1 rounded-sm border border-zinc-800/60">
                      <span className="text-zinc-500 block text-[5.5px] uppercase font-bold">PROFIT FACTOR</span>
                      <span className="text-gold-400 font-black text-[11px]">2.84</span>
                    </div>
                    <div className="bg-[#171717] p-1 rounded-sm border border-zinc-800/60">
                      <span className="text-zinc-500 block text-[5.5px] uppercase font-bold">SHARPE RATIO</span>
                      <span className="text-zinc-100 font-black text-[11px]">3.82</span>
                    </div>
                    <div className="bg-[#171717] p-1 rounded-sm border border-zinc-800/60">
                      <span className="text-zinc-500 block text-[5.5px] uppercase font-bold">TOTAL TRADES</span>
                      <span className="text-zinc-300 font-bold text-[10px]">142 FILLED</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-[7px] text-zinc-500 pt-1 border-t border-zinc-800/50">
                    <span>AVG WIN: <strong className="text-emerald-400">+$1,450</strong></span>
                    <span>AVG LOSS: <strong className="text-rose-400">-$510</strong></span>
                  </div>
                </div>

                {/* Drawdown Safeguard metrics */}
                <div className="bg-[#111111] p-2 rounded-sm border border-zinc-800/80 space-y-1 text-[8px]">
                  <div className="flex justify-between items-center text-zinc-400 font-bold uppercase tracking-wider mb-1">
                    <span>DRAWDOWN OVERWATCH</span>
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  </div>
                  
                  <div className="space-y-1 leading-none">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">PEAK DAILY LOSS</span>
                      <span className="text-rose-400 font-bold">1.94% / 5.00%</span>
                    </div>
                    <div className="h-1 bg-[#171717] border border-zinc-800 rounded-sm overflow-hidden relative">
                      <div className="h-full bg-rose-500 relative" style={{ width: '38.8%' }}>
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(255,255,255,0.15)_50%)] bg-[size:4px_100%]" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-zinc-500">MAX TOTAL LIMIT</span>
                      <span className="text-rose-600 font-bold">2.42% / 8.00%</span>
                    </div>
                    <div className="h-1 bg-[#171717] border border-zinc-800 rounded-sm overflow-hidden relative">
                      <div className="h-full bg-rose-600 relative" style={{ width: '30.25%' }}>
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(255,255,255,0.15)_50%)] bg-[size:4px_100%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Funded Account Milestones checklist */}
                <div className="bg-[#111111] p-2 rounded-sm border border-zinc-800/80 space-y-1 text-[8px]">
                  <div className="flex justify-between items-center text-zinc-400 font-bold uppercase tracking-wider mb-0.5">
                    <span>CLEARANCE STEPS</span>
                    <Sparkles className="w-3 h-3 text-gold-500 shrink-0" />
                  </div>
                  
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase">Phase 1 Target (10%)</span>
                      <span className="text-gold-400 font-black">12.4% -- CLEARED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 uppercase">Phase 2 Target (5%)</span>
                      <span className="text-gold-400 font-black">5.8% -- CLEARED</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-zinc-800/60 mt-1">
                      <span className="text-zinc-300 font-bold uppercase">LIVE VAULT LIMIT</span>
                      <span className="text-emerald-400 font-black">$1,000,000 ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* High Density Real-time System Log Stream */}
                <div className="space-y-1 text-[7px] text-left select-none bg-[#111111] p-2 rounded-sm border border-zinc-800/80 leading-normal">
                  <span className="text-zinc-500 block uppercase font-bold tracking-widest pb-0.5 border-b border-zinc-800 mb-1">TELEMETRY SYSTEM STREAM</span>
                  <div className="space-y-0.5 text-zinc-400 font-mono">
                    <div className="flex gap-1.5"><span className="text-zinc-600">[15:59:02]</span><span>ALLOCATION DESK: BTCUSD ORDER LOADED</span></div>
                    <div className="flex gap-1.5"><span className="text-zinc-600">[15:59:15]</span><span>ALGORITHM: SCANNING ORDER BOOK</span></div>
                    <div className="flex gap-1.5"><span className="text-gold-500/80">[16:00:00]</span><span>AUDIT LOG: DRAWDOWN BUFFER SECURELY OK</span></div>
                    <div className="flex gap-1.5"><span className="text-emerald-500/80">[16:00:01]</span><span>VAULT CODES: clearance level IV OK</span></div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Real-time Trade Signal Tape - Framer Motion Loop Ticker */}
            <div className="bg-[#111111] border border-zinc-800 p-1.5 rounded-sm flex items-center overflow-hidden w-full select-none text-[7.5px] text-zinc-400 relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#111111] to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#111111] to-transparent z-10" />
              <motion.div 
                className="flex gap-8 whitespace-nowrap uppercase font-mono"
                animate={{ x: [0, -1000] }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 25,
                }}
              >
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> [XBTUSD-PERP] LIQ SHORT: $1,240,000 AT $95,640.00</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> [ETHUSD-PERP] LIQ LONG: $840,000 AT $3,450.20</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> [SOLUSD-PERP] ORDER BLOCK: BUY 22,000 CONTRACTS @ $142.12</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" /> [SYS-AUDIT] VAULT HEALTH: 100% SECURE // ALL PROTOCOLS OPERATING CLEAR</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> [AVAXUSD-PERP] POSITION SWEEP: ADD 4,000 LOTS</span>
                
                {/* Repeat list to avoid gaps during loop */}
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> [XBTUSD-PERP] LIQ SHORT: $1,240,000 AT $95,640.00</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> [ETHUSD-PERP] LIQ LONG: $840,000 AT $3,450.20</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> [SOLUSD-PERP] ORDER BLOCK: BUY 22,000 CONTRACTS @ $142.12</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" /> [SYS-AUDIT] VAULT HEALTH: 100% SECURE // ALL PROTOCOLS OPERATING CLEAR</span>
              </motion.div>
            </div>

          </motion.div>

        </div>
      </section>

      {/* PREMIUM SaaS PRODUCT SHOWCASE (MARKETPLACE PREVIEW) */}
      <section className="bg-[#050505] py-20 md:py-28 z-20 relative w-full border-b border-zinc-900/60">
        <div className="max-w-[1512px] mx-auto px-6 md:px-12 space-y-16">
          
          {/* Header block */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/20 border border-gold-500/10 text-gold-400 text-[9px] font-mono uppercase tracking-widest block mx-auto font-bold animate-pulse">
              <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-gold-400" />
              <span>SaaS Digital Marketplace</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-b from-zinc-50 to-zinc-400">
              Clearance Assets
            </h2>
            
            <p className="text-xs text-zinc-500 leading-relaxed max-w-lg mx-auto">
              Decrypt advanced indicator libraries, proprietary calculator terminals, and trading masterclass guidebooks.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Alpha Trade Journal',
                category: 'Trading Journal',
                price: '$29.00',
                format: 'NOTION + PDF',
                desc: 'Advanced journaling cockpit mapping mental triggers, win indices, and emotional risk metrics.',
                thumb: (
                  <div className="h-full flex flex-col justify-between p-3 bg-[#050505] rounded-xl border border-zinc-900/60 font-mono text-[9px] text-zinc-500 relative overflow-hidden group-hover:border-gold-500/30 transition-colors duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)] pointer-events-none" />
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500/85" />
                        </div>
                        <span className="text-[8px] text-zinc-400 font-bold uppercase">Journal.env</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-[7px] font-bold font-mono uppercase">Strict Mode</span>
                    </div>
                    
                    <div className="space-y-1.5 py-2 relative z-10">
                      <div className="flex justify-between items-center bg-[#0E0E0E]/80 px-2 py-1 rounded border border-zinc-900/60">
                        <span className="text-zinc-500 text-[8px] flex items-center gap-1"><Check className="w-2.5 h-2.5 text-gold-500" /> Sweep Zone Cleared</span>
                        <span className="text-emerald-400 font-bold font-mono">100%</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#0E0E0E]/80 px-2 py-1 rounded border border-zinc-900/60">
                        <span className="text-zinc-500 text-[8px] flex items-center gap-1"><Check className="w-2.5 h-2.5 text-gold-500" /> Win Rate Index</span>
                        <span className="text-zinc-200 font-bold font-mono">78.4%</span>
                      </div>
                    </div>

                    <div className="space-y-1 relative z-10">
                      <div className="flex justify-between text-[8px] text-zinc-600">
                        <span>COHORT RISK WEIGHT</span>
                        <span className="text-gold-400 font-bold">OPTIMAL</span>
                      </div>
                      <div className="h-1 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                  </div>
                )
              },
              {
                title: 'Risk & Margin Controller',
                category: 'Risk Calculator',
                price: '$39.00',
                format: 'XLSX SPREADSHEET',
                desc: 'Compute position sizing, isolated cross margin parameters, and exact liquidation risks up to 100x Isolated.',
                thumb: (
                  <div className="h-full flex flex-col justify-between p-3 bg-[#050505] rounded-xl border border-zinc-900/60 font-mono text-[9px] text-zinc-500 relative overflow-hidden group-hover:border-gold-500/30 transition-colors duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)] pointer-events-none" />
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-gold-500" />
                        <span className="text-[8px] text-zinc-400 font-bold uppercase">RISK_COMPASS_V2</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-gold-950/30 border border-gold-500/20 text-gold-400 text-[7px] font-bold font-mono">100X_ISO</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 py-2 relative z-10 text-[8px]">
                      <div className="bg-[#0E0E0E] p-1.5 rounded border border-zinc-900/60 flex flex-col justify-between">
                        <span className="text-zinc-600 text-[6px] uppercase font-bold">Drawdown Target</span>
                        <span className="text-zinc-200 font-bold font-mono">0.82%</span>
                      </div>
                      <div className="bg-[#0E0E0E] p-1.5 rounded border border-zinc-900/60 flex flex-col justify-between">
                        <span className="text-zinc-600 text-[6px] uppercase font-bold">Liq Threshold</span>
                        <span className="text-rose-400 font-bold font-mono">$92,450</span>
                      </div>
                    </div>

                    <div className="py-1 bg-gold-950/20 border border-gold-500/10 text-center text-gold-400 font-black text-[8px] rounded uppercase relative z-10 animate-pulse">
                      CALCULATING EXPOSURE LIMIT
                    </div>
                  </div>
                )
              },
              {
                title: 'Funded Account Tracker',
                category: 'Funded Tracker',
                price: '$49.00',
                format: 'DASHBOARD COMPASS',
                desc: 'Sync evaluations, drawdown limits, active targets, and payout structures inside a single cockpit.',
                thumb: (
                  <div className="h-full flex flex-col justify-between p-3 bg-[#050505] rounded-xl border border-zinc-900/60 font-mono text-[9px] text-zinc-500 relative overflow-hidden group-hover:border-gold-500/30 transition-colors duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)] pointer-events-none" />
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-gold-500 font-bold" />
                        <span className="text-[8px] text-zinc-400 font-bold uppercase">ALLOCATION_RADAR</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-[7px] font-bold font-mono uppercase">Phase 2</span>
                    </div>

                    <div className="space-y-1.5 py-2 relative z-10">
                      <div className="flex justify-between text-[8px]">
                        <span className="text-zinc-600">DAILY LIMIT METRIC</span>
                        <span className="text-zinc-300 font-bold">3.2% / 5%</span>
                      </div>
                      <div className="h-1 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: '64%' }} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[7px] text-zinc-600 uppercase border-t border-zinc-900/40 pt-1.5 relative z-10 font-bold">
                      <span className="flex items-center gap-1"><Sparkles className="w-2.5 h-2.5 text-gold-500 shrink-0" /> Target Limit</span>
                      <span className="text-gold-400 font-bold font-mono">$1M APPROVED</span>
                    </div>
                  </div>
                )
              },
              {
                title: 'Liquidity sweep guide',
                category: 'Trading PDFs',
                price: '$49.00',
                format: 'PDF E-MANUAL',
                desc: 'Institutional strategies manual mapping sweep zones, order blocks, and market-maker pool footprints.',
                thumb: (
                  <div className="h-full flex flex-col justify-between p-3.5 bg-[#050505] rounded-xl border border-zinc-900/60 font-mono text-[9px] text-zinc-500 relative overflow-hidden group-hover:border-gold-500/30 transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold-950/10 via-transparent to-gold-900/5 pointer-events-none" />
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-gold-600/5 to-transparent blur-xl rounded-full" />
                    
                    <div className="flex justify-between items-start relative z-10 w-full">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[6px] text-gold-500 font-bold uppercase tracking-widest font-mono">EVIL ELITE INTEL</span>
                        <span className="text-[10px] text-zinc-100 font-display font-extrabold uppercase leading-tight tracking-wider">LIQUIDITY SWEEP<br/>MANIFESTO</span>
                      </div>
                      <BookOpen className="w-4 h-4 text-gold-500/60 shrink-0" />
                    </div>

                    <div className="border-t border-zinc-900/60 pt-2 space-y-0.5 text-[7px] text-zinc-600 relative z-10 font-mono uppercase font-bold">
                      <div>// CORE PARADIGM IV // ORDER BLOCKS</div>
                      <div>// SWEEP METRICS & FVG ALGORITHMS</div>
                    </div>

                    <div className="flex items-center justify-between text-[7px] text-zinc-500 relative z-10 font-mono uppercase">
                      <span className="flex items-center gap-1 font-bold"><Lock className="w-2.5 h-2.5 text-gold-500 shrink-0" /> SECURE_PDF</span>
                      <span className="font-bold">VOL.08</span>
                    </div>
                  </div>
                )
              },
              {
                title: 'Risk & Leverage spreadsheet',
                category: 'Excel templates',
                price: '$39.00',
                format: 'XLSX SHEET',
                desc: 'Mathematical portfolio logs to audit risk-reward curves and daily leverage indices over multiple contracts.',
                thumb: (
                  <div className="h-full flex flex-col justify-between p-3 bg-[#050505] rounded-xl border border-zinc-900/60 font-mono text-[9px] text-zinc-500 relative overflow-hidden group-hover:border-gold-500/30 transition-colors duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)] pointer-events-none" />
                    <div className="flex justify-between items-center pb-1.5 border-b border-zinc-900/60 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Table className="w-3.5 h-3.5 text-gold-500" />
                        <span className="text-[8px] text-zinc-400 font-bold uppercase">RISK_LEDGER.xlsx</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 text-[8px] font-mono font-bold uppercase">EXCEL</span>
                    </div>

                    <div className="py-1 text-[7px] text-zinc-600 bg-zinc-950 rounded border border-zinc-900/60 px-2 relative z-10">
                      <span className="text-[6px] text-gold-500/80 block uppercase font-black tracking-widest">Formula uplink active</span>
                      <code className="text-zinc-400 font-bold font-mono">=SHARPE_RATIO(B2:B24) * Leverage_Factor</code>
                    </div>

                    <div className="grid grid-cols-3 gap-1 relative z-10 text-[7px] uppercase font-bold text-center">
                      <div className="bg-[#0E0E0E] p-1 rounded border border-zinc-900/60 flex flex-col items-center justify-center">
                        <span className="text-zinc-600 text-[5px]">Sharpe</span>
                        <span className="text-emerald-400 font-bold font-mono text-[8px]">3.82</span>
                      </div>
                      <div className="bg-[#0E0E0E] p-1 rounded border border-zinc-900/60 flex flex-col items-center justify-center">
                        <span className="text-zinc-600 text-[5px]">Profit Factor</span>
                        <span className="text-gold-400 font-bold font-mono text-[8px]">4.12</span>
                      </div>
                      <div className="bg-[#0E0E0E] p-1 rounded border border-zinc-900/60 flex flex-col items-center justify-center">
                        <span className="text-zinc-600 text-[5px]">Drawdown</span>
                        <span className="text-emerald-400 font-bold font-mono text-[8px]">1.94%</span>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                title: 'Order block indicator v5',
                category: 'Premium trading tools',
                price: '$149.00',
                format: 'PINESCRIPT V5',
                desc: 'Proprietary PineScript MT5 package highlighting mitigated order blocks and FVG sweep signals.',
                thumb: (
                  <div className="h-full flex flex-col justify-between p-3 bg-[#050505] rounded-xl border border-zinc-900/60 font-mono text-[9px] text-zinc-500 relative overflow-hidden group-hover:border-gold-500/30 transition-colors duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_50%)] pointer-events-none" />
                    
                    {/* Simulated chart backgrid */}
                    <div className="absolute inset-0 grid grid-cols-5 gap-2 opacity-[0.035] pointer-events-none">
                      {[...Array(15)].map((_, idx) => (
                        <div key={idx} className="border-r border-b border-zinc-100" />
                      ))}
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-gold-500" />
                        <span className="text-[8px] text-zinc-400 font-bold uppercase">PineScript_Uplink</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-gold-950/30 border border-gold-500/20 text-gold-400 text-[7px] font-bold font-mono uppercase">V5_Stable</span>
                    </div>

                    <div className="py-2 text-[7px] text-zinc-600 space-y-0.5 relative z-10 bg-zinc-950 rounded px-2 border border-zinc-900/60">
                      <div>//@version=5</div>
                      <div className="text-zinc-500">indicator("FVG Sweep Engine", overlay=true)</div>
                      <div className="text-gold-500 font-bold font-mono">fvg_mitigated = close {">"} fvg_high</div>
                    </div>

                    <div className="flex justify-between items-center text-[7px] text-zinc-600 relative z-10 uppercase border-t border-zinc-900/40 pt-1.5 font-bold">
                      <span className="flex items-center gap-1"><LucideLineChart className="w-2.5 h-2.5 text-gold-500 shrink-0" /> Signals Enabled</span>
                      <span className="text-emerald-400 font-bold animate-pulse font-mono">Socket Live</span>
                    </div>
                  </div>
                )
              }
            ].map((prod, idx) => {
              const productIds = [2, 3, 3, 1, 3, 4];
              const targetProductId = productIds[idx] || 1;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-[#0E0E0E]/60 border border-zinc-900/60 hover:border-gold-500/25 p-5 rounded-2xl relative overflow-hidden group hover:bg-[#0E0E0E] transition-all duration-300 flex flex-col justify-between backdrop-blur-sm font-sans cursor-pointer hover:border-gold-500/40"
                  onClick={() => router.push(`/products/${targetProductId}`)}
                >
                  {/* Top Subtle border line */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-500/10 to-transparent group-hover:via-gold-500/35 transition-all duration-300" />

                  {/* Thumbnail Area with gold glow backlights */}
                  <div className="h-36 w-full relative mb-5 select-none overflow-hidden rounded-xl bg-zinc-950">
                    {prod.thumb}
                    {/* Download Badge Overlay */}
                    <span className="absolute top-2 right-2 bg-gold-950/60 border border-gold-500/30 text-gold-400 text-[8px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full z-10 animate-pulse">
                      Download Available
                    </span>
                  </div>

                  {/* Context Area */}
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase block font-bold">{prod.category}</span>
                      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-200 group-hover:text-gold-400 transition-colors">
                        {prod.title}
                      </h3>
                    </div>

                    <p className="text-[11px] text-zinc-500 leading-normal">
                      {prod.desc}
                    </p>

                    {/* Actions / Pricing Footer */}
                    <div className="pt-4 border-t border-zinc-900/50 flex items-center justify-between mt-auto">
                      <div className="flex flex-col font-mono">
                        <span className="text-[8px] text-zinc-600 uppercase tracking-widest block">Clearance</span>
                        <span className="text-sm font-bold text-gold-300">{prod.price}</span>
                      </div>
                      
                      <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-900 text-zinc-400 group-hover:border-gold-500/20 group-hover:text-gold-400 text-[9px] font-mono font-bold uppercase rounded-[4px] transition-all">
                        {prod.format}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* PREMIUM SaaS TESTIMONIALS SECTION */}
      <section className="bg-[#050505] py-20 md:py-28 z-20 relative w-full border-b border-zinc-900/60 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.015),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-[1512px] mx-auto px-6 md:px-12 space-y-16">
          
          {/* Header Block */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/20 border border-gold-500/10 text-gold-400 text-[9px] font-mono uppercase tracking-widest block mx-auto font-bold animate-pulse">
              <Users className="w-3.5 h-3.5 shrink-0 text-gold-400" />
              <span>Verified Operator Ledger</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-b from-zinc-50 to-zinc-400">
              Clearance Reviews
            </h2>
            
            <p className="text-xs text-zinc-500 leading-relaxed max-w-lg mx-auto">
              Read verified feedback and real-time scaling milestones achieved by our global proprietary funded traders.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alexander Vance',
                initials: 'AV',
                country: 'UNITED STATES',
                node: 'US_EAST_NODE',
                avatarBg: 'from-gold-600 via-amber-700 to-zinc-950',
                review: 'Executing contracts on the Elite Terminal is completely unmatched. The execution speed sits at a sub-millisecond level, which is critical for my news-straddle setups. The drawdown overwatch is fully transparent—no hidden slippage or spread hikes. The scaling plan took me from a $50k allocation to $1,000,000 in less than five months.',
                allocation: '$1,000,000 Allocated',
                profit: '+$242,500.00',
                roi: '+24.2% ROI Cleared'
              },
              {
                name: 'Kaelen Drake',
                initials: 'KD',
                country: 'UNITED KINGDOM',
                node: 'UK_LONDON_NODE',
                avatarBg: 'from-amber-600 via-yellow-700 to-zinc-950',
                review: 'I have traded with five major prop firms over the last decade, and Evil Elite outperforms every single one of them. The custom risk and leverage spreadsheets combined with their advanced PineScript indicator suite changed the way I identify mitigated support blocks. Weekly payouts are instant and cleared straight to my wallet.',
                allocation: '$250,000 Allocated',
                profit: '+$64,820.00',
                roi: '+25.9% ROI Cleared'
              },
              {
                name: 'Mei-Ling Wu',
                initials: 'MW',
                country: 'SINGAPORE',
                node: 'SG_CORE_NODE',
                avatarBg: 'from-yellow-600 via-gold-700 to-zinc-950',
                review: 'Evil Elites algorithmic routing pipeline is phenomenal. Running my high-frequency scalp models on their isolated leverage limits is seamless. Their security standards, role-based Clearance verification, and direct administrator uplink support give me the ultimate peace of mind. Truly built for traders taking growth seriously.',
                allocation: '$500,000 Allocated',
                profit: '+$118,420.00',
                roi: '+23.6% ROI Cleared'
              }
            ].map((user, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0E0E0E]/60 border border-zinc-900/60 hover:border-gold-500/25 p-6 rounded-2xl relative overflow-hidden group hover:bg-[#0E0E0E] transition-all duration-300 flex flex-col justify-between backdrop-blur-sm"
              >
                {/* Gold glowing top line highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-500/10 to-transparent group-hover:via-gold-500/35 transition-all duration-300" />

                <div className="space-y-6">
                  {/* Trader Meta Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Image Frame */}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarBg} p-[1.5px] shadow-[0_0_15px_rgba(212,175,55,0.1)] shrink-0 flex items-center justify-center border border-zinc-900/60`}>
                        <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                          <span className="font-mono text-xs font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-400 group-hover:from-gold-300 group-hover:to-gold-500 transition-colors duration-200 uppercase tracking-widest">{user.initials}</span>
                        </div>
                      </div>

                      {/* User title details */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-mono font-bold text-zinc-200 tracking-wide uppercase truncate block">{user.name}</span>
                        <span className="text-[7px] text-zinc-500 font-mono tracking-widest uppercase truncate block">{user.country} // {user.node}</span>
                      </div>
                    </div>

                    {/* Verified operator badge */}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-[7px] font-mono font-bold uppercase shrink-0 font-bold">
                      <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Review Text quote */}
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans italic">
                    "{user.review}"
                  </p>
                </div>

                {/* Bottom Profit Stats Box */}
                <div className="mt-6 pt-4 border-t border-zinc-900/50 space-y-2.5">
                  <div className="flex justify-between items-center text-[7px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>Performance Matrix</span>
                    <span className="text-gold-400 font-bold">{user.allocation}</span>
                  </div>
                  
                  <div className="p-3 bg-zinc-950/60 border border-zinc-900/60 rounded-xl flex items-center justify-between font-mono">
                    <div className="flex flex-col">
                      <span className="text-[6px] text-zinc-500 uppercase">CUMULATIVE PROFIT</span>
                      <span className="text-[11px] font-bold text-gold-300">{user.profit}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-500/10 px-2 py-0.5 rounded-full shrink-0 font-bold">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>{user.roi}</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* PREMIUM SaaS PRICING SECTION */}
      <section id="pricing" className="bg-[#050505] py-20 md:py-28 z-20 relative w-full">
        <div className="max-w-[1512px] mx-auto px-6 md:px-12 space-y-16">
          
          {/* Header block */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/20 border border-gold-500/10 text-gold-400 text-[9px] font-mono uppercase tracking-widest block mx-auto font-bold animate-pulse">
              <Star className="w-3.5 h-3.5 shrink-0 text-gold-400" />
              <span>Allocation pricing</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-b from-zinc-50 to-zinc-400">
              Clearance Tiers
            </h2>
            
            <p className="text-xs text-zinc-500 leading-relaxed max-w-lg mx-auto">
              Select your proprietary allocation limit program. Start evaluation immediately under active clearance guidelines.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {[
              {
                id: 'Starter',
                title: 'Starter Cohort',
                price: '$29',
                allocation: '$50,000 Allocation Limit',
                desc: 'Perfect for retail traders initiating their evaluation phase.',
                features: [
                  'Funded allocation up to $50,000',
                  'Standard order execution priority',
                  'Max daily drawdown: 5%',
                  'Standard indicator & guide vault',
                  '1 Clearance session key'
                ],
                popular: false,
                cta: 'Initiate Starter'
              },
              {
                id: 'Pro',
                title: 'Pro Terminal',
                price: '$99',
                allocation: '$250,000 Allocation Limit',
                desc: 'Optimized for established professionals and high-frequency algorithms.',
                features: [
                  'Funded allocation up to $250,000',
                  'Elevated order execution priority',
                  'Max daily drawdown: 6%',
                  'Multi-license template clearances',
                  'Dedicated system manager support'
                ],
                popular: true,
                cta: 'Initiate Pro Terminal'
              },
              {
                id: 'Elite',
                title: 'Elite Signal',
                price: '$199',
                allocation: '$1,000,000 Allocation Limit',
                desc: 'Institutional-grade clearance keys and maximum allocation pools.',
                features: [
                  'Funded allocation up to $1,000,000',
                  'Maximum order execution priority',
                  'Max daily drawdown: 8% (Max limits)',
                  'Full database & templates decryption',
                  'Direct VIP desk and socket support'
                ],
                popular: false,
                cta: 'Initiate Elite Signal'
              }
            ].map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`
                  rounded-2xl p-8 relative flex flex-col justify-between transition-all duration-300 backdrop-blur-sm
                  ${plan.popular 
                    ? 'bg-[#0E0E0E] border-2 border-[#D4AF37] glow-gold scale-105 z-10 shadow-[0_20px_40px_rgba(212,175,55,0.08)]' 
                    : 'bg-[#0E0E0E]/60 border border-zinc-900/60 hover:border-gold-500/20 hover:bg-[#0E0E0E]'}
                `}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-gold-600 to-gold-500 text-zinc-950 text-[9px] font-mono font-black uppercase tracking-widest shadow-md">
                    Most Popular
                  </span>
                )}

                {/* Card Top Highlights */}
                {!plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-500/10 to-transparent hover:via-gold-500/30 transition-all duration-300" />
                )}

                {/* Plan Header */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase block font-bold">Clearance tier</span>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-zinc-200 block">
                      {plan.title}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl font-mono font-black text-zinc-100">{plan.price}</span>
                    <span className="text-zinc-500 text-xs font-mono">/ month</span>
                  </div>

                  <span className="text-[10px] text-gold-400 font-mono font-bold uppercase tracking-wider block bg-gold-950/20 border border-gold-500/10 px-3 py-1 rounded-lg w-fit">
                    {plan.allocation}
                  </span>

                  <p className="text-[11px] text-zinc-500 leading-normal font-sans pt-1 border-b border-zinc-900/50 pb-4">
                    {plan.desc}
                  </p>

                  {/* Feature Lists */}
                  <ul className="space-y-3 pt-2">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-[11px] text-zinc-300 flex items-start gap-2.5 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-8 mt-auto">
                  <button
                    onClick={() => router.push(`/checkout?plan=${plan.id}`)}
                    className={`
                      w-full py-3 rounded-lg text-center text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer
                      ${plan.popular
                        ? 'bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 glow-gold shadow-md'
                        : 'bg-zinc-900 border border-zinc-800 hover:border-gold-500/30 text-zinc-300 hover:text-gold-400'}
                    `}
                  >
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* PREMIUM SaaS FAQ ACCORDION SECTION */}
      <section className="bg-[#050505] py-20 md:py-28 z-20 relative w-full border-t border-zinc-900/60">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-16">
          
          {/* Header Block */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/20 border border-gold-500/10 text-gold-400 text-[9px] font-mono uppercase tracking-widest block mx-auto font-bold animate-pulse">
              <Clock className="w-3.5 h-3.5 shrink-0 text-gold-400" />
              <span>Operator Support Center</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-b from-zinc-50 to-zinc-400">
              Frequently Audited Questions
            </h2>
            
            <p className="text-xs text-zinc-500 leading-relaxed max-w-lg mx-auto">
              Decrypt key details regarding license features, direct clearance delivery, scaling metrics, and cancellation guidelines.
            </p>
          </div>

          {/* Accordion List Container */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'What is included in the program?',
                a: 'Every active license program grants direct access to our live Operator Terminal dashboard, our complete proprietary indicator libraries (PineScript MT5 package), premium Excel risk models, and direct socket priority uplinks. High-tier programs also decrypt full technical PDF strategy guides and secure VIP administrator direct uplinks.'
              },
              {
                q: 'How do digital clearances and downloads work?',
                a: 'Immediately upon network validation of your subscription clearance, signed download vaults are dynamically instantiated on your administrative console dashboard. In addition, cryptographically secure decryption keys are transmitted directly to your operational email address to immediately unzip all software components.'
              },
              {
                q: 'What is the refund protocol?',
                a: 'Due to the non-custodial, direct clearance delivery nature of our digital products, licensed guides, and proprietary indicator packages, all purchases are definitive, final, and non-refundable. We advise operators to carefully evaluate allocation limits before clearing billing contracts.'
              },
              {
                q: 'How does subscription cancellation work?',
                a: 'You are free to terminate your allocation program subscription at any time. Simply navigate to your operator command panel settings or open an uplink cancellation command directly with our systems admin. Terminations will register immediately and complete at the end of the active billing period.'
              },
              {
                q: 'Are future AI modules included?',
                a: 'Yes. Our development pipeline currently prioritizes real-time natural-language sentiment analysis nodes and automated leverage safety micro-advisers scheduled for Q3 clearance audits. All active licensed operators will receive automatic version clearances at zero extra cost.'
              },
              {
                q: 'What is the general device compatibility?',
                a: 'All dashboard terminals, cockpit interfaces, and tracking databases are 100% responsive and run seamlessly across modern smartphones, tablets, laptops, and desktop rigs. PineScript indicator components require a TradingView Pro terminal profile and run natively on TradingView desktop and mobile platforms.'
              }
            ].map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`bg-[#0E0E0E]/60 border rounded-xl overflow-hidden transition-all duration-300 backdrop-blur-sm group
                    ${isOpen 
                      ? 'border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.04)] bg-[#0E0E0E]' 
                      : 'border-zinc-900/60 hover:border-zinc-800'}`}
                >
                  {/* Accordion Toggle Header */}
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 font-mono select-none outline-none focus:outline-none cursor-pointer"
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 
                      ${isOpen ? 'text-gold-400' : 'text-zinc-200 group-hover:text-gold-500/80'}`}>
                      {faq.q}
                    </span>
                    
                    {/* Glowing gold caret indicator */}
                    <div className={`w-5 h-5 rounded-lg bg-zinc-950/60 border flex items-center justify-center transition-all duration-300
                      ${isOpen 
                        ? 'border-gold-500/30 text-gold-400 rotate-90 bg-gold-950/10' 
                        : 'border-zinc-900 text-zinc-500 group-hover:text-gold-500/60'}`}>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </button>

                  {/* Smooth Collapsible Answer Container */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 border-t border-zinc-900/40 text-[11px] text-zinc-400 leading-relaxed font-sans font-normal text-left">
                      {faq.a}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* PREMIUM SaaS FINAL CTA SECTION */}
      <section className="bg-[#050505] py-24 md:py-32 z-20 relative w-full border-t border-zinc-900/60 overflow-hidden">
        {/* Glowing backdrop circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-950/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full bg-[#0E0E0E]/90 border border-zinc-900 rounded-3xl p-10 md:p-16 relative overflow-hidden text-center space-y-8 glow-gold-hover shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-sm"
          >
            {/* Top golden edge bar highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
            
            {/* Security Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/20 border border-gold-500/10 text-gold-400 text-[9px] font-mono uppercase tracking-widest block mx-auto font-bold animate-pulse">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-gold-400" />
              <span>Instant Clearance Authorized</span>
            </div>

            {/* Headline and Supporting Text */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-widest uppercase leading-none bg-clip-text text-transparent bg-gradient-to-b from-zinc-50 to-zinc-400">
                Start Building Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600">Trading Edge Today.</span>
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans max-w-md mx-auto">
                Harness institutional execution latency, advanced leverage indicators, and secure drawdown overwatch programs from your custom operator cockpit.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto relative z-20">
              <button
                onClick={() => router.push('/signup')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 glow-gold text-xs font-mono tracking-widest uppercase cursor-pointer"
              >
                Start Evaluation
                <ArrowRight className="w-4 h-4 text-zinc-950 shrink-0" />
              </button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-zinc-950 border border-zinc-800 hover:border-gold-500/30 text-zinc-300 hover:text-gold-400 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs font-mono tracking-widest uppercase cursor-pointer"
              >
                View Pricing
              </button>
            </div>

            {/* Checklist elements */}
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[8px] font-mono text-zinc-500 uppercase tracking-widest pt-4 border-t border-zinc-900/40 max-w-lg mx-auto">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-gold-500 shrink-0" /> sub-millisecond execution</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-gold-500 shrink-0" /> sovereign ledger audits</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-gold-500 shrink-0" /> 24/7 priority socket feeds</span>
            </div>

          </motion.div>

        </div>
      </section>

      {/* PREMIUM SaaS FOOTER */}
      <footer className="bg-[#050505] border-t border-zinc-900/60 pt-20 pb-12 z-20 relative w-full overflow-hidden">
        {/* Subtle bottom radial gold backdrop */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-gold-950/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-[1512px] mx-auto px-6 md:px-12 space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 items-start">
            
            {/* Left Side: Brand Cockpit Description */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 flex items-center justify-center glow-gold">
                  <span className="text-zinc-950 font-display font-black text-xs">EE</span>
                </div>
                <span className="font-display font-extrabold tracking-widest text-base bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent font-mono">
                  EVIL ELITE
                </span>
              </div>
              
              <p className="text-xs text-zinc-500 leading-relaxed font-sans max-w-sm">
                Deploying institutional risk oversights, high-frequency clearing systems, and non-custodial capital allocations. Built for operators taking sovereign scaling seriously.
              </p>

              {/* Social Channels List */}
              <div className="flex items-center gap-3 pt-2">
                {[
                  { 
                    name: 'Discord', 
                    href: '#', 
                    svg: (
                      <svg viewBox="0 0 127.14 96.36" className="w-3.5 h-3.5 fill-current">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.88,6.83,77.19,77.19,0,0,0,49.58,0,105.15,105.15,0,0,0,19.14,8.07C2.81,32.41-1.68,56.12.51,79.43A105.9,105.9,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.45-5c.87-.64,1.72-1.31,2.53-2a75.76,75.76,0,0,0,72.93,0c.81.7,1.66,1.37,2.53,2a68.43,68.43,0,0,1-10.45,5A77.7,77.7,0,0,0,102.32,96.36a105.9,105.9,0,0,0,31.5-16.93C130.56,50.31,125.13,26.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                      </svg>
                    )
                  },
                  { 
                    name: 'Twitter/X', 
                    href: '#', 
                    svg: (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )
                  },
                  { 
                    name: 'Telegram', 
                    href: '#', 
                    svg: (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M21.91 3.22a1 1 0 00-1.22-.19L2.3 11.23a1 1 0 00-.06 1.79l5.05 2.19 1.7 5.09a1 1 0 001.76.24l2.45-3.32 4.67 3.33a1 1 0 001.59-.64l3.12-16.14a1 1 0 00-.67-.88zM8.5 13.9l10-7-7.5 8.5v3.5l-2.5-5z"/>
                      </svg>
                    )
                  }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 hover:text-gold-400 hover:border-gold-500/25 transition-all duration-300 shadow-sm cursor-pointer"
                    title={social.name}
                  >
                    {social.svg}
                  </a>
                ))}
              </div>
            </div>

            {/* Middle Nav Columns */}
            <div className="grid grid-cols-3 gap-6 md:col-span-2 font-mono text-[9px] uppercase tracking-wider">
              
              {/* Product links */}
              <div className="space-y-4">
                <span className="text-[10px] text-zinc-300 font-bold tracking-widest block border-b border-zinc-900 pb-2">Product</span>
                <ul className="space-y-2.5 text-zinc-500">
                  <li><a href="#pricing" className="hover:text-gold-400 transition-colors">Pricing</a></li>
                  <li><a href="#pricing" className="hover:text-gold-400 transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-gold-400 transition-colors">Downloads</a></li>
                </ul>
              </div>

              {/* Company links */}
              <div className="space-y-4">
                <span className="text-[10px] text-zinc-300 font-bold tracking-widest block border-b border-zinc-900 pb-2">Company</span>
                <ul className="space-y-2.5 text-zinc-500">
                  <li><a href="#pricing" className="hover:text-gold-400 transition-colors">About</a></li>
                  <li><a href="#pricing" className="hover:text-gold-400 transition-colors">Contact</a></li>
                  <li><a href="#pricing" className="hover:text-gold-400 transition-colors">Careers</a></li>
                </ul>
              </div>

              {/* Legal links */}
              <div className="space-y-4">
                <span className="text-[10px] text-zinc-300 font-bold tracking-widest block border-b border-zinc-900 pb-2">Legal</span>
                <ul className="space-y-2.5 text-zinc-500">
                  <li><a href="#pricing" className="hover:text-gold-400 transition-colors">Privacy</a></li>
                  <li><a href="#pricing" className="hover:text-gold-400 transition-colors">Terms</a></li>
                </ul>
              </div>

            </div>

            {/* Right Column: Newsletter Subscription */}
            <div className="space-y-4 font-mono">
              <span className="text-[10px] text-zinc-300 font-black tracking-widest block border-b border-zinc-900 pb-2 uppercase">Subscribe to Intel logs</span>
              
              <div className="space-y-3">
                <p className="text-[9px] text-zinc-500 uppercase leading-relaxed">
                  Receive cryptographically signed telemetry alerts and program clearances directly in your mailbox.
                </p>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <input
                      type="email"
                      placeholder="operator@secure.node"
                      className="w-full bg-zinc-950 border border-zinc-900/80 rounded-lg py-2.5 pl-9 pr-3 text-[10px] text-zinc-300 placeholder-zinc-700 outline-none focus:border-gold-500/30 transition-all font-mono"
                    />
                  </div>
                  
                  <button className="px-4 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-lg transition-all duration-300 flex items-center justify-center glow-gold text-[9px] uppercase cursor-pointer">
                    Submit
                  </button>
                </div>
                
                <span className="text-[7px] text-zinc-600 uppercase block select-none">
                  [x] Node telemetry audits consented
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Copyright Block */}
          <div className="pt-8 border-t border-zinc-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            <span>© 2026 EVIL ELITE. All sovereign custody clearance preserved.</span>
            <div className="flex gap-4">
              <span>Host Node: VERCEL_EDGE</span>
              <span>•</span>
              <span>Sovereignty cleared</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
