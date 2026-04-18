import { getSupabase, hasSupabaseCredentials } from "./supabase-client";
import type { RunRow, TickerEvent } from "./types";

export async function fetchRunHistory(limit = 25): Promise<RunRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("[iteron] fetchRunHistory failed", error.message);
    return [];
  }
  return (data ?? []) as RunRow[];
}

interface ClickEventRow {
  id: string;
  user_id: string;
  segment: string;
  book_id: string;
  event_type: "click" | "cart" | "bounce";
  created_at: string;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export async function fetchTickerSeed(limit = 60): Promise<TickerEvent[]> {
  const supabase = getSupabase();
  if (!supabase) return syntheticTickerSeed(limit);
  const { data, error } = await supabase
    .from("click_events")
    .select("id,user_id,segment,book_id,event_type,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data || data.length === 0) {
    return syntheticTickerSeed(limit);
  }
  return (data as ClickEventRow[]).map((row) => ({
    id: row.id,
    time: formatTime(row.created_at),
    userId: row.user_id,
    segment: row.segment,
    eventType: row.event_type,
    bookId: row.book_id,
  }));
}

const SYNTH_BOOKS = [
  "the-hollow-hour",
  "cold-case-protocol",
  "what-the-river-knows",
  "starlight-inheritance",
  "the-binary-throne",
  "midnight-registry",
  "summer-on-tern-island",
  "the-quiet-conspiracy",
];

const SYNTH_SEGMENTS = ["Mystery", "Romance", "Sci-Fi"];
const SYNTH_EVENTS: TickerEvent["eventType"][] = ["click", "click", "click", "cart", "bounce"];

function syntheticTickerSeed(limit: number): TickerEvent[] {
  const now = Date.now();
  const out: TickerEvent[] = [];
  for (let i = 0; i < limit; i++) {
    const ts = new Date(now - i * 1700);
    const hh = String(ts.getHours()).padStart(2, "0");
    const mm = String(ts.getMinutes()).padStart(2, "0");
    const ss = String(ts.getSeconds()).padStart(2, "0");
    out.push({
      id: `synth-${i}`,
      time: `${hh}:${mm}:${ss}`,
      userId: `user_${1000 + ((i * 37) % 9000)}`,
      segment: SYNTH_SEGMENTS[i % SYNTH_SEGMENTS.length],
      eventType: SYNTH_EVENTS[i % SYNTH_EVENTS.length],
      bookId: SYNTH_BOOKS[i % SYNTH_BOOKS.length],
    });
  }
  return out;
}
