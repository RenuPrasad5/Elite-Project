'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export const PublicNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Conditional Navigation Links
  const publicLinks = [
    { label: 'HOME', href: '/' },
    { label: 'MARKETS', href: '/markets' },
    { label: 'PRODUCTS', href: '/products' },
    { label: 'ABOUT US', href: '/about' },
    { label: 'RULES', href: '/rules' },
    { label: 'RESULTS', href: '/results' },
    { label: 'FAQ', href: '/faq' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const authenticatedLinks = [
    { label: 'DASHBOARD', href: '/dashboard' },
    { label: 'MARKETS', href: '/markets' },
    { label: 'PRODUCTS', href: '/products' },
    { label: 'ABOUT US', href: '/about' },
    { label: 'RULES', href: '/rules' },
    { label: 'RESULTS', href: '/results' },
    { label: 'FAQ', href: '/faq' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const navLinks = user ? authenticatedLinks : publicLinks;

  const handleLogout = async () => {
    await signOut();
    setProfileDropdownOpen(false);
    router.push('/login');
  };

  return (
    <header className="w-full border-b border-zinc-900 bg-[#050505]/80 backdrop-blur-md z-50 sticky top-0 font-mono select-none">
      <div className="max-w-[1512px] w-full mx-auto h-20 px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <img src="/logo.png" alt="EvilElite Trading Logo" className="h-12 w-auto object-contain drop-shadow-md" />
          <span className="font-display font-extrabold tracking-[0.15em] text-lg text-zinc-100 uppercase leading-none hidden sm:block">EVIL ELITE</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-[10px] tracking-widest text-zinc-500 uppercase">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.label} 
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
          
          {loading ? (
            // Loading skeleton for auth state
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-20 h-8 bg-zinc-900 animate-pulse rounded-sm" />
              <div className="w-32 h-8 bg-zinc-900 animate-pulse rounded-sm" />
            </div>
          ) : user ? (
            // LOGGED IN STATE: Profile Dropdown
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] border border-zinc-800 hover:border-gold-500/30 text-zinc-300 text-[10px] uppercase tracking-widest rounded-sm transition-all cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-gold-400" />
                <span className="max-w-[100px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#0B0B0B] border border-zinc-800 rounded-sm overflow-hidden shadow-2xl py-1 flex flex-col"
                  >
                    <div className="px-4 py-2 border-b border-zinc-900 mb-1">
                      <p className="text-[9px] text-zinc-500 uppercase">Signed in as</p>
                      <p className="text-xs text-zinc-200 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); router.push('/dashboard'); }}
                      className="text-left px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-gold-400 hover:bg-[#111111] transition-colors"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => { setProfileDropdownOpen(false); router.push('/dashboard/profile'); }}
                      className="text-left px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-gold-400 hover:bg-[#111111] transition-colors"
                    >
                      Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="text-left px-4 py-2 text-[10px] uppercase tracking-widest text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3 h-3" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // LOGGED OUT STATE: Login / Register
            <div className="hidden sm:flex items-center gap-3">
              <button 
                onClick={() => router.push('/login')}
                className="px-4 py-1.5 text-zinc-300 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                LOGIN
              </button>
              <button 
                onClick={() => router.push('/pricing')}
                className="px-4 py-1.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all cursor-pointer glow-gold shadow-sm flex items-center gap-1"
              >
                START TRADING
              </button>
            </div>
          )}

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
                    key={link.label} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-4 rounded-sm transition-colors ${isActive ? 'bg-zinc-900 text-gold-400 font-bold' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-zinc-900 mt-2 flex flex-col gap-3">
                {user ? (
                  <>
                    <button 
                      onClick={() => { router.push('/dashboard'); setMobileMenuOpen(false); }}
                      className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-zinc-950 font-bold rounded-sm text-center tracking-widest"
                    >
                      DASHBOARD
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 bg-[#111111] border border-zinc-800 text-rose-500 font-bold rounded-sm text-center tracking-widest"
                    >
                      SIGN OUT
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { router.push('/login'); setMobileMenuOpen(false); }}
                      className="w-full py-3 bg-[#111111] border border-zinc-800 text-zinc-300 font-bold rounded-sm text-center tracking-widest"
                    >
                      LOGIN
                    </button>
                    <button 
                      onClick={() => { router.push('/pricing'); setMobileMenuOpen(false); }}
                      className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-zinc-950 font-bold rounded-sm text-center tracking-widest glow-gold"
                    >
                      START TRADING
                    </button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
