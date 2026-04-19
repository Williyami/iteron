"use client";

import { useStore } from "@/lib/store";

function greeting(now: Date = new Date()): string {
  const h = now.getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function OverviewHeader() {
  const runStatus = useStore((s) => s.run.status);
  const historyLen = useStore((s) => s.history.length);

  const statusCopy =
    runStatus === "running"
      ? "Agents are running a loop right now."
      : runStatus === "complete"
      ? "Last loop finished. Ready when you are."
      : runStatus === "failed"
      ? "Last loop hit an error. Check the thought stream below."
      : "Everything is quiet. Pick a goal when you're ready.";

  return (
    <section className="hero-wash pt-10 pb-6">
      <div className="dashboard-shell">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="min-w-0">
            <div className="mb-3">
              <span className="chip">
                {runStatus === "running" ? "Loop running" : "Autonomous · always on"}
              </span>
            </div>
            <h1
              className="text-ink"
              style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1 }}
            >
              {greeting()}.{" "}
              <span style={{ color: "var(--ink-muted)", fontWeight: 500 }}>
                Let&rsquo;s ship a lift today.
              </span>
            </h1>
            <p
              className="mt-3 text-[15px] leading-relaxed"
              style={{ color: "var(--ink-muted)", maxWidth: 560 }}
            >
              {statusCopy}
            </p>
          </div>

          <dl
            className="flex items-stretch gap-0 overflow-hidden shrink-0 surface-card"
            style={{ borderRadius: 16 }}
          >
            <StatCell
              label="Status"
              value={
                runStatus === "running"
                  ? "Running"
                  : runStatus === "complete"
                  ? "Complete"
                  : runStatus === "failed"
                  ? "Failed"
                  : "Idle"
              }
              tint={
                runStatus === "running"
                  ? "var(--signal)"
                  : runStatus === "failed"
                  ? "var(--rust)"
                  : "var(--ink)"
              }
            />
            <Divider />
            <StatCell label="Runs today" value={String(historyLen)} />
          </dl>
        </div>
      </div>
    </section>
  );
}

function StatCell({
  label,
  value,
  tint = "var(--ink)",
}: {
  label: string;
  value: string;
  tint?: string;
}) {
  return (
    <div className="px-5 py-3 min-w-[96px]">
      <dt
        className="text-[10px] uppercase"
        style={{ color: "var(--ink-faint)", letterSpacing: "0.12em", fontWeight: 600 }}
      >
        {label}
      </dt>
      <dd
        className="mt-1 tabular-nums"
        style={{ color: tint, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}
      >
        {value}
      </dd>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, background: "var(--border)" }} aria-hidden />;
}
