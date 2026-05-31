import React from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { MarketTabs } from '@/components/markets/MarketTabs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Markets | Evil Elite Trading',
  description: 'Live institutional market data, charting, and analytics.',
};

export default function MarketsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Main Navbar */}
      <PublicNavbar />

      {/* Markets Secondary Navigation & Search */}
      <MarketTabs />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1512px] mx-auto px-4 md:px-12 py-6 relative z-10">
        {children}
      </main>

    </div>
  );
}
