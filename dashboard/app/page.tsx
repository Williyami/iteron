import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

const METRICS = [
  { label: "Events read hourly", value: "1,247" },
  { label: "Median time to intervention", value: "25s" },
  { label: "Winning tests this week", value: "18" },
  { label: "Segments under watch", value: "3" },
];

const STEPS = [
  {
    title: "Read storefront behavior",
    body: "The analyst agent watches click, dwell, and exit data continuously and flags segments that are drifting away from baseline.",
  },
  {
    title: "Draft a hypothesis",
    body: "Instead of opaque scoring, the system writes a plain-language diagnosis that explains what seems off and why.",
  },
  {
    title: "Ship a config test",
    body: "The optimizer produces a reversible config change, splits traffic, and promotes the winner automatically.",
  },
];

export default function Home() {
  return (
    <>
      <MarketingNav />
      <main className="bg-bone text-ink">
        <section className="page-shell py-20">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-start">
            <div>
              <div
                className="mb-5 inline-flex rounded-full px-3 py-1 text-[12px]"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--ink-muted)",
                  fontWeight: 600,
                }}
              >
                Autonomous optimization loop
              </div>
              <h1
                className="max-w-[760px] text-[clamp(44px,7vw,84px)] leading-[0.98]"
                style={{ letterSpacing: "-0.05em", fontWeight: 700 }}
              >
                The storefront control panel that keeps{" "}
                <span style={{ color: "var(--signal)" }}>improving itself.</span>
              </h1>
              <p
                className="mt-6 max-w-[640px] text-[18px] leading-[1.65]"
                style={{ color: "var(--ink-muted)" }}
              >
                Iteron pairs an analyst and an optimizer so your store can detect underperforming
                segments, test fixes, and scale the winners without waiting on a weekly review.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-lg px-5 py-3 text-[14px]"
                  style={{
                    background: "var(--ink)",
                    color: "var(--paper)",
                    fontWeight: 600,
                  }}
                >
                  Open dashboard
                </Link>
                <Link
                  href="/product"
                  className="rounded-lg px-5 py-3 text-[14px]"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--ink)",
                    fontWeight: 600,
                  }}
                >
                  View product
                </Link>
              </div>
            </div>

            <div className="surface-card p-6">
              <div
                className="text-[12px]"
                style={{ color: "var(--ink-faint)", fontWeight: 600 }}
              >
                Latest winning run
              </div>
              <div className="mt-5 flex items-end gap-2">
                <span
                  className="text-[56px] leading-none"
                  style={{ color: "var(--signal)", fontWeight: 700, letterSpacing: "-0.05em" }}
                >
                  +34.2%
                </span>
              </div>
              <p className="mt-4 text-[15px] leading-[1.7]" style={{ color: "var(--ink-muted)" }}>
                Mystery visitors responded better to emotional tag language than literary taxonomy.
                The system pushed the winner live and kept the previous config available for rollback.
              </p>
              <div
                className="mt-6 grid gap-3 rounded-xl p-4"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
              >
                <RunRow label="Segment" value="Mystery" />
                <RunRow label="Change" value="Tag rewrite + rank shuffle" />
                <RunRow label="Result" value="Scaled to 100%" accent />
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pb-8">
          <div className="grid gap-4 md:grid-cols-4">
            {METRICS.map((metric) => (
              <div key={metric.label} className="surface-card p-5">
                <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
                  {metric.label}
                </div>
                <div
                  className="mt-3 text-[34px] leading-none"
                  style={{ color: "var(--ink)", fontWeight: 700, letterSpacing: "-0.04em" }}
                >
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="page-shell py-16">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
                The loop
              </div>
              <h2
                className="mt-3 max-w-[420px] text-[clamp(30px,4vw,52px)] leading-[1.02]"
                style={{ letterSpacing: "-0.04em", fontWeight: 700 }}
              >
                One product system across the dashboard and every supporting page.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <article key={step.title} className="surface-card p-5">
                  <div className="text-[12px]" style={{ color: "var(--signal)", fontWeight: 700 }}>
                    0{index + 1}
                  </div>
                  <h3 className="mt-3 text-[20px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.7]" style={{ color: "var(--ink-muted)" }}>
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}

function RunRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span style={{ color: "var(--ink-faint)", fontWeight: 500 }}>{label}</span>
      <span style={{ color: accent ? "var(--signal)" : "var(--ink)", fontWeight: 600 }}>{value}</span>
    </div>
  );
}
