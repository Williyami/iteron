"use client";

import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="mt-4" style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="page-shell-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="mb-5 flex items-center gap-2">
              <span
                className="inline-flex items-center justify-center rounded-full"
                style={{
                  width: 28,
                  height: 28,
                  background: "var(--signal)",
                  color: "var(--paper)",
                  fontWeight: 700,
                }}
              >
                i
              </span>
              <span
                className="text-[18px]"
                style={{ letterSpacing: "-0.02em", fontWeight: 600 }}
              >
                iteron
              </span>
            </div>
            <p
              className="text-[14.5px] leading-[1.7] max-w-[380px]"
              style={{ color: "rgba(225, 245, 238, 0.7)", letterSpacing: "-0.005em" }}
            >
              Autonomous personalization middleware for e-commerce. Watches,
              diagnoses, ships, and measures — without a human in the loop.
            </p>

            <div className="mt-6 flex gap-3">
              <Link href="/signup" className="btn-accent" style={{ padding: "10px 18px", fontSize: 13 }}>
                Get started
              </Link>
              <Link
                href="/login"
                className="btn-secondary"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "var(--paper)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "10px 18px",
                  fontSize: 13,
                }}
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4
              className="text-[11.5px] mb-4 font-semibold uppercase tracking-[0.1em]"
              style={{ color: "rgba(225, 245, 238, 0.55)" }}
            >
              Product
            </h4>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="/product">Overview</FooterLink>
              <FooterLink href="/product#loop">How it works</FooterLink>
              <FooterLink href="/dashboard">Live instrument</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4
              className="text-[11.5px] mb-4 font-semibold uppercase tracking-[0.1em]"
              style={{ color: "rgba(225, 245, 238, 0.55)" }}
            >
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="mailto:hello@iteron.ai">Contact</FooterLink>
              <FooterLink href="/login">Sign in</FooterLink>
              <FooterLink href="/signup">Get started</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4
              className="text-[11.5px] mb-4 font-semibold uppercase tracking-[0.1em]"
              style={{ color: "rgba(225, 245, 238, 0.55)" }}
            >
              Legal
            </h4>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="#">Privacy</FooterLink>
              <FooterLink href="#">Terms</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </ul>
          </div>
        </div>

        <div
          className="mt-16 pt-6 flex items-center justify-between text-[12.5px]"
          style={{
            borderTop: "1px solid rgba(225, 245, 238, 0.12)",
            color: "rgba(225, 245, 238, 0.55)",
          }}
        >
          <span>© 2026 iteron ai · stockholm</span>
          <span className="flex items-center gap-2">
            <span
              className="inline-block rounded-full"
              style={{ width: 6, height: 6, background: "var(--signal)" }}
            />
            <span style={{ color: "var(--signal-soft)", fontWeight: 600 }}>operational</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[14px] transition-colors"
        style={{
          color: "rgba(225, 245, 238, 0.85)",
          letterSpacing: "-0.005em",
        }}
      >
        {children}
      </Link>
    </li>
  );
}
