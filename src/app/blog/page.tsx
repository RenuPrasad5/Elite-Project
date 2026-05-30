import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ChevronRight, UserCircle, ArrowRight, ShieldCheck, Target, Flame } from 'lucide-react';
import { getAllPosts } from '@/lib/blog-data';

export const metadata = {
  title: 'Insights & Strategies',
  description: 'Master institutional trading strategies, read funded challenge guides, and learn advanced risk management protocols.',
};

export default function BlogHubPage() {
  const posts = getAllPosts();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Prop Firm': return <Award className="w-3.5 h-3.5" />;
      case 'Risk Management': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Strategy': return <Target className="w-3.5 h-3.5" />;
      case 'Psychology': return <Flame className="w-3.5 h-3.5" />;
      default: return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Prop Firm': return 'text-gold-400 bg-gold-500/10 border-gold-500/20';
      case 'Risk Management': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Strategy': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Psychology': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default: return 'text-zinc-400 bg-zinc-900 border-zinc-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(181,131,32,0.05),transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-900 bg-[#020202]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-gold-600 to-gold-800 flex items-center justify-center border border-gold-500/30">
              <span className="text-zinc-950 font-display font-bold text-[10px]">EE</span>
            </div>
            <span className="font-display font-bold tracking-widest text-sm text-zinc-100">
              EVIL ELITE
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-gold-400 transition-colors">Terminal</Link>
            <Link href="/dashboard" className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-gold-500/50 hover:text-gold-400 text-[10px] font-bold font-mono uppercase tracking-widest rounded transition-all">
              Operator Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        
        {/* Page Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-widest mb-6">
            Alpha <span className="text-gold-500">Intelligence</span>
          </h1>
          <p className="text-zinc-400 font-mono text-sm leading-relaxed uppercase tracking-widest">
            Institutional trading strategies, risk management protocols, and funded challenge frameworks designed for elite operators.
          </p>
        </div>

        {/* Featured Post (First one) */}
        {posts.length > 0 && (
          <div className="mb-12">
            <Link href={`/blog/${posts[0].slug}`} className="block group">
              <div className="bg-[#020202] border border-zinc-900 rounded-xl overflow-hidden group-hover:border-gold-500/30 transition-all flex flex-col md:flex-row shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                
                {/* Simulated Image Area */}
                <div className="md:w-1/2 h-64 md:h-auto bg-zinc-950 relative overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-900">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,155,51,0.1),transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity" />
                  <Target className="w-24 h-24 text-zinc-800 group-hover:text-gold-500/20 transition-colors" />
                </div>
                
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded border flex items-center gap-1.5 ${getCategoryColor(posts[0].category)}`}>
                      {posts[0].category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {posts[0].readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-zinc-100 mb-4 group-hover:text-gold-400 transition-colors leading-tight">
                    {posts[0].title}
                  </h2>
                  
                  <p className="text-sm text-zinc-400 font-sans leading-relaxed mb-8">
                    {posts[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <UserCircle className="w-6 h-6 text-zinc-500" />
                      <span className="text-[11px] font-bold font-mono text-zinc-300 uppercase tracking-widest">{posts[0].author}</span>
                    </div>
                    <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-gold-500 flex items-center gap-1 group-hover:translate-x-2 transition-transform">
                      Initialize <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <div className="bg-[#020202] border border-zinc-900 rounded-xl p-6 h-full flex flex-col hover:border-gold-500/30 transition-all hover:bg-zinc-950/50">
                
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded border flex items-center gap-1.5 ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                  <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h3 className="text-xl font-display font-bold text-zinc-200 mb-3 group-hover:text-gold-400 transition-colors leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-xs text-zinc-500 font-sans leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-4 border-t border-zinc-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-widest">{post.author}</span>
                  </div>
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </main>

      {/* SEO Footer */}
      <footer className="relative z-10 border-t border-zinc-900 bg-[#020202] mt-24 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-lg font-display font-bold uppercase tracking-widest text-zinc-500 mb-4">EVIL ELITE Trading Systems</h2>
          <p className="text-xs text-zinc-600 font-mono max-w-2xl mx-auto">
            Providing high-frequency execution infrastructure, funded challenge analytics, and risk management algorithms for institutional and retail prop firm operators.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Simple fallback icon component since Award isn't imported from lucide-react at the top level
function Award(props: any) {
  return <Target {...props} />;
}
