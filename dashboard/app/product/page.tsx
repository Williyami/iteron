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
      <main className="bg-bone text-ink">
        <section className="page-shell py-20">
          <div className="max-w-[780px]">
            <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
              Product
            </div>
            <h1
              className="mt-3 text-[clamp(40px,6.5vw,74px)] leading-[0.98]"
              style={{ letterSpacing: "-0.05em", fontWeight: 700 }}
            >
              A lightweight operating layer for autonomous storefront optimization.
            </h1>
            <p className="mt-6 text-[18px] leading-[1.65]" style={{ color: "var(--ink-muted)" }}>
              The prototype UI in your other folder is less editorial and more like a product tool.
              This page now follows that same direction: clean surfaces, compact hierarchy, and direct
              product language.
            </p>
          </div>
        </section>

        <section className="page-shell pb-8">
          <div className="grid gap-4 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <article key={pillar.title} className="surface-card p-6">
                <h2 className="text-[22px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>
                  {pillar.title}
                </h2>
                <p className="mt-4 text-[14px] leading-[1.75]" style={{ color: "var(--ink-muted)" }}>
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-shell py-16">
          <div className="surface-card p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
                  Capability map
                </div>
                <h3
                  className="mt-3 text-[clamp(28px,4vw,44px)] leading-[1.03]"
                  style={{ letterSpacing: "-0.04em", fontWeight: 700 }}
                >
                  The actions the loop can take without changing your store’s code.
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {CAPABILITIES.map((capability) => (
                  <div
                    key={capability}
                    className="rounded-xl px-4 py-4 text-[14px]"
                    style={{ background: "var(--surface-2)", color: "var(--ink)", fontWeight: 500 }}
                  >
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pb-16">
          <div className="max-w-[760px]">
            <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
              How it works
            </div>
            <h2
              className="mt-3 text-[clamp(30px,4.8vw,54px)] leading-[1.02]"
              style={{ letterSpacing: "-0.04em", fontWeight: 700 }}
            >
              One loop, five steps, and a visible trail from problem to intervention.
            </h2>
          </div>
          <div className="mt-8 grid gap-4">
            {LOOP_STEPS.map((step, index) => (
              <article
                key={step.title}
                className="surface-card grid gap-5 p-6 md:grid-cols-[120px_1fr]"
              >
                <div>
                  <div className="text-[12px]" style={{ color: "var(--signal)", fontWeight: 700 }}>
                    {step.time}
                  </div>
                  <div className="mt-2 text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
                    Step 0{index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-[24px]" style={{ fontWeight: 600, letterSpacing: "-0.03em" }}>
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[720px] text-[15px] leading-[1.75]" style={{ color: "var(--ink-muted)" }}>
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="page-shell pb-20">
          <div className="max-w-[760px]">
            <div className="text-[12px]" style={{ color: "var(--ink-faint)", fontWeight: 600 }}>
              Principles
            </div>
            <h2
              className="mt-3 text-[clamp(30px,4.8vw,54px)] leading-[1.02]"
              style={{ letterSpacing: "-0.04em", fontWeight: 700 }}
            >
              The operating beliefs behind the product.
            </h2>
          </div>
          <div className="mt-8 grid gap-4">
            {PRINCIPLES.map((principle, index) => (
              <article key={principle} className="surface-card p-6 md:p-7">
                <div className="text-[12px]" style={{ color: "var(--signal)", fontWeight: 700 }}>
                  0{index + 1}
                </div>
                <p
                  className="mt-3 max-w-[820px] text-[26px] leading-[1.18]"
                  style={{ color: "var(--ink)", fontWeight: 600, letterSpacing: "-0.035em" }}
                >
                  {principle}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
