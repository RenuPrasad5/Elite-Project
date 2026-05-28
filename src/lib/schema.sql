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
CREATE POLICY "Allow public read access to products" 
    ON public.products 
    FOR SELECT 
    USING (true);

-- 5. RLS Policies for Purchases
CREATE POLICY "Allow users to view their own purchases" 
    ON public.purchases 
    FOR SELECT 
    USING (auth.uid() = user_id);

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
CREATE POLICY "Allow users to view their own subscription status"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

