'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProducts, updateLocalSubscription, purchaseProduct, Product } from '@/lib/products';
import { ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const type = searchParams.get('type');
  const tier = searchParams.get('tier') as 'Starter' | 'Pro' | 'Elite' | null;
  const productIdsParam = searchParams.get('productIds') || searchParams.get('productId');
  const sessionId = searchParams.get('session_id') || `sim_sess_${Math.random().toString(36).substring(7)}`;

  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    async function syncClearance() {
      if (!user) return;
      
      try {
        // Sync one-time digital purchase locally if simulated checkout
        if (type === 'product' && productIdsParam) {
          const ids = productIdsParam.split(',').map(Number);
          
          // Resolve product titles
          const allProducts = await getProducts();
          const purchased = allProducts.filter((item) => ids.includes(item.id));
          if (purchased.length > 0) setPurchasedProducts(purchased);

          // Force client local storage fallback sync (guarantees local sync instantly)
          for (const id of ids) {
            await purchaseProduct(user.id, id);
          }
        }

        // Sync subscription tier locally if simulated
        if (type === 'subscription' && tier) {
          await updateLocalSubscription(user.id, tier);
        }
      } catch (err) {
        console.error('Error syncing local fallback checkout record:', err);
      } finally {
        // Luxury timing delay for terminal styling
        setTimeout(() => setSyncing(false), 1500);
      }
    }

    syncClearance();
  }, [user, type, productIdsParam, tier]);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[35rem] h-[35rem] bg-gold-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(181,131,32,0.01),transparent_60%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel-premium rounded-2xl glow-gold p-8 relative z-10 text-center space-y-6"
      >
        {/* Animated Check icon */}
        <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/35 flex items-center justify-center mx-auto relative group">
          <CheckCircle2 className="w-8 h-8 text-gold-400 animate-pulse" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.15 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-gold-500"
          />
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <h2 className="text-xl font-display font-extrabold tracking-widest bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent uppercase">
            Payment Completed
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
            Clearance Authorized Successfully
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-[#050505] border border-zinc-900 rounded-xl p-4 text-left font-mono text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-900/60">
            <span className="text-zinc-500 uppercase text-[9px] tracking-wider">Transaction Node</span>
            <span className="text-gold-400 text-[10px] font-bold">SECURE_PAYMENT_NODE</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-zinc-500">Checkout Type:</span>
              <span className="text-zinc-300 uppercase font-semibold">{type || 'N/A'}</span>
            </div>
            
            {type === 'subscription' && tier && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Unlocked Tier:</span>
                <span className="text-gold-400 font-bold uppercase">{tier} Membership</span>
              </div>
            )}

            {type === 'product' && purchasedProducts.length > 0 && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Unlocked Asset(s):</span>
                <span className="text-zinc-200 font-semibold truncate max-w-[180px]">
                  {purchasedProducts.length === 1 
                    ? purchasedProducts[0].title 
                    : `${purchasedProducts.length} Items Cleared`}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-zinc-500">Receipt Hash:</span>
              <span className="text-zinc-400 font-mono text-[9px] truncate max-w-[150px]">{sessionId}</span>
            </div>
          </div>
        </div>

        {/* Status logs */}
        <div className="space-y-2">
          {syncing ? (
            <div className="flex items-center justify-center gap-2 text-zinc-500 font-mono text-[10px]">
              <div className="w-3 h-3 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              <span>SYNCING OPERATOR LICENSES...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Clearance levels synced globally</span>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => router.push('/dashboard')}
          disabled={syncing}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 disabled:from-zinc-800 disabled:to-zinc-900 text-zinc-950 disabled:text-zinc-500 font-bold rounded-xl transition-all duration-300 glow-gold cursor-pointer text-xs uppercase tracking-widest disabled:pointer-events-none"
        >
          <span>Return to control hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020202] text-zinc-100 flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest font-mono text-zinc-500">Confirming Transaction Node...</span>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
