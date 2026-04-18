import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata = {
  title: "Product · Iteron AI",
  description: "The autonomous loop, the intervention layer, and the operator interface.",
};

const PILLARS = [
  {
    title: "Analyst agent",
    body: "Reads event data, finds abnormal CTR by segment, and writes a plain-language diagnosis that a human can audit later.",
  },
  {
    title: "Optimizer agent",
    body: "Turns the diagnosis into a reversible config experiment, routes traffic, and scales the best variant when the result is clear.",
  },
  {
    title: "Operator dashboard",
    body: "Shows the live pipeline, thought stream, preview state, and outcome history in one surface so the system feels inspectable.",
  },
];

const CAPABILITIES = [
  "Tag language tuning per segment",
  "Sort-order changes without deploys",
  "A/B result tracking and roll-forward",
  "Readable decision logs for each run",
  "Persistent experiment history",
  "Live or demo execution modes",
];

const LOOP_STEPS = [
  {
    time: "+00:00",
    title: "Fetch recent event data",
    body: "The analyst reads the latest clickstream, groups behavior by segment, and looks for CTR that has slipped away from its baseline.",
  },
  {
    time: "+00:04",
    title: "Write the diagnosis",
    body: "A hypothesis is generated in plain language so the change has context, not just a score and a recommendation.",
  },
  {
    time: "+00:08",
    title: "Generate a config test",
    body: "The optimizer proposes a new experience variant covering layout, tag language, or ordering without needing a code deploy.",
  },
  {
    time: "+00:12",
    title: "Split traffic and measure",
    body: "Visitors are bucketed between control and test, then the loop keeps reading until it has a credible signal.",
  },
  {
    time: "+00:20",
    title: "Scale or roll back",
    body: "Winning configs are promoted, failed ones are archived, and the system keeps monitoring for the next issue.",
  },
];

const PRINCIPLES = [
  "Experimentation should feel like infrastructure, not ceremony.",
  "Every autonomous decision should be readable after the fact.",
  "Segments matter more than pretend-perfect user twins.",
  "Operators need a live instrument, not a postmortem report.",
];

export default function ProductPage() {
  return (
    <>
      <MarketingNav />
      <main className="text-ink">
        <section className="hero-wash">
          <div className="page-shell-wide pt-16 pb-20 md:pt-24 md:pb-24">
            <div className="max-w-[820px]">
              <div className="mb-6">
                <span className="chip">Product</span>
              </div>
              <h1
                className="text-[clamp(40px,6.2vw,74px)] leading-[0.98] font-bold"
                style={{ letterSpacing: "-0.045em" }}
              >
                A lightweight operating layer for{" "}
                <span style={{ color: "var(--deep)" }}>autonomous storefront optimization.</span>
              </h1>
              <p
                className="mt-6 max-w-[640px] text-[18px] leading-[1.6]"
                style={{ color: "var(--ink-muted)" }}
              >
                Iteron watches your store, diagnoses drift per segment, ships a
                reversible config test, and scales the winner — continuously, with
                a visible audit trail on every decision.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="btn-primary">
                  Get started
                </Link>
                <Link href="/dashboard" className="btn-secondary">
                  Open the live instrument
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell-wide pt-4 pb-20">
          <div className="grid gap-5 md:grid-cols-3">
            {PILLARS.map((pillar, idx) => (
              <article key={pillar.title} className="surface-card-lift p-7">
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
                    0{idx + 1}
                  </span>
                  Pillar
                </div>
                <h2
                  className="mt-4 text-[22px] font-semibold"
                  style={{ fontWeight: 600, letterSpacing: "-0.03em" }}
                >
                  {pillar.title}
                </h2>
                <p className="mt-3 text-[14.5px] leading-[1.7]" style={{ color: "var(--ink-muted)" }}>
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wash-mint">
          <div className="page-shell-wide py-20">
            <div className="surface-card-lift p-6 md:p-10">
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--deep)" }}>
                    Capability map
                  </div>
                  <h3
                    className="mt-4 text-[clamp(28px,4vw,42px)] leading-[1.05] font-bold"
                    style={{ letterSpacing: "-0.035em" }}
                  >
                    The actions the loop can take without changing your store&rsquo;s code.
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {CAPABILITIES.map((capability) => (
                    <div
                      key={capability}
                      className="rounded-xl px-4 py-4 text-[14px] flex items-start gap-3"
                      style={{ background: "var(--surface-2)", color: "var(--ink)", fontWeight: 500 }}
                    >
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
                          <path d="M2 5.2l2 2L8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span>{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="loop" className="page-shell-wide py-24 scroll-mt-28">
          <div className="max-w-[760px]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--deep)" }}>
              How it works
            </div>
            <h2
              className="mt-4 text-[clamp(30px,4.8vw,54px)] leading-[1.02] font-bold"
              style={{ letterSpacing: "-0.04em" }}
            >
              One loop, five steps, a visible trail from problem to intervention.
            </h2>
          </div>
          <div className="mt-10 grid gap-4">
            {LOOP_STEPS.map((step, index) => (
              <article
                key={step.title}
                className="surface-card-lift grid gap-5 p-6 md:p-7 md:grid-cols-[140px_1fr]"
              >
                <div>
                  <div
                    className="inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold"
                    style={{ color: "var(--deep)" }}
                  >
                    <span
                      className="inline-flex items-center justify-center rounded-full"
                      style={{
                        width: 22,
                        height: 22,
                        background: "var(--mint)",
                      }}
                    >
                      0{index + 1}
                    </span>
                    {step.time}
                  </div>
                </div>
                <div>
                  <h3 className="text-[22px] font-semibold" style={{ letterSpacing: "-0.03em" }}>
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[720px] text-[15px] leading-[1.7]" style={{ color: "var(--ink-muted)" }}>
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="page-shell-wide pb-24">
          <div className="max-w-[760px]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--deep)" }}>
              Principles
            </div>
            <h2
              className="mt-4 text-[clamp(30px,4.8vw,54px)] leading-[1.02] font-bold"
              style={{ letterSpacing: "-0.04em" }}
            >
              The operating beliefs behind the product.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {PRINCIPLES.map((principle, index) => (
              <article key={principle} className="surface-card-lift p-7">
                <div className="text-[12px] font-semibold" style={{ color: "var(--deep)" }}>
                  0{index + 1}
                </div>
                <p
                  className="mt-3 text-[22px] leading-[1.25] font-semibold"
                  style={{ color: "var(--ink)", letterSpacing: "-0.025em" }}
                >
                  {principle}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">Start the loop</Link>
            <Link href="/login" className="btn-secondary">Sign in</Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
