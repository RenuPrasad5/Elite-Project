'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn({ email, password });

    if (signInError) {
      setError(signInError.message || 'Invalid email or password.');
      setLoading(false);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md glass-panel-premium p-8 rounded-2xl glow-gold relative overflow-hidden">
      {/* Decorative top gold line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      
      {/* Logo Area */}
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center gap-4"
        >
          <img src="/logo.png" alt="EvilElite Trading Logo" className="h-16 w-auto object-contain drop-shadow-md" />
          <span className="font-display font-extrabold tracking-[0.15em] text-2xl text-zinc-100 uppercase leading-none">EVIL ELITE</span>
        </motion.div>
        <p className="text-xs text-zinc-500 tracking-wider uppercase mt-1">
          Secure Node Authentication
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-200 text-sm"
          >
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2" htmlFor="email">
            Security Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
              <Mail className="w-5 h-5" />
            </span>
            <input
              id="email"
              type="email"
              placeholder="operator@evilelite.club"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-gold-500/50 transition-colors text-sm"
              disabled={loading || authLoading}
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest" htmlFor="password">
              Access Cipher
            </label>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
              <Lock className="w-5 h-5" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-gold-500/50 transition-colors text-sm"
              disabled={loading || authLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || authLoading}
          className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 glow-gold glow-gold-hover disabled:opacity-50 disabled:pointer-events-none text-sm cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Initialize Session
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-zinc-900 pt-6">
        <p className="text-sm text-zinc-400">
          New operator?{' '}
          <Link href="/signup" className="text-gold-400 hover:text-gold-300 font-medium hover:underline transition-all">
            Request Clearance
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 bg-[#020202] relative">
      {/* Abstract dark luxury backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,131,32,0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-900/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center text-zinc-400">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-xs uppercase tracking-widest font-mono">Authenticating...</span>
        </div>
      }>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
