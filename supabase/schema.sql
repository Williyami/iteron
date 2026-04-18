CREATE TABLE IF NOT EXISTS click_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  segment text NOT NULL,
  book_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('click', 'cart', 'bounce')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ui_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  segment text NOT NULL,
  config_json jsonb NOT NULL,
  variant text NOT NULL CHECK (variant IN ('control', 'test')),
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ab_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  segment text NOT NULL,
  config_id uuid REFERENCES ui_config(id),
  ctr_control numeric(5,4),
  ctr_test numeric(5,4),
  winner text CHECK (winner IN ('control', 'test')),
  decided_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  goal text,
  segment_targeted text,
  ctr_before numeric(5,4),
  ctr_after numeric(5,4),
  improvement_pct numeric(5,2),
  winner_variant text,
  status text DEFAULT 'running' CHECK (status IN ('running', 'complete', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now()
);
