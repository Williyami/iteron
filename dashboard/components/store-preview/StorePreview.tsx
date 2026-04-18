"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { ApplyingOverlay } from "./ApplyingOverlay";

const BASE_URL = "http://localhost:8080";

const SITE_LABELS: Record<string, string> = {
  pageturn: "localhost:8080",
  novawear: "localhost:8080/novawear",
};

export function StorePreview() {
  const [loaded, setLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const running     = useStore((s) => s.run.status === "running");
  const runStatus   = useStore((s) => s.run.status);
  const demoSite    = useStore((s) => s.demoSite);
  const appliedConfig = useStore((s) => s.appliedConfig);

  const iframeUrl = demoSite === "novawear" ? `${BASE_URL}/novawear` : BASE_URL;
  const siteLabel = SITE_LABELS[demoSite] ?? "localhost:8080";

  const prevStatusRef = useRef(runStatus);
  useEffect(() => {
    if (
      prevStatusRef.current === "running" &&
      runStatus === "complete" &&
      demoSite === "novawear" &&
      appliedConfig?.configJson
    ) {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "iteron:config", payload: appliedConfig.configJson },
        BASE_URL
      );
    }
    prevStatusRef.current = runStatus;
  }, [runStatus, appliedConfig, demoSite]);

  const handleReload = () => {
    setLoaded(false);
    setReloadKey((k) => k + 1);
  };

  return (
    <section
      className="relative h-full w-full overflow-hidden bg-paper"
      style={{ border: "1px solid var(--hairline)" }}
    >
      <div
        className="flex items-baseline justify-between px-4 py-2.5 gap-3"
        style={{ borderBottom: "1px solid var(--hairline)" }}
      >
        <span
          className="font-mono text-[10px] uppercase truncate"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}
        >
          iframe · {siteLabel}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="font-mono text-[9px] uppercase"
            style={{
              color: loaded ? "var(--signal)" : "var(--ink-faint)",
              letterSpacing: "0.2em",
            }}
          >
            {loaded ? "◆ connected" : "connecting…"}
          </span>
          <button
            type="button"
            onClick={handleReload}
            className="group inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors"
            style={{
              color: "var(--ink-muted)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--ink)";
              e.currentTarget.style.borderColor = "var(--hairline-strong)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--ink-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
            aria-label="Reload store preview"
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
              className="transition-transform group-hover:rotate-90"
            >
              <path
                d="M12 2v3h-3M2 12V9h3M11.5 5.5a5 5 0 0 0-9 .5M2.5 8.5a5 5 0 0 0 9-.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reload
          </button>
          <a
            href={iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md transition-colors"
            style={{
              color: "var(--ink-muted)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--signal)";
              e.currentTarget.style.borderColor = "var(--signal)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--ink-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
            aria-label="Open store in new tab"
          >
            Open store
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path
                d="M4 8l4-4M4.5 4h3.5v3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="relative w-full" style={{ height: "calc(100% - 37px)" }}>
        <iframe
          key={`${reloadKey}-${demoSite}`}
          ref={iframeRef}
          src={iframeUrl}
          onLoad={() => setLoaded(true)}
          title={demoSite === "novawear" ? "NovaWear store" : "PageTurn store"}
          className="absolute inset-0 w-full h-full border-0"
          style={{ background: "var(--bone)" }}
        />
        {running && <ApplyingOverlay />}
      </div>
    </section>
  );
}
