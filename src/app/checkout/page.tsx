'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, ShieldCheck, Lock, CreditCard, CheckCircle2, ChevronRight, Activity, Star } from 'lucide-react';

const PLAN_PRICES: Record<string, number> = {
  Starter: 29.00,
  Pro: 99.00,
  Elite: 199.00,
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  
  const { items, cartTotal } = useCart();
  const { user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Determine flow type
  const isSubscriptionFlow = !!plan && Object.keys(PLAN_PRICES).includes(plan);
  
  // Base calculations
  const baseTotal = isSubscriptionFlow ? PLAN_PRICES[plan as string] : cartTotal;
  const taxRate = 0.08;
  const taxAmount = baseTotal * taxRate;
  const discountAmount = couponApplied ? baseTotal * 0.1 : 0; // 10% mock discount
  const finalTotal = baseTotal + taxAmount - discountAmount;

  const handleStripeCheckout = async () => {
    if (!isSubscriptionFlow && items.length === 0) {
      alert("Cart is empty.");
      return;
    }
    if (!email) {
      alert("Please enter a valid email for the clearance receipt.");
      return;
    }

    setProcessing(true);
    try {
      const payload: any = {
        userId: user?.id || `guest_${Math.random().toString(36).substring(7)}`,
        email,
      };

      if (isSubscriptionFlow) {
        payload.planId = plan;
      } else {
        payload.productIds = items.map(item => item.id);
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      } else if (data.simulated) {
        // Fallback simulation
        setTimeout(() => {
          if (isSubscriptionFlow) {
            router.push(`/checkout/success?type=subscription&tier=${plan}`);
          } else {
            router.push(`/checkout/success?type=product&productIds=${payload.productIds.join(',')}`);
          }
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to initialize payment gateway.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Payment system error.');
      setProcessing(false);
    }
  };

  if (!isSubscriptionFlow && items.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <Activity className="w-8 h-8 text-rose-500 animate-pulse" />
        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">CLEARANCE NODE EMPTY</span>
        <button onClick={() => router.push('/products')} className="text-gold-400 font-mono text-[9px] hover:text-gold-300">RETURN TO CATALOG</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col relative overflow-hidden font-sans select-none pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(181,131,32,0.015),transparent_50%)] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full border-b border-zinc-900 bg-[#050505]/80 backdrop-blur-md z-30 relative font-mono select-none py-4">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 100 100" className="w-6 h-6 text-gold-400 fill-current shrink-0">
              <path d="M50 10 L80 25 L80 60 C80 75, 50 90, 50 90 C50 90, 20 75, 20 60 L20 25 Z" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
              <path d="M35 32 H47 V38 H38 V44 H45 V50 H38 V56 H47 V62 H35 Z" fill="#D4AF37" />
              <path d="M65 32 H53 V38 H62 V44 H55 V50 H62 V56 H53 V62 H65 Z" fill="#D4AF37" />
            </svg>
            <span className="font-display font-extrabold tracking-[0.25em] text-[10px] text-zinc-100 uppercase">EVILELITE CHECKOUT</span>
          </div>
          <div className="flex items-center gap-1.5 text-[8px] text-emerald-500 font-bold tracking-widest uppercase bg-emerald-950/20 px-3 py-1 rounded-sm border border-emerald-500/20 hidden sm:flex">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECURE 256-BIT ENCRYPTION</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] w-full mx-auto px-6 py-10 relative z-20">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 font-mono text-[9px] uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> BACK
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT SIDE: ORDER SUMMARY & DETAILS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold uppercase tracking-wider text-zinc-200">
                Order Specifications
              </h2>
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                Review your {isSubscriptionFlow ? 'institutional clearance' : 'digital clearances'}
              </p>
            </div>

            <div className="bg-[#0B0B0B] border border-zinc-800 rounded-sm p-1">
              {isSubscriptionFlow ? (
                <div className="p-6 flex flex-col justify-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-950/20 border border-gold-500/10 text-gold-400 text-[9px] font-mono uppercase tracking-widest font-bold w-fit mb-2">
                    <Star className="w-3.5 h-3.5 shrink-0 text-gold-400" />
                    <span>Monthly Subscription</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-zinc-200 tracking-widest uppercase">
                    {plan} Clearance Tier
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-mono font-black text-gold-400">${baseTotal.toFixed(2)}</span>
                    <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">/ month</span>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-zinc-900/60">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 flex gap-4 items-center">
                      <div className="w-16 h-16 bg-[#111111] rounded border border-zinc-900 overflow-hidden shrink-0 relative">
                        <img src={`/products/product_${item.id}.png`} alt={item.title} className="w-full h-full object-cover mix-blend-lighten" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-zinc-950 text-[8px] font-bold flex items-center justify-center rounded-full border border-zinc-950">
                          {item.cartQuantity}
                        </div>
                      </div>
                      
                      <div className="flex-grow space-y-1">
                        <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest block">{item.category}</span>
                        <h3 className="text-xs font-display font-bold text-zinc-200">{item.title}</h3>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-zinc-300">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Included Value Drops */}
            <div className="bg-emerald-950/10 border border-emerald-500/10 rounded-sm p-4 space-y-2">
              <span className="text-[9px] text-emerald-500 font-mono font-bold uppercase tracking-widest block mb-3">INSTANT ALLOCATION INCLUDES:</span>
              {[
                'Lifetime digital access & version updates',
                'Priority secure node support',
                'Institutional configuration keys'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[10px] text-zinc-400 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: PAYMENT & BILLING */}
          <div className="lg:col-span-6">
            <div className="bg-[#0B0B0B] border border-zinc-800 rounded-sm p-6 space-y-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-t-[2px] border-t-gold-500/60">
              {/* Scanline */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20" />

              <div className="space-y-6 relative z-10">
                
                {/* Contact Information */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-2">
                    Contact Node
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Transmission Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@network.com"
                      className="w-full bg-[#111111] border border-zinc-800 focus:border-gold-500/50 px-3 py-2.5 text-xs text-zinc-200 rounded outline-none font-mono transition-colors"
                    />
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-900 pb-2">
                    Access Codes
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="ENTER CLEARANCE CODE"
                      className="flex-grow bg-[#111111] border border-zinc-800 focus:border-gold-500/50 px-3 py-2.5 text-xs text-zinc-200 rounded outline-none font-mono uppercase transition-colors"
                    />
                    <button 
                      onClick={() => setCouponApplied(true)}
                      disabled={!coupon}
                      className="px-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono text-[9px] uppercase tracking-widest font-bold rounded transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <div className="text-[9px] text-emerald-500 font-mono uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> CODE ACCEPTED: 10% SECURED
                    </div>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="space-y-3 pt-4 border-t border-zinc-900 font-mono">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Subtotal</span>
                    <span>${baseTotal.toFixed(2)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-[11px] text-emerald-500">
                      <span>Discount (10%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Tax (8% Est)</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-zinc-800/60">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Total Clearance</span>
                    <span className="text-xl font-bold text-gold-400 leading-none">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trust Badges & Action */}
                <div className="space-y-4 pt-4">
                  <button
                    onClick={handleStripeCheckout}
                    disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-sm tracking-widest text-[10px] uppercase cursor-pointer glow-gold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        INITIALIZING SECURE TUNNEL...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        PROCEED TO SECURE PAYMENT <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[8px] font-mono uppercase tracking-widest">Encrypted Checkout via Stripe</span>
                    </div>
                    {/* Simulated Trust Badges */}
                    <div className="flex items-center gap-4 opacity-50 grayscale select-none">
                       <div className="h-4 w-12 bg-zinc-800 rounded flex items-center justify-center text-[6px] font-bold text-zinc-500">VISA</div>
                       <div className="h-4 w-12 bg-zinc-800 rounded flex items-center justify-center text-[6px] font-bold text-zinc-500">MC</div>
                       <div className="h-4 w-12 bg-zinc-800 rounded flex items-center justify-center text-[6px] font-bold text-zinc-500">AMEX</div>
                       <div className="h-4 w-12 bg-zinc-800 rounded flex items-center justify-center text-[6px] font-bold text-zinc-500">APPLE</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <Activity className="w-8 h-8 text-gold-500 animate-pulse" />
        <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">INITIALIZING CHECKOUT TUNNEL...</span>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
