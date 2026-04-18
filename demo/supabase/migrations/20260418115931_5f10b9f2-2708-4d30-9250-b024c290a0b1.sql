-- ui_config table
CREATE TABLE public.ui_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  segment TEXT NOT NULL,
  variant TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ui_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ui_config readable by anyone"
  ON public.ui_config FOR SELECT
  USING (true);

CREATE INDEX idx_ui_config_lookup ON public.ui_config(segment, variant, active, created_at DESC);

-- click_events table
CREATE TABLE public.click_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  segment TEXT NOT NULL,
  book_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can insert click events"
  ON public.click_events FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_click_events_segment ON public.click_events(segment, created_at DESC);