'use client';

import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#020202] text-zinc-100 flex flex-col justify-center items-center font-sans">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.02),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gold-950/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative flex flex-col items-center space-y-6 max-w-sm text-center px-6">
        
        {/* Glowing visual container */}
        <div className="relative">
          {/* Pulsing ring outer */}
          <div className="absolute inset-0 rounded-full border border-gold-500/10 scale-150 animate-ping opacity-30" />
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-dashed border-gold-500/20 flex items-center justify-center relative bg-zinc-950 glow-gold"
          >
            <Activity className="w-6 h-6 text-gold-400" />
          </motion.div>
        </div>

        {/* Brand headers */}
        <div className="space-y-1.5 z-10 pt-2">
          <h2 className="text-sm font-display font-bold tracking-widest text-zinc-300 uppercase">
            EVIL ELITE
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span>Establishing Uplink</span>
          </div>
        </div>

        {/* Fading log messages */}
        <div className="font-mono text-[9px] text-zinc-600 space-y-1 bg-[#050505] border border-zinc-900/60 rounded-lg px-4 py-2 w-56 text-left">
          <div className="flex items-center gap-1">
            <span className="text-gold-500">&gt;</span> Syncing node signature...
          </div>
          <div className="flex items-center gap-1 opacity-50">
            <span className="text-zinc-700">&gt;</span> Verifying credentials...
          </div>
        </div>

      </div>
    </div>
  );
}
