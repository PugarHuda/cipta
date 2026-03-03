-- ============================================================
-- Migration: ERC-8004 + Honeypot + ETH payment columns
-- ============================================================

-- Add new columns to access_logs (ignore if already exist)
ALTER TABLE access_logs
  ADD COLUMN IF NOT EXISTS payment_type TEXT CHECK (payment_type IN ('x402', 'eth')),
  ADD COLUMN IF NOT EXISTS erc8004_agent_id TEXT,
  ADD COLUMN IF NOT EXISTS erc8004_score INTEGER;

-- Add honeypot status to existing constraint
-- Drop old constraint, re-add with new value
ALTER TABLE access_logs
  DROP CONSTRAINT IF EXISTS access_logs_status_check;

ALTER TABLE access_logs
  ADD CONSTRAINT access_logs_status_check
  CHECK (status IN ('attempted', 'paid', 'blocked', 'whitelisted', 'honeypot'));

-- Create honeypot_logs table
CREATE TABLE IF NOT EXISTS honeypot_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_wallet TEXT NOT NULL,
  bot_agent TEXT NOT NULL,
  trap_path TEXT NOT NULL,
  erc8004_agent_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_honeypot_creator ON honeypot_logs(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_honeypot_timestamp ON honeypot_logs(timestamp DESC);

ALTER TABLE honeypot_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "honeypot_select_public" ON honeypot_logs
  FOR SELECT USING (true);

CREATE POLICY "honeypot_insert_all" ON honeypot_logs
  FOR INSERT WITH CHECK (true);

-- Add honeypot summary view
CREATE OR REPLACE VIEW honeypot_summary AS
SELECT
  creator_wallet,
  COUNT(*) AS total_traps,
  COUNT(DISTINCT bot_agent) AS unique_bots,
  MAX(timestamp) AS last_trap,
  COUNT(*) FILTER (WHERE erc8004_agent_id IS NOT NULL) AS erc8004_agents_caught
FROM honeypot_logs
GROUP BY creator_wallet;

-- Update top_bots view (already handles the new status via existing filter)
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
