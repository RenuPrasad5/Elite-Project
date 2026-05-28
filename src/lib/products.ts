import { supabase } from './supabase';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: 'PDFs' | 'Trading Journals' | 'Excel Sheets' | 'Trading Tools';
  download_url: string;
  file_type: 'pdf' | 'xlsx' | 'zip' | 'indicator';
  badge?: string;
  features: string[];
}

export interface Purchase {
  id?: number;
  user_id: string;
  product_id: number;
  purchased_at?: string;
}

// Seeded local mock products for fallback
export const LOCAL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Institutional Liquidity Heatmap Guide',
    description: 'A masterclass PDF detailing how to locate and trade high-frequency institutional order blocks, sweep zones, and market maker liquidity pool gaps.',
    price: 49.00,
    category: 'PDFs',
    download_url: '/downloads/institutional_liquidity_guide.pdf',
    file_type: 'pdf',
    badge: 'Hot',
    features: ['55 Pages of Institutional Concepts', 'Detailed Order Flow Charts', 'Step-by-step Execution Checklists']
  },
  {
    id: 2,
    title: 'Alpha Trade Journal (Notion & PDF Edition)',
    description: 'Advanced multi-asset journaling terminal. Log your trades, track Win/Loss ratios, record emotional triggers, and automatically generate weekly performance metrics.',
    price: 29.00,
    category: 'Trading Journals',
    download_url: '/downloads/alpha_trade_journal.pdf',
    file_type: 'pdf',
    badge: 'Best Seller',
    features: ['Notion Template & Printable PDF Included', 'Advanced Strategy Win Tracker', 'Emotional Bias Checklist']
  },
  {
    id: 3,
    title: 'Leveraged Risk & Margin Calculator',
    description: 'A professional-grade Excel sheet that calculates precise position sizing, margin limits, liquidation zones, and risk-to-reward ratios for isolated leverage up to 100x.',
    price: 39.00,
    category: 'Excel Sheets',
    download_url: '/downloads/risk_margin_calculator.xlsx',
    file_type: 'xlsx',
    badge: 'Essential',
    features: ['Isolated & Cross Margin Calculations', 'Instant Stop-Loss Position Sizing', 'Liquidation Risk Heat Index']
  },
  {
    id: 4,
    title: 'Order Block & Fair Value Gap Finder',
    description: 'PineScript (TradingView v5) and MT5 script that automatically highlights institutional order blocks and mitigated/unmitigated Fair Value Gaps (FVG) with sound alerts.',
    price: 149.00,
    category: 'Trading Tools',
    download_url: '/downloads/order_block_finder.zip',
    file_type: 'zip',
    badge: 'Premium',
    features: ['Automated PineScript v5 & MT5 code', 'Real-time Alert Notifications', 'Mitigated vs Unmitigated Zone Coloring']
  },
  {
    id: 5,
    title: 'HFT Arbitrage Bot Controller',
    description: 'A high-frequency Python CLI script to monitor price differences between key orderbooks, complete with API triggers and instant webhook outputs.',
    price: 299.00,
    category: 'Trading Tools',
    download_url: '/downloads/hft_arbitrage_controller.zip',
    file_type: 'zip',
    badge: 'Elite',
    features: ['Command-Line Interface (Python)', 'Dual exchange API connectors', 'Custom Telegram Webhook Alerts']
  }
];

/**
 * Fetches all products. Automatically falls back to local data if the database query fails.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase query failed, falling back to local products:', error.message);
      return LOCAL_PRODUCTS;
    }

    if (!data || data.length === 0) {
      return LOCAL_PRODUCTS;
    }

    // Cast the returned categories
    return data.map((item) => ({
      ...item,
      price: Number(item.price),
    }));
  } catch (err) {
    console.error('Error fetching products from database, falling back:', err);
    return LOCAL_PRODUCTS;
  }
}

/**
 * Fetches product IDs purchased by the user. Automatically falls back to localStorage if table doesn't exist.
 */
export async function getUserPurchases(userId: string): Promise<number[]> {
  try {
    // 1. Check local storage first to merge database and local purchases
    const localKey = `ee_purchases_${userId}`;
    let localPurchases: number[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(localKey);
      if (stored) {
        localPurchases = JSON.parse(stored);
      }
    }

    const { data, error } = await supabase
      .from('purchases')
      .select('product_id')
      .eq('user_id', userId);

    if (error) {
      console.warn('Failed to fetch purchases from Supabase, returning local store:', error.message);
      return localPurchases;
    }

    const dbPurchases = data.map((p: any) => p.product_id);
    
    // Merge database and local storage purchases to guarantee consistency
    const merged = Array.from(new Set([...dbPurchases, ...localPurchases]));
    
    // Sync back to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(merged));
    }

    return merged;
  } catch (err) {
    console.error('Error fetching purchases, returning local cache:', err);
    // Fallback to local storage purchases
    if (typeof window !== 'undefined') {
      const localKey = `ee_purchases_${userId}`;
      const stored = localStorage.getItem(localKey);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }
}

/**
 * Registers a product purchase for the user. Syncs to Supabase and falls back to local storage.
 */
export async function purchaseProduct(userId: string, productId: number): Promise<{ success: boolean; error?: any }> {
  // Sync locally first
  const localKey = `ee_purchases_${userId}`;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(localKey);
      const currentPurchases: number[] = stored ? JSON.parse(stored) : [];
      if (!currentPurchases.includes(productId)) {
        currentPurchases.push(productId);
        localStorage.setItem(localKey, JSON.stringify(currentPurchases));
      }
    } catch (e) {
      console.error('Local storage update failed:', e);
    }
  }

  try {
    const { error } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        product_id: productId
      });

    if (error) {
      console.warn('Supabase insertion failed, purchase registered locally only:', error.message);
      return { success: true, error: `Local only: ${error.message}` };
    }

    return { success: true };
  } catch (err) {
    console.error('Supabase purchase error:', err);
    return { success: true, error: err };
  }
}

export interface UserSubscription {
  user_id: string;
  tier: 'Starter' | 'Pro' | 'Elite' | null;
  status: string | null;
  current_period_end?: string;
}

/**
 * Fetches user subscription details. Falls back to localStorage if connection/table fails.
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  try {
    // 1. Check local storage first
    const localKey = `ee_subscription_${userId}`;
    let localSub: UserSubscription = { user_id: userId, tier: null, status: null };
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(localKey);
      if (stored) {
        localSub = JSON.parse(stored);
      }
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('tier, status, current_period_end')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.warn('Failed to fetch subscription from Supabase, returning local store:', error.message);
      return localSub;
    }

    if (!data) {
      return { user_id: userId, tier: null, status: null };
    }

    const activeSub: UserSubscription = {
      user_id: userId,
      tier: data.tier as 'Starter' | 'Pro' | 'Elite',
      status: data.status,
      current_period_end: data.current_period_end
    };

    // Sync back to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(localKey, JSON.stringify(activeSub));
    }

    return activeSub;
  } catch (err) {
    console.error('Error fetching subscription status, returning local cache:', err);
    if (typeof window !== 'undefined') {
      const localKey = `ee_subscription_${userId}`;
      const stored = localStorage.getItem(localKey);
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return { user_id: userId, tier: null, status: null };
  }
}

/**
 * Updates subscription details locally for sandbox testing.
 */
export async function updateLocalSubscription(userId: string, tier: 'Starter' | 'Pro' | 'Elite' | null): Promise<boolean> {
  const localKey = `ee_subscription_${userId}`;
  if (typeof window !== 'undefined') {
    try {
      if (tier === null) {
        localStorage.removeItem(localKey);
      } else {
        const subData: UserSubscription = {
          user_id: userId,
          tier,
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        localStorage.setItem(localKey, JSON.stringify(subData));
      }
      return true;
    } catch (e) {
      console.error('Local storage subscription update failed:', e);
      return false;
    }
  }
  return false;
}

