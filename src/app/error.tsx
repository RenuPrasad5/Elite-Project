'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, ArrowLeft, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log system errors securely
    console.error('Production Edge Interruption:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Radial grid backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.02),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-950/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border-red-500/10 relative overflow-hidden space-y-6 text-center">
        {/* Red Warning Glow Top highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        {/* Shock Warning Symbol */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-red-950/40 border border-red-500/20 text-red-400 mx-auto"
        >
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </motion.div>

        {/* Title details */}
        <div className="space-y-2">
          <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
            Handshake Interrupted
          </h2>
          <p className="text-xs text-zinc-500 font-mono">
            Uplink Degraded: Connection anomaly detected on core nodes.
          </p>
        </div>

        {/* Crash Log Screen */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest pl-1">
            <Terminal className="w-3 h-3 text-red-400" />
            <span>Diagnostics code</span>
          </div>
          <div className="bg-[#050505] border border-zinc-900 rounded-lg p-4 font-mono text-[10px] text-red-300 overflow-x-auto max-h-[120px] scrollbar-thin">
            <span className="text-red-500 font-bold">SYSTEM ERROR:</span> {error.message || 'Verification token degradation.'}
            {error.digest && (
              <div className="text-[9px] text-zinc-600 mt-1 uppercase">Digest Signature: {error.digest}</div>
            )}
          </div>
        </div>

        {/* Action Panel Buttons */}
        <div className="flex flex-col gap-3 pt-2 text-xs font-mono font-bold">
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-zinc-950 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            Re-establish Handshake
          </button>
          
          <Link
            href="/dashboard"
            className="w-full py-3 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-300 hover:text-zinc-200 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Safety Node Home
          </Link>
        </div>

      </div>
    </div>
  );
}
