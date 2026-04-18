import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { HeroLoopDemo } from "@/components/marketing/HeroLoopDemo";
import { IteronLogoAnimation } from "@/components/marketing/IteronLogoAnimation";

const FEATURES = [
  {
    tag: "Analyst",
    title: "Reads your storefront like a teammate.",
    body: "Continuously watches click, dwell, and exit data across every segment and writes a plain-language diagnosis the moment performance drifts.",
  },
  {
    tag: "Optimizer",
    title: "Ships reversible config tests, not code changes.",
    body: "Turns each diagnosis into a traffic-split experiment — tag language, shelf order, merchandising rules — without a deploy or a redesign cycle.",
  },
  {
    tag: "Dashboard",
    title: "A live instrument, not a weekly report.",
    body: "See the pipeline, the thought stream, the active tests, and the full audit trail of every autonomous decision in a single surface.",
  },
];

const AUDIENCE = [
  {
    label: "Growth teams",
    body: "Replace the weekly CRO backlog with a loop that runs around the clock.",
  },
  {
    label: "Merchandisers",
    body: "Retune tags, shelves, and sort orders by segment without filing tickets.",
  },
  {
    label: "Founders",
    body: "Ship your first measurable conversion lift before the end of the week.",
  },
  {
    label: "Platform teams",
    body: "Drop in over your existing storefront — no replatforming, no rewrites.",
  },
];

const METRICS = [
  { value: "1,247", label: "Events read hourly" },
  { value: "25s", label: "Median time to intervention" },
  { value: "18", label: "Winning tests this week" },
  { value: "+34.2%", label: "Top lift in the last run" },
];

export default function Home() {
  return (
    <>
      <MarketingNav />
      <main className="text-ink">
        {/* Hero */}
        <section className="hero-wash">
          <div className="page-shell-wide pt-16 pb-24 md:pt-24 md:pb-32">
            <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center">
              <div>
                <div className="mb-6">
                  <span className="chip">Autonomous · always on</span>
                </div>
                <h1
                  className="text-[clamp(44px,6.2vw,82px)] leading-[0.98] font-bold"
                  style={{ letterSpacing: "-0.045em" }}
                >
                  The storefront that{" "}
                  <span style={{ color: "var(--deep)" }}>builds itself</span>
                  <br />
                  while you sleep.
                </h1>
                <p
                  className="mt-6 max-w-[560px] text-[18px] leading-[1.6]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  Iteron pairs an analyst and an optimizer agent so your e-commerce
                  store detects underperforming segments, ships config tests, and
                  scales the winners — in a continuous 25-second loop, with a human
                  in the audit seat, not the bottleneck.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/signup" className="btn-primary">
                    Get started
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path
                        d="M2.5 6h7m0 0L6 2.5M9.5 6L6 9.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                  <Link href="/product" className="btn-secondary">
                    Explore the product
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-5 text-[12.5px]" style={{ color: "var(--ink-muted)" }}>
                  <span className="flex items-center gap-2">
                    <Dot /> No replatforming — plugs in over Shopify, Medusa, custom
                  </span>
                  <span className="flex items-center gap-2">
                    <Dot /> Reversible by design
                  </span>
                </div>
              </div>

              <div className="lg:-mt-4">
                <HeroLoopDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Metric strip */}
        <section className="page-shell-wide -mt-6">
          <div
            className="surface-card grid grid-cols-2 md:grid-cols-4 overflow-hidden"
            style={{ borderRadius: 20 }}
          >
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                className="p-6 md:p-7"
                style={{
                  borderRight:
                    i < METRICS.length - 1 ? "1px solid var(--border)" : undefined,
                }}
              >
                <div
                  className="text-[32px] md:text-[36px] leading-none font-bold"
                  style={{ color: "var(--ink)", letterSpacing: "-0.04em" }}
                >
                  {m.value}
                </div>
                <div
                  className="mt-2 text-[12.5px] font-medium"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product pillars */}
        <section className="page-shell-wide pt-28 pb-20">
          <div className="max-w-[760px]">
            <div
              className="text-[12px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--deep)" }}
            >
              The loop
            </div>
            <h2
              className="mt-4 text-[clamp(32px,4.6vw,56px)] leading-[1.03] font-bold"
              style={{ letterSpacing: "-0.04em" }}
            >
              Three agents, one product, zero babysitting.
            </h2>
            <p
              className="mt-5 max-w-[600px] text-[17px] leading-[1.6]"
              style={{ color: "var(--ink-muted)" }}
            >
              Each stage is inspectable on its own and composable into a loop that
              runs as long as your traffic does.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <article key={f.tag} className="surface-card-lift p-7">
                <div
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: "var(--deep)" }}
                >
                  <span
                    className="inline-flex items-center justify-center rounded-full text-[10px]"
                    style={{
                      width: 20,
                      height: 20,
                      background: "var(--mint)",
                      color: "var(--deep)",
                    }}
                  >
                    0{i + 1}
                  </span>
                  {f.tag}
                </div>
                <h3
                  className="mt-4 text-[22px] leading-[1.18] font-semibold"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  {f.title}
                </h3>
                <p
                  className="mt-3 text-[14.5px] leading-[1.7]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {f.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Logo animation break */}
        <section className="page-shell-wide py-8 flex justify-center">
          <div style={{ width: 140, height: 140 }}>
            <IteronLogoAnimation />
          </div>
        </section>

        {/* Mid gradient band — showcase */}
        <section className="section-wash-mint">
          <div className="page-shell-wide py-24">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div
                  className="text-[12px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: "var(--deep)" }}
                >
                  Inspectable autonomy
                </div>
                <h2
                  className="mt-4 text-[clamp(28px,4vw,44px)] leading-[1.05] font-bold"
                  style={{ letterSpacing: "-0.035em" }}
                >
                  Every decision comes with its reasoning attached.
                </h2>
                <p
                  className="mt-5 text-[16px] leading-[1.65]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  The thought stream, the traffic split, the lift, and the rollback
                  button all live on the same page. You can trust the loop because
                  you can interrupt it at any point — and it will tell you why it
                  did what it did.
                </p>
                <ul className="mt-7 flex flex-col gap-3">
                  {[
                    "Plain-language diagnosis per run",
                    "One-click rollback with archived configs",
                    "Per-segment CTR history, not just aggregates",
                    "Read-only API for your own dashboards",
                  ].map((it) => (
                    <li key={it} className="flex items-start gap-3 text-[14.5px]" style={{ color: "var(--ink)" }}>
                      <CheckBadge />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface-card-lift overflow-hidden">
                <div
                  className="px-5 py-3 text-[12px] font-semibold"
                  style={{ borderBottom: "1px solid var(--border)", color: "var(--ink-muted)" }}
                >
                  Decision log · Mystery segment
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {[
                    {
                      t: "00:04",
                      head: "Diagnosis written",
                      body: "Tag language skews literary; shoppers click emotional framing 1.8× more.",
                    },
                    {
                      t: "00:08",
                      head: "Config test #41 launched",
                      body: "50/50 split · emotional tag rewrite + shelf re-order.",
                    },
                    {
                      t: "00:19",
                      head: "Lift confirmed",
                      body: "Test CTR 9.1% vs. control 6.8%. Confidence 0.96.",
                    },
                    {
                      t: "00:23",
                      head: "Winner scaled to 100%",
                      body: "Prior config archived as rollback candidate #41-a.",
                    },
                  ].map((row, idx) => (
                    <div
                      key={row.t}
                      className="grid grid-cols-[52px_1fr] gap-3 rounded-xl p-3"
                      style={{
                        background: idx === 3 ? "var(--mint-2)" : "var(--surface-2)",
                        border: idx === 3 ? "1px solid rgba(29, 158, 117, 0.25)" : "1px solid var(--border-2)",
                      }}
                    >
                      <div
                        className="text-[11.5px] font-mono font-semibold pt-0.5"
                        style={{ color: idx === 3 ? "var(--deep)" : "var(--ink-muted)" }}
                      >
                        +{row.t}
                      </div>
                      <div>
                        <div
                          className="text-[13.5px] font-semibold"
                          style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
                        >
                          {row.head}
                        </div>
                        <div
                          className="mt-0.5 text-[12.5px] leading-[1.55]"
                          style={{ color: "var(--ink-muted)" }}
                        >
                          {row.body}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Audiences */}
        <section className="page-shell-wide py-24">
          <div className="max-w-[760px]">
            <div
              className="text-[12px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--deep)" }}
            >
              Built for
            </div>
            <h2
              className="mt-4 text-[clamp(28px,4vw,44px)] leading-[1.05] font-bold"
              style={{ letterSpacing: "-0.035em" }}
            >
              The teams who ship conversion, not slide decks.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCE.map((a) => (
              <div
                key={a.label}
                className="rounded-2xl p-6"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="text-[13px] font-semibold"
                  style={{ color: "var(--deep)" }}
                >
                  {a.label}
                </div>
                <p
                  className="mt-3 text-[14px] leading-[1.65]"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band */}
        <section className="page-shell-wide pb-24">
          <div
            className="relative overflow-hidden rounded-[28px] p-10 md:p-16"
            style={{
              background:
                "radial-gradient(ellipse 80% 120% at 100% 0%, rgba(29, 158, 117, 0.45), transparent 60%), linear-gradient(135deg, var(--ink) 0%, #0b2836 60%, var(--deep) 100%)",
              color: "var(--paper)",
            }}
          >
            <div className="max-w-[620px]">
              <div
                className="text-[12px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "rgba(225, 245, 238, 0.7)" }}
              >
                Start the loop
              </div>
              <h2
                className="mt-4 text-[clamp(30px,4.2vw,50px)] leading-[1.04] font-bold"
                style={{ letterSpacing: "-0.035em" }}
              >
                Your storefront is already generating data. Start learning from it
                this afternoon.
              </h2>
              <p
                className="mt-5 text-[16px] leading-[1.65]"
                style={{ color: "rgba(225, 245, 238, 0.75)" }}
              >
                Create a workspace, connect a store, and watch the first analyst
                run surface something you would have missed in a weekly review.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="btn-accent"
                  style={{ background: "var(--signal)" }}
                >
                  Create a workspace
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M2.5 6h7m0 0L6 2.5M9.5 6L6 9.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "var(--paper)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}

function Dot() {
  return (
    <span
      className="inline-block rounded-full"
      style={{ width: 5, height: 5, background: "var(--signal)" }}
    />
  );
}

function CheckBadge() {
  return (
    <span
      className="mt-[3px] inline-flex items-center justify-center rounded-full shrink-0"
      style={{
        width: 18,
        height: 18,
        background: "var(--mint)",
        color: "var(--deep)",
      }}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
        <path
          d="M2 5.2l2 2L8 3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
