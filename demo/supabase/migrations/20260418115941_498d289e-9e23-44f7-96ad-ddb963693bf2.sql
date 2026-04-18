DROP POLICY "anyone can insert click events" ON public.click_events;

CREATE POLICY "anyone can insert valid click events"
  ON public.click_events FOR INSERT
  WITH CHECK (
    event_type IN ('click', 'cart')
    AND char_length(book_id) BETWEEN 1 AND 200
    AND char_length(segment) BETWEEN 1 AND 64
  );