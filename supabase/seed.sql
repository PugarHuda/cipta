-- ============================================================
-- CIPTA — Demo Seed Data
-- Jalankan di Supabase SQL Editor untuk isi data demo
-- Ganti wallet address jika perlu
-- ============================================================

DO $$
DECLARE
  w TEXT := '0x0fc7b2C6Ed68f4553F4b2c7B52d4269a673B666f';
  now TIMESTAMPTZ := NOW();
BEGIN

-- ── access_logs: 30 hari terakhir ─────────────────────────────

-- GPTBot — paling sering, bayar x402
INSERT INTO access_logs (creator_wallet, bot_agent, path, status, amount_usd, tx_hash, payment_type, erc8004_score, timestamp) VALUES
  (w, 'GPTBot/1.0', '/content/artikel-defi-2026',    'paid',        0.003, '0xabc111', 'x402', 88, now - INTERVAL '0 days 2 hours'),
  (w, 'GPTBot/1.0', '/content/analisis-onchain',     'paid',        0.003, '0xabc112', 'x402', 88, now - INTERVAL '0 days 5 hours'),
  (w, 'GPTBot/1.0', '/content/artikel-defi-2026',    'paid',        0.003, '0xabc113', 'x402', 88, now - INTERVAL '1 day'),
  (w, 'GPTBot/1.0', '/content/token-ekonomi',        'paid',        0.003, '0xabc114', 'x402', 88, now - INTERVAL '1 day 3 hours'),
  (w, 'GPTBot/1.0', '/content/analisis-onchain',     'paid',        0.003, '0xabc115', 'x402', 88, now - INTERVAL '2 days'),
  (w, 'GPTBot/1.0', '/content/artikel-defi-2026',    'attempted',   NULL,  NULL,       'x402', 88, now - INTERVAL '2 days 1 hour'),
  (w, 'GPTBot/1.0', '/content/token-ekonomi',        'paid',        0.003, '0xabc116', 'x402', 88, now - INTERVAL '3 days'),
  (w, 'GPTBot/1.0', '/content/analisis-onchain',     'paid',        0.003, '0xabc117', 'x402', 88, now - INTERVAL '4 days'),
  (w, 'GPTBot/1.0', '/content/artikel-defi-2026',    'paid',        0.003, '0xabc118', 'x402', 88, now - INTERVAL '5 days'),
  (w, 'GPTBot/1.0', '/content/token-ekonomi',        'attempted',   NULL,  NULL,       'x402', 88, now - INTERVAL '6 days'),
  (w, 'GPTBot/1.0', '/content/analisis-onchain',     'paid',        0.003, '0xabc119', 'x402', 88, now - INTERVAL '7 days'),
  (w, 'GPTBot/1.0', '/content/artikel-defi-2026',    'paid',        0.003, '0xabc11a', 'x402', 88, now - INTERVAL '9 days'),
  (w, 'GPTBot/1.0', '/content/token-ekonomi',        'paid',        0.003, '0xabc11b', 'x402', 88, now - INTERVAL '11 days'),
  (w, 'GPTBot/1.0', '/content/analisis-onchain',     'paid',        0.003, '0xabc11c', 'x402', 88, now - INTERVAL '14 days'),
  (w, 'GPTBot/1.0', '/content/artikel-defi-2026',    'paid',        0.003, '0xabc11d', 'x402', 88, now - INTERVAL '18 days'),
  (w, 'GPTBot/1.0', '/content/token-ekonomi',        'paid',        0.003, '0xabc11e', 'x402', 88, now - INTERVAL '22 days'),
  (w, 'GPTBot/1.0', '/content/analisis-onchain',     'paid',        0.003, '0xabc11f', 'x402', 88, now - INTERVAL '26 days');

-- ClaudeBot — bayar ETH, punya ERC-8004 tinggi (TRUSTED)
INSERT INTO access_logs (creator_wallet, bot_agent, path, status, amount_usd, tx_hash, payment_type, erc8004_agent_id, erc8004_score, timestamp) VALUES
  (w, 'ClaudeBot/1.0', '/content/artikel-defi-2026', 'paid', 0.002, '0xdef111', 'eth', 'agent_claude_001', 94, now - INTERVAL '0 days 1 hour'),
  (w, 'ClaudeBot/1.0', '/content/analisis-onchain',  'paid', 0.002, '0xdef112', 'eth', 'agent_claude_001', 94, now - INTERVAL '1 day 2 hours'),
  (w, 'ClaudeBot/1.0', '/content/token-ekonomi',     'paid', 0.002, '0xdef113', 'eth', 'agent_claude_001', 94, now - INTERVAL '3 days'),
  (w, 'ClaudeBot/1.0', '/content/artikel-defi-2026', 'paid', 0.002, '0xdef114', 'eth', 'agent_claude_001', 94, now - INTERVAL '6 days'),
  (w, 'ClaudeBot/1.0', '/content/analisis-onchain',  'paid', 0.002, '0xdef115', 'eth', 'agent_claude_001', 94, now - INTERVAL '10 days'),
  (w, 'ClaudeBot/1.0', '/content/token-ekonomi',     'paid', 0.002, '0xdef116', 'eth', 'agent_claude_001', 94, now - INTERVAL '15 days'),
  (w, 'ClaudeBot/1.0', '/content/artikel-defi-2026', 'paid', 0.002, '0xdef117', 'eth', 'agent_claude_001', 94, now - INTERVAL '20 days');

-- PerplexityBot — campuran paid/attempted
INSERT INTO access_logs (creator_wallet, bot_agent, path, status, amount_usd, tx_hash, payment_type, erc8004_score, timestamp) VALUES
  (w, 'PerplexityBot/1.0', '/content/artikel-defi-2026', 'paid',     0.001, '0xppp111', 'x402', 76, now - INTERVAL '0 days 3 hours'),
  (w, 'PerplexityBot/1.0', '/content/analisis-onchain',  'attempted', NULL,  NULL,       'x402', 76, now - INTERVAL '1 day'),
  (w, 'PerplexityBot/1.0', '/content/token-ekonomi',     'paid',     0.001, '0xppp112', 'x402', 76, now - INTERVAL '2 days'),
  (w, 'PerplexityBot/1.0', '/content/artikel-defi-2026', 'paid',     0.001, '0xppp113', 'x402', 76, now - INTERVAL '4 days'),
  (w, 'PerplexityBot/1.0', '/content/analisis-onchain',  'attempted', NULL,  NULL,       'x402', 76, now - INTERVAL '7 days'),
  (w, 'PerplexityBot/1.0', '/content/token-ekonomi',     'paid',     0.001, '0xppp114', 'x402', 76, now - INTERVAL '12 days'),
  (w, 'PerplexityBot/1.0', '/content/artikel-defi-2026', 'paid',     0.001, '0xppp115', 'x402', 76, now - INTERVAL '17 days');

-- Bytespider — banyak tapi conversion rendah
INSERT INTO access_logs (creator_wallet, bot_agent, path, status, amount_usd, tx_hash, payment_type, timestamp) VALUES
  (w, 'Bytespider',  '/content/artikel-defi-2026', 'attempted', NULL,  NULL,       'x402', now - INTERVAL '0 days 4 hours'),
  (w, 'Bytespider',  '/content/analisis-onchain',  'paid',      0.001, '0xbyt111', 'x402', now - INTERVAL '1 day'),
  (w, 'Bytespider',  '/content/token-ekonomi',     'attempted', NULL,  NULL,       'x402', now - INTERVAL '2 days'),
  (w, 'Bytespider',  '/content/artikel-defi-2026', 'attempted', NULL,  NULL,       'x402', now - INTERVAL '3 days'),
  (w, 'Bytespider',  '/content/analisis-onchain',  'paid',      0.001, '0xbyt112', 'x402', now - INTERVAL '5 days'),
  (w, 'Bytespider',  '/content/token-ekonomi',     'attempted', NULL,  NULL,       'x402', now - INTERVAL '8 days'),
  (w, 'Bytespider',  '/content/artikel-defi-2026', 'paid',      0.001, '0xbyt113', 'x402', now - INTERVAL '13 days'),
  (w, 'Bytespider',  '/content/analisis-onchain',  'attempted', NULL,  NULL,       'x402', now - INTERVAL '19 days');

-- Googlebot — whitelist, gratis
INSERT INTO access_logs (creator_wallet, bot_agent, path, status, timestamp) VALUES
  (w, 'Googlebot/2.1', '/content/artikel-defi-2026', 'whitelisted', now - INTERVAL '0 days 6 hours'),
  (w, 'Googlebot/2.1', '/content/analisis-onchain',  'whitelisted', now - INTERVAL '1 day'),
  (w, 'Googlebot/2.1', '/content/token-ekonomi',     'whitelisted', now - INTERVAL '3 days'),
  (w, 'Googlebot/2.1', '/content/artikel-defi-2026', 'whitelisted', now - INTERVAL '7 days');

-- Amazonbot — sesekali bayar
INSERT INTO access_logs (creator_wallet, bot_agent, path, status, amount_usd, tx_hash, payment_type, timestamp) VALUES
  (w, 'Amazonbot/0.1', '/content/artikel-defi-2026', 'paid',     0.001, '0xamz111', 'x402', now - INTERVAL '2 days'),
  (w, 'Amazonbot/0.1', '/content/analisis-onchain',  'attempted', NULL, NULL,       'x402', now - INTERVAL '5 days'),
  (w, 'Amazonbot/0.1', '/content/artikel-defi-2026', 'paid',     0.001, '0xamz112', 'x402', now - INTERVAL '12 days');

-- ── honeypot_logs: bot yang kena trap ─────────────────────────

INSERT INTO honeypot_logs (creator_wallet, bot_agent, trap_path, erc8004_agent_id, timestamp) VALUES
  (w, 'ScrapeBot/3.1',        '/cipta-trap/premium-content', NULL,              now - INTERVAL '0 days 1 hour'),
  (w, 'DataMiner/1.0',        '/cipta-trap/artikel',         NULL,              now - INTERVAL '0 days 8 hours'),
  (w, 'GPTBot/1.0',           '/cipta-trap/secret-data',     'agent_gpt_rogue',  now - INTERVAL '1 day'),
  (w, 'UnknownBot/2.0',       '/cipta-trap/premium-content', NULL,              now - INTERVAL '2 days'),
  (w, 'AhrefsBot/7.0',        '/cipta-trap/artikel',         NULL,              now - INTERVAL '3 days'),
  (w, 'SemrushBot/3.1',       '/cipta-trap/premium-content', NULL,              now - INTERVAL '4 days'),
  (w, 'MJ12bot/v1.4.8',       '/cipta-trap/secret-data',     NULL,              now - INTERVAL '5 days'),
  (w, 'DataMiner/1.0',        '/cipta-trap/artikel',         NULL,              now - INTERVAL '6 days'),
  (w, 'ScrapeBot/3.1',        '/cipta-trap/premium-content', NULL,              now - INTERVAL '8 days'),
  (w, 'UnknownBot/2.0',       '/cipta-trap/artikel',         NULL,              now - INTERVAL '10 days'),
  (w, 'ClaudeBot/1.0',        '/cipta-trap/secret-data',     'agent_claude_bad', now - INTERVAL '13 days'),
  (w, 'Bytespider',           '/cipta-trap/premium-content', NULL,              now - INTERVAL '17 days');

END $$;
