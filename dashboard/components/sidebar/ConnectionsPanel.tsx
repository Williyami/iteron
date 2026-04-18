"use client";

import { useCallback, useEffect, useState } from "react";
import { hasSupabaseCredentials } from "@/lib/supabase-client";

type Status = "connected" | "offline" | "unknown" | "checking";

interface Connection {
  id: string;
  name: string;
  kind: string;
  description: string;
  target: string;
  docsHref?: string;
  check: () => Promise<Status>;
}

const AGENTS_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const PAGETURN_URL = "http://localhost:8080";

async function pingUrl(url: string, timeoutMs = 2500): Promise<Status> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    await fetch(url, { mode: "no-cors", signal: ctrl.signal });
    return "connected";
  } catch {
    return "offline";
  } finally {
    clearTimeout(t);
  }
}

const CONNECTIONS: Connection[] = [
  {
    id: "supabase",
    name: "Supabase",
    kind: "Database · Postgres",
    description:
      "Stores click_events, ui_config, A/B results and run history. Used by the dashboard and the agent loop.",
    target: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "Not configured",
    docsHref: "https://supabase.com/docs",
    check: async () => (hasSupabaseCredentials ? "connected" : "offline"),
  },
  {
    id: "agents",
    name: "Agents API",
    kind: "Python · FastAPI",
    description:
      "Orchestrates the Analyst → Optimizer loop and streams events over SSE. Required for Live mode.",
    target: AGENTS_API_URL,
    check: () => pingUrl(`${AGENTS_API_URL}/health`),
  },
  {
    id: "pageturn",
    name: "PageTurn",
    kind: "Demo store · Vite",
    description:
      "The connected storefront that the agents personalise. Previewed inside the dashboard via iframe.",
    target: PAGETURN_URL,
    check: () => pingUrl(PAGETURN_URL),
  },
  {
    id: "anthropic",
    name: "Anthropic",
    kind: "LLM · Claude",
    description:
      "Powers the Analyst and Optimizer agents. Configured server-side — keys never reach the browser.",
    target: "api.anthropic.com",
    docsHref: "https://docs.claude.com",
    check: async () => "unknown",
  },
];

function StatusDot({ status }: { status: Status }) {
  const color =
    status === "connected"
      ? "var(--signal)"
      : status === "offline"
      ? "var(--rust)"
      : status === "checking"
      ? "var(--amber)"
      : "var(--ink-faint)";
  return (
    <span
      className="relative inline-flex h-2 w-2 rounded-full shrink-0"
      style={{ background: color }}
      aria-hidden
    >
      {status === "connected" && (
        <span
          className="absolute inset-0 rounded-full pulse-halo"
          style={{ background: color }}
        />
      )}
    </span>
  );
}

function StatusLabel({ status }: { status: Status }) {
  const copy =
    status === "connected"
      ? "Connected"
      : status === "offline"
      ? "Offline"
      : status === "checking"
      ? "Checking…"
      : "Server-side";
  const color =
    status === "connected"
      ? "var(--signal)"
      : status === "offline"
      ? "var(--rust)"
      : status === "checking"
      ? "var(--amber)"
      : "var(--ink-muted)";
  return (
    <span
      className="text-[11px] font-semibold"
      style={{ color, letterSpacing: "0.02em" }}
    >
      {copy}
    </span>
  );
}

export function ConnectionsPanel() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    Object.fromEntries(CONNECTIONS.map((c) => [c.id, "checking" as Status]))
  );

  const refresh = useCallback(async () => {
    setStatuses((prev) =>
      Object.fromEntries(CONNECTIONS.map((c) => [c.id, prev[c.id] === "connected" ? "connected" : "checking"]))
    );
    await Promise.all(
      CONNECTIONS.map(async (c) => {
        const s = await c.check();
        setStatuses((prev) => ({ ...prev, [c.id]: s }));
      })
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div
            className="font-mono text-[11px] uppercase"
            style={{ color: "var(--ink-faint)", letterSpacing: "0.22em" }}
          >
            Integrations
          </div>
          <h2
            className="mt-1 text-ink"
            style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}
          >
            Connections
          </h2>
          <p
            className="mt-1 text-[13px] leading-relaxed"
            style={{ color: "var(--ink-muted)", maxWidth: 540 }}
          >
            The backends Iteron talks to. Connect a service here to light it up
            across the dashboard, or use the provided defaults for the local
            demo.
          </p>
        </div>
        <button
          onClick={refresh}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg transition-colors"
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
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M12 2v3h-3M2 12V9h3M11.5 5.5a5 5 0 0 0-9 .5M2.5 8.5a5 5 0 0 0 9-.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONNECTIONS.map((c) => {
          const status = statuses[c.id] ?? "checking";
          return (
            <article
              key={c.id}
              className="rounded-xl p-5 transition-colors"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
              }}
            >
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusDot status={status} />
                    <h3
                      className="text-[15px] text-ink"
                      style={{ fontWeight: 600, letterSpacing: "-0.01em" }}
                    >
                      {c.name}
                    </h3>
                  </div>
                  <div
                    className="text-[11px] mt-1 uppercase"
                    style={{ color: "var(--ink-faint)", letterSpacing: "0.1em", fontWeight: 600 }}
                  >
                    {c.kind}
                  </div>
                </div>
                <StatusLabel status={status} />
              </header>
              <p
                className="mt-3 text-[13px] leading-relaxed"
                style={{ color: "var(--ink-muted)" }}
              >
                {c.description}
              </p>
              <div
                className="mt-4 font-mono text-[11px] px-3 py-2 rounded-lg truncate"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-2)",
                  color: "var(--ink-muted)",
                }}
                title={c.target}
              >
                {c.target}
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                {c.docsHref ? (
                  <a
                    href={c.docsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] font-semibold transition-colors"
                    style={{ color: "var(--ink-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-muted)")}
                  >
                    Docs
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path
                        d="M4 8l4-4M4.5 4h3.5v3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  disabled={status === "connected"}
                  onClick={async () => {
                    setStatuses((p) => ({ ...p, [c.id]: "checking" }));
                    const s = await c.check();
                    setStatuses((p) => ({ ...p, [c.id]: s }));
                  }}
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:cursor-not-allowed"
                  style={{
                    color: status === "connected" ? "var(--ink-faint)" : "var(--signal)",
                    border: `1px solid ${
                      status === "connected" ? "var(--border)" : "var(--signal)"
                    }`,
                    background:
                      status === "connected"
                        ? "var(--surface)"
                        : "color-mix(in oklch, var(--signal) 8%, var(--surface))",
                  }}
                >
                  {status === "connected" ? "Linked" : "Test connection"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div
        className="rounded-xl px-5 py-4 flex items-start gap-3"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-2)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={{ color: "var(--ink-faint)", marginTop: 2 }}
          aria-hidden
        >
          <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M9 5.5v4M9 12h.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="text-[12px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
          Credentials live in <code className="font-mono">.env</code> at the project root. The
          dashboard reads <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono">NEXT_PUBLIC_API_URL</code>; server-side keys
          (Anthropic, service role) never leave the agent process.
        </div>
      </div>
    </div>
  );
}
