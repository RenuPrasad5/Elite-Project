'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Activity, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex-1 bg-[#020202] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.03),transparent_70%)] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-gold-950/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gold-900/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-4xl w-full text-center space-y-8 relative z-10 py-16">
        
        {/* Top badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/30 border border-gold-500/20 text-gold-400 text-xs font-mono uppercase tracking-widest"
        >
          <Star className="w-3 h-3 fill-gold-400" />
          Next-Gen Institutional Derivative Node
        </motion.div>

        {/* Hero title */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-extrabold tracking-widest uppercase leading-tight bg-clip-text text-transparent bg-gradient-to-b from-zinc-50 to-zinc-400"
          >
            EVIL ELITE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-sm md:text-base text-zinc-400 font-sans tracking-wide leading-relaxed"
          >
            Execute high-frequency derivatives with institutional precision. Protected by military-grade multi-signature clearing networks. Complete sovereignty over your assets.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 glow-gold glow-gold-hover text-sm cursor-pointer"
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-950 border border-zinc-800 hover:border-gold-500/30 text-zinc-300 hover:text-gold-400 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            Operator Login
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-zinc-900/55"
        >
          <div className="glass-panel p-6 rounded-xl text-left space-y-3">
            <div className="p-3 rounded-lg bg-gold-950/20 border border-gold-500/10 text-gold-400 w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-zinc-200 tracking-wider text-sm">Ultra-Low Latency</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Sub-millisecond execution engine built for professional and institutional high-frequency order placement.</p>
          </div>

          <div className="glass-panel p-6 rounded-xl text-left space-y-3">
            <div className="p-3 rounded-lg bg-gold-950/20 border border-gold-500/10 text-gold-400 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-zinc-200 tracking-wider text-sm">Supabase Custody</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Robust session tracking, stateless JSON web token controls, and zero-knowledge data authorization.</p>
          </div>

          <div className="glass-panel p-6 rounded-xl text-left space-y-3">
            <div className="p-3 rounded-lg bg-gold-950/20 border border-gold-500/10 text-gold-400 w-fit">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-zinc-200 tracking-wider text-sm">Leveraged Matrices</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Isolated leverage controls up to 100x on institutional-grade liquid derivative pools.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
