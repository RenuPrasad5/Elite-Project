import React, { useState, useRef } from 'react';
import { Bot, UploadCloud, Image as ImageIcon, X, Loader2, Target, AlertTriangle, Activity, BrainCircuit, Sparkles, ArrowRight } from 'lucide-react';
import { AITradeReviewResponse } from '@/app/api/ai/review/route';

export const AITradeReview = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AITradeReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitForReview = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', image);
    if (notes) formData.append('notes', notes);

    try {
      const response = await fetch('/api/ai/review', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to analyze trade');
      }

      const data: AITradeReviewResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-6 h-6 text-gold-400" />
        <div>
          <h2 className="text-xl font-bold font-mono tracking-widest text-zinc-100 uppercase">AI Trade Review</h2>
          <p className="text-xs text-zinc-500 font-mono">Vision-powered execution analysis & coaching</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* INPUT SECTION */}
        <div className="space-y-6">
          
          <div 
            className={`relative border-2 border-dashed rounded-xl p-6 md:p-8 transition-colors ${preview ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-800 hover:border-gold-500/50 bg-[#020202] hover:bg-zinc-900/20'} flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px] md:min-h-[250px]`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            
            {preview ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img src={preview} alt="Trade chart" className="max-h-[250px] rounded object-contain border border-zinc-800" />
                <button 
                  onClick={(e) => { e.stopPropagation(); clearImage(); }}
                  className="absolute -top-3 -right-3 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white p-1 rounded-full shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="w-12 h-12 text-zinc-700 mb-4" />
                <h3 className="text-sm font-bold text-zinc-300 font-mono uppercase tracking-widest mb-1">Upload Chart Screenshot</h3>
                <p className="text-[10px] text-zinc-500 font-mono max-w-[200px]">Drag & drop your MT4/TradingView chart, or click to browse.</p>
              </>
            )}
          </div>

          <div className="bg-[#020202] border border-zinc-900 rounded-xl p-5 space-y-4">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Trade Context (Optional)</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 'I longed the 1H FVG but price swept my stop loss before running to target. Was feeling serious FOMO...'"
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-sm text-zinc-300 font-mono h-24 resize-none focus:outline-none focus:border-gold-500/50 transition-colors"
            />
            
            <button 
              onClick={submitForReview}
              disabled={!image || isAnalyzing}
              className={`w-full py-3 rounded text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2
                ${!image 
                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed' 
                  : isAnalyzing 
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' 
                    : 'bg-gold-500 hover:bg-gold-400 text-zinc-950 shadow-[0_0_15px_rgba(204,155,51,0.2)] cursor-pointer'
                }
              `}
            >
              {isAnalyzing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Neural Engine Processing...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Initialize AI Review</>
              )}
            </button>
            {error && <p className="text-rose-500 text-[10px] font-mono text-center">{error}</p>}
          </div>

        </div>

        {/* OUTPUT SECTION */}
        <div className="relative">
          {!result && !isAnalyzing && (
            <div className="absolute inset-0 border border-zinc-900 border-dashed rounded-xl bg-zinc-950/30 flex flex-col items-center justify-center text-center p-8">
              <Bot className="w-12 h-12 text-zinc-800 mb-4" />
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest leading-relaxed">
                Awaiting chart input. <br/>Upload a screenshot to generate an institutional-grade AI review.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 border border-gold-500/20 rounded-xl bg-[#020202] flex flex-col items-center justify-center text-center p-8">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-t-2 border-gold-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-b-2 border-zinc-500 rounded-full animate-spin animation-delay-150"></div>
                <BrainCircuit className="absolute inset-0 m-auto w-6 h-6 text-gold-400 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-gold-400 mb-2">Analyzing Execution</h3>
              <p className="text-[10px] font-mono text-zinc-500">Parsing price action and processing semantic context...</p>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="bg-[#020202] border border-zinc-900 rounded-xl overflow-hidden h-full flex flex-col">
              
              <div className="p-4 bg-zinc-950/50 border-b border-zinc-900 flex justify-between items-center">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                  <Bot className="w-4 h-4 text-gold-500" /> AI Diagnostic Report
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase">Setup Quality</span>
                  <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${result.setupQuality >= 7 ? 'bg-emerald-500/10 text-emerald-400' : result.setupQuality >= 4 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-500'}`}>
                    {result.setupQuality}/10
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                
                <div>
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Target className="w-3 h-3" /> Technical Analysis
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-mono">{result.setupQualityNotes}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg">
                    <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Risk:Reward Profile</h4>
                    <p className="text-xs text-zinc-400 font-mono">{result.rrAnalysis}</p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg">
                    <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Psychological State</h4>
                    <p className="text-xs text-zinc-400 font-mono">{result.emotionalAnalysis}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-rose-500/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" /> Identified Mistakes
                  </h4>
                  <ul className="space-y-2">
                    {result.mistakes.map((mistake, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 font-mono flex items-start gap-2 bg-rose-500/5 p-2 rounded border border-rose-500/10">
                        <span className="text-rose-500 mt-0.5">▪</span> {mistake}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              <div className="p-5 bg-gold-500/5 border-t border-gold-500/20">
                <h4 className="text-[9px] font-bold text-gold-500 uppercase tracking-widest mb-1">Direct Action</h4>
                <p className="text-sm text-zinc-200 font-mono font-bold leading-relaxed">
                  {result.actionableAdvice}
                </p>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
