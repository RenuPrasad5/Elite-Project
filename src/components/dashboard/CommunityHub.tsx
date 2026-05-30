import React, { useState } from 'react';
import { Users, Trophy, MessageSquare, UserCircle, MessageCircle, ExternalLink, ShieldCheck, Flame, Star, Target, TrendingUp, ChevronUp, ChevronDown, Award, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// --- MOCK DATA ---
const MOCK_LEADERBOARD = [
  { rank: 1, handle: 'Phantom_FX', pnl: 142500, winRate: 78, change: 0, badges: ['Whale', 'Sniper', 'Funded'] },
  { rank: 2, handle: 'Ghost_Trader', pnl: 98200, winRate: 64, change: 2, badges: ['Funded', 'Consistent'] },
  { rank: 3, handle: 'VoidCapital', pnl: 85100, winRate: 71, change: -1, badges: ['Sniper', 'Funded'] },
  { rank: 4, handle: 'NQ_Assassin', pnl: 62450, winRate: 58, change: 1, badges: ['Funded'] },
  { rank: 5, handle: 'Dark_Pool_Surfer', pnl: 41900, winRate: 60, change: -2, badges: [] },
  { rank: 6, handle: 'Apex_Predator', pnl: 38500, winRate: 82, change: 5, badges: ['Sniper'] },
  { rank: 7, handle: 'Zenith', pnl: 29000, winRate: 55, change: 0, badges: ['Consistent'] },
  { rank: 8, handle: 'Liquidator', pnl: 24100, winRate: 49, change: -1, badges: [] },
];

const MOCK_FEED = [
  { id: 1, user: 'Phantom_FX', type: 'milestone', content: 'Just secured a $300k allocation. Evil Elite system is unmatched.', time: '2m ago', likes: 45 },
  { id: 2, user: 'NQ_Assassin', type: 'trade', content: 'Caught a beautiful 4R short on NQ off the 1H FVG. Clean setup.', time: '15m ago', likes: 12 },
  { id: 3, user: 'SYSTEM', type: 'alert', content: 'Ghost_Trader has just entered the Top 3 Leaderboard.', time: '1h ago', likes: 89 },
  { id: 4, user: 'VoidCapital', type: 'trade', content: 'Choppy PA today. Staying out until NY session opens. Discipline > Action.', time: '3h ago', likes: 34 },
];

export const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'feed' | 'profile'>('leaderboard');
  const { user } = useAuth();
  const userHandle = user?.email?.split('@')[0] || 'Unknown_Operator';

  const renderBadges = (badges: string[]) => {
    return badges.map(badge => {
      let colors = '';
      let Icon = ShieldCheck;
      if (badge === 'Whale') { colors = 'bg-purple-500/10 text-purple-400 border-purple-500/20'; Icon = Star; }
      else if (badge === 'Sniper') { colors = 'bg-rose-500/10 text-rose-400 border-rose-500/20'; Icon = Target; }
      else if (badge === 'Funded') { colors = 'bg-gold-500/10 text-gold-400 border-gold-500/20'; Icon = Award; }
      else if (badge === 'Consistent') { colors = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'; Icon = Flame; }
      
      return (
        <span key={badge} className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-widest ${colors}`}>
          <Icon className="w-3 h-3" /> {badge}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Internal Nav */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-gold-400" />
          <div>
            <h2 className="text-xl font-bold font-mono tracking-widest text-zinc-100 uppercase">Community Hub</h2>
            <p className="text-xs text-zinc-500 font-mono">Global rankings & operator network</p>
          </div>
        </div>

        <div className="flex w-full md:w-auto overflow-x-auto bg-zinc-950 border border-zinc-900 rounded p-1 custom-scrollbar">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'leaderboard' ? 'bg-zinc-900 text-gold-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Trophy className="w-3 h-3" /> Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'feed' ? 'bg-zinc-900 text-gold-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <MessageSquare className="w-3 h-3" /> Network Feed
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'profile' ? 'bg-zinc-900 text-gold-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <UserCircle className="w-3 h-3" /> My Profile
          </button>
        </div>
      </div>

      {/* --- LEADERBOARD VIEW --- */}
      {activeTab === 'leaderboard' && (
        <div className="bg-[#020202] border border-zinc-900 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-900 bg-zinc-950/50 flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-500" /> Global Elite Rankings
            </h3>
            <span className="text-[10px] text-zinc-600 font-mono">Season 14 • Ends in 12d</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-900 text-[10px] uppercase tracking-widest text-zinc-500">
                  <th className="p-4 font-bold text-center w-16">Rank</th>
                  <th className="p-4 font-bold">Operator</th>
                  <th className="p-4 font-bold">Badges</th>
                  <th className="p-4 font-bold text-right">Win Rate</th>
                  <th className="p-4 font-bold text-right">Net PnL</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono">
                {MOCK_LEADERBOARD.map((trader) => (
                  <tr key={trader.rank} className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-colors">
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <span className={`font-bold ${trader.rank <= 3 ? 'text-gold-400 text-lg' : 'text-zinc-400'}`}>
                          #{trader.rank}
                        </span>
                        {trader.change !== 0 && (
                          <div className={`flex items-center text-[9px] ${trader.change > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                            {trader.change > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {Math.abs(trader.change)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-zinc-200">
                      {trader.handle}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        {renderBadges(trader.badges)}
                      </div>
                    </td>
                    <td className="p-4 text-right text-zinc-300">
                      {trader.winRate}%
                    </td>
                    <td className={`p-4 text-right font-bold ${trader.pnl > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                      ${trader.pnl.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {/* Current User Docked at Bottom */}
                <tr className="bg-gold-500/5 border-t border-gold-500/20">
                  <td className="p-4 text-center">
                    <span className="font-bold text-zinc-500">#4,291</span>
                  </td>
                  <td className="p-4 font-bold text-gold-400 flex items-center gap-2">
                    {userHandle} <span className="text-[9px] bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded uppercase">You</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] text-zinc-600 italic">No badges earned</span>
                  </td>
                  <td className="p-4 text-right text-zinc-400">-</td>
                  <td className="p-4 text-right font-bold text-zinc-400">$0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- FEED VIEW --- */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Discord Banner */}
          <div className="relative overflow-hidden bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5865F2]/20 blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-widest text-[#5865F2] mb-1">Elite Alpha Discord</h3>
                <p className="text-[11px] font-mono text-zinc-400">Sync your account to access private trade floors and live alerts.</p>
              </div>
            </div>
            <button className="relative z-10 whitespace-nowrap bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(88,101,242,0.3)]">
              Join Server <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Social Feed */}
          <div className="space-y-4">
            {MOCK_FEED.map((post) => (
              <div key={post.id} className="p-5 bg-[#020202] border border-zinc-900 rounded-xl flex gap-4">
                <div className={`w-10 h-10 rounded-md shrink-0 flex items-center justify-center font-bold text-xs ${post.user === 'SYSTEM' ? 'bg-gold-500 text-black' : 'bg-zinc-900 text-zinc-400'}`}>
                  {post.user === 'SYSTEM' ? 'EE' : post.user.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className={`font-bold font-mono text-sm ${post.user === 'SYSTEM' ? 'text-gold-400' : 'text-zinc-200'}`}>
                      {post.user}
                    </h4>
                    <span className="text-[10px] text-zinc-600 font-mono">{post.time}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-3 font-mono">{post.content}</p>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    <button className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                      <TrendingUp className="w-3 h-3" /> {post.likes} Respect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PROFILE VIEW --- */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            {/* Identity Card */}
            <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-gold-500 to-zinc-800" />
              <div className="w-24 h-24 mx-auto rounded-full bg-zinc-900 border-4 border-zinc-950 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <UserCircle className="w-12 h-12 text-zinc-700" />
              </div>
              <h3 className="text-xl font-bold font-mono text-zinc-100">{userHandle}</h3>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mt-1 mb-4">Unranked Operator</p>
              <div className="pt-4 border-t border-zinc-900/50 flex justify-center gap-2 flex-wrap">
                <span className="text-[9px] text-zinc-600 border border-zinc-800 px-2 py-1 rounded uppercase">No Badges Unlocked</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {/* Lifetime Stats Placeholder */}
            <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-900 pb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-gold-500" /> Lifetime Public Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-950/50 border border-zinc-900/50 rounded-lg text-center">
                  <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Total Net PnL</span>
                  <span className="text-2xl font-bold font-mono text-zinc-300">$0.00</span>
                </div>
                <div className="p-4 bg-zinc-950/50 border border-zinc-900/50 rounded-lg text-center">
                  <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Global Rank</span>
                  <span className="text-2xl font-bold font-mono text-zinc-300">#4,291</span>
                </div>
                <div className="p-4 bg-zinc-950/50 border border-zinc-900/50 rounded-lg text-center">
                  <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Win Rate</span>
                  <span className="text-2xl font-bold font-mono text-zinc-300">0.0%</span>
                </div>
                <div className="p-4 bg-zinc-950/50 border border-zinc-900/50 rounded-lg text-center">
                  <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Followers</span>
                  <span className="text-2xl font-bold font-mono text-zinc-300">0</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
