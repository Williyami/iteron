"use client";

import Link from "next/link";

const LINKS = {
  Product: [
    { href: "/product",       label: "Overview" },
    { href: "/product#loop",  label: "How it works" },
    { href: "/pricing",       label: "Pricing" },
    { href: "/dashboard",     label: "Live demo" },
  ],
  Company: [
    { href: "/manifesto",              label: "Manifesto" },
    { href: "mailto:hello@iteron.ai",  label: "Contact" },
  ],
  Legal: [
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
    { href: "#", label: "Security" },
  ],
};

export function MarketingFooter() {
  return (
    <footer style={{ background: "var(--ink)" }}>
      <div className="page-shell-wide pt-16 pb-10">

        {/* Main grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14"
          style={{ borderBottom: "1px solid rgba(225,245,238,0.08)" }}
        >
          {/* Brand */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center justify-center rounded-full text-[13px] font-bold shrink-0"
                style={{ width: 28, height: 28, background: "var(--signal)", color: "#fff" }}
              >
                i
              </span>
              <span className="text-[18px] font-semibold" style={{ letterSpacing: "-0.02em", color: "rgba(225,245,238,0.95)" }}>
                iteron
              </span>
            </div>

            <p className="text-[14.5px] leading-[1.7] max-w-[360px]" style={{ color: "rgba(225,245,238,0.5)" }}>
              Autonomous personalization middleware for e-commerce. Watches, diagnoses, ships, and measures — without a human in the loop.
            </p>

            <div className="flex gap-2.5">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-opacity hover:opacity-85"
                style={{ background: "var(--signal)", color: "#fff" }}
              >
                Get started
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2.5 6h7m0 0L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-opacity hover:opacity-85"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(225,245,238,0.75)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            {Object.entries(LINKS).map(([section, links]) => (
              <div key={section}>
                <div
                  className="text-[11px] font-semibold uppercase mb-4"
                  style={{ letterSpacing: "0.12em", color: "rgba(225,245,238,0.3)" }}
                >
                  {section}
                </div>
                <ul className="flex flex-col gap-3">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[14px] transition-colors hover:text-white"
                        style={{ color: "rgba(225,245,238,0.65)" }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between gap-4 pt-8 text-[12.5px]" style={{ color: "rgba(225,245,238,0.3)" }}>
          <span>© 2026 Iteron AI · Stockholm</span>
          <div className="flex items-center gap-2">
            <span className="inline-block rounded-full" style={{ width: 6, height: 6, background: "var(--signal)" }} />
            <span style={{ color: "rgba(225,245,238,0.45)" }}>All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
