'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProducts, getUserPurchases, purchaseProduct, Product, getUserSubscription, UserSubscription, updateLocalSubscription } from '@/lib/products';
import { 
  LogOut, 
  User, 
  TrendingUp, 
  Clock, 
  Coins, 
  ShieldCheck, 
  Terminal, 
  Activity, 
  DollarSign,
  LayoutDashboard,
  ShoppingBag,
  Download,
  CreditCard,
  Settings as SettingsIcon,
  Search,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  FileDown,
  ExternalLink,
  RefreshCw,
  Sliders,
  Database,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { time: '09:00', price: 92400 },
  { time: '10:00', price: 92850 },
  { time: '11:00', price: 92100 },
  { time: '12:00', price: 93400 },
  { time: '13:00', price: 94100 },
  { time: '14:00', price: 93800 },
  { time: '15:00', price: 94900 },
  { time: '16:00', price: 95500 },
];

const mockPositions = [
  { id: 1, symbol: 'BTC-USD-PERP', type: 'LONG', size: '2.50 BTC', entry: '$92,400.00', mark: '$95,500.00', pnl: '+$7,750.00', leverage: '100x', positive: true },
  { id: 2, symbol: 'ETH-USD-PERP', type: 'SHORT', size: '32.0 ETH', entry: '$3,120.50', mark: '$3,080.20', pnl: '+$1,289.60', leverage: '50x', positive: true },
  { id: 3, symbol: 'SOL-USD-PERP', type: 'LONG', size: '150.0 SOL', entry: '$142.30', mark: '$139.10', pnl: '-$480.00', leverage: '25x', positive: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut, loading: authLoading } = useAuth();
  
  // States
  const [activeView, setActiveView] = useState<'dashboard' | 'products' | 'downloads' | 'billing' | 'settings'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<number[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription>({ user_id: '', tier: null, status: null });
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Marketplace Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Checkout Modal State
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [upgradingTier, setUpgradingTier] = useState<'Starter' | 'Pro' | 'Elite' | null>(null);

  // Settings State
  const [clearingHistory, setClearingHistory] = useState(false);

  // Initial mount checks and fetch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoadingProducts(true);
    try {
      const allProducts = await getProducts();
      const userPurchases = await getUserPurchases(user.id);
      const sub = await getUserSubscription(user.id);
      setProducts(allProducts);
      setPurchasedIds(userPurchases);
      setSubscription(sub);
    } catch (err) {
      console.error('Error loading product/purchase/subscription data:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/login');
      router.refresh();
    }
  };

  // Real Stripe Product Checkout or Simulated Fallback
  const handlePurchase = async (productId: number) => {
    if (!user) return;
    setPurchasingId(productId);
    setCheckoutSuccess(false);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.simulated) {
        // High-fidelity sandbox fallback trigger
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setCheckoutSuccess(true);
        setTimeout(() => {
          setPurchasingId(null);
          setCheckoutSuccess(false);
          setSelectedProduct(null);
          router.push(`/checkout/success?type=product&productId=${productId}`);
        }, 1200);
      } else {
        throw new Error(data.error || 'Transaction initialization failed.');
      }
    } catch (err: any) {
      console.error('Product checkout error:', err);
      setPurchasingId(null);
      alert(err.message || 'Payment system offline. Please try again.');
    }
  };

  // Real Stripe Subscription Upgrade or Simulated Fallback
  const handleSubscriptionCheckout = async (planId: 'Starter' | 'Pro' | 'Elite') => {
    if (!user) return;
    setUpgradingTier(planId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: user.id,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.simulated) {
        // High-fidelity sandbox fallback trigger
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await updateLocalSubscription(user.id, planId);
        setSubscription({
          user_id: user.id,
          tier: planId,
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        setUpgradingTier(null);
        router.push(`/checkout/success?type=subscription&tier=${planId}`);
      } else {
        throw new Error(data.error || 'Upgrade initialization failed.');
      }
    } catch (err: any) {
      console.error('Subscription checkout error:', err);
      setUpgradingTier(null);
      alert(err.message || 'Payment engine offline. Please try again.');
    }
  };

  // Mock File Download Processing
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const handleDownload = async (product: Product) => {
    setDownloadingId(product.id);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const element = document.createElement('a');
    const fileContent = `EVIL ELITE LICENSE & KEY DECRYPTOR\nProduct: ${product.title}\nFormat: ${product.file_type.toUpperCase()}\nUnique Key Hash: sha256-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}\nLicense Type: Premium Lifetime Access Clearance\nAuthorized operator: ${user?.email}`;
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${product.title.toLowerCase().replace(/\s+/g, '_')}_clearance_license.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setDownloadingId(null);
  };

  // Reset Local Purchase Cache (For Testing)
  const handleResetPurchases = () => {
    if (!user) return;
    setClearingHistory(true);
    setTimeout(() => {
      localStorage.removeItem(`ee_purchases_${user.id}`);
      localStorage.removeItem(`ee_subscription_${user.id}`);
      setPurchasedIds([]);
      setSubscription({ user_id: user.id, tier: null, status: null });
      setClearingHistory(false);
      alert('Local storage cache cleared. Real database records remain unaffected.');
    }, 1000);
  };

  // Loading Screen
  if (authLoading || (user && loadingProducts && !isMounted)) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-[#020202]">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest font-mono text-zinc-500">Syncing clearance node...</span>
      </div>
    );
  }

  // Denied Access Screen
  if (!user) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-[#020202] text-zinc-400">
        <ShieldCheck className="w-12 h-12 text-rose-500 mb-4 animate-pulse" />
        <p className="text-lg font-medium font-display tracking-wider">CLEARANCE KEY INVALID</p>
        <p className="text-sm text-zinc-600 mb-6">Access requires valid operator signature credentials.</p>
        <button 
          onClick={() => router.push('/login')} 
          className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-lg transition-all duration-300 glow-gold cursor-pointer text-xs uppercase tracking-widest"
        >
          Authenticate Node
        </button>
      </div>
    );
  }

  // Filters for marketplace
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'All' || 
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 bg-[#020202] text-zinc-100 flex relative overflow-hidden h-screen font-sans">
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(181,131,32,0.015),transparent_60%)] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-gold-950/10 rounded-full blur-[150px] pointer-events-none" />

      {/* MOBILE HEADER */}
      <header className="md:hidden w-full h-16 bg-[#050505] border-b border-zinc-900 absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 flex items-center justify-center glow-gold">
            <span className="text-zinc-950 font-display font-bold text-[10px]">EE</span>
          </div>
          <span className="font-display font-bold tracking-widest text-sm bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            EVIL ELITE
          </span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-400 hover:text-zinc-100">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* LEFT SIDEBAR (Sidebar navigation options: Dashboard, Products, Downloads, Billing, Settings) */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 w-64 bg-[#050505] border-r border-zinc-900 z-50 flex flex-col justify-between 
        transition-transform duration-300 md:translate-x-0 pt-16 md:pt-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col flex-1 p-6 space-y-8">
          
          {/* Logo & Node name */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 flex items-center justify-center glow-gold">
              <span className="text-zinc-950 font-display font-bold text-xs">EE</span>
            </div>
            <span className="font-display font-bold tracking-widest text-base bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              EVIL ELITE
            </span>
          </div>

          {/* Active Operator Status */}
          <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-lg space-y-1">
            <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase block">Operator Profile</span>
            <span className="text-xs text-zinc-300 truncate block font-medium font-mono">{user.email}</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wider">Secure Node</span>
            </div>
          </div>

          {/* Sidebar Menu items */}
          <nav className="space-y-1.5 flex-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Marketplace', icon: ShoppingBag },
              { id: 'downloads', label: 'Downloads', icon: Download, badge: purchasedIds.length > 0 ? purchasedIds.length : null },
              { id: 'billing', label: 'Billing Ledger', icon: CreditCard },
              { id: 'settings', label: 'Clearance Settings', icon: Sliders },
            ].map((item) => {
              const IconComponent = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-gold-950/30 text-gold-400 border border-gold-500/20' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold font-mono bg-gold-500 text-zinc-950 rounded-full w-4 h-4 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Profile / Terminate */}
        <div className="p-6 border-t border-zinc-900/50 bg-[#030303]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">Clearance</span>
              <span className="text-[10px] text-gold-400 font-bold font-mono uppercase truncate max-w-[100px]">{subscription.tier || 'FREE NODE'}</span>
            </div>
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

      {/* RIGHT CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto pt-16 md:pt-0">
        
        {/* Dynamic Inner Panel View Renderer */}
        <div className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {/* VIEW 1: CORE TRADER TERMINAL (DASHBOARD) */}
              {activeView === 'dashboard' && (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                        Operator Control Hub
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1 font-mono">
                        Active Node: node_sec_clearance_5.evilelite.club
                      </p>
                    </div>

                    <button
                      onClick={loadData}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-gold-500/30 text-zinc-400 hover:text-gold-400 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Sync Database
                    </button>
                  </div>

                  {/* Account Overview Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-5 rounded-xl flex items-center justify-between relative overflow-hidden">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Portfolio Balance</span>
                        <span className="text-2xl font-bold font-mono">$842,910.45</span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                          <TrendingUp className="w-3 h-3" /> +14.2% today
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-gold-950/20 border border-gold-500/10 text-gold-400">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Leverage Clearance</span>
                        <span className="text-2xl font-bold font-mono">100x Isolated</span>
                        <span className="text-[11px] text-zinc-500 font-mono block">Max Collateral Mode</span>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">24H Trading Volume</span>
                        <span className="text-2xl font-bold font-mono">$4,289,120</span>
                        <span className="text-[11px] text-emerald-400 font-mono">Institutional node priority</span>
                      </div>
                      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Coins className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Subscription Status Card */}
                    <div className="glass-panel-premium p-5 rounded-xl flex items-center justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-full blur-[30px]" />
                      <div className="space-y-1 z-10">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Clearance Tier</span>
                        <span className="text-base font-bold text-gold-400 uppercase tracking-wider block">
                          {subscription.tier ? `${subscription.tier} membership` : 'No Active Membership'}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold uppercase">
                          <ShieldCheck className="w-3.5 h-3.5" /> {subscription.status === 'active' ? 'Active' : 'Free Operator'}
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-gold-950/40 border border-gold-500/20 text-gold-400 z-10">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Recharts chart */}
                  <div className="glass-panel p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-gold-400" />
                        <h3 className="font-display font-bold uppercase tracking-widest text-xs text-zinc-300">
                          Institutional Index Feed (BTC/USD)
                        </h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-gold-400">$95,500.00</span>
                    </div>
                    <div className="h-60 w-full">
                      {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cc9b33" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#cc9b33" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#27272a" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} />
                            <YAxis stroke="#27272a" tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} domain={['dataMin - 300', 'dataMax + 300']} />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#cc9b33', borderRadius: '8px', color: '#f4f4f5', fontFamily: 'monospace', fontSize: 11 }} />
                            <Area type="monotone" dataKey="price" stroke="#cc9b33" strokeWidth={1.5} fillOpacity={1} fill="url(#goldGradient)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : null}
                    </div>
                  </div>

                  {/* Bottom details grids */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Positions */}
                    <div className="lg:col-span-2 glass-panel p-6 rounded-xl space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-300">Active derivative positions</h4>
                        <span className="text-[10px] font-mono text-zinc-500">Live Engine</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-mono">
                          <thead>
                            <tr className="text-zinc-500 uppercase tracking-widest text-[9px] border-b border-zinc-900/60 pb-2">
                              <th className="pb-2">Contract</th>
                              <th className="pb-2">Margin</th>
                              <th className="pb-2 text-right">Entry / Mark</th>
                              <th className="pb-2 text-right">PnL</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900/40">
                            {mockPositions.map((pos) => (
                              <tr key={pos.id} className="hover:bg-zinc-900/10">
                                <td className="py-3 font-bold text-zinc-200">
                                  {pos.symbol}
                                  <span className="text-[9px] ml-1.5 px-1 py-0.2 rounded bg-zinc-950 border border-zinc-800 text-zinc-500">{pos.leverage}</span>
                                </td>
                                <td className="py-3">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${pos.type === 'LONG' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/10' : 'bg-rose-950/40 text-rose-400 border border-rose-500/10'}`}>
                                    {pos.type}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  <div>{pos.entry}</div>
                                  <div className="text-[9px] text-zinc-500">{pos.mark}</div>
                                </td>
                                <td className={`py-3 text-right font-bold ${pos.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {pos.pnl}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Quick actions & widgets */}
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                        <Sliders className="w-3.5 h-3.5 text-gold-400" />
                        <h4 className="text-xs font-bold tracking-widest uppercase text-zinc-300">Quick actions</h4>
                      </div>

                      <div className="space-y-2">
                        <button 
                          onClick={() => setActiveView('products')} 
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-gold-500/30 text-left text-xs font-semibold text-zinc-300 hover:text-gold-400 transition-all cursor-pointer"
                        >
                          <span>Explore marketplace</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => setActiveView('downloads')}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-gold-500/30 text-left text-xs font-semibold text-zinc-300 hover:text-gold-400 transition-all cursor-pointer"
                        >
                          <span>Access downloads</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => setActiveView('settings')}
                          className="w-full flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-gold-500/30 text-left text-xs font-semibold text-zinc-300 hover:text-gold-400 transition-all cursor-pointer"
                        >
                          <span>Operator settings</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>

                        <div className="p-3.5 rounded-lg bg-gold-950/15 border border-gold-500/10 space-y-2">
                          <span className="text-[10px] text-gold-400 font-mono tracking-widest uppercase block font-bold">Purchased assets</span>
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-zinc-400">Total Indicators:</span>
                            <span className="text-zinc-200 font-bold">{purchasedIds.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              )}

              {/* VIEW 2: DIGITAL PRODUCT MARKETPLACE */}
              {activeView === 'products' && (
                <>
                  <div className="space-y-1">
                    <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                      Digital Marketplace
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Acquire institutional guides, mathematical calculators, and proprietary PineScript indicators.
                    </p>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                    {/* Search */}
                    <div className="relative flex-1">
                      <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-zinc-500" />
                      <input 
                        type="text"
                        placeholder="Search assets (e.g. 'fvg', 'risk')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-[#020202] border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-gold-500/50 transition-colors"
                      />
                    </div>

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-1">
                      {['All', 'PDFs', 'Trading Journals', 'Excel Sheets', 'Trading Tools'].map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`
                            px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer
                            ${selectedCategory === category 
                              ? 'bg-gold-500 text-zinc-950' 
                              : 'bg-[#020202] text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'}
                          `}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Cards Grid */}
                  {filteredProducts.length === 0 ? (
                    <div className="glass-panel p-16 text-center rounded-xl space-y-3">
                      <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto" />
                      <h4 className="text-sm font-semibold text-zinc-300">No matching assets found</h4>
                      <p className="text-xs text-zinc-500">Modify your search query or change the active category filter.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredProducts.map((product) => {
                        const isPurchased = purchasedIds.includes(product.id);
                        return (
                          <div 
                            key={product.id}
                            className="glass-panel hover:border-gold-500/35 transition-all duration-300 rounded-xl overflow-hidden flex flex-col justify-between relative group"
                          >
                            {/* Card Header Badge */}
                            {product.badge && (
                              <span className="absolute top-3 left-3 bg-gold-950/60 border border-gold-500/30 text-gold-400 text-[8px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">
                                {product.badge}
                              </span>
                            )}

                            {/* Card Body */}
                            <div className="p-6 space-y-4">
                              <div className="pt-4 flex justify-between items-start">
                                <span className="text-[9px] font-mono text-gold-400/80 bg-gold-950/20 border border-gold-500/10 px-2 py-0.5 rounded">
                                  {product.category}
                                </span>
                                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                                  .{product.file_type}
                                </span>
                              </div>

                              <h3 className="font-display font-bold text-zinc-200 tracking-wider text-sm group-hover:text-gold-400 transition-colors">
                                {product.title}
                              </h3>

                              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                                {product.description}
                              </p>

                              {/* Features Preview */}
                              <ul className="space-y-1 pt-1">
                                {product.features.slice(0, 2).map((feat, idx) => (
                                  <li key={idx} className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-mono">
                                    <CheckCircle2 className="w-3 h-3 text-gold-500 shrink-0" />
                                    <span className="truncate">{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="p-6 pt-0 border-t border-zinc-900/30 flex items-center justify-between mt-auto">
                              <span className="text-base font-bold font-mono text-gold-300">
                                ${(product.price || 0).toFixed(2)}
                              </span>

                              <div className="flex items-center gap-2">
                                {isPurchased ? (
                                  <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="px-3.5 py-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer"
                                  >
                                    <Unlock className="w-3.5 h-3.5" />
                                    Unlocked
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-gold-500/30 text-zinc-300 hover:text-gold-400 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-all duration-200"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    Access
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* VIEW 3: DOWNLOADS REPOSITORY */}
              {activeView === 'downloads' && (
                <>
                  <div className="space-y-1">
                    <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                      Decrypted Repository
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Access all products unlocked by your operator signature key.
                    </p>
                  </div>

                  {/* Filter purchased products */}
                  {purchasedIds.length === 0 ? (
                    <div className="glass-panel p-16 text-center rounded-xl space-y-4">
                      <Lock className="w-12 h-12 text-zinc-700 mx-auto animate-pulse" />
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-zinc-300">Repository currently locked</h4>
                        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                          You have not purchased any premium assets. Head over to the Marketplace tab to unlock indicator tools or calculators.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveView('products')}
                        className="px-5 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold rounded-lg transition-all duration-300 glow-gold cursor-pointer text-[10px] uppercase tracking-widest"
                      >
                        Visit Marketplace
                      </button>
                    </div>
                  ) : (
                    <div className="glass-panel rounded-xl overflow-hidden border border-zinc-900">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs font-mono">
                          <thead>
                            <tr className="bg-zinc-950 text-zinc-500 uppercase tracking-widest text-[9px] border-b border-zinc-900 px-6 py-4">
                              <th className="p-4 pl-6">Secured Asset</th>
                              <th className="p-4">Category</th>
                              <th className="p-4">File Type</th>
                              <th className="p-4 text-right pr-6">Download Link</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-900/50">
                            {products
                              .filter((p) => purchasedIds.includes(p.id))
                              .map((product) => (
                                <tr key={product.id} className="hover:bg-zinc-900/10">
                                  <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded bg-gold-950/20 border border-gold-500/10 flex items-center justify-center text-gold-400">
                                        <FileDown className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <span className="font-semibold text-zinc-200 block text-xs">{product.title}</span>
                                        <span className="text-[9px] text-zinc-500 block truncate max-w-xs">{product.description}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className="text-zinc-400">{product.category}</span>
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase tracking-widest text-[9px] font-bold">
                                      {product.file_type}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right pr-6">
                                    <button
                                      onClick={() => handleDownload(product)}
                                      disabled={downloadingId === product.id}
                                      className="px-3.5 py-2 bg-gold-500 hover:bg-gold-400 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 ml-auto transition-all cursor-pointer disabled:pointer-events-none"
                                    >
                                      {downloadingId === product.id ? (
                                        <>
                                          <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                          Unpacking...
                                        </>
                                      ) : (
                                        <>
                                          <Download className="w-3.5 h-3.5" />
                                          Download
                                        </>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* VIEW 4: BILLING LEDGER */}
              {activeView === 'billing' && (
                <>
                  <div className="space-y-1">
                    <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                      Billing Ledger
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Institutional invoicing ledger and secure billing node endpoints.
                    </p>
                  </div>

                  {/* Subscription Membership Tiers */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                      <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-300">Membership clearance tiers</h3>
                      <span className="text-[9px] font-mono text-zinc-500">Stripe Live Gateway</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          id: 'Starter',
                          name: 'Starter Tier',
                          price: 29.00,
                          badge: 'Entry Level',
                          features: ['Basic Indicator Downloads', 'Standard PDF Market Guides', 'Leverage limits up to 25x', 'Community Group Access'],
                          color: 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        },
                        {
                          id: 'Pro',
                          name: 'Pro Tier',
                          price: 79.00,
                          badge: 'Operator Choice',
                          features: ['Advanced Indicator Tools', 'Excel Risk Calculators', 'Leverage limits up to 50x', 'Priority Signal Alerts', 'Standard Notion Journal'],
                          color: 'border-zinc-800 text-zinc-300 hover:border-gold-500/25 bg-zinc-950/20'
                        },
                        {
                          id: 'Elite',
                          name: 'Elite Tier',
                          price: 199.00,
                          badge: 'Institutional Clearance',
                          features: ['Unlimited Decoder Access', 'HFT Python Bot Repositories', 'Full 100x Isolated Margins', 'Automated Telegram Webhooks', '1-on-1 Consultation Call'],
                          color: 'border-gold-500/20 text-gold-400 bg-gold-950/5 hover:border-gold-500/40 glow-gold-soft'
                        }
                      ].map((plan) => {
                        const isActive = subscription.tier === plan.id;
                        const isUpgrading = upgradingTier === plan.id;
                        return (
                          <div 
                            key={plan.id}
                            className={`glass-panel p-6 rounded-xl flex flex-col justify-between space-y-6 transition-all duration-300 border relative group ${plan.color}`}
                          >
                            {isActive && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-zinc-950 text-[9px] font-bold font-mono uppercase px-3 py-0.5 rounded-full tracking-widest z-10">
                                Active clearance
                              </div>
                            )}

                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">{plan.badge}</span>
                                  <h4 className="text-sm font-bold tracking-wider font-display uppercase text-zinc-200 mt-0.5">{plan.name}</h4>
                                </div>
                                <span className="text-lg font-mono font-bold text-zinc-100">${plan.price.toFixed(0)}<span className="text-[10px] text-zinc-500 font-normal">/mo</span></span>
                              </div>

                              <ul className="space-y-1.5 pt-2">
                                {plan.features.map((feat, idx) => (
                                  <li key={idx} className="text-[11px] text-zinc-400 flex items-start gap-2 font-mono">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <button
                              onClick={() => handleSubscriptionCheckout(plan.id as any)}
                              disabled={isActive || upgradingTier !== null}
                              className={`
                                w-full py-2.5 rounded-lg text-center text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:pointer-events-none
                                ${isActive 
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-zinc-900 border border-zinc-800 hover:border-gold-500/30 text-zinc-300 hover:text-gold-400'}
                              `}
                            >
                              {isActive ? 'Clearance Granted' : isUpgrading ? 'Authorizing...' : 'Upgrade Access'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="glass-panel p-6 rounded-xl space-y-4">
                      <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-400">Payment instrument</h3>
                      <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-zinc-500 block">CARD ON FILE</span>
                          <span className="text-xs font-bold font-mono text-zinc-200">•••• •••• •••• 5551</span>
                        </div>
                        <span className="text-[9px] font-bold text-gold-400 font-mono bg-gold-950/20 border border-gold-500/10 px-2 py-0.5 rounded">VISA</span>
                      </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl space-y-4 md:col-span-2">
                      <h3 className="text-xs font-bold font-mono tracking-widest uppercase text-zinc-400">Transaction history</h3>
                      <div className="space-y-2">
                        {/* Static Billing Seed */}
                        <div className="flex items-center justify-between p-3.5 bg-zinc-950/80 border border-zinc-900 rounded-lg text-xs font-mono">
                          <div className="space-y-1">
                            <span className="text-zinc-200 font-semibold block">Elite Signal Subscription renewal</span>
                            <span className="text-[9px] text-zinc-500">May 28, 2026 • invoice_sub_8832a</span>
                          </div>
                          <span className="text-gold-400 font-bold">$199.00</span>
                        </div>

                        {/* User purchased items */}
                        {products
                          .filter((p) => purchasedIds.includes(p.id))
                          .map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3.5 bg-zinc-950/80 border border-zinc-900 rounded-lg text-xs font-mono">
                              <div className="space-y-1">
                                <span className="text-zinc-200 font-semibold block">{product.title} purchase</span>
                                <span className="text-[9px] text-zinc-500">May 28, 2026 • tx_prod_{product.id}ef5</span>
                              </div>
                              <span className="text-emerald-400 font-bold">${(product.price || 0).toFixed(2)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 5: SETTINGS */}
              {activeView === 'settings' && (
                <>
                  <div className="space-y-1">
                    <h2 className="text-xl font-display font-extrabold tracking-widest text-zinc-200 uppercase">
                      Clearance Settings
                    </h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Review security clearance limits and database logs.
                    </p>
                  </div>

                  <div className="glass-panel p-6 rounded-xl space-y-6">
                    <div className="flex items-center gap-2 pb-3 border-b border-zinc-900">
                      <Database className="w-4 h-4 text-gold-400" />
                      <h3 className="font-display font-bold uppercase tracking-widest text-xs text-zinc-300">
                        Supabase Database Controls
                      </h3>
                    </div>

                    <div className="space-y-4 max-w-xl">
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-zinc-400 block font-mono">SUPABASE NODE API URL</span>
                        <input 
                          type="text" 
                          value={process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not Configured'}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 rounded text-xs text-zinc-500 font-mono focus:outline-none"
                          disabled
                        />
                      </div>

                      <div className="space-y-2 pt-4">
                        <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Developer testing options</h4>
                        <p className="text-xs text-zinc-500">
                          Clear local storage purchase cache keys to reset the locked/unlocked state of indicators. Real Supabase database entries are preserved.
                        </p>
                        
                        <button
                          onClick={handleResetPurchases}
                          disabled={clearingHistory}
                          className="px-4 py-2 bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-300 hover:text-rose-200 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:pointer-events-none"
                        >
                          {clearingHistory ? 'Clearing cache...' : 'Reset local purchases'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* DETAILED PRODUCT DIALOG MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-[#000]/80 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl glass-panel-premium rounded-xl glow-gold overflow-hidden relative z-10"
            >
              {/* Gold Top Highlight */}
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-gold-950/40 border border-gold-500/20 text-gold-400 font-mono text-[9px] font-bold uppercase tracking-widest">
                      {selectedProduct.category}
                    </span>
                    <h3 className="font-display font-extrabold text-xl text-zinc-100 tracking-wide pt-1">
                      {selectedProduct.title}
                    </h3>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="text-zinc-500 hover:text-zinc-200 p-1 border border-zinc-900 rounded bg-[#020202] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {selectedProduct.description}
                </p>

                {/* Features list */}
                <div className="space-y-2">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">Specs & Clearance features</span>
                  <ul className="space-y-1.5">
                    {selectedProduct.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2.5 font-mono">
                        <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Purchase Area */}
                <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block">Clearance price</span>
                    <span className="text-xl font-bold font-mono text-gold-300">${(selectedProduct.price || 0).toFixed(2)}</span>
                  </div>

                  <div>
                    {purchasedIds.includes(selectedProduct.id) ? (
                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                          setActiveView('downloads');
                        }}
                        className="px-6 py-2.5 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Unlock className="w-4 h-4" />
                        Access unlocked
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(selectedProduct.id)}
                        disabled={purchasingId !== null}
                        className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-500 font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-1.5 cursor-pointer glow-gold transition-all duration-300 disabled:pointer-events-none"
                      >
                        {purchasingId === selectedProduct.id ? (
                          checkoutSuccess ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Unlocked
                            </>
                          ) : (
                            <>
                              <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </>
                          )
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Purchase Access
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
