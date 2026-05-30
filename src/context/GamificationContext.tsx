"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, TrendingUp, Bell } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'streak' | 'level' | 'achievement' | 'info';
}

interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastLogDate: string | null;
}

interface GamificationContextType {
  state: GamificationState;
  addXP: (amount: number) => void;
  logTrade: () => void;
  triggerToast: (title: string, message: string, type: Toast['type']) => void;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamificationState>({
    xp: 0,
    level: 1,
    streak: 0,
    lastLogDate: null,
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('EE_Gamification');
    if (saved) {
      setState(JSON.parse(saved));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('EE_Gamification', JSON.stringify(state));
  }, [state]);

  const triggerToast = (title: string, message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const addXP = (amount: number) => {
    setState((prev) => {
      const newXp = prev.xp + amount;
      const requiredXp = prev.level * 1000; // Formula for leveling up
      
      if (newXp >= requiredXp) {
        // Level Up!
        triggerToast(
          'Rank Promoted',
          `You have achieved Level ${prev.level + 1} Operator Status.`,
          'level'
        );
        return { ...prev, xp: newXp - requiredXp, level: prev.level + 1 };
      }
      
      return { ...prev, xp: newXp };
    });
  };

  const logTrade = () => {
    const today = new Date().toDateString();
    setState((prev) => {
      if (prev.lastLogDate === today) {
        // Already logged today, just add XP
        addXP(50);
        return prev;
      }

      // Check if it was yesterday to continue streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const isStreakMaintained = prev.lastLogDate === yesterday.toDateString();
      const newStreak = isStreakMaintained ? prev.streak + 1 : 1;

      if (newStreak === 3) triggerToast('Streak Initiated', '3 Days Consecutive Logging', 'streak');
      if (newStreak === 7) triggerToast('Discipline Master', '7 Days Consecutive Logging', 'streak');
      
      addXP(100); // More XP for logging a day
      
      return {
        ...prev,
        streak: newStreak,
        lastLogDate: today,
      };
    });
  };

  return (
    <GamificationContext.Provider value={{ state, addXP, logTrade, triggerToast }}>
      {children}
      
      {/* Toast Render System */}
      <div className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`p-4 rounded-xl border pointer-events-auto backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.8)] w-[300px] flex items-start gap-4 ${
                toast.type === 'streak' ? 'bg-orange-950/80 border-orange-500/50 text-orange-100' :
                toast.type === 'level' ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100' :
                'bg-gold-950/80 border-gold-500/50 text-gold-100'
              }`}
            >
              <div className={`mt-1 rounded-full p-2 ${
                toast.type === 'streak' ? 'bg-orange-500/20 text-orange-400' :
                toast.type === 'level' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-gold-500/20 text-gold-400'
              }`}>
                {toast.type === 'streak' && <Flame className="w-5 h-5" />}
                {toast.type === 'level' && <TrendingUp className="w-5 h-5" />}
                {toast.type === 'achievement' && <Trophy className="w-5 h-5" />}
                {toast.type === 'info' && <Bell className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs font-bold font-display tracking-widest uppercase mb-1">{toast.title}</h4>
                <p className="text-[10px] font-mono opacity-80 leading-relaxed">{toast.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GamificationContext.Provider>
  );
}

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) throw new Error('useGamification must be used within GamificationProvider');
  return context;
};
