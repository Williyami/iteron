"use client";

import { useEffect, useState } from "react";
import { fetchTickerSeed } from "@/lib/queries";
import type { TickerEvent } from "@/lib/types";

const SYNTH_SEGMENTS = ["Mystery", "Romance", "Sci-Fi"];
const SYNTH_BOOKS = [
  "the-hollow-hour",
  "cold-case-protocol",
  "what-the-river-knows",
  "starlight-inheritance",
  "the-binary-throne",
  "midnight-registry",
];

function nowStamp() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function segmentTint(segment: string) {
  if (segment === "Mystery") return "var(--moss)";
  if (segment === "Romance") return "var(--signal)";
  if (segment === "Sci-Fi") return "var(--amber)";
  return "var(--ink)";
}

export function TelemetryTicker() {
  const [events, setEvents] = useState<TickerEvent[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const seed = await fetchTickerSeed(60);
      if (!cancelled) setEvents(seed);
    })();

    const pushInterval = setInterval(() => {
      setEvents((prev) => {
        if (prev.length === 0) return prev;
        const idx = Math.floor(Math.random() * prev.length);
        const base = prev[idx];
        const next: TickerEvent = {
          id: `live-${Date.now()}`,
          time: nowStamp(),
          userId: `user_${Math.floor(1000 + Math.random() * 9000)}`,
          segment:
            base?.segment ?? SYNTH_SEGMENTS[idx % SYNTH_SEGMENTS.length],
          eventType: Math.random() > 0.15 ? "click" : "cart",
          bookId: SYNTH_BOOKS[idx % SYNTH_BOOKS.length],
        };
        return [...prev.slice(-120), next];
      });
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(pushInterval);
    };
  }, []);

  if (events.length === 0) {
    return (
      <div
        className="flex items-center h-full px-6 bg-paper font-mono text-[10px] uppercase"
        style={{
          borderTop: "1px solid var(--hairline)",
          color: "var(--ink-faint)",
          letterSpacing: "0.22em",
        }}
      >
        // telemetry seeding
      </div>
    );
  }

  return (
    <div
      className="relative h-full overflow-hidden bg-paper flex items-center"
      style={{ borderTop: "1px solid var(--hairline)" }}
    >
      <div
        className="shrink-0 px-4 font-mono text-[9px] uppercase"
        style={{
          color: "var(--ink-faint)",
          letterSpacing: "0.26em",
          borderRight: "1px solid var(--hairline)",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        telemetry
      </div>
      <div className="ticker-track flex whitespace-nowrap flex-1">
        <TickerRow events={events} />
        <TickerRow events={events} />
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 left-28 w-20"
        style={{ background: "linear-gradient(to right, var(--paper), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-20"
        style={{ background: "linear-gradient(to left, var(--paper), transparent)" }}
      />
    </div>
  );
}

function TickerRow({ events }: { events: TickerEvent[] }) {
  return (
    <div className="flex items-center gap-6 px-6 shrink-0">
      {events.map((ev) => (
        <span
          key={ev.id}
          className="font-mono text-[10.5px] uppercase flex items-center gap-2"
          style={{ color: "var(--ink)", letterSpacing: "0.08em" }}
        >
          <span className="tabular-nums" style={{ color: "var(--ink-faint)" }}>
            {ev.time}
          </span>
          <span style={{ color: "var(--ink-muted)" }}>{ev.userId}</span>
          <span style={{ color: segmentTint(ev.segment) }}>{ev.segment}</span>
          <span style={{ color: "var(--ink-faint)" }}>◆</span>
          <span style={{ color: "var(--ink-muted)" }}>{ev.eventType}</span>
          <span style={{ color: "var(--ink-faint)" }}>{ev.bookId}</span>
          <span style={{ color: "var(--ink-faint)" }}>·</span>
        </span>
      ))}
    </div>
  );
}
