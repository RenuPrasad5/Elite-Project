'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, User as UserIcon, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layout/PublicNavbar';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validation
    if (!termsAccepted) {
      setError('You must accept the Terms of Service and Risk Disclaimer to proceed.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your master password.');
      return;
    }
    if (password.length < 8) {
      setError('Security requirement: Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (signUpError) {
        setError(signUpError.message || 'Registration failed.');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during initialization.');
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

      <main className="flex-1 flex items-center justify-center p-6 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[500px]"
        >
          {/* Logo & Header */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#0B0B0B] border border-zinc-800 shadow-[0_0_30px_rgba(212,175,55,0.15)] mb-2">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <h1 className="text-3xl font-display font-extrabold uppercase tracking-widest text-zinc-100">
              Join the <span className="text-gold-400">Elite</span>
            </h1>
            <p className="text-xs font-mono text-zinc-500 tracking-wider leading-relaxed">
              CREATE YOUR OPERATOR PROFILE TO ACCESS <br /> INSTITUTIONAL CAPITAL ALLOCATIONS
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-[#0B0B0B] border border-zinc-800/80 p-8 rounded-sm shadow-2xl relative overflow-hidden backdrop-blur-sm">
            {/* Top gold border highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/80 to-transparent" />

            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Error Alert */}
              {error && (
                <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-mono text-rose-400 leading-relaxed">{error}</p>
                </div>
              )}

              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase">
                  Legal Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-4 w-4 text-zinc-600" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-[#111111] border border-zinc-800 focus:border-gold-500/50 text-zinc-200 text-sm rounded-sm py-2.5 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all font-mono"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase">
                  Primary Email Address
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
                    placeholder="operator@domain.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase">
                    Master Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-zinc-600" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full bg-[#111111] border border-zinc-800 focus:border-gold-500/50 text-zinc-200 text-sm rounded-sm py-2.5 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all font-mono"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-zinc-600" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full bg-[#111111] border border-zinc-800 focus:border-gold-500/50 text-zinc-200 text-sm rounded-sm py-2.5 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-gold-500/50 transition-all font-mono"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* TOS Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 bg-[#111111] border border-zinc-700 rounded-sm text-gold-500 focus:ring-gold-500 focus:ring-offset-[#050505]"
                  />
                </div>
                <label htmlFor="terms" className="text-[10px] font-mono text-zinc-500 leading-relaxed uppercase tracking-wider">
                  I acknowledge the high-risk nature of derivatives trading and accept the <Link href="/rules" className="text-gold-500 hover:text-gold-400 hover:underline">Terms of Service</Link> and Risk Disclaimer.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all cursor-pointer glow-gold shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    CREATING PROFILE...
                  </>
                ) : (
                  <>
                    INITIALIZE PROFILE <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center text-[11px] font-mono text-zinc-500 tracking-wider">
            ALREADY HAVE AN ACCOUNT?{' '}
            <Link href="/login" className="text-gold-500 hover:text-gold-400 font-bold border-b border-transparent hover:border-gold-500 transition-all">
              LOGIN HERE
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
