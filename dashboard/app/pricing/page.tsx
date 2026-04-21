import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    sub: "during beta",
    description: "Get the full loop running on one store. No credit card required.",
    cta: "Get started",
    ctaHref: "/signup",
    primary: false,
    features: [
      "1 connected store",
      "Up to 10,000 events/month",
      "UI layout & product tag tools",
      "Dashboard + thought stream",
      "Community support",
    ],
  },
  {
    name: "Growth",
    price: "$299",
    sub: "per month",
    description: "The full toolbox, unlimited runs, and priority support for scaling teams.",
    cta: "Start free trial",
    ctaHref: "/signup",
    primary: true,
    features: [
      "3 connected stores",
      "Unlimited events",
      "All optimization tools",
      "Email & Slack alerts",
      "A/B history + rollback",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    price: "Custom",
    sub: "talk to us",
    description: "Dedicated infrastructure, custom SLAs, and a shared Slack channel with our team.",
    cta: "Book a call",
    ctaHref: "mailto:hello@iteron.ai",
    primary: false,
    features: [
      "Unlimited stores",
      "Custom event volume",
      "Dedicated agent compute",
      "SSO & audit logs",
      "SLA guarantee",
      "Onboarding & integration support",
    ],
  },
];

const FAQ = [
  {
    q: "What counts as an event?",
    a: "Any click, page view, or add-to-cart signal sent to Iteron from your storefront. The free tier covers most early-stage stores.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No long-term contracts on Starter or Growth. Cancel from the dashboard and your store reverts to its last applied config.",
  },
  {
    q: "Do I need to modify my storefront code?",
    a: "A single script tag is all it takes for most Shopify, Medusa, or custom storefronts. No replatforming, no rewrite.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your click events and run history are retained for 30 days after cancellation so you can export them. After that they're purged.",
  },
];

export default function PricingPage() {
  return (
    <>
      <MarketingNav />
      <main className="text-ink">
        {/* Header */}
        <section className="hero-wash">
          <div className="page-shell-wide pt-16 pb-20 md:pt-24 md:pb-28 text-center">
            <div className="mb-5">
              <span className="chip">Simple pricing</span>
            </div>
            <h1
              className="text-[clamp(36px,5.5vw,68px)] leading-[0.98] font-bold mx-auto max-w-[700px]"
              style={{ letterSpacing: "-0.045em" }}
            >
              Pay for what you{" "}
              <span style={{ color: "var(--deep)" }}>actually ship.</span>
            </h1>
            <p
              className="mt-6 text-[18px] leading-[1.6] mx-auto max-w-[520px]"
              style={{ color: "var(--ink-muted)" }}
            >
              Start free. Upgrade when Iteron is running and the lift is real.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="page-shell-wide -mt-4 pb-20">
          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className="relative rounded-2xl p-8 flex flex-col"
                style={{
                  background: plan.primary ? "var(--ink)" : "var(--surface)",
                  border: plan.primary ? "1px solid var(--deep)" : "1px solid var(--border)",
                  color: plan.primary ? "var(--paper)" : "var(--ink)",
                  boxShadow: plan.primary ? "0 8px 32px rgba(8, 80, 65, 0.18)" : "0 1px 3px rgba(15,23,42,0.06)",
                }}
              >
                {plan.primary && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full"
                    style={{ background: "var(--signal)", color: "white" }}
                  >
                    Most popular
                  </div>
                )}

                <div className="mb-6">
                  <div
                    className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-3"
                    style={{ color: plan.primary ? "rgba(225,245,238,0.6)" : "var(--deep)" }}
                  >
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-[42px] font-bold leading-none"
                      style={{ letterSpacing: "-0.04em", color: plan.primary ? "var(--paper)" : "var(--ink)" }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-[14px]" style={{ color: plan.primary ? "rgba(225,245,238,0.5)" : "var(--ink-muted)" }}>
                      {plan.sub}
                    </span>
                  </div>
                  <p
                    className="mt-3 text-[14px] leading-[1.6]"
                    style={{ color: plan.primary ? "rgba(225,245,238,0.7)" : "var(--ink-muted)" }}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px]">
                      <span
                        className="mt-[3px] inline-flex items-center justify-center rounded-full shrink-0"
                        style={{
                          width: 16, height: 16,
                          background: plan.primary ? "rgba(29,158,117,0.25)" : "var(--mint)",
                          color: plan.primary ? "var(--signal)" : "var(--deep)",
                        }}
                      >
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                          <path d="M2 5.2l2 2L8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span style={{ color: plan.primary ? "rgba(225,245,238,0.85)" : "var(--ink)" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className="block text-center text-[14px] font-semibold rounded-xl py-3 transition-all"
                  style={
                    plan.primary
                      ? { background: "var(--signal)", color: "white" }
                      : { background: "var(--mint)", color: "var(--deep)", border: "1px solid var(--mint-2)" }
                  }
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section-wash-mint">
          <div className="page-shell-wide py-20">
            <div className="max-w-[640px] mx-auto">
              <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-center mb-4" style={{ color: "var(--deep)" }}>
                FAQ
              </div>
              <h2
                className="text-[clamp(26px,3.5vw,40px)] font-bold text-center mb-12"
                style={{ letterSpacing: "-0.035em" }}
              >
                Common questions.
              </h2>
              <div className="flex flex-col gap-6">
                {FAQ.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-2xl p-6"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                  >
                    <div className="text-[15px] font-semibold mb-2" style={{ letterSpacing: "-0.01em" }}>{item.q}</div>
                    <p className="text-[14px] leading-[1.7]" style={{ color: "var(--ink-muted)" }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="page-shell-wide py-20">
          <div
            className="relative overflow-hidden rounded-[28px] p-10 md:p-16 text-center"
            style={{
              background: "radial-gradient(ellipse 80% 120% at 100% 0%, rgba(29, 158, 117, 0.45), transparent 60%), linear-gradient(135deg, var(--ink) 0%, #0b2836 60%, var(--deep) 100%)",
              color: "var(--paper)",
            }}
          >
            <h2
              className="text-[clamp(26px,3.5vw,44px)] font-bold mx-auto max-w-[520px]"
              style={{ letterSpacing: "-0.035em" }}
            >
              Start free. Upgrade when it works.
            </h2>
            <p className="mt-4 text-[16px] mx-auto max-w-[420px]" style={{ color: "rgba(225,245,238,0.7)" }}>
              No credit card. No lock-in. Just the loop.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/signup" className="btn-accent" style={{ background: "var(--signal)" }}>
                Create a workspace
              </Link>
              <Link href="/product" className="btn-secondary" style={{ background: "rgba(255,255,255,0.08)", color: "var(--paper)", border: "1px solid rgba(255,255,255,0.2)" }}>
                See how it works
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
