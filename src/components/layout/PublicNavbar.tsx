'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PublicNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'PRODUCTS', href: '/products' },
    { label: 'ABOUT US', href: '/about' },
    { label: 'PROGRAMS', href: '/programs' },
    { label: 'RULES', href: '/rules' },
    { label: 'RESULTS', href: '/results' },
    { label: 'FAQ', href: '/faq' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <header className="w-full border-b border-zinc-900 bg-[#050505]/80 backdrop-blur-md z-50 sticky top-0 font-mono select-none">
      <div className="max-w-[1512px] w-full mx-auto h-20 px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <svg viewBox="0 0 100 100" className="w-9 h-9 text-gold-400 fill-current shrink-0">
            <path d="M50 10 L80 25 L80 60 C80 75, 50 90, 50 90 C50 90, 20 75, 20 60 L20 25 Z" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
            <path d="M50 16 L74 28 L74 58 C74 70, 50 82, 50 82 C50 82, 26 70, 26 58 L26 28 Z" fill="rgba(212,175,55,0.03)" />
            <path d="M35 32 H47 V38 H38 V44 H45 V50 H38 V56 H47 V62 H35 Z" fill="#D4AF37" />
            <path d="M65 32 H53 V38 H62 V44 H55 V50 H62 V56 H53 V62 H65 Z" fill="#D4AF37" />
            <line x1="50" y1="24" x2="50" y2="76" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
          <div className="flex flex-col">
            <span className="font-display font-extrabold tracking-[0.25em] text-xs text-zinc-100 uppercase leading-none">EVILELITE</span>
            <span className="text-[7.5px] font-mono tracking-[0.4em] text-gold-400 uppercase font-black pl-0.5 mt-0.5 leading-none">TRADING</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-[10px] tracking-widest text-zinc-500 uppercase">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`transition-colors py-1 ${isActive ? 'text-gold-400 font-bold border-b border-gold-400' : 'hover:text-zinc-200'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="hidden sm:flex px-3.5 py-1.5 bg-[#111111] border border-zinc-800 hover:border-gold-500/30 text-zinc-300 text-[9px] uppercase tracking-widest rounded-sm transition-all cursor-pointer items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-zinc-400 fill-current shrink-0">
              <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
            </svg>
            DASHBOARD
          </button>
          
          <button 
            onClick={() => router.push('/pricing')}
            className="px-4 py-1.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 text-[9px] font-bold uppercase tracking-widest rounded-sm transition-all cursor-pointer glow-gold shadow-sm flex items-center gap-1"
          >
            GET FUNDED <span className="font-sans font-black">→</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-1.5 text-zinc-400 hover:text-gold-400 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-zinc-900 bg-[#050505] overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-4 text-xs tracking-widest uppercase">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-4 rounded-sm transition-colors ${isActive ? 'bg-zinc-900 text-gold-400 font-bold' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-zinc-900 mt-2">
                <button 
                  onClick={() => { router.push('/dashboard'); setMobileMenuOpen(false); }}
                  className="w-full py-3 mb-3 bg-[#111111] border border-zinc-800 text-zinc-300 font-bold rounded-sm text-center"
                >
                  ENTER DASHBOARD
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
