'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col relative overflow-hidden font-sans select-none pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.025),transparent_60%)] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full border-b border-zinc-900 bg-[#050505]/45 backdrop-blur-md z-30 relative font-mono select-none">
        <div className="max-w-[1512px] w-full mx-auto h-20 px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className="group flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-zinc-800 hover:border-gold-500/20 text-zinc-400 hover:text-gold-400 text-[9px] uppercase tracking-widest rounded-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              BACK TO CATALOG
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse rounded-full shrink-0" />
              <span className="text-[8.5px] text-zinc-500 tracking-widest uppercase font-bold">SECURE_CATALOG // ACTIVE_CART</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-gold-400 fill-current shrink-0">
              <path d="M50 10 L80 25 L80 60 C80 75, 50 90, 50 90 C50 90, 20 75, 20 60 L20 25 Z" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
              <path d="M35 32 H47 V38 H38 V44 H45 V50 H38 V56 H47 V62 H35 Z" fill="#D4AF37" />
              <path d="M65 32 H53 V38 H62 V44 H55 V50 H62 V56 H53 V62 H65 Z" fill="#D4AF37" />
            </svg>
          </div>
        </div>
      </header>

      <main className="max-w-[1512px] w-full mx-auto px-6 md:px-12 py-10 relative z-20">
        
        <div className="space-y-1 mb-8">
          <span className="text-[9px] text-gold-400 block uppercase tracking-widest font-bold">PENDING CLEARANCES</span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-wider text-zinc-200 leading-none">
            Your Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#0B0B0B] border border-zinc-900 rounded-sm p-12 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto" />
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Your cart is currently empty.</p>
            <Link href="/products" className="inline-block mt-4 px-6 py-3 bg-[#111111] border border-zinc-800 hover:border-gold-500/30 text-gold-400 font-mono text-[9px] uppercase tracking-widest font-bold transition-all">
              BROWSE CATALOG
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-[#0B0B0B] border border-zinc-800 rounded-sm p-4 flex gap-4 items-center relative overflow-hidden group hover:border-gold-500/30 transition-all">
                  <div className="w-24 h-16 bg-[#111111] rounded border border-zinc-900 overflow-hidden shrink-0 relative">
                    <img src={`/products/product_${item.id}.png`} alt={item.title} className="w-full h-full object-cover mix-blend-lighten" />
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <span className="text-[8px] font-mono text-gold-400 uppercase font-bold">{item.category}</span>
                    <h3 className="text-sm font-display font-bold text-zinc-200 leading-tight">{item.title}</h3>
                    <p className="text-[10px] text-zinc-500 font-sans line-clamp-1">{item.description}</p>
                  </div>
                  
                  <div className="text-right shrink-0 px-4">
                    <span className="text-sm font-mono font-bold text-gold-300 block">${item.price.toFixed(2)}</span>
                  </div>
                  
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-zinc-600 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#0B0B0B] border border-zinc-800 rounded-sm p-6 space-y-6 sticky top-24 font-mono">
                <div className="pb-4 border-b border-zinc-900">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order Summary</h3>
                </div>
                
                <div className="space-y-3 text-[11px] text-zinc-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="text-zinc-500">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-zinc-900 flex justify-between items-center text-sm font-bold">
                  <span className="text-zinc-200">Total</span>
                  <span className="text-gold-400 text-lg">${cartTotal.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full py-3.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-sm tracking-widest text-[9.5px] uppercase cursor-pointer glow-gold flex items-center justify-center gap-2 transition-all"
                >
                  PROCEED TO SECURE CHECKOUT <ArrowRight className="w-3.5 h-3.5" />
                </button>
                
                <div className="flex items-center justify-center gap-1.5 pt-2 text-[8px] text-emerald-500 font-bold tracking-widest uppercase">
                  <ShieldCheck className="w-3 h-3" />
                  <span>256-BIT SECURE ENCRYPTION</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
