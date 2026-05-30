import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/blog-data';
import { ArrowLeft, Clock, Calendar, UserCircle, Share2, Terminal } from 'lucide-react';

// Static Generation setup
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Dynamic SEO Metadata Generation
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    return { title: 'Post Not Found | EVIL ELITE' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.seoKeywords,
    openGraph: {
      title: `${post.title} | EVIL ELITE`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    }
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans selection:bg-gold-500/30 selection:text-gold-200">
      
      {/* Background styling */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(181,131,32,0.03),transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-900 bg-[#020202]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-gold-400 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
          </Link>
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-gold-600 to-gold-800 flex items-center justify-center">
              <span className="text-zinc-950 font-display font-bold text-[8px]">EE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-20">
        
        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/20 px-2.5 py-1 rounded">
              {post.category}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold text-zinc-100 mb-6 leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-lg text-zinc-400 font-sans leading-relaxed mb-8 border-l-2 border-gold-500/50 pl-4">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between py-4 border-y border-zinc-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-zinc-500" />
              </div>
              <div>
                <p className="text-xs font-bold font-mono text-zinc-200 uppercase tracking-widest">{post.author}</p>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <button className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-gold-400 hover:border-gold-500/30 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Article Content - Styled for Readability & Premium Feel */}
        <article 
          className="prose prose-invert prose-zinc max-w-none 
            prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-wider
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-zinc-200
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-zinc-300
            prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-sans prose-p:text-[15px]
            prose-strong:text-gold-400 prose-strong:font-bold
            prose-em:text-zinc-400 prose-em:italic
            prose-blockquote:border-l-4 prose-blockquote:border-gold-500/50 prose-blockquote:bg-zinc-900/30 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r prose-blockquote:not-italic prose-blockquote:text-zinc-300 prose-blockquote:font-mono prose-blockquote:text-sm
            prose-a:text-gold-400 hover:prose-a:text-gold-300 prose-a:transition-colors prose-a:underline-offset-4
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Conversion CTA (Crucial for SEO Traffic ROI) */}
        <div className="mt-20 p-8 bg-gradient-to-br from-[#050505] to-zinc-950 border border-zinc-900 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-gold-500/10 transition-colors" />
          
          <div className="relative z-10 text-center space-y-4">
            <Terminal className="w-8 h-8 text-gold-500 mx-auto mb-2" />
            <h3 className="text-xl font-display font-bold uppercase tracking-widest text-zinc-100">Ready to execute with precision?</h3>
            <p className="text-sm text-zinc-400 font-sans max-w-md mx-auto">
              Stop relying on retail tools. Access the institutional-grade dashboard, risk calculators, and journal systems used by elite funded operators.
            </p>
            <div className="pt-4">
              <Link href="/signup" className="inline-block px-8 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs uppercase tracking-widest rounded transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Initialize Workspace
              </Link>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
