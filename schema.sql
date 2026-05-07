-- ============================================================
-- UnlockPro — Schéma PostgreSQL
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT,                        -- nullable si OAuth
  name        TEXT,
  role        TEXT NOT NULL DEFAULT 'customer', -- customer | admin
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fournisseurs API
CREATE TABLE IF NOT EXISTS providers (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,              -- 'doctorunlock' | 'gsmfusion' | 'unlockbase'
  api_url     TEXT NOT NULL,
  api_key     TEXT NOT NULL,
  balance     NUMERIC(10,2) DEFAULT 0,
  priority    INT DEFAULT 1,             -- 1 = prioritaire
  active      BOOLEAN DEFAULT TRUE,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Catalogue de services
CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  brand       TEXT NOT NULL,             -- 'apple' | 'samsung' | ...
  carrier     TEXT NOT NULL,             -- 'sfr' | 'orange' | 'bouygues' | ...
  country     TEXT NOT NULL DEFAULT 'FR',
  name        TEXT NOT NULL,             -- "iPhone 15 — SFR France"
  price       NUMERIC(8,2) NOT NULL,     -- prix de vente HT
  cost        NUMERIC(8,2) NOT NULL,     -- coût fournisseur
  eta_hours   INT DEFAULT 24,            -- délai estimé en heures
  provider_id INT REFERENCES providers(id),
  active      BOOLEAN DEFAULT TRUE
);

-- Commandes
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  service_id      INT REFERENCES services(id),
  imei            TEXT NOT NULL,
  email           TEXT NOT NULL,         -- email de livraison (≠ compte)
  status          TEXT NOT NULL DEFAULT 'pending',
    -- pending | paid | processing | completed | failed | refunded
  unlock_code     TEXT,
  provider_id     INT REFERENCES providers(id),
  provider_order_id TEXT,               -- ID renvoyé par le fournisseur
  stripe_pi       TEXT,                 -- PaymentIntent ID
  amount          NUMERIC(8,2) NOT NULL,
  cost            NUMERIC(8,2),
  attempts        INT DEFAULT 0,
  error_msg       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tickets support
CREATE TABLE IF NOT EXISTS tickets (
  id          SERIAL PRIMARY KEY,
  order_id    UUID REFERENCES orders(id),
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      TEXT DEFAULT 'open',      -- open | resolved
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email      ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_imei       ON orders(imei);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Trigger updated_at automatique
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- Données de départ : fournisseurs
INSERT INTO providers (name, api_url, api_key, priority) VALUES
  ('doctorunlock', 'https://api.doctorunlock.com/v1', 'YOUR_KEY', 1),
  ('gsmfusion',    'https://api.gsmfusion.com/v2',    'YOUR_KEY', 2),
  ('unlockbase',   'https://api.unlockbase.com/v1',   'YOUR_KEY', 3)
ON CONFLICT DO NOTHING;

-- Catalogue exemple
INSERT INTO services (brand, carrier, country, name, price, cost, eta_hours, provider_id) VALUES
  ('apple',   'sfr',      'FR', 'iPhone (toutes versions) — SFR France',      24.99,  7.50, 48, 1),
  ('apple',   'orange',   'FR', 'iPhone (toutes versions) — Orange France',   24.99,  7.50, 48, 1),
  ('apple',   'bouygues', 'FR', 'iPhone (toutes versions) — Bouygues Telecom',24.99,  7.50, 48, 1),
  ('samsung', 'sfr',      'FR', 'Samsung Galaxy — SFR France',                17.99,  5.00, 24, 2),
  ('samsung', 'orange',   'FR', 'Samsung Galaxy — Orange France',             17.99,  5.00, 24, 2),
  ('samsung', 'bouygues', 'FR', 'Samsung Galaxy — Bouygues Telecom',          17.99,  5.00, 24, 2),
  ('huawei',  'sfr',      'FR', 'Huawei — SFR France',                        12.99,  4.00, 72, 3),
  ('other',   'sfr',      'FR', 'Autres marques — SFR France',                11.99,  4.00, 72, 3)
ON CONFLICT DO NOTHING;
