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
  status TEXT NOT NULL CHECK (status IN ('attempted', 'paid', 'blocked', 'whitelisted')),
  amount_usd DECIMAL(10, 6),
  tx_hash TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query dashboard yang cepat
CREATE INDEX IF NOT EXISTS idx_logs_creator ON access_logs(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON access_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_logs_status ON access_logs(status);
CREATE INDEX IF NOT EXISTS idx_logs_bot ON access_logs(bot_agent);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_logs ENABLE ROW LEVEL SECURITY;

-- creators: bisa dibaca siapa saja (public dashboard)
CREATE POLICY "creators_select_public" ON creators
  FOR SELECT USING (true);

-- access_logs: siapa saja bisa baca (data sudah di-scope di query per wallet)
CREATE POLICY "logs_select_public" ON access_logs
  FOR SELECT USING (true);

-- access_logs: siapa saja bisa INSERT (middleware pakai anon key)
CREATE POLICY "logs_insert_all" ON access_logs
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

-- ============================================================
-- DATA DUMMY untuk testing dashboard (opsional)
-- Hapus bagian ini kalau tidak mau data contoh
-- ============================================================

-- INSERT INTO access_logs (creator_wallet, bot_agent, path, status, amount_usd) VALUES
--   ('0xTESTWALLET123', 'GPTBot/1.0', '/content/artikel-1', 'paid', 0.001),
--   ('0xTESTWALLET123', 'ClaudeBot/1.0', '/content/artikel-2', 'paid', 0.002),
--   ('0xTESTWALLET123', 'PerplexityBot/1.0', '/content/artikel-1', 'attempted', NULL),
--   ('0xTESTWALLET123', 'GPTBot/1.0', '/content/artikel-3', 'paid', 0.001);
