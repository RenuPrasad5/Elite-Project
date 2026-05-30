'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.025),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gold-950/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl glow-gold relative overflow-hidden space-y-6 text-center">
        {/* Decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

        {/* Brand visual header */}
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gold-950/40 border border-gold-500/20 text-gold-400 mb-4"
          >
            <ShieldCheck className="w-6 h-6 text-gold-400" />
          </motion.div>
          
          <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
            Clearance 404
          </h2>
          <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mt-1">
            Uplink Pathway Not Mapped
          </p>
        </div>

        {/* Detailed context message */}
        <div className="space-y-3 font-mono text-[10px] text-zinc-500 bg-[#050505] p-4 rounded-lg border border-zinc-900 leading-relaxed text-left">
          <div className="flex items-center gap-1.5 text-gold-400 uppercase tracking-widest mb-1">
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span>Telemetry report</span>
          </div>
          <span>
            The cryptographic coordinates you requested do not correlate to any valid administrative or marketplace directory entries. Access credentials rejected.
          </span>
        </div>

        {/* Action redirection */}
        <div className="pt-2">
          <Link
            href="/"
            className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 glow-gold text-xs font-mono tracking-widest uppercase cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-zinc-950" />
            Return Operator Home
          </Link>
        </div>

      </div>
    </div>
  );
}
