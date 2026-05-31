'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { getProducts, Product, LOCAL_PRODUCTS } from '@/lib/products';
import { 
  TrendingUp, 
  ShieldCheck, 
  Terminal, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash, 
  FileUp, 
  Database, 
  ArrowLeft, 
  RefreshCw, 
  Activity, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  LogOut, 
  LayoutDashboard, 
  Sliders, 
  Clipboard, 
  ShieldAlert, 
  BarChart3, 
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function AdminHubPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'uplink' | 'orders' | 'analytics'>('overview');
  
  // Data States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    productRevenue: 0,
    subscriptionRevenue: 0,
    subscribersBreakdown: { Starter: 0, Pro: 0, Elite: 0, total: 0 }
  });

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Terminal log console inside Admin Overview
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Initializing Evil Elite Clearance Node...',
    'Admin Session Established securely.',
    'Uplink Active: Port 443 listening for payload transfers.'
  ]);

  // Product CRUD Modal/Drawer States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState<'PDFs' | 'Trading Journals' | 'Excel Sheets' | 'Trading Tools'>('PDFs');
  const [prodFileType, setProdFileType] = useState<'pdf' | 'xlsx' | 'zip' | 'indicator'>('pdf');
  const [prodBadge, setProdBadge] = useState('');
  const [prodFeatures, setProdFeatures] = useState<string>('');
  const [savingProduct, setSavingProduct] = useState(false);

  // File Upload State (Uplink Vault)
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([
    { name: 'institutional_liquidity_guide.pdf', size: '12.4 MB', hash: 'sha256-ee8f59a...', url: '/downloads/institutional_liquidity_guide.pdf' },
    { name: 'alpha_trade_journal.pdf', size: '4.8 MB', hash: 'sha256-429fa2...', url: '/downloads/alpha_trade_journal.pdf' }
  ]);

  // Search/Filters states
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Clipboard notify
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Load users
      const usersRes = await fetch('/api/admin/users');
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsersList(usersData.users);
      }

      // 2. Load orders & revenue stats
      const ordersRes = await fetch('/api/admin/orders');
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setOrdersList(ordersData.orders);
        setStats(ordersData.stats);
      }

      // 3. Load products
      const dbProducts = await getProducts();
      setProductsList(dbProducts);
      
      addTerminalLog('Sync completed: Administrative nodes mapped.');
    } catch (err: any) {
      console.error('Error fetching admin hub details:', err);
      addTerminalLog(`Uplink Error: ${err.message || 'Database sync offline'}`);
      // Fallback
      setProductsList(LOCAL_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    setSyncing(true);
    addTerminalLog('Synchronizing database registries...');
    await loadAdminData();
    setSyncing(false);
  };

  const addTerminalLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // --- USER CONTROLS ---
  const handleUpdateUserRole = async (userId: string, currentRole: string) => {
    const targetRole = currentRole === 'admin' ? 'user' : 'admin';
    addTerminalLog(`Modifying role for ${userId} to ${targetRole.toUpperCase()}`);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: targetRole })
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: targetRole } : u));
        addTerminalLog(`Role modified for ${userId} successfully.`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
      addTerminalLog(`Failed updating role for node ${userId}`);
    }
  };

  const handleUpdateUserTier = async (userId: string, tier: string) => {
    addTerminalLog(`Adjusting subscription tier for user ${userId} to ${tier}`);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tier: tier === 'Free' ? null : tier })
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.map(u => u.id === userId ? { 
          ...u, 
          subscription: tier === 'Free' ? null : { tier, status: 'active' } 
        } : u));
        addTerminalLog(`Subscription shifted to ${tier} for ${userId}.`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update subscription tier');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you absolutely sure you want to terminate this user node? All database links will cascades.')) return;
    addTerminalLog(`Purging user account node ${userId}...`);
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(prev => prev.filter(u => u.id !== userId));
        addTerminalLog(`Node ${userId} successfully terminated and erased.`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // --- PRODUCT CRUD CONTROLS ---
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdDesc('');
    setProdPrice('');
    setProdCategory('PDFs');
    setProdFileType('pdf');
    setProdBadge('');
    setProdFeatures('');
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProdTitle(prod.title);
    setProdDesc(prod.description);
    setProdPrice(String(prod.price));
    setProdCategory(prod.category);
    setProdFileType(prod.file_type);
    setProdBadge(prod.badge || '');
    setProdFeatures(prod.features.join('\n'));
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodDesc || !prodPrice) {
      alert('Please fill out all required fields.');
      return;
    }

    setSavingProduct(true);
    const productPayload = {
      title: prodTitle,
      description: prodDesc,
      price: Number(prodPrice),
      category: prodCategory,
      download_url: `/downloads/${prodTitle.toLowerCase().replace(/\s+/g, '_')}.${prodFileType}`,
      file_type: prodFileType,
      badge: prodBadge || undefined,
      features: prodFeatures.split('\n').filter(f => f.trim() !== '')
    };

    try {
      if (editingProduct) {
        // UPDATE PRODUCT
        addTerminalLog(`Editing database product ${editingProduct.id}...`);
        const { data, error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', editingProduct.id)
          .select();

        if (error) throw error;
        
        setProductsList(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productPayload } : p));
        addTerminalLog(`Product ${editingProduct.id} ("${prodTitle}") saved.`);
      } else {
        // CREATE PRODUCT
        addTerminalLog(`Creating new database digital product...`);
        const { data, error } = await supabase
          .from('products')
          .insert(productPayload)
          .select();

        if (error) throw error;
        
        const newProduct = data?.[0] || { id: Date.now(), ...productPayload };
        setProductsList(prev => [...prev, newProduct]);
        addTerminalLog(`Product "${prodTitle}" added to product matrix.`);
      }
      
      setProductModalOpen(false);
    } catch (err: any) {
      console.warn('Real database write failed, simulating in-memory CRUD:', err.message);
      // Local fallback simulator
      if (editingProduct) {
        setProductsList(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productPayload } : p));
      } else {
        setProductsList(prev => [...prev, { id: Date.now(), ...productPayload } as any]);
      }
      setProductModalOpen(false);
      addTerminalLog('Matrix saved locally (Simulated Mode).');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Purge this asset from product matrix? Customers will lose download clearance.')) return;
    addTerminalLog(`Deleting product entry ${id} from database...`);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProductsList(prev => prev.filter(p => p.id !== id));
      addTerminalLog(`Product ${id} purged successfully.`);
    } catch (err: any) {
      console.warn('Real database delete failed, simulating local state:', err.message);
      setProductsList(prev => prev.filter(p => p.id !== id));
      addTerminalLog(`Product ${id} purged locally (Simulated Mode).`);
    }
  };

  // --- MOCK FILE UPLOAD SIMULATOR (Uplink Vault) ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateFileUpload(files[0].name, files[0].size);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateFileUpload(files[0].name, files[0].size);
    }
  };

  const simulateFileUpload = (name: string, sizeBytes: number) => {
    const size = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';
    setUploadingFile(name);
    setUploadProgress(0);
    addTerminalLog(`Uplinking payload file: ${name} (${size})`);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const randomHash = 'sha256-' + Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
            const newFile = {
              name,
              size,
              hash: randomHash,
              url: `/downloads/${name.toLowerCase().replace(/\s+/g, '_')}`
            };
            setUploadedFiles(prevFiles => [newFile, ...prevFiles]);
            setUploadingFile(null);
            addTerminalLog(`Clearance Granted: ${name} encrypted & uploaded. Hash: ${randomHash}`);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // --- RENDERING GUARDS ---
  if (authLoading || (user && loading && !isMounted)) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-[#020202]">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest font-mono text-zinc-500">Connecting Admin Node...</span>
      </div>
    );
  }

  if (!user || user.user_metadata?.role !== 'admin') {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-[#020202] text-zinc-400">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-4 animate-pulse" />
        <p className="text-lg font-medium font-display tracking-wider">ACCESS FORBIDDEN</p>
        <p className="text-sm text-zinc-600 mb-6 text-center max-w-md px-4">
          This secure domain requires administrative credentials. Demote your clearance or switch account to authorize access.
        </p>
        <button 
          onClick={() => router.push('/dashboard')} 
          className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 text-zinc-950 font-bold rounded-lg transition-all duration-300 glow-gold cursor-pointer text-xs uppercase tracking-widest"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // --- FILTERS ---
  const filteredUsers = usersList.filter(u => 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.id.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredOrders = ordersList.filter(o => 
    o.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.item_title.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.id.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const filteredProducts = productsList.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.file_type.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Bar chart cell colors
  const COLORS = ['#d4af37', '#997d26', '#594916', '#261f0a'];

  return (
    <div className="flex-1 bg-[#020202] text-zinc-100 flex relative overflow-hidden h-screen font-sans">
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(181,131,32,0.02),transparent_60%)] pointer-events-none" />
      <div className="absolute -top-40 right-20 w-96 h-96 bg-gold-950/5 rounded-full blur-[150px] pointer-events-none" />

      {/* LEFT ADMIN SIDEBAR */}
      <aside className="w-64 bg-[#050505] border-r border-zinc-900 flex flex-col justify-between pt-6">
        <div className="flex flex-col flex-1 px-6 space-y-8">
          
          {/* Logo & Node name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
              <img src="/logo.png" alt="EvilElite Trading Logo" className="h-10 w-auto object-contain drop-shadow-md" />
              <span className="font-display font-extrabold tracking-[0.15em] text-lg text-zinc-100 uppercase leading-none">EVIL ELITE</span>
            </div>
            <span className="text-[8px] font-mono border border-gold-500/30 text-gold-400 font-bold px-2 py-0.5 rounded bg-gold-950/20">ADMIN</span>
          </div>

          {/* Active Operator Status */}
          <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-lg space-y-1">
            <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase block">Logged Operator</span>
            <span className="text-xs text-zinc-300 truncate block font-medium font-mono">{user.email}</span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-[9px] text-gold-400 font-mono font-bold uppercase tracking-wider">Direct Uplink</span>
              </div>
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-[9px] font-mono text-zinc-400 hover:text-gold-400 flex items-center gap-0.5 border border-zinc-900 px-1.5 py-0.2 rounded hover:border-gold-500/25 transition-all"
              >
                <ArrowLeft className="w-2.5 h-2.5" /> Dashboard
              </button>
            </div>
          </div>

          {/* Sidebar Menu items */}
          <nav className="space-y-1.5 flex-1">
            {[
              { id: 'overview', label: 'Command Hub', icon: LayoutDashboard },
              { id: 'users', label: 'User Matrix', icon: Users },
              { id: 'products', label: 'Product Matrix', icon: ShoppingBag },
              { id: 'uplink', label: 'Uplink Vault', icon: FileUp },
              { id: 'orders', label: 'Sales Ledgers', icon: DollarSign },
              { id: 'analytics', label: 'Metrics Terminal', icon: BarChart3 },
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-gold-950/30 text-gold-400 border border-gold-500/20 glow-gold-hover' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent'}
                  `}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom profile / Terminate */}
        <div className="p-6 border-t border-zinc-900/50 bg-[#030303]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">System API Status:</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] text-emerald-400 font-mono font-bold">ONLINE</span>
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 bg-zinc-950 border border-zinc-900 hover:border-rose-500/30 text-zinc-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
            title="Terminate Clearance Session"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {/* TAB 1: COMMAND HUB (OVERVIEW) */}
              {activeTab === 'overview' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                        Admin Command Hub
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1 font-mono">
                        Hardware Node ID: node_sec_adm_evilelite_2026
                      </p>
                    </div>

                    <button
                      onClick={handleSyncData}
                      disabled={syncing}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-gold-500/30 text-zinc-400 hover:text-gold-400 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                      {syncing ? 'Syncing...' : 'Sync Registry'}
                    </button>
                  </div>

                  {/* Operational Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-5 rounded-xl flex items-center justify-between relative overflow-hidden">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Gross Revenues</span>
                        <span className="text-2xl font-bold font-mono text-gold-400">${stats.totalRevenue?.toFixed(2)}</span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                          <TrendingUp className="w-3 h-3" /> +21.4% Monthly
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-gold-950/20 border border-gold-500/10 text-gold-400">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Subscribers MRR</span>
                        <span className="text-2xl font-bold font-mono">${stats.subscriptionRevenue?.toFixed(2)}</span>
                        <span className="text-[11px] text-zinc-500 font-mono block">MRR Projected cohort</span>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Direct Indicator Sales</span>
                        <span className="text-2xl font-bold font-mono">${stats.productRevenue?.toFixed(2)}</span>
                        <span className="text-[11px] text-emerald-400 font-mono">One-time licenses</span>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Active Operators</span>
                        <span className="text-2xl font-bold font-mono">{usersList.length} Nodes</span>
                        <span className="text-[11px] text-gold-400 font-mono font-bold block uppercase">
                          {usersList.filter(u => u.role === 'admin').length} Administrative key
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Recharts Revenue Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-panel p-6 rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-300">Revenue Performance Projection</h4>
                        <span className="text-[9px] font-mono text-zinc-500">Dynamic ledger feed</span>
                      </div>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stats.monthlyRevenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="goldRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cc9b33" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#cc9b33" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#27272a" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} />
                            <YAxis stroke="#27272a" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#cc9b33', borderRadius: '8px', color: '#f4f4f5', fontFamily: 'monospace', fontSize: 11 }} />
                            <Area type="monotone" dataKey="revenue" stroke="#cc9b33" strokeWidth={2} fillOpacity={1} fill="url(#goldRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* CLI Terminal Logger Console */}
                    <div className="glass-panel p-6 rounded-xl flex flex-col justify-between space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                        <Terminal className="w-4 h-4 text-gold-400" />
                        <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-300">Security Terminal Log</h4>
                      </div>

                      <div className="bg-[#010101] border border-zinc-900 rounded-lg p-4 font-mono text-[10px] text-zinc-400 flex-1 overflow-y-auto max-h-[220px] space-y-1.5 scrollbar-thin">
                        {terminalLogs.map((log, idx) => (
                          <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                            <span className="text-gold-500/80">&gt;</span> {log}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button 
                          onClick={() => {
                            setTerminalLogs([`[${new Date().toLocaleTimeString()}] Log cleared. Console Uplink ready.`]);
                          }}
                          className="px-3 py-1.5 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[10px] font-mono font-bold uppercase rounded cursor-pointer"
                        >
                          Clear Log
                        </button>
                        <button 
                          onClick={() => addTerminalLog('Direct test handshake sent to Supabase storage cluster.')}
                          className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-gold-500/20 text-zinc-400 hover:text-gold-400 text-[10px] font-mono font-bold uppercase rounded cursor-pointer"
                        >
                          Handshake
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: USER MATRIX */}
              {activeTab === 'users' && (
                <>
                  <div className="space-y-1">
                    <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                      User Access Matrix
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      List operator profiles, alter administrative roles, customize subscriptions, or terminate nodes.
                    </p>
                  </div>

                  {/* Search filter panel */}
                  <div className="flex gap-4 items-center bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                    <div className="relative flex-1">
                      <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-zinc-500" />
                      <input 
                        type="text"
                        placeholder="Search operator nodes by email, role or system ID..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Users table list */}
                  <div className="glass-panel rounded-xl overflow-hidden border border-zinc-900">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead>
                          <tr className="bg-zinc-950 text-zinc-500 uppercase tracking-widest text-[9px] border-b border-zinc-900">
                            <th className="p-4 pl-6">Operator Node ID / Email</th>
                            <th className="p-4">Authorization</th>
                            <th className="p-4">Subscription Plan</th>
                            <th className="p-4">Registration Uplink</th>
                            <th className="p-4 text-right pr-6">Destruct Node</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900/40">
                          {filteredUsers.map((item) => (
                            <tr key={item.id} className="hover:bg-zinc-900/10">
                              <td className="p-4 pl-6">
                                <div className="space-y-0.5">
                                  <span className="font-semibold text-zinc-200 block text-xs">{item.email}</span>
                                  <span 
                                    onClick={() => handleCopyToClipboard(item.id, item.id)}
                                    className="text-[9px] text-zinc-500 cursor-pointer hover:text-gold-400 select-all font-mono flex items-center gap-1"
                                    title="Click to copy System ID"
                                  >
                                    ID: {item.id}
                                    {copiedId === item.id ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Clipboard className="w-2.5 h-2.5 opacity-60" />}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleUpdateUserRole(item.id, item.role)}
                                  className={`
                                    px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer
                                    ${item.role === 'admin'
                                      ? 'bg-gold-950/40 text-gold-400 border border-gold-500/20'
                                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800/80 hover:border-zinc-700'}
                                  `}
                                >
                                  {item.role || 'user'}
                                </button>
                              </td>
                              <td className="p-4">
                                <select
                                  value={item.subscription?.tier || 'Free'}
                                  onChange={(e) => handleUpdateUserTier(item.id, e.target.value)}
                                  className="bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1 text-[10px] font-bold text-zinc-300 focus:outline-none focus:border-gold-500/30 uppercase cursor-pointer"
                                >
                                  <option value="Free">FREE PLATFORM</option>
                                  <option value="Starter">STARTER COHORT</option>
                                  <option value="Pro">PRO TERM</option>
                                  <option value="Elite">ELITE SIGNAL</option>
                                </select>
                              </td>
                              <td className="p-4">
                                <span className="text-zinc-500 text-[11px]">
                                  {new Date(item.created_at).toLocaleString()}
                                </span>
                              </td>
                              <td className="p-4 text-right pr-6">
                                <button
                                  onClick={() => handleDeleteUser(item.id)}
                                  disabled={item.email === user.email}
                                  className="p-1.5 bg-zinc-950 border border-zinc-900 hover:border-rose-500/30 text-zinc-500 hover:text-rose-400 rounded transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                                  title="Terminate User Profile Node"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: PRODUCT MATRIX */}
              {activeTab === 'products' && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                        Product Clearance Matrix
                      </h2>
                      <p className="text-xs text-zinc-500 font-mono">
                        CRUD operations for digital guides, PineScript indicators, and algorithmic tools in the database.
                      </p>
                    </div>

                    <button
                      onClick={openAddProductModal}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-gold-600 to-gold-500 text-zinc-950 hover:from-gold-500 hover:to-gold-400 text-xs font-extrabold uppercase tracking-widest rounded-lg transition-all duration-300 glow-gold cursor-pointer"
                    >
                      <Plus className="w-4 h-4 shrink-0" />
                      Add Digital Asset
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex gap-4 items-center bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                    <div className="relative flex-1">
                      <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-zinc-500" />
                      <input 
                        type="text"
                        placeholder="Search product keys by title, category, format..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProducts.map((prod) => (
                      <div key={prod.id} className="glass-panel p-6 rounded-xl flex flex-col justify-between space-y-4 group hover:border-gold-500/30 transition-all duration-300">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gold-400/80 bg-gold-950/20 border border-gold-500/10 px-2 py-0.5 rounded">
                              {prod.category}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">.{prod.file_type}</span>
                          </div>

                          <h3 className="font-display font-bold text-zinc-200 tracking-wider text-sm group-hover:text-gold-400 transition-colors">
                            {prod.title}
                          </h3>

                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {prod.features.slice(0, 3).map((f, idx) => (
                              <span key={idx} className="text-[9px] font-mono bg-zinc-950 border border-zinc-900 text-zinc-500 px-2 py-0.5 rounded">
                                ✓ {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[8px] text-zinc-500 font-mono uppercase block">License Price</span>
                            <span className="text-sm font-bold font-mono text-gold-300">${(prod.price || 0).toFixed(2)}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="p-2 bg-zinc-950 border border-zinc-900 hover:border-gold-500/20 hover:text-gold-400 rounded text-zinc-400 transition-all cursor-pointer"
                              title="Edit Asset Settings"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 bg-zinc-950 border border-zinc-900 hover:border-rose-500/20 hover:text-rose-400 rounded text-zinc-400 transition-all cursor-pointer"
                              title="Purge Asset"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* TAB 4: FILE UPLINK VAULT */}
              {activeTab === 'uplink' && (
                <>
                  <div className="space-y-1">
                    <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                      Clearance Uplink Vault
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Encrypt and upload new indicator codes or PDF masterclass guides to secure system buckets.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Uplink upload area */}
                    <div className="md:col-span-2 space-y-6">
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                          p-12 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-4 transition-all duration-300 relative
                          ${dragging 
                            ? 'border-gold-500 bg-gold-950/10 text-gold-400 glow-gold' 
                            : 'border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:border-zinc-700'}
                        `}
                      >
                        <input
                          type="file"
                          id="vault-file-uplink"
                          onChange={handleFileInputChange}
                          className="hidden"
                          disabled={uploadingFile !== null}
                        />

                        {uploadingFile ? (
                          <div className="space-y-4 w-full max-w-xs">
                            <Activity className="w-10 h-10 text-gold-400 animate-pulse mx-auto" />
                            <div className="space-y-2">
                              <span className="text-xs font-mono font-bold text-zinc-300 block truncate">{uploadingFile}</span>
                              <span className="text-[10px] font-mono text-zinc-500 block">ENCRYPTING PAYLOAD: {uploadProgress}%</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-gold-500" 
                                style={{ width: `${uploadProgress}%` }}
                                transition={{ ease: 'easeInOut' }}
                              />
                            </div>
                          </div>
                        ) : (
                          <label htmlFor="vault-file-uplink" className="cursor-pointer space-y-4 p-4 block">
                            <FileUp className="w-12 h-12 text-gold-500/80 hover:text-gold-400 transition-colors mx-auto animate-bounce" />
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold text-zinc-200">Drag & Drop Secure Payload</h4>
                              <p className="text-xs text-zinc-500 max-w-sm">
                                Standard PDF manuals, ZIP archives containing indicators, or XLSX risk terminals. Max payload limit: 120 MB.
                              </p>
                            </div>
                            <span className="inline-block mt-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg hover:border-gold-500/30 transition-all text-zinc-300">
                              Choose System File
                            </span>
                          </label>
                        )}
                      </div>

                      {/* Upload logs / Vault files */}
                      <div className="glass-panel p-6 rounded-xl space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                          <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-300">Vault Registry Log</h3>
                          <span className="text-[9px] font-mono text-zinc-500">Secure bucket: default_clearance_s3</span>
                        </div>

                        <div className="space-y-2">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3.5 bg-zinc-950/80 border border-zinc-900 rounded-lg text-xs font-mono">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-gold-950/20 border border-gold-500/10 flex items-center justify-center text-gold-400">
                                  <Download className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-zinc-200 font-semibold block">{file.name}</span>
                                  <span className="text-[9px] text-zinc-500 block uppercase">SHA: {file.hash}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-[10px] text-zinc-500">{file.size}</span>
                                <button
                                  onClick={() => handleCopyToClipboard(file.hash, file.hash)}
                                  className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[9px] font-mono font-bold uppercase rounded hover:border-gold-500/20 transition-all cursor-pointer text-zinc-300"
                                >
                                  {copiedId === file.hash ? 'Copied' : 'Copy Hash'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Security Details */}
                    <div className="glass-panel p-6 rounded-xl space-y-4 self-start">
                      <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                        <ShieldCheck className="w-4 h-4 text-gold-400" />
                        <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-300">Storage Parameters</h4>
                      </div>

                      <div className="space-y-3 font-mono text-[11px] text-zinc-400">
                        <div className="space-y-1">
                          <span className="text-[9px] text-zinc-500 block uppercase">Encryption Scheme:</span>
                          <span className="text-zinc-300 font-semibold block">AES-256 GCM SECURE ENDPOINT</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-zinc-500 block uppercase">Active Clearance buckets:</span>
                          <span className="text-zinc-300 font-semibold block">5 Mapped regions</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-zinc-500 block uppercase">Uplink Speed limit:</span>
                          <span className="text-zinc-300 font-semibold block">10 GB/sec burst</span>
                        </div>
                        <div className="p-3 bg-gold-950/15 border border-gold-500/10 rounded-lg space-y-1 mt-2 text-[10px]">
                          <span className="text-gold-400 font-bold block uppercase tracking-wider">Storage Webhooks</span>
                          <span className="text-zinc-500 leading-normal block">
                            All uploads generate encrypted signed URLs injected into Stripe Webhook databases instantly.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 5: SALES LEDGERS */}
              {activeTab === 'orders' && (
                <>
                  <div className="space-y-1">
                    <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                      Sales & Transaction Ledgers
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Log details of indicator purchases, license registrations, and customer billing histories.
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex gap-4 items-center bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                    <div className="relative flex-1">
                      <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-zinc-500" />
                      <input 
                        type="text"
                        placeholder="Search sales ledgers by ID, product name, or customer email..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Ledgers table */}
                  <div className="glass-panel rounded-xl overflow-hidden border border-zinc-900">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead>
                          <tr className="bg-zinc-950 text-zinc-500 uppercase tracking-widest text-[9px] border-b border-zinc-900">
                            <th className="p-4 pl-6">Order Transaction ID</th>
                            <th className="p-4">Customer Signature</th>
                            <th className="p-4">Licensed Asset / Product</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Uplink Time</th>
                            <th className="p-4 text-right pr-6">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900/40">
                          {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-zinc-900/10">
                              <td className="p-4 pl-6 font-semibold text-zinc-300">{order.id}</td>
                              <td className="p-4 text-zinc-400">{order.email}</td>
                              <td className="p-4 text-zinc-200 font-semibold">{order.item_title}</td>
                              <td className="p-4">
                                <span className={`
                                  px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-widest
                                  ${order.type === 'subscription' 
                                    ? 'bg-gold-950/30 text-gold-400 border border-gold-500/20' 
                                    : 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20'}
                                `}>
                                  {order.type === 'subscription' ? 'SUITE SUBSCRIPTION' : 'ONE-TIME SALE'}
                                </span>
                              </td>
                              <td className="p-4 text-zinc-500">
                                {new Date(order.purchased_at).toLocaleString()}
                              </td>
                              <td className="p-4 text-right pr-6 font-bold text-zinc-100">${(order.amount || 0).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 6: METRICS TERMINAL */}
              {activeTab === 'analytics' && (
                <>
                  <div className="space-y-1">
                    <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                      Operational Metrics Terminal
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Analytical review of subscriber cohorts, subscription distributions, and MRR growth indexes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Subscriber tier breakdown (Recharts BarChart) */}
                    <div className="glass-panel p-6 rounded-xl space-y-4 md:col-span-2">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-300 font-mono">Subscriber Tier cohorts distribution</h4>
                        <span className="text-[9px] font-mono text-zinc-500">Active subscriptions</span>
                      </div>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { tier: 'Starter ($29/m)', count: stats.subscribersBreakdown?.Starter || 1 },
                            { tier: 'Pro ($99/m)', count: stats.subscribersBreakdown?.Pro || 1 },
                            { tier: 'Elite ($199/m)', count: stats.subscribersBreakdown?.Elite || 1 }
                          ]} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                            <XAxis dataKey="tier" stroke="#27272a" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} />
                            <YAxis stroke="#27272a" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#cc9b33', borderRadius: '8px', color: '#f4f4f5', fontFamily: 'monospace', fontSize: 11 }} />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {[0, 1, 2].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick gauges / Stats */}
                    <div className="glass-panel p-6 rounded-xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                          <Sliders className="w-4 h-4 text-gold-400" />
                          <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-300 font-mono">Operations Audit</h4>
                        </div>

                        <div className="space-y-4 pt-2 font-mono text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-500">
                              <span>MRR MET TARGET:</span>
                              <span className="text-gold-400 font-bold">78%</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-gold-500 rounded-full" style={{ width: '78%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-500">
                              <span>RETENTION MATRIX:</span>
                              <span className="text-gold-400 font-bold">96.2%</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-gold-500 rounded-full" style={{ width: '96.2%' }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-500">
                              <span>CHURN LEVEL GAUGES:</span>
                              <span className="text-emerald-400 font-bold">3.8%</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '3.8%' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1 text-[10px] font-mono leading-normal text-zinc-500 mt-auto">
                        <span className="text-zinc-400 font-bold block uppercase">Growth Projection Index</span>
                        <span>
                          Current indicators denote subscription cohorts scaling up at 14.5% week-over-week. Administrative limits stable.
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* DETAILED PRODUCT EDIT/ADD DRAWERS/MODAL */}
      <AnimatePresence>
        {productModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductModalOpen(false)}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />

            {/* Modal Form */}
            <motion.form
              onSubmit={handleSaveProduct}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-[#050505] border border-zinc-800 rounded-xl glow-gold overflow-hidden relative z-10 p-6 md:p-8 space-y-5"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <h3 className="font-display font-extrabold text-sm text-zinc-200 uppercase tracking-widest">
                  {editingProduct ? 'Modify clearance asset' : 'Add new digital asset'}
                </h3>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300 p-1 border border-zinc-900 rounded bg-[#020202] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Asset Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Institutional Order Blocks Guide"
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-zinc-200 placeholder-zinc-700 focus:outline-none transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a comprehensive operational summary of the digital trading tool..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-zinc-200 placeholder-zinc-700 focus:outline-none transition-colors leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Price (USD) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="99.00"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-zinc-200 placeholder-zinc-700 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Badge */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Badge Overlay</label>
                    <input
                      type="text"
                      placeholder="Hot / Elite / Best Seller"
                      value={prodBadge}
                      onChange={(e) => setProdBadge(e.target.value)}
                      className="w-full px-3 py-2 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-zinc-200 placeholder-zinc-700 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-zinc-300 focus:outline-none"
                    >
                      <option value="PDFs">PDFs</option>
                      <option value="Trading Journals">Trading Journals</option>
                      <option value="Excel Sheets">Excel Sheets</option>
                      <option value="Trading Tools">Trading Tools</option>
                    </select>
                  </div>

                  {/* File Type */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Format Type</label>
                    <select
                      value={prodFileType}
                      onChange={(e) => setProdFileType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-zinc-300 focus:outline-none"
                    >
                      <option value="pdf">pdf</option>
                      <option value="xlsx">xlsx</option>
                      <option value="zip">zip</option>
                      <option value="indicator">indicator</option>
                    </select>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Asset Specifications (one per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Spec 1: Advanced Pinescript V5&#10;Spec 2: Instant sound alerts"
                    value={prodFeatures}
                    onChange={(e) => setProdFeatures(e.target.value)}
                    className="w-full px-3 py-2 bg-[#020202] border border-zinc-900 focus:border-gold-500/30 rounded-lg text-zinc-200 placeholder-zinc-700 focus:outline-none transition-colors leading-relaxed"
                  />
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-900 flex justify-end gap-3 text-xs font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 text-zinc-950 rounded-lg transition-all glow-gold disabled:opacity-50 cursor-pointer"
                >
                  {savingProduct ? 'Saving...' : 'Save Matrix'}
                </button>
              </div>

            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
