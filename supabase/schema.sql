-- ============================================================
-- CIPTA — Supabase Schema
-- Jalankan di: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Tabel kreator yang terdaftar
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  display_name TEXT,
  price_per_request DECIMAL(10, 6) DEFAULT 0.001,
  total_earned_usd DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel log setiap akses bot
CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  bot_agent TEXT NOT NULL,
  path TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attempted', 'paid', 'blocked', 'whitelisted', 'honeypot')),
  amount_usd DECIMAL(10, 6),
  tx_hash TEXT,
  payment_type TEXT CHECK (payment_type IN ('x402', 'eth')),
  erc8004_agent_id TEXT,
  erc8004_score INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel honeypot trap log
CREATE TABLE IF NOT EXISTS honeypot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  bot_agent TEXT NOT NULL,
  trap_path TEXT NOT NULL,
  erc8004_agent_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query dashboard yang cepat
CREATE INDEX IF NOT EXISTS idx_logs_creator ON access_logs(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON access_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_status ON access_logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_bot ON access_logs(bot_agent);
CREATE INDEX IF NOT EXISTS idx_honeypot_creator ON honeypot_logs(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_honeypot_timestamp ON honeypot_logs(timestamp DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE honeypot_logs ENABLE ROW LEVEL SECURITY;

-- creators: bisa dibaca siapa saja (public dashboard)
CREATE POLICY "creators_select_public" ON creators
  FOR SELECT USING (true);

-- access_logs: siapa saja bisa baca + insert (middleware pakai anon key)
CREATE POLICY "logs_select_public" ON access_logs
  FOR SELECT USING (true);

CREATE POLICY "logs_insert_all" ON access_logs
  FOR INSERT WITH CHECK (true);

-- honeypot_logs: siapa saja bisa baca + insert
CREATE POLICY "honeypot_select_public" ON honeypot_logs
  FOR SELECT USING (true);

CREATE POLICY "honeypot_insert_all" ON honeypot_logs
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- VIEWS untuk dashboard
-- ============================================================

-- Earnings harian per kreator (dipakai EarningsChart)
CREATE OR REPLACE VIEW daily_earnings AS
SELECT
  creator_wallet,
  DATE(timestamp) AS date,
  COUNT(*) FILTER (WHERE status = 'paid') AS paid_requests,
  COALESCE(SUM(amount_usd) FILTER (WHERE status = 'paid'), 0) AS earned_usd
FROM access_logs
GROUP BY creator_wallet, DATE(timestamp)
ORDER BY date DESC;

-- Top bots per kreator (dipakai BotActivityTable)
-- Kolom sesuai dengan BotStats type di @cipta/middleware
CREATE OR REPLACE VIEW top_bots AS
SELECT
  creator_wallet,
  bot_agent,
  COUNT(*) AS total_requests,
  COUNT(*) FILTER (WHERE status = 'paid') AS total_paid,
  COALESCE(SUM(amount_usd) FILTER (WHERE status = 'paid'), 0) AS total_earned_usd,
  MAX(timestamp) AS last_seen
FROM access_logs
GROUP BY creator_wallet, bot_agent
ORDER BY total_earned_usd DESC;

-- Honeypot summary per kreator (dipakai HoneypotCard)
CREATE OR REPLACE VIEW honeypot_summary AS
SELECT
  creator_wallet,
  COUNT(*) AS total_traps,
  COUNT(DISTINCT bot_agent) AS unique_bots,
  MAX(timestamp) AS last_trap,
  COUNT(*) FILTER (WHERE erc8004_agent_id IS NOT NULL) AS erc8004_agents_caught
FROM honeypot_logs
GROUP BY creator_wallet;
