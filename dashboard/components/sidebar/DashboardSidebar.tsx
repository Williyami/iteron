"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { IteronLogo } from "@/components/brand/IteronLogo";
import { useStore } from "@/lib/store";

type NavTab = "overview" | "history" | "analytics" | "connections" | "settings";

interface Props {
  active: NavTab;
  onSelect: (tab: NavTab) => void;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "History",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1.5 13.5L5.5 8.5L8.5 11L12 6L14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "connections",
    label: "Connections",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6.5 9.5l-2 2a2.5 2.5 0 1 1-3.5-3.5l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9.5 6.5l2-2a2.5 2.5 0 1 1 3.5 3.5l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5.75 10.25l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const SETTINGS_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export function DashboardSidebar({ active, onSelect }: Props) {
  const runStatus = useStore((s) => s.run.status);
  const historyLen = useStore((s) => s.history.length);
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-[220px] shrink-0 sticky top-0 h-screen overflow-y-auto"
      style={{
        borderRight: "1px solid var(--hairline)",
        background: "var(--surface)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-[64px] px-5 shrink-0"
        style={{ borderBottom: "1px solid var(--hairline)" }}
      >
        <Link href="/" className="flex items-center group">
          <IteronLogo />
        </Link>
      </div>

      {/* Workspace pill */}
      <div className="px-3 pt-4 pb-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)" }}
        >
          <span
            className={clsx(
              "w-2 h-2 rounded-full shrink-0",
              runStatus === "running" ? "pulse-halo bg-[var(--signal)]" : "bg-[var(--signal)]"
            )}
            style={{ opacity: runStatus === "running" ? 1 : 0.5 }}
          />
          <span
            className="text-[11px] font-semibold truncate"
            style={{ color: "var(--ink-muted)" }}
          >
            {runStatus === "running" ? "Agent running…" : "PageTurn workspace"}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 pt-2">
        <div
          className="text-[10px] uppercase px-2 mb-1.5"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.12em", fontWeight: 600 }}
        >
          Main
        </div>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: isActive ? "color-mix(in oklch, var(--signal) 10%, transparent)" : "transparent",
                    color: isActive ? "var(--signal)" : "var(--ink-muted)",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: "13px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--surface-2)";
                      e.currentTarget.style.color = "var(--ink)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--ink-muted)";
                    }
                  }}
                >
                  <span style={{ color: isActive ? "var(--signal)" : "var(--ink-faint)" }}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.id === "history" && historyLen > 0 && (
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: isActive
                          ? "color-mix(in oklch, var(--signal) 18%, transparent)"
                          : "var(--surface-2)",
                        color: isActive ? "var(--signal)" : "var(--ink-faint)",
                      }}
                    >
                      {historyLen}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Store links */}
        <div
          className="text-[10px] uppercase px-2 mt-5 mb-1.5"
          style={{ color: "var(--ink-faint)", letterSpacing: "0.12em", fontWeight: 600 }}
        >
          Navigate
        </div>
        <ul className="space-y-0.5">
          {[
            { href: "/", label: "Landing page" },
            { href: "/product", label: "Product" },
            { href: "/how-it-works", label: "How it works" },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                style={{
                  color: pathname === href ? "var(--ink)" : "var(--ink-muted)",
                  fontWeight: pathname === href ? 600 : 400,
                  fontSize: "13px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--surface-2)";
                  (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color =
                    pathname === href ? "var(--ink)" : "var(--ink-muted)";
                }}
              >
                <span style={{ color: "var(--ink-faint)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2.5 8.5L5 11L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
                    <rect x="1.75" y="1.75" width="12.5" height="12.5" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </span>
                <span className="flex-1">{label}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: "var(--ink-faint)", opacity: 0.5 }}>
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings (bottom) */}
      <div className="px-3 pb-2 pt-3 shrink-0" style={{ borderTop: "1px solid var(--hairline)" }}>
        {(() => {
          const isActive = active === "settings";
          return (
            <button
              onClick={() => onSelect("settings")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
              style={{
                background: isActive ? "color-mix(in oklch, var(--signal) 10%, transparent)" : "transparent",
                color: isActive ? "var(--signal)" : "var(--ink-muted)",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--surface-2)";
                  e.currentTarget.style.color = "var(--ink)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--ink-muted)";
                }
              }}
            >
              <span style={{ color: isActive ? "var(--signal)" : "var(--ink-faint)" }}>
                {SETTINGS_ICON}
              </span>
              <span className="flex-1">Settings</span>
            </button>
          );
        })()}
      </div>

    </aside>
  );
}
