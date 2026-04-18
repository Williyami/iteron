"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ApplyingOverlay } from "./ApplyingOverlay";

const PAGETURN_URL = "http://localhost:8080";
const IFRAME_TIMEOUT_MS = 4000;

export function StorePreview() {
  const [loaded, setLoaded] = useState(false);
  const [fallback, setFallback] = useState(false);
  const running = useStore((s) => s.run.status === "running");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!loaded) setFallback(true);
    }, IFRAME_TIMEOUT_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [loaded]);

  return (
    <section
      className="relative h-full w-full overflow-hidden bg-paper"
      style={{ border: "1px solid var(--hairline)" }}
    >
      <div
        className="flex items-baseline justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid var(--hairline)" }}
      >
        <span
          className="font-mono text-[10px] uppercase"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}
        >
          iframe · localhost:8080
        </span>
        <span
          className="font-mono text-[9px] uppercase"
          style={{
            color: loaded && !fallback ? "var(--signal)" : "var(--ink-faint)",
            letterSpacing: "0.2em",
          }}
        >
          {fallback ? "◆ snapshot" : loaded ? "◆ connected" : "connecting…"}
        </span>
      </div>
      <div className="relative w-full" style={{ height: "calc(100% - 37px)" }}>
        {!fallback && (
          <iframe
            src={PAGETURN_URL}
            onLoad={() => setLoaded(true)}
            title="PageTurn store"
            className="absolute inset-0 w-full h-full border-0"
            style={{ background: "var(--bone)" }}
          />
        )}
        {fallback && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/pageturn-fallback.png"
            alt="PageTurn snapshot"
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        {fallback && (
          <div
            className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase pointer-events-none"
            style={{ color: "var(--ink-faint)", letterSpacing: "0.25em" }}
          >
            // pageturn offline · demo mode
          </div>
        )}
        {running && <ApplyingOverlay />}
      </div>
    </section>
  );
}
