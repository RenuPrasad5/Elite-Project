'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

function CancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'transaction';

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Glow backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[35rem] h-[35rem] bg-rose-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.015),transparent_60%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 relative z-10 text-center space-y-6 hover:border-rose-500/25 transition-all duration-500"
      >
        {/* Animated Cancel icon */}
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto relative">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <h2 className="text-xl font-display font-extrabold tracking-widest bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent uppercase">
            Checkout Aborted
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
            Signature Verification Interrupted
          </p>
        </div>

        {/* Informative text */}
        <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
          The Stripe transaction flow was terminated by the user or timed out. No credit card charges were processed, and access remains locked.
        </p>

        {/* Navigation flows */}
        <div className="grid grid-cols-1 gap-2 pt-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Control Hub</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020202] text-zinc-100 flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest font-mono text-zinc-500">Cancelling Session...</span>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
