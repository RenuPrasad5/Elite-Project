import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { Lock } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="flex-1 bg-[#050505] text-zinc-100 flex flex-col relative overflow-hidden font-sans select-none min-h-screen">
      <PublicNavbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-20 mt-32">
        <div className="w-16 h-16 rounded-full bg-gold-950/20 border border-gold-500/30 flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-gold-400" />
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500 mb-4 text-center">
          PRICING MODULE SECURED
        </h1>
        <p className="text-zinc-500 font-mono tracking-widest text-xs max-w-md text-center leading-relaxed">
          THIS SECTOR OF THE PLATFORM IS CURRENTLY UNDER DEVELOPMENT. CHECK BACK LATER FOR INSTITUTIONAL ACCESS.
        </p>
      </main>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.035),transparent_60%)] pointer-events-none" />
    </div>
  );
}
