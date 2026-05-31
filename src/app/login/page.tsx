'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await signIn({ email, password });
      
      if (signInError) {
        setError(signInError.message || 'Invalid email or password.');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans select-none">
      <PublicNavbar />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-20" />

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px]"
        >
          {/* Logo & Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0B0B0B] border border-zinc-800 shadow-[0_0_30px_rgba(212,175,55,0.15)] mb-2">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <h1 className="text-3xl font-display font-extrabold uppercase tracking-widest text-zinc-100">
              Operator <span className="text-gold-400">Login</span>
            </h1>
            <p className="text-xs font-mono text-zinc-500 tracking-wider">
              ENTER YOUR CREDENTIALS TO ACCESS THE TERMINAL
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#0B0B0B] border border-zinc-800/80 p-8 rounded-sm shadow-2xl relative overflow-hidden backdrop-blur-sm">
            {/* Top gold border highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/80 to-transparent" />

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-mono text-rose-400 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-600" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#111111] border border-zinc-800 focus:border-gold-500/50 text-zinc-200 text-sm rounded-sm py-2.5 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all font-mono"
                    placeholder="operator@evilelite.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase">
                    Master Password
                  </label>
                  <Link href="/reset-password" className="text-[9px] font-mono text-gold-500 hover:text-gold-400 transition-colors">
                    FORGOT PASSWORD?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-600" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#111111] border border-zinc-800 focus:border-gold-500/50 text-zinc-200 text-sm rounded-sm py-2.5 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 text-xs font-bold uppercase tracking-widest rounded-sm transition-all cursor-pointer glow-gold shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    INITIALIZE SESSION <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center text-[11px] font-mono text-zinc-500 tracking-wider">
            DON'T HAVE AN ALLOCATION YET?{' '}
            <Link href="/signup" className="text-gold-500 hover:text-gold-400 font-bold border-b border-transparent hover:border-gold-500 transition-all">
              ENROLL HERE
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
