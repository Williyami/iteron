CREATE POLICY "anyone can insert demo ui config"
  ON public.ui_config FOR INSERT
  WITH CHECK (
    char_length(segment) BETWEEN 1 AND 64
    AND char_length(variant) BETWEEN 1 AND 64
    AND jsonb_typeof(config_json) = 'object'
  );
