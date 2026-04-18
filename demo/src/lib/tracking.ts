import { supabase } from "@/integrations/supabase/client";

const KEY = "pageturn_user_id";

export function getUserId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export async function trackEvent(params: {
  segment: string;
  book_id: string;
  event_type: "click" | "cart";
}) {
  const user_id = getUserId();
  try {
    await supabase.from("click_events").insert({ user_id, ...params });
  } catch (e) {
    console.warn("track failed", e);
  }
}
