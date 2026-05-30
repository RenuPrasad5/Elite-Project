import React, { useState, useEffect } from 'react';
import { Users, Trophy, MessageSquare, UserCircle, MessageCircle, ExternalLink, ShieldCheck, Flame, Star, Target, TrendingUp, ChevronUp, ChevronDown, Award, Activity, Edit2, Check, X, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

// --- MOCK FEED ---
const MOCK_FEED = [
  { id: 1, user: 'Phantom_FX', type: 'milestone', content: 'Just secured a $300k allocation. Evil Elite system is unmatched.', time: '2m ago', likes: 45 },
  { id: 2, user: 'NQ_Assassin', type: 'trade', content: 'Caught a beautiful 4R short on NQ off the 1H FVG. Clean setup.', time: '15m ago', likes: 12 },
  { id: 3, user: 'SYSTEM', type: 'alert', content: 'Ghost_Trader has just entered the Top 3 Leaderboard.', time: '1h ago', likes: 89 },
  { id: 4, user: 'VoidCapital', type: 'trade', content: 'Choppy PA today. Staying out until NY session opens. Discipline > Action.', time: '3h ago', likes: 34 },
];

export const CommunityHub = () => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'feed' | 'profile'>('leaderboard');
  const { user } = useAuth();
  
  // State
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editHandle, setEditHandle] = useState('');
  const [editBio, setEditBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Discord State
  const [connectingDiscord, setConnectingDiscord] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Leaderboard
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('total_pnl', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      
      // Calculate ranks
      const rankedProfiles = (profiles || []).map((p, idx) => ({
        ...p,
        computedRank: idx + 1
      }));
      setLeaderboard(rankedProfiles);

      // 2. Fetch User Profile
      if (user) {
        let { data: myProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create a default one
          const defaultHandle = `Operator_${user.id.substring(0,6)}`;
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              user_id: user.id,
              handle: defaultHandle,
              bio: 'New Operator in the terminal.',
              win_rate: 0,
              total_pnl: 0,
              badges: []
            })
            .select()
            .single();
            
          if (!insertError) {
            myProfile = newProfile;
          }
        }
        
        setUserProfile(myProfile);
        setEditHandle(myProfile?.handle || '');
        setEditBio(myProfile?.bio || '');
      }

    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !userProfile) return;
    setSavingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ handle: editHandle, bio: editBio })
        .eq('id', userProfile.id)
        .select()
        .single();

      if (error) throw error;
      
      setUserProfile(data);
      setIsEditing(false);
      
      // Refresh leaderboard if handle changed
      fetchData();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      alert(error.message || 'Failed to update profile handle. It may already be taken.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleConnectDiscord = () => {
    if (!user || !userProfile) return;
    setConnectingDiscord(true);
    
    // Simulate OAuth Delay
    setTimeout(async () => {
      try {
        const simulatedDiscordUser = `${editHandle || 'User'}#${Math.floor(Math.random() * 9000 + 1000)}`;
        const { data, error } = await supabase
          .from('profiles')
          .update({ discord_username: simulatedDiscordUser })
          .eq('id', userProfile.id)
          .select()
          .single();

        if (error) throw error;
        setUserProfile(data);
        alert(`Successfully linked Discord account: ${simulatedDiscordUser}`);
      } catch (error) {
        console.error('Discord link error:', error);
      } finally {
        setConnectingDiscord(false);
      }
    }, 1500);
  };

  const renderBadges = (badges: string[] | null) => {
    if (!badges || badges.length === 0) return <span className="text-[9px] text-zinc-600 italic uppercase">No Badges</span>;
    
    return badges.map(badge => {
      let colors = 'bg-zinc-900 text-zinc-400 border-zinc-800';
      let Icon = ShieldCheck;
      if (badge === 'Whale') { colors = 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.2)]'; Icon = Star; }
      else if (badge === 'Sniper') { colors = 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.2)]'; Icon = Target; }
      else if (badge === 'Funded') { colors = 'bg-gold-500/10 text-gold-400 border-gold-500/20 shadow-[0_0_8px_rgba(204,155,51,0.2)]'; Icon = Award; }
      else if (badge === 'Consistent') { colors = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]'; Icon = Flame; }
      
      return (
        <span key={badge} className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-widest ${colors}`}>
          <Icon className="w-2.5 h-2.5" /> {badge}
        </span>
      );
    });
  };

  // Find user's rank
  const myRank = leaderboard.findIndex(p => p.user_id === user?.id) + 1;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 border border-zinc-900 border-dashed rounded-xl bg-zinc-950/30">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-6 h-6 text-gold-500 animate-spin" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Syncing Global Network...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header & Internal Nav */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-gold-400" />
          <div>
            <h2 className="text-xl font-bold font-display tracking-widest text-zinc-100 uppercase">Trader Network</h2>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">Global rankings & operator connections</p>
          </div>
        </div>

        <div className="flex w-full md:w-auto overflow-x-auto bg-[#020202] border border-zinc-900 rounded p-1 custom-scrollbar">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'leaderboard' ? 'bg-zinc-900 text-gold-400 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
          >
            <Trophy className="w-3 h-3" /> Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'feed' ? 'bg-zinc-900 text-gold-400 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
          >
            <MessageSquare className="w-3 h-3" /> Network Feed
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === 'profile' ? 'bg-zinc-900 text-gold-400 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300 border border-transparent'}`}
          >
            <UserCircle className="w-3 h-3" /> My Profile
          </button>
        </div>
      </div>

      {/* --- LEADERBOARD VIEW --- */}
      {activeTab === 'leaderboard' && (
        <div className="bg-[#020202] border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-zinc-900 bg-zinc-950/80 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-[40px]" />
            <h3 className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2 relative z-10">
              <Star className="w-4 h-4 text-gold-500" /> Global Elite Rankings
            </h3>
            <span className="text-[9px] bg-gold-500/10 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-widest relative z-10">Season 14</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-900 text-[9px] uppercase tracking-widest text-zinc-500 font-mono">
                  <th className="p-4 font-normal text-center w-16">Rank</th>
                  <th className="p-4 font-normal">Operator</th>
                  <th className="p-4 font-normal">Badges</th>
                  <th className="p-4 font-normal text-right">Win Rate</th>
                  <th className="p-4 font-normal text-right">Total Net PnL</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-mono">
                {leaderboard.map((trader) => {
                  const isMe = trader.user_id === user?.id;
                  return (
                    <tr key={trader.id} className={`border-b border-zinc-900/40 hover:bg-zinc-900/20 transition-colors ${isMe ? 'bg-gold-500/5' : ''}`}>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className={`font-bold ${trader.computedRank <= 3 ? 'text-gold-400 text-sm drop-shadow-[0_0_5px_rgba(204,155,51,0.5)]' : 'text-zinc-400'}`}>
                            #{trader.computedRank}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className={`font-bold ${isMe ? 'text-gold-400' : 'text-zinc-200'}`}>
                            {trader.handle} {isMe && <span className="ml-2 text-[9px] bg-gold-500/20 text-gold-500 px-1 py-0.5 rounded border border-gold-500/30 uppercase">You</span>}
                          </span>
                          {trader.discord_username && (
                            <span className="text-[9px] text-[#5865F2] mt-0.5 flex items-center gap-1"><MessageCircle className="w-2.5 h-2.5"/> {trader.discord_username}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {renderBadges(trader.badges)}
                        </div>
                      </td>
                      <td className="p-4 text-right text-zinc-400">
                        {Number(trader.win_rate).toFixed(1)}%
                      </td>
                      <td className={`p-4 text-right font-bold ${trader.total_pnl > 0 ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]' : trader.total_pnl < 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                        ${Number(trader.total_pnl).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </td>
                    </tr>
                  );
                })}
                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500 text-[10px] uppercase tracking-widest font-mono">
                      No operators ranked yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- FEED VIEW --- */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Discord Banner */}
          <div className="relative overflow-hidden bg-[#020202] border border-[#5865F2]/30 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(88,101,242,0.1)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#5865F2]/10 blur-[80px] pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-zinc-950 border border-[#5865F2]/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(88,101,242,0.3)]">
                <MessageCircle className="w-6 h-6 text-[#5865F2]" />
              </div>
              <div>
                <h3 className="text-[11px] font-bold font-display uppercase tracking-widest text-[#5865F2] mb-1">Elite Alpha Discord</h3>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Sync your account to access private trade floors and live alerts.</p>
              </div>
            </div>
            
            {userProfile?.discord_username ? (
              <div className="relative z-10 flex items-center gap-2 bg-[#5865F2]/10 border border-[#5865F2]/30 px-4 py-2 rounded text-[#5865F2] font-mono text-[10px] uppercase tracking-widest">
                <Check className="w-3.5 h-3.5" /> Connected: {userProfile.discord_username}
              </div>
            ) : (
              <button 
                onClick={handleConnectDiscord}
                disabled={connectingDiscord}
                className="relative z-10 whitespace-nowrap bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/50 text-[#5865F2] px-6 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {connectingDiscord ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
                {connectingDiscord ? 'Linking...' : 'Connect Discord'}
              </button>
            )}
          </div>

          {/* Social Feed */}
          <div className="space-y-4">
            {MOCK_FEED.map((post) => (
              <div key={post.id} className="p-5 bg-[#020202] border border-zinc-900 hover:border-zinc-800 transition-colors rounded-xl flex gap-4">
                <div className={`w-10 h-10 rounded border shrink-0 flex items-center justify-center font-bold text-xs font-display ${post.user === 'SYSTEM' ? 'bg-gold-500/10 text-gold-400 border-gold-500/30' : 'bg-zinc-950 text-zinc-400 border-zinc-800'}`}>
                  {post.user === 'SYSTEM' ? 'EE' : post.user.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-2 border-b border-zinc-900/50 pb-2">
                    <h4 className={`font-bold font-mono text-[11px] uppercase tracking-widest ${post.user === 'SYSTEM' ? 'text-gold-400' : 'text-zinc-200'}`}>
                      {post.user}
                    </h4>
                    <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">{post.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-4 font-mono">{post.content}</p>
                  <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    <button className="flex items-center gap-1.5 hover:text-gold-400 transition-colors cursor-pointer bg-zinc-950 px-2 py-1 rounded border border-zinc-900">
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
      {activeTab === 'profile' && userProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Identity Card */}
            <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-gold-500 to-zinc-800" />
              
              <div className="w-20 h-20 mx-auto rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-5 group-hover:border-gold-500/30 transition-colors">
                <UserCircle className="w-10 h-10 text-zinc-600 group-hover:text-gold-500/50 transition-colors" />
              </div>
              
              {isEditing ? (
                <div className="space-y-4 mb-4 text-left">
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mb-1 block">Operator Handle</label>
                    <input 
                      type="text" 
                      value={editHandle}
                      onChange={(e) => setEditHandle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-[11px] text-zinc-200 font-mono focus:border-gold-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono mb-1 block">Bio / Strategy</label>
                    <textarea 
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-[11px] text-zinc-200 font-mono focus:border-gold-500 outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex-1 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 py-1.5 rounded text-[9px] uppercase tracking-widest font-bold flex items-center justify-center gap-1"
                    >
                      {savingProfile ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 py-1.5 rounded text-[9px] uppercase tracking-widest font-bold flex items-center justify-center gap-1"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-center items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold font-mono text-zinc-100 uppercase tracking-wider">{userProfile.handle}</h3>
                    <button onClick={() => setIsEditing(true)} className="text-zinc-600 hover:text-gold-400 transition-colors">
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono mb-4 px-4 leading-relaxed">{userProfile.bio || 'No bio provided.'}</p>
                  
                  {userProfile.discord_username && (
                    <div className="inline-flex items-center gap-1.5 text-[9px] font-mono text-[#5865F2] bg-[#5865F2]/10 px-2 py-1 rounded border border-[#5865F2]/20 mb-4">
                      <MessageCircle className="w-3 h-3" /> {userProfile.discord_username}
                    </div>
                  )}

                  <div className="pt-4 border-t border-zinc-900/50 flex justify-center gap-1.5 flex-wrap">
                    {renderBadges(userProfile.badges)}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Lifetime Stats */}
            <div className="p-6 bg-[#020202] border border-zinc-900 rounded-xl">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-900/50 pb-3">
                <h3 className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" /> Lifetime Public Stats
                </h3>
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded border border-zinc-900">
                  Visible on Leaderboard
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded flex flex-col justify-between">
                  <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-3">Total Net PnL</span>
                  <span className={`text-xl font-bold font-mono ${userProfile.total_pnl > 0 ? 'text-emerald-400' : userProfile.total_pnl < 0 ? 'text-rose-400' : 'text-zinc-300'}`}>
                    ${Number(userProfile.total_pnl).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
                <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded flex flex-col justify-between">
                  <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-3">Global Rank</span>
                  <span className="text-xl font-bold font-mono text-gold-400">
                    {myRank > 0 ? `#${myRank}` : 'Unranked'}
                  </span>
                </div>
                <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded flex flex-col justify-between">
                  <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-3">Win Rate</span>
                  <span className="text-xl font-bold font-mono text-zinc-300">
                    {Number(userProfile.win_rate).toFixed(1)}%
                  </span>
                </div>
                <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded flex flex-col justify-between">
                  <span className="block text-[9px] text-zinc-500 font-mono uppercase tracking-widest mb-3">Followers</span>
                  <span className="text-xl font-bold font-mono text-zinc-300">
                    0
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="bg-[#020202] hover:bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold font-mono uppercase tracking-widest px-4 py-2 rounded transition-colors flex items-center gap-2 cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5" /> Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
