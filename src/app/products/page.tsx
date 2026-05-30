'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Terminal,
  Activity,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Product, getProducts } from '@/lib/products';
import { motion } from 'framer-motion';

export default function MarketplacePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col relative overflow-hidden font-sans select-none pb-20">
      
      {/* Background radial coordinates mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.025),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(181,131,32,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(181,131,32,0.01)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-30" />

      {/* HEADER */}
      <header className="w-full border-b border-zinc-900 bg-[#050505]/45 backdrop-blur-md z-30 relative font-mono select-none">
        <div className="max-w-[1512px] w-full mx-auto h-20 px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/"
              className="group flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-zinc-800 hover:border-gold-500/20 text-zinc-400 hover:text-gold-400 text-[9px] uppercase tracking-widest rounded-sm transition-all cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
              HOME
            </Link>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold-500 animate-pulse rounded-full shrink-0" />
              <span className="text-[8.5px] text-zinc-500 tracking-widest uppercase font-bold">SECURE_CATALOG // MARKETPLACE_HUB</span>
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

      <main className="max-w-[1512px] w-full mx-auto px-6 md:px-12 py-12 md:py-20 relative z-20">
        
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/20 border border-gold-500/10 text-gold-400 text-[9px] font-mono uppercase tracking-widest block mx-auto font-bold">
            <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-gold-400" />
            <span>Proprietary SaaS Marketplace</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-widest uppercase text-zinc-100">
            ELITE TRADING ASSETS
          </h1>
          
          <p className="text-xs text-zinc-400 leading-relaxed max-w-lg mx-auto font-mono">
            Gain the ultimate edge with our institutional-grade algorithms, calculators, and specialized journals. Fully encrypted digital distribution.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col bg-[#0B0B0B] border border-zinc-900 rounded-sm overflow-hidden hover:border-gold-500/40 transition-all duration-300 relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Glow bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/20 to-transparent group-hover:via-gold-500/60 transition-all duration-500" />
                
                {/* Thumbnail Header */}
                <div className="relative h-48 w-full bg-[#111111] overflow-hidden border-b border-zinc-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_70%)]" />
                  
                  {/* Category icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    {product.file_type === 'pdf' ? <FileText className="w-32 h-32" /> :
                     product.file_type === 'xlsx' ? <Activity className="w-32 h-32" /> :
                     <Terminal className="w-32 h-32" />}
                  </div>

                  <img 
                    src={`/products/product_${product.id}.png`} 
                    alt={product.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 z-10 mix-blend-lighten"
                  />
                  
                  {product.badge && (
                    <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[8px] font-bold uppercase tracking-widest backdrop-blur-md rounded-[2px] shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-zinc-950/80 border border-zinc-800 text-zinc-300 font-mono text-[8px] font-bold uppercase tracking-widest backdrop-blur-md rounded-[2px]">
                    .{product.file_type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="space-y-2 mb-4">
                    <span className="text-[9px] font-mono text-gold-400 uppercase tracking-widest block font-bold">
                      {product.category}
                    </span>
                    <h2 className="text-lg font-display font-extrabold text-zinc-100 leading-tight">
                      {product.title}
                    </h2>
                    <p className="text-[11px] text-zinc-500 font-sans leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Spacer */}
                  <div className="flex-grow" />

                  {/* Pricing and Action */}
                  <div className="pt-4 mt-2 border-t border-zinc-900/80 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">CLEARANCE</span>
                      <span className="text-lg font-mono font-bold text-gold-300">${product.price.toFixed(2)}</span>
                    </div>
                    
                    <button 
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="px-4 py-2 bg-[#111111] border border-zinc-800 group-hover:border-gold-500/40 group-hover:bg-gold-500/10 text-zinc-300 group-hover:text-gold-400 font-mono text-[9px] uppercase tracking-widest font-bold rounded-[2px] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      VIEW ASSET <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
