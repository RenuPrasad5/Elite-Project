'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  Terminal, 
  Download, 
  BookOpen, 
  ChevronRight, 
  Star, 
  Activity, 
  Clock, 
  DollarSign, 
  Layers, 
  Table, 
  FileText, 
  Check, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ComposedChart, Tooltip } from 'recharts';
import { Product, LOCAL_PRODUCTS, getUserPurchases, purchaseProduct } from '@/lib/products';

// FAQ Items by product ID
const PRODUCT_FAQS: Record<number, { q: string; a: string }[]> = {
  1: [
    { q: 'Who is this orderflow guide written for?', a: 'It is written for intermediate to advanced technical analysts looking to identify high-probability entries. If you have been stopped out repeatedly at traditional retail support/resistance nodes, this manual decrypts why large order blocks cause structural sweeps.' },
    { q: 'What asset markets are covered in this manual?', a: 'The concepts are universal across high-liquidity derivative instruments, including Forex (EURUSD, GBPUSD), Crypto (BTC, ETH), Indices (NAS100, US30), and Commodities (XAUUSD).' },
    { q: 'Are there actual indicators or source codes included?', a: 'This is a core strategic theory and analysis manual. For automated script execution, we suggest pairing this manual with our PineScript/MT5 Order Block Finder tool.' }
  ],
  2: [
    { q: 'Does this journal template require a paid Notion plan?', a: 'No. The Notion Alpha Journal template is fully optimized to run on standard, free personal Notion accounts without requiring any upgraded workspace clearances.' },
    { q: 'Is the printable PDF journal high-resolution?', a: 'Yes. The PDF is exported in ultra-high-density vector lines designed to look extremely clean, dark, and highly legible when printed on default A4/Letter paper.' },
    { q: 'Can I import my historical CSV logs?', a: 'The Notion edition supports default database CSV import mapping. The manual provides a quick 3-step walkthrough to upload your historic trade log ledger.' }
  ],
  3: [
    { q: 'Does this calculator spreadsheet run on Excel and Google Sheets?', a: 'Yes, absolutely. The spreadsheet is cleared for Microsoft Excel (.xlsx format) and includes a seamless, one-click Google Sheets duplicate link.' },
    { q: 'Is isolated position leverage customizable?', a: 'Yes. Custom parameters allow you to configure position sizing, cross margin buffers, and liquidation calculations from 1x isolated up to 100x cross leverage.' },
    { q: 'Does it calculate drawdown safeguards?', a: 'Yes. It features dedicated prop-firm drawdown caps buffers. Enter your maximum evaluation drawdown limits, and it warns you if position size risks exceed your parameters.' }
  ],
  4: [
    { q: 'Can I deploy this script on a free TradingView account?', a: 'Yes, absolutely. The PineScript v5 code executes natively inside the TradingView Pine Editor on free, essential, or premium TradingView profiles.' },
    { q: 'Is the indicator code open-source and customizable?', a: 'Yes. The full PineScript v5 source code is completely decrypted and open. You are free to modify calculation steps, write custom alerts, or link it to execution bots.' },
    { q: 'What alerts are supported?', a: 'It supports sound alerts, TradingView dynamic popup notifications, and outbound Webhook JSON links to automatically clear order triggers to Discord, Telegram, or custom servers.' }
  ],
  5: [
    { q: 'What server operating systems are supported?', a: 'The HFT Python CLI application is fully compiled to run on Windows, macOS, and Linux servers (e.g. Ubuntu, AWS EC2, or DigitalOcean Droplets).' },
    { q: 'Is high-level coding experience required to run the bot?', a: 'No. While basic terminal command-line execution is helpful, the package unzips with pre-configured templates and a step-by-step server deployment guide.' },
    { q: 'How is API security managed?', a: 'Sovereign security is our top priority. API keys, decryption signatures, and webhooks are stored completely in-house in local `.env` configuration logs. Zero data is transmitted to outside nodes.' }
  ]
};

// Included files by product ID
const PRODUCT_INCLUDED_FILES: Record<number, string[]> = {
  1: [
    'Institutional Liquidity Heatmap manifesto (PDF Format)',
    'Order Block Spotting footprint checklists',
    'Fair Value Gap (FVG) mitigation spreadsheets',
    'Lifetime Version updates & security patch certificates'
  ],
  2: [
    'Alpha Trade Notion Operational workspace links',
    'High-Density printable journal templates (PDF Edition)',
    'Psychological bias assessment log ledger',
    'Win-rate cohort metrics calculator Excel sheets'
  ],
  3: [
    'Leveraged Risk & Margin controller spreadsheet (.xlsx)',
    'Google Sheets cloud clone dashboard links',
    'Multi-contract leverage tracking sheets',
    'Prop Firm Evaluation drawdown buffer blueprints'
  ],
  4: [
    'TradingView PineScript v5 indicator source code (.txt)',
    'MetaTrader 5 (.mq5 & .ex5) compiled indicators',
    'Custom API Webhook configuration templates',
    'Outbound bot JSON socket connection manuals'
  ],
  5: [
    'HFT Bot Controller application code (Python v3.11)',
    'Pre-configured API credentials templates (.env.example)',
    'Bot execution telemetry guide (PDF Instruction)',
    '2 Dedicated Server system clearance keys'
  ]
};

// Benefits by product ID
const PRODUCT_BENEFITS: Record<number, string[]> = {
  1: [
    'Identify Institutional Nodes: Stop placing stops where retail patterns suggest. Trace actual capital pools loaded by algorithmic market makers.',
    'Slippage & FVG Protection: Master entering positions inside Fair Value Gaps (FVG) to ensure optimized executions and minimal spread hikes.',
    'Pass Funded Evaluations: Trade with institutional patience. Know when order sweeps are complete to avoid high-drawdown exposure.'
  ],
  2: [
    'Full Mathematical Control: Instantly analyze Sharpe ratios, win factors, and profit metrics from your personal journaling cockpit.',
    'Eliminate Emotional Volatility: Track mental anchors, greed markers, and session stress parameters to isolate behavioral trading slipups.',
    'Prop-Firm Optimization: Maintain detailed trading histories to satisfy funded allocation compliance audits instantly.'
  ],
  3: [
    'Zero Margin Liquidations: Calculate exact liquidation limits before clearing isolated leverage orders up to 100x leverage.',
    'Instant Stop-Loss Sizing: Input Stop-Loss distance in points, and instantly receive precise dollar contract limits.',
    'Pass Funded Safely: Program custom Daily Loss caps. The calculator highlights exposure boundaries to secure funded checkpoints.'
  ],
  4: [
    'Automate mitigation logs: Instantly highlight mitigated vs unmitigated order blocks in real time across any timeframe.',
    'Mitigate Fair Value Gaps: Track unfilled institutional imbalances with precision FVG zone overlays and alert push notifications.',
    'Outbound Algorithmic Routing: Webhook interfaces map trade signals to bot executors, creating an automated quantitative pipeline.'
  ],
  5: [
    'Triangular Arbitrage clearance: Program bots to scan coin order book spreads between dual platforms (e.g. Binance vs Coinbase).',
    'Sub-millisecond feeds: High-frequency socket triggers monitor and compute exchange price spreads in less than 1.5ms.',
    'Encrypted system logs: Outbound Telegram/Discord webhooks report cleared profit loops and telemetry status immediately.'
  ]
};

import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Purchase states
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Load data
  useEffect(() => {
    const foundProduct = LOCAL_PRODUCTS.find((p) => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      if (user) {
        getUserPurchases(user.id).then((ids) => {
          setPurchasedIds(ids);
        }).finally(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [productId, user]);

  // Simulated purchase / webhook clearances
  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      addToCart(product);
      // Fallback simulation delay for aesthetics
      setTimeout(() => {
        setAddingToCart(false);
        router.push('/cart');
      }, 600);
    } catch (err: any) {
      console.error(err);
      setAddingToCart(false);
    }
  };

  // Preview screenshots mock definitions
  const mockScreenshots = [
    { title: 'Operational Overwatch Panel', desc: 'Secure clearance dashboard mapping active signal nodes.' },
    { title: 'Risk-Weight Telemetry Grid', desc: 'Bloomberg-density position limits and safety filters.' },
    { title: 'Decrypted Output Log', desc: 'Outbound webhook queues and socket feed verification.' }
  ];
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#050505]">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest font-mono text-zinc-500 animate-pulse">Syncing clearance node...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#050505] text-zinc-400 font-mono text-center px-6">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4 animate-pulse" />
        <p className="text-lg font-bold tracking-widest uppercase">SECURE DESK ERROR: NODE NOT FOUND</p>
        <p className="text-xs text-zinc-600 max-w-sm mt-2 leading-relaxed">The requested digital clearance catalog item does not exist or has been withdrawn by administrative security.</p>
        <Link href="/" className="mt-6 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-gold-500/20 text-zinc-300 hover:text-gold-400 text-xs rounded transition-all uppercase tracking-widest">
          Return to Hub
        </Link>
      </div>
    );
  }

  const isPurchased = purchasedIds.includes(product.id);
  const faqs = PRODUCT_FAQS[product.id] || [];
  const includedFiles = PRODUCT_INCLUDED_FILES[product.id] || [];
  const benefits = PRODUCT_BENEFITS[product.id] || [];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col relative overflow-hidden font-sans select-none pb-20">
      
      {/* Background radial coordinates mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.025),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(181,131,32,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(181,131,32,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-45" />

      {/* HEADER */}
      <header className="w-full border-b border-zinc-900 bg-[#050505]/45 backdrop-blur-md z-30 relative font-mono select-none">
        <div className="max-w-[1512px] w-full mx-auto h-20 px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push(user ? '/dashboard' : '/')}
              className="group flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-zinc-800 hover:border-gold-500/20 text-zinc-400 hover:text-gold-400 text-[9px] uppercase tracking-widest rounded-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              BACK TO HUB
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse rounded-full shrink-0" />
              <span className="text-[8.5px] text-zinc-500 tracking-widest uppercase font-bold">SECURE_CATALOG // COCKPIT_ROUTE: {product.category.toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-gold-400 fill-current shrink-0">
              <path d="M50 10 L80 25 L80 60 C80 75, 50 90, 50 90 C50 90, 20 75, 20 60 L20 25 Z" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
              <path d="M35 32 H47 V38 H38 V44 H45 V50 H38 V56 H47 V62 H35 Z" fill="#D4AF37" />
              <path d="M65 32 H53 V38 H62 V44 H55 V50 H62 V56 H53 V62 H65 Z" fill="#D4AF37" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="font-display font-extrabold tracking-[0.25em] text-[10px] text-zinc-100 uppercase leading-none">EVILELITE</span>
              <span className="text-[6.5px] font-mono tracking-[0.4em] text-gold-400 uppercase font-black pl-0.5 mt-0.5 leading-none">TRADING</span>
            </div>
          </div>
        </div>
      </header>

      {/* CORE SPECIFICATIONS WORKSPACE */}
      <main className="max-w-[1512px] w-full mx-auto px-6 md:px-12 py-10 relative z-20 space-y-12">
        
        {/* Dynamic upper grid details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-20">
          
          {/* LEFT COLUMN: INTERACTIVE TELEMETRY SIMULATORS & SCREENSHOTS (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Product Image Mockup */}
            <div className="w-full bg-[#0B0B0B] border border-zinc-900 rounded-sm overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              <div className="relative aspect-[16/9] w-full flex items-center justify-center">
                <img 
                  src={`/products/product_${product.id}.png`} 
                  alt={product.title} 
                  className="w-full h-full object-cover opacity-90 mix-blend-lighten"
                />
              </div>
            </div>

            {/* Interactive quantitative preview simulator */}
            <div className="w-full bg-[#0B0B0B] border border-zinc-800 rounded-sm p-4 relative overflow-hidden border-t-[3px] border-t-gold-500/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] font-mono text-[9px] select-none min-h-[380px] flex flex-col justify-between">
              {/* Scanline and coordinate mesh */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-transparent pointer-events-none z-20" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.003)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-40 z-30" />
              <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[7px] text-zinc-600 uppercase font-bold font-mono">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <span>PREVIEW_TELEMETRY: ACTIVE</span>
              </div>

              {/* Simulator view switcher */}
              <div className="space-y-4 flex-1 flex flex-col justify-between pt-2">
                
                {/* 1. Institutional Liquidity Heatmap Guide - Bid/Ask depth ledger */}
                {product.id === 1 && (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 bg-[#111111] p-3 rounded border border-zinc-800/80">
                      <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800 text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span className="text-gold-400">SYS_ANALYSIS: ORDER BOOK SWEEP DEPTH</span>
                        <span>CLUSTERS DECRYPTED</span>
                      </div>
                      
                      {/* Depth visualizer bar rows */}
                      <div className="space-y-1.5 font-mono text-[8.5px]">
                        {[
                          { sym: 'XAUUSD', price: '2,042.80', size: '1,420 lots', fillPct: '85%', side: 'ASK', color: 'text-rose-500', barBg: 'bg-rose-950/25' },
                          { sym: 'XAUUSD', price: '2,041.10', size: '942 lots', fillPct: '55%', side: 'ASK', color: 'text-rose-500', barBg: 'bg-rose-950/25' },
                          { sym: 'XAUUSD', price: '2,039.50', size: '320 lots', fillPct: '20%', side: 'SPREAD', color: 'text-gold-400', barBg: 'bg-gold-950/10' },
                          { sym: 'XAUUSD', price: '2,038.20', size: '1,120 lots', fillPct: '65%', side: 'BID', color: 'text-emerald-400', barBg: 'bg-emerald-950/25' },
                          { sym: 'XAUUSD', price: '2,037.00', size: '1,980 lots', fillPct: '95%', side: 'BID', color: 'text-emerald-400', barBg: 'bg-emerald-950/25' }
                        ].map((row, idx) => (
                          <div key={idx} className="relative flex justify-between px-2.5 py-1.5 bg-[#050505] rounded border border-zinc-900/60 overflow-hidden leading-none">
                            <div className={`absolute left-0 top-0 bottom-0 ${row.barBg} pointer-events-none transition-all duration-1000`} style={{ width: row.fillPct }} />
                            <span className="text-zinc-300 font-bold relative z-10">{row.sym}</span>
                            <span className={`${row.color} font-black relative z-10`}>${row.price}</span>
                            <span className="text-zinc-400 relative z-10">{row.size}</span>
                            <span className={`px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[6.5px] font-bold ${row.color} relative z-10`}>{row.side}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-gold-950/15 border border-gold-500/20 text-gold-400 rounded-[2px] leading-relaxed text-[8.5px] text-center font-mono">
                      <strong>HIGH RESOLUTION ORDER BOOK SWEEP Telemetry</strong>: Highlights unfilled volume clusters and stop-loss hunting coordinates dynamically in A4 manuals.
                    </div>
                  </div>
                )}

                {/* 2. Alpha Trade Journal - Trade Log Terminal */}
                {product.id === 2 && <JournalSimulator />}

                {/* 3. Leveraged Risk & Margin Calculator - Sliding Calculator */}
                {product.id === 3 && <RiskCalculatorSimulator />}

                {/* 4. Order Block Finder - Simulated Candles Canvas Chart */}
                {product.id === 4 && <PineScriptChartSimulator />}

                {/* 5. HFT Arbitrage bot controller - Simulated Spread cli prompt */}
                {product.id === 5 && <ArbitrageCliSimulator />}

              </div>

              {/* Lower dynamic logs telemetry footer */}
              <div className="border-t border-zinc-900 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-zinc-600 text-[7px] uppercase font-bold tracking-wider">
                <div className="flex items-center gap-2">
                  <span>CLEARED KEY ID: <strong className="text-gold-500/80">sha256-ee_catalog_0{product.id}</strong></span>
                  <span>|</span>
                  <span>LATENCY: <strong className="text-emerald-400 animate-pulse">0.8ms</strong></span>
                </div>
                <span>SECURITY CLEARANCE: LEVEL_IV DESK_AUDIT_PASSED</span>
              </div>
            </div>

            {/* Screen screenshots preview deck */}
            <div className="space-y-3 font-mono">
              <span className="text-[9px] text-zinc-500 block uppercase tracking-widest font-bold">Catalog asset view screenshots</span>
              <div className="grid grid-cols-3 gap-3">
                {mockScreenshots.map((snap, sIdx) => (
                  <button 
                    key={sIdx}
                    onClick={() => setActiveScreenshotIdx(sIdx)}
                    className={`p-3 bg-[#0B0B0B] border rounded-sm flex flex-col justify-between text-left space-y-2 cursor-pointer transition-all duration-300 relative overflow-hidden group
                      ${activeScreenshotIdx === sIdx 
                        ? 'border-gold-500/50 shadow-[0_0_12px_rgba(212,175,55,0.06)]' 
                        : 'border-zinc-900 hover:border-zinc-800'}`}
                  >
                    {activeScreenshotIdx === sIdx && (
                      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
                    )}
                    <div className="flex justify-between items-center text-[7px] text-zinc-600">
                      <span>PREVIEW_{sIdx + 1}</span>
                      <Star className={`w-2.5 h-2.5 ${activeScreenshotIdx === sIdx ? 'text-gold-500' : 'text-zinc-700'}`} />
                    </div>
                    <div className="space-y-1">
                      <span className={`text-[8.5px] font-bold block leading-tight uppercase transition-colors duration-200
                        ${activeScreenshotIdx === sIdx ? 'text-gold-400' : 'text-zinc-300 group-hover:text-zinc-100'}`}>
                        {snap.title}
                      </span>
                      <p className="text-[7.5px] text-zinc-500 leading-normal line-clamp-2 leading-relaxed">
                        {snap.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CORE VALUES, SPECS, CTA, WHAT'S INCLUDED (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Main info panel */}
            <div className="bg-[#0B0B0B] border border-zinc-800 rounded-sm p-6 relative overflow-hidden space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-t-[2px] border-t-gold-500/60 font-mono text-[9px]">
              
              {/* Product category & Badge */}
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
                <span className="text-[9px] font-mono text-gold-400 font-bold uppercase tracking-widest bg-gold-950/20 border border-gold-500/10 px-2.5 py-0.5 rounded">
                  {product.category}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-bold uppercase font-sans">.{product.file_type.toUpperCase()} CLEARANCE</span>
                  {product.badge && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 font-bold tracking-widest text-[8px] animate-pulse">
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & description */}
              <div className="space-y-2">
                <h1 className="text-xl md:text-2xl font-display font-extrabold uppercase leading-none tracking-wider text-zinc-100 select-none">
                  {product.title}
                </h1>
                
                <p className="text-zinc-400 text-[11px] leading-relaxed font-sans font-normal pt-1">
                  {product.description}
                </p>
              </div>

              {/* Specifications list */}
              <div className="space-y-2 pt-1">
                <span className="text-[8px] text-zinc-500 tracking-widest uppercase font-bold">OPERATIONAL CORE SPECIFICATIONS</span>
                
                <div className="grid grid-cols-2 gap-2 text-[8px]">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="p-2 bg-[#111111] rounded-[1px] border border-zinc-900 flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-gold-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-300 font-bold leading-normal">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase area */}
              <div className="bg-[#111111] border border-zinc-900/80 p-4 rounded-[2px] space-y-4 mt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[7.5px] text-zinc-500 tracking-widest uppercase block font-bold">CLEARANCE DISBURSEMENT PRICE</span>
                    <span className="text-2xl font-black font-mono text-gold-300">${(product.price || 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex flex-col text-right">
                    <span className="text-emerald-400 font-bold block text-[10px] leading-none mb-0.5">✓ LIFETIME ACCESS</span>
                    <span className="text-zinc-500 block text-[6.5px] uppercase leading-none">Instant network clearance</span>
                  </div>
                </div>

                {isPurchased ? (
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="w-full py-3.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold rounded-sm tracking-widest text-[9.5px] uppercase cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <Unlock className="w-4 h-4 text-emerald-400" />
                    SECURED CLEARANCE UNLOCKED → VIEW REPOSITORY
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full py-3.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-sm tracking-widest text-[9.5px] uppercase cursor-pointer glow-gold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {addingToCart ? (
                      <>
                        <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        ENCRYPTING CART NODE...
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-zinc-950" />
                        ADD TO SECURE CART
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Included files */}
              <div className="space-y-2 pt-2">
                <span className="text-[8px] text-zinc-500 tracking-widest uppercase font-bold block border-b border-zinc-900 pb-1">SIGNED DIGITAL FILES INCLUDED</span>
                <ul className="space-y-1.5 text-[8.5px]">
                  {includedFiles.map((file, idx) => (
                    <li key={idx} className="flex items-center justify-between text-zinc-400 font-mono">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-gold-500 shrink-0" />
                        <span>{file}</span>
                      </div>
                      <span className="px-1 bg-[#111111] border border-zinc-900 text-zinc-500 text-[6.5px] font-bold">VERIFIED</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>

        {/* Dynamic lower detailed information panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-20 border-t border-zinc-900 pt-10">
          
          {/* LEFT SIDE: CORE BENEFITS ANALYSIS (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6 font-mono text-[9px]">
            <div className="space-y-1">
              <span className="text-[9px] text-gold-400 block uppercase tracking-widest font-bold">OPERATIONAL ADVANTAGE</span>
              <h2 className="text-lg font-display font-extrabold uppercase tracking-wider text-zinc-200 leading-none">
                SaaS Allocation Benefits
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4 font-sans text-xs text-zinc-400">
              {benefits.map((benefit, idx) => {
                const [title, desc] = benefit.split(':');
                return (
                  <div key={idx} className="bg-[#0B0B0B] border border-zinc-900 p-5 rounded-sm relative overflow-hidden group hover:border-gold-500/25 transition-all">
                    {/* Glowing backlight grid */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/10 to-transparent group-hover:via-gold-500/25 transition-all" />
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gold-950/20 border border-gold-500/10 text-gold-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 leading-normal text-left">
                        <strong className="text-zinc-200 font-mono text-xs uppercase tracking-wide block">{title}</strong>
                        <p className="text-[11px] leading-relaxed font-normal text-zinc-500">{desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: FREQUENTLY AUDITED QUESTIONS ACCORDION (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6 font-mono text-[9px]">
            <div className="space-y-1">
              <span className="text-[9px] text-gold-400 block uppercase tracking-widest font-bold">AUDIT SUPPORT CHECKPOINTS</span>
              <h2 className="text-lg font-display font-extrabold uppercase tracking-wider text-zinc-200 leading-none">
                Asset Audited FAQ
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className={`bg-[#0B0B0B] border rounded-sm overflow-hidden transition-all duration-300 relative group
                    ${isOpen ? 'border-gold-500/40 bg-[#0E0E0E]' : 'border-zinc-900 hover:border-zinc-800'}`}>
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left gap-4 select-none outline-none focus:outline-none cursor-pointer"
                    >
                      <span className={`text-[8.5px] font-bold uppercase tracking-wider transition-colors duration-200 
                        ${isOpen ? 'text-gold-400' : 'text-zinc-300 group-hover:text-gold-500/80'}`}>
                        {faq.q}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 text-zinc-500 
                        ${isOpen ? 'rotate-90 text-gold-400' : 'group-hover:text-gold-500/60'}`} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 text-[11px] leading-relaxed text-zinc-500 font-sans font-normal border-t border-zinc-900/40 text-left">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

// 2. Alpha Trade Journal - interactive simulator log widget
function JournalSimulator() {
  const [trades, setTrades] = useState<any[]>([
    { sym: 'BTCUSD', type: 'BUY', price: '94,200', pnl: '+$1,280.00', color: 'text-emerald-400' },
    { sym: 'XAUUSD', type: 'SELL', price: '2,034', pnl: '+$420.50', color: 'text-emerald-400' },
  ]);
  const [sym, setSym] = useState('EURUSD');
  const [type, setType] = useState('BUY');
  const [price, setPrice] = useState('1.0845');

  const addMockPosition = () => {
    const isWin = Math.random() > 0.3;
    const value = (Math.random() * 800 + 100).toFixed(2);
    const mockPnl = `${isWin ? '+' : '-'}$${value}`;
    const newPos = {
      sym: sym.toUpperCase(),
      type,
      price,
      pnl: mockPnl,
      color: isWin ? 'text-emerald-400' : 'text-rose-500'
    };
    setTrades([newPos, ...trades].slice(0, 4));
  };

  return (
    <div className="space-y-3 flex-1 flex flex-col justify-between">
      <div className="bg-[#111111] p-3 rounded border border-zinc-800/80 space-y-3">
        <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800 text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
          <span className="text-gold-400">SYS_COCKPIT: TRADE_LOGGER_TERMINAL</span>
          <span>SHARPE: 3.84 (OPTIMAL)</span>
        </div>

        {/* Input selectors */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-0.5">
            <span className="text-[6.5px] text-zinc-500 uppercase block font-bold">ASSET TICK</span>
            <input value={sym} onChange={(e) => setSym(e.target.value)} className="w-full bg-[#050505] border border-zinc-850 px-2 py-1 text-[8.5px] text-zinc-300 rounded outline-none font-mono" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[6.5px] text-zinc-500 uppercase block font-bold">ACTION ORDER</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-[#050505] border border-zinc-850 px-2 py-1 text-[8.5px] text-zinc-300 rounded outline-none font-mono cursor-pointer">
              <option value="BUY">BUY (LONG)</option>
              <option value="SELL">SELL (SHORT)</option>
            </select>
          </div>
          <div className="space-y-0.5">
            <span className="text-[6.5px] text-zinc-500 uppercase block font-bold">ENTRY PRICE</span>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-[#050505] border border-zinc-850 px-2 py-1 text-[8.5px] text-zinc-300 rounded outline-none font-mono" />
          </div>
        </div>

        <button onClick={addMockPosition} className="w-full py-1.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-[8.5px] rounded tracking-wider uppercase cursor-pointer">
          LOG TELEMETRY POSITION
        </button>

        {/* Log table */}
        <div className="space-y-1 pt-1 border-t border-zinc-850/60">
          <span className="text-[6.5px] text-zinc-500 uppercase block font-bold">Historical Audited Ledger (4 slots)</span>
          <div className="space-y-1">
            {trades.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-1.5 bg-[#050505] border border-zinc-900 rounded-[1px] leading-none text-[8px] font-mono">
                <span className="text-zinc-300 font-bold">{item.sym}</span>
                <span className={`px-1 py-0.2 rounded bg-zinc-900 border border-zinc-850 font-bold ${item.type === 'BUY' ? 'text-emerald-400' : 'text-rose-500'}`}>{item.type}</span>
                <span className="text-zinc-500">${item.price}</span>
                <span className={`${item.color} font-black`}>{item.pnl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-2 px-3 bg-gold-950/15 border border-gold-500/20 text-gold-400 rounded-[2px] leading-relaxed text-[8.5px] text-center font-mono">
        <strong>DYNAMIC ACCOUNTABILITY ENGINE</strong>: Automatically logs emotional triggers and maps Win/Loss ratios in the Notion database workspace.
      </div>
    </div>
  );
}

// 3. Leveraged Risk & Margin Calculator - Slider Calculator widget
function RiskCalculatorSimulator() {
  const [balance, setBalance] = useState(100000);
  const [leverage, setLeverage] = useState(50);
  const [entry, setEntry] = useState(90000);
  const [pct, setPct] = useState(1.5);

  const riskAmount = (balance * (pct / 100)).toFixed(2);
  const size = ((balance * leverage * (pct / 100)) / entry).toFixed(4);
  const margin = ((Number(size) * entry) / leverage).toFixed(2);
  const liquidation = (entry * (1 - 1 / leverage)).toFixed(2);

  return (
    <div className="space-y-3 flex-1 flex flex-col justify-between">
      <div className="bg-[#111111] p-3 rounded border border-zinc-800/80 space-y-3">
        <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800 text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
          <span className="text-gold-400">SYS_CALCULATOR: ISO_LEVERAGE_CORE</span>
          <span>SYSTEM_STATUS: SAFE</span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-2 text-[8px]">
          <div className="space-y-0.5">
            <span className="text-[6.5px] text-zinc-500 uppercase block font-bold">PORTFOLIO CAP ($)</span>
            <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full bg-[#050505] border border-zinc-850 px-2 py-1 text-[8.5px] text-zinc-300 rounded outline-none font-mono" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[6.5px] text-zinc-500 uppercase block font-bold">ENTRY PRICE LIMIT ($)</span>
            <input type="number" value={entry} onChange={(e) => setEntry(Number(e.target.value))} className="w-full bg-[#050505] border border-zinc-850 px-2 py-1 text-[8.5px] text-zinc-300 rounded outline-none font-mono" />
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-2 py-1 border-y border-zinc-850/60">
          <div className="flex justify-between text-[7.5px] font-mono text-zinc-400">
            <span>ISOLATED LEVERAGE VALUE</span>
            <span className="text-gold-400 font-bold">{leverage}X leverage</span>
          </div>
          <input type="range" min="1" max="100" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} className="w-full accent-gold-500 h-1 bg-[#050505] border border-zinc-850 rounded-lg cursor-pointer" />

          <div className="flex justify-between text-[7.5px] font-mono text-zinc-400">
            <span>ALLOWED POSITION RISK (%)</span>
            <span className="text-rose-400 font-bold">{pct}% Portfolio risk</span>
          </div>
          <input type="range" min="0.5" max="5" step="0.1" value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full accent-rose-500 h-1 bg-[#050505] border border-zinc-850 rounded-lg cursor-pointer" />
        </div>

        {/* Calculated Specs */}
        <div className="grid grid-cols-2 gap-2 font-mono text-[8px] leading-tight pt-1">
          <div className="p-1.5 bg-[#050505] border border-zinc-900 rounded">
            <span className="text-zinc-500 block text-[6px] uppercase font-bold">RISK QUANTITY ($)</span>
            <span className="text-rose-400 font-bold">${riskAmount}</span>
          </div>
          <div className="p-1.5 bg-[#050505] border border-zinc-900 rounded">
            <span className="text-zinc-500 block text-[6px] uppercase font-bold">POSITION SIZING (BTC)</span>
            <span className="text-zinc-100 font-bold">{size} contract</span>
          </div>
          <div className="p-1.5 bg-[#050505] border border-zinc-900 rounded">
            <span className="text-zinc-500 block text-[6px] uppercase font-bold">REQUIRED CROSS MARGIN</span>
            <span className="text-zinc-300 font-bold">${margin}</span>
          </div>
          <div className="p-1.5 bg-[#050505] border border-zinc-900 rounded">
            <span className="text-zinc-500 block text-[6px] uppercase font-bold">EST. LIQUIDATION POINT</span>
            <span className="text-rose-500 font-black">${liquidation}</span>
          </div>
        </div>
      </div>

      <div className="p-2 px-3 bg-gold-950/15 border border-gold-500/20 text-gold-400 rounded-[2px] leading-relaxed text-[8.5px] text-center font-mono">
        <strong>PRECISION RISK MULTI-GRID CORE</strong>: Prevents contract liquidations on isolate margins by calculating entry levels prior to execution.
      </div>
    </div>
  );
}

// 4. PineScript Finder - simulated candlestick canvas chart widget
function PineScriptChartSimulator() {
  const chartPoints = [
    { name: '09:00', price: 92400, fvg: null, ob: null },
    { name: '09:15', price: 92850, fvg: null, ob: null },
    { name: '09:30', price: 92100, fvg: 92100, ob: null }, // Highlight FVG zone
    { name: '09:45', price: 93400, fvg: null, ob: null },
    { name: '10:00', price: 94100, fvg: null, ob: 94100 }, // Highlight Order Block
    { name: '10:15', price: 93800, fvg: null, ob: null },
    { name: '10:30', price: 94900, fvg: null, ob: null },
    { name: '10:45', price: 95500, fvg: null, ob: null },
  ];

  return (
    <div className="space-y-3 flex-1 flex flex-col justify-between">
      <div className="bg-[#111111] p-3 rounded border border-zinc-800/80 space-y-2">
        <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800 text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
          <span className="text-gold-400">SYS_CHART: PINESCRIPT_V5_LIVE_FEED</span>
          <span>MITIGATE_INDEX: ACTIVE</span>
        </div>

        {/* Candle Recharts simulator */}
        <div className="h-44 w-full relative bg-[#050505]/40 rounded border border-zinc-850 overflow-hidden pt-2">
          <div className="absolute top-1 left-2 text-[6px] text-zinc-500 uppercase flex gap-2 font-mono z-20">
            <span>INDEX: SOL/USD</span>
            <span className="text-emerald-400">FVG GAP</span>
            <span className="text-gold-400">ORDER BLOCK</span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartPoints} margin={{ top: 8, right: 4, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="1 1" stroke="#1c1c1f" />
              <XAxis dataKey="name" stroke="#444" fontSize={6} fontFamily="monospace" tickLine={false} />
              <YAxis domain={['dataMin - 200', 'dataMax + 200']} stroke="#444" fontSize={6} fontFamily="monospace" tickLine={false} />
              <Area type="monotone" dataKey="price" stroke="#555" strokeWidth={1} fillOpacity={0.05} fill="#D4AF37" />
              {/* Highlight FVG */}
              <Line type="monotone" dataKey="fvg" stroke="#10B981" strokeWidth={0} dot={{ r: 5, fill: '#10B981', stroke: '#10B981', strokeWidth: 1 }} />
              {/* Highlight OB */}
              <Line type="monotone" dataKey="ob" stroke="#D4AF37" strokeWidth={0} dot={{ r: 6, fill: '#D4AF37', stroke: '#D4AF37', strokeWidth: 1 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Telemetry output code */}
        <div className="p-2 bg-[#050505] rounded border border-zinc-850 text-[7px] text-zinc-500 leading-normal">
          <span className="text-gold-500/80 font-bold block uppercase pb-0.5">TELEMETRY_LOG_OUT:</span>
          <code>[10:00:02] ORDER_BLOCK mitigation triggered at $94,100 // push_webhook cleared</code>
        </div>
      </div>

      <div className="p-2 px-3 bg-gold-950/15 border border-gold-500/20 text-gold-400 rounded-[2px] leading-relaxed text-[8.5px] text-center font-mono">
        <strong>AUTOMATED MITIGATION FINDER</strong>: Plots Fair Value Gaps and Order Blocks on TradingView dynamically via open PineScript source code templates.
      </div>
    </div>
  );
}

// 5. HFT Arbitrage Bot Controller - simulated CLI spread prompt widget
function ArbitrageCliSimulator() {
  const [spreads, setSpreads] = useState<any[]>([
    { ts: '16:05:01', exchange: 'BINANCE vs COINBASE', pair: 'BTC/USDT', spread: '0.14 bps', status: 'AUDITING', color: 'text-gold-400' },
    { ts: '16:05:02', exchange: 'COINBASE vs KRAKEN', pair: 'ETH/USDT', spread: '0.28 bps', status: 'AUDITING', color: 'text-gold-400' }
  ]);
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTicks((prev) => prev + 1);
      const isLoopCleared = Math.random() > 0.7;
      const mockSpread = (Math.random() * 0.4 + 0.05).toFixed(2);
      const newLog = {
        ts: new Date().toTimeString().split(' ')[0],
        exchange: Math.random() > 0.5 ? 'BINANCE vs COINBASE' : 'COINBASE vs KRAKEN',
        pair: Math.random() > 0.5 ? 'BTC/USDT' : 'ETH/USDT',
        spread: `${mockSpread} bps`,
        status: isLoopCleared ? 'LOOP CLEARED' : 'AUDITING',
        color: isLoopCleared ? 'text-emerald-400' : 'text-gold-400'
      };
      setSpreads((prev) => [newLog, ...prev].slice(0, 3));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3 flex-1 flex flex-col justify-between">
      <div className="bg-[#111111] p-3 rounded border border-zinc-800/80 space-y-2">
        <div className="flex justify-between items-center pb-1.5 border-b border-zinc-800 text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
          <span className="text-gold-400">SYS_BOT: HFT_ARBITRAGE_CONTROLLER_CLI</span>
          <span>SOCKETS active: 3 exchanges</span>
        </div>

        {/* Command line list */}
        <div className="space-y-1.5 font-mono text-[7.5px] p-2 bg-[#050505] rounded border border-zinc-850 min-h-[140px] select-none text-left">
          <div className="text-zinc-500 flex gap-1"><span className="text-gold-400">&gt;</span><span>python hft_controller.py --exchanges=binance,coinbase,kraken --mode=triangular</span></div>
          <div className="text-zinc-400 uppercase">[16:04:59] API SOCKETS ESTABLISHED CONCURRENTLY...</div>
          
          <div className="space-y-1 pt-1 border-t border-zinc-900">
            {spreads.map((log, lIdx) => (
              <div key={lIdx} className="flex justify-between leading-none text-zinc-450">
                <span>[{log.ts}] {log.exchange}</span>
                <span className="text-zinc-500">{log.pair}</span>
                <span className="text-zinc-300 font-bold">{log.spread}</span>
                <span className={`font-bold px-1 bg-zinc-900 border border-zinc-850 rounded-[1px] text-[6.5px] ${log.color}`}>{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-2 px-3 bg-gold-950/15 border border-gold-500/20 text-gold-400 rounded-[2px] leading-relaxed text-[8.5px] text-center font-mono">
        <strong>HIGH-FREQUENCY CLI BOT CONTROLLER</strong>: Automatically scans multi-exchange orderbook spreads and routes executions under sub-millisecond conditions.
      </div>
    </div>
  );
}
