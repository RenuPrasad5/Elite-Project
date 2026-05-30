-- Supabase Database Schema for EVIL ELITE Digital Product Marketplace

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('PDFs', 'Trading Journals', 'Excel Sheets', 'Trading Tools')),
    download_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'xlsx', 'zip', 'indicator')),
    badge TEXT,
    features TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Purchases Table (Tracks which user bought which product)
CREATE TABLE IF NOT EXISTS public.purchases (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_product_purchase UNIQUE (user_id, product_id)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Products
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
CREATE POLICY "Allow public read access to products" 
    ON public.products 
    FOR SELECT 
    USING (true);

-- 5. RLS Policies for Purchases
DROP POLICY IF EXISTS "Allow users to view their own purchases" ON public.purchases;
CREATE POLICY "Allow users to view their own purchases" 
    ON public.purchases 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to insert their own purchases" ON public.purchases;
CREATE POLICY "Allow users to insert their own purchases" 
    ON public.purchases 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 6. Seed Premium Digital Products
INSERT INTO public.products (title, description, price, category, download_url, file_type, badge, features)
VALUES 
(
    'Institutional Liquidity Heatmap Guide', 
    'A masterclass PDF detailing how to locate and trade high-frequency institutional order blocks, sweep zones, and market maker liquidity pool gaps.', 
    49.00, 
    'PDFs', 
    '/downloads/institutional_liquidity_guide.pdf', 
    'pdf', 
    'Hot', 
    ARRAY['55 Pages of Institutional Concepts', 'Detailed Order Flow Charts', 'Step-by-step Execution Checklists']
),
(
    'Alpha Trade Journal (Notion & PDF Edition)', 
    'Advanced multi-asset journaling terminal. Log your trades, track Win/Loss ratios, record emotional triggers, and automatically generate weekly performance metrics.', 
    29.00, 
    'Trading Journals', 
    '/downloads/alpha_trade_journal.pdf', 
    'pdf', 
    'Best Seller', 
    ARRAY['Notion Template & Printable PDF Included', 'Advanced Strategy Win Rate Tracker', 'Emotional Bias Checklist']
),
(
    'Leveraged Risk & Margin Calculator', 
    'A professional-grade Excel sheet that calculates precise position sizing, margin limits, liquidation zones, and risk-to-reward ratios for isolated leverage up to 100x.', 
    39.00, 
    'Excel Sheets', 
    '/downloads/risk_margin_calculator.xlsx', 
    'xlsx', 
    'Essential', 
    ARRAY['Isolated & Cross Margin Calculations', 'Instant Stop-Loss Position Sizing', 'Liquidation Risk Heat Index']
),
(
    'Order Block & Fair Value Gap Finder', 
    'PineScript (TradingView v5) and MT5 script that automatically highlights institutional order blocks and mitigated/unmitigated Fair Value Gaps (FVG) with sound alerts.', 
    149.00, 
    'Trading Tools', 
    '/downloads/order_block_finder.zip', 
    'zip', 
    'Premium', 
    ARRAY['Automated PineScript v5 & MT5 code', 'Real-time Alert Notifications', 'Mitigated vs Unmitigated Zone Coloring']
),
(
    'HFT Arbitrage Bot Controller', 
    'A high-frequency Python CLI script to monitor price differences between key orderbooks, complete with API triggers and instant webhook outputs.', 
    299.00, 
    'Trading Tools', 
    '/downloads/hft_arbitrage_controller.zip', 
    'zip', 
    'Elite', 
    ARRAY['Command-Line Interface (Python)', 'Dual exchange API connectors', 'Custom Telegram Webhook Alerts']
)
ON CONFLICT DO NOTHING;

-- 7. Create Subscriptions Table (Tracks which user has which membership tier)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('Starter', 'Pro', 'Elite')),
    status TEXT NOT NULL,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_subscription UNIQUE (user_id)
);

-- Enable RLS for Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Subscriptions
DROP POLICY IF EXISTS "Allow users to view their own subscription status" ON public.subscriptions;
CREATE POLICY "Allow users to view their own subscription status"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- 8. Create Trades Table (Trading Journal)
CREATE TABLE IF NOT EXISTS public.trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    asset TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('Long', 'Short')),
    pnl NUMERIC NOT NULL,
    rr NUMERIC NOT NULL,
    setup TEXT NOT NULL,
    emotion TEXT NOT NULL,
    mistake TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    screenshot_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Trades
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Trades
DROP POLICY IF EXISTS "Allow users to view their own trades" ON public.trades;
CREATE POLICY "Allow users to view their own trades"
    ON public.trades
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to insert their own trades" ON public.trades;
CREATE POLICY "Allow users to insert their own trades"
    ON public.trades
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to update their own trades" ON public.trades;
CREATE POLICY "Allow users to update their own trades"
    ON public.trades
    FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to delete their own trades" ON public.trades;
CREATE POLICY "Allow users to delete their own trades"
    ON public.trades
    FOR DELETE
    USING (auth.uid() = user_id);

-- 9. Storage Bucket for Trade Screenshots
-- Note: You may need to run this in the Supabase SQL Editor if storage schema differs.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trade-screenshots', 'trade-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage Bucket
DROP POLICY IF EXISTS "Allow public read of trade screenshots" ON storage.objects;
CREATE POLICY "Allow public read of trade screenshots"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'trade-screenshots');

DROP POLICY IF EXISTS "Allow authenticated uploads to trade screenshots" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to trade screenshots"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'trade-screenshots' AND 
        auth.role() = 'authenticated'
    );


-- 10. Create Profiles Table (Community Layer)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable to allow system/bot seed profiles
    handle TEXT UNIQUE NOT NULL,
    bio TEXT,
    discord_username TEXT,
    win_rate NUMERIC DEFAULT 0,
    total_pnl NUMERIC DEFAULT 0,
    global_rank INTEGER,
    badges TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
CREATE POLICY "Allow public read access to profiles"
    ON public.profiles
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
CREATE POLICY "Allow users to insert their own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
CREATE POLICY "Allow users to update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Seed Initial Profiles for Leaderboard
INSERT INTO public.profiles (user_id, handle, bio, win_rate, total_pnl, global_rank, badges)
-- Using NULL for user_id so we don't violate foreign key constraints for dummy leaderboard data
VALUES 
    (NULL, 'Phantom_FX', 'Top step prop firm trader. NQ exclusively.', 78.5, 142500, 1, ARRAY['Whale', 'Sniper', 'Funded']),
    (NULL, 'Ghost_Trader', 'Price action purist.', 64.2, 98200, 2, ARRAY['Funded', 'Consistent']),
    (NULL, 'VoidCapital', 'Institutional order flow.', 71.0, 85100, 3, ARRAY['Sniper', 'Funded']),
    (NULL, 'NQ_Assassin', 'Live fast, trade hard.', 58.0, 62450, 4, ARRAY['Funded'])
ON CONFLICT (handle) DO NOTHING;


