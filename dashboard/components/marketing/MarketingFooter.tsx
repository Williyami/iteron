"use client";

import Link from "next/link";
import { IteronLogo } from "@/components/brand/IteronLogo";

export function MarketingFooter() {
  return (
    <footer
      className="bg-bone mt-24"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div className="page-shell py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="mb-4">
              <IteronLogo size={34} />
            </div>
            <p
              className="text-[14px] leading-[1.7] max-w-[360px]"
              style={{ color: "var(--ink-muted)", letterSpacing: "-0.005em" }}
            >
              Autonomous personalization middleware for e-commerce.
              Watches, diagnoses, ships, and measures without a human in the loop.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4
              className="text-[12px] mb-4"
              style={{ color: "var(--ink-faint)", fontWeight: 600 }}
            >
              product
            </h4>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="/product">Product overview</FooterLink>
              <FooterLink href="/dashboard">Live instrument</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4
              className="text-[12px] mb-4"
              style={{ color: "var(--ink-faint)", fontWeight: 600 }}
            >
              company
            </h4>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="mailto:hello@iteron.ai">Contact</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4
              className="text-[12px] mb-4"
              style={{ color: "var(--ink-faint)", fontWeight: 600 }}
            >
              legal
            </h4>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="#">Privacy</FooterLink>
              <FooterLink href="#">Terms</FooterLink>
              <FooterLink href="#">Security</FooterLink>
            </ul>
          </div>
        </div>

        <div
          className="mt-16 pt-6 flex items-center justify-between text-[12px]"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--ink-faint)",
          }}
        >
          <span>© 2026 iteron ai · stockholm</span>
          <span>status · <span style={{ color: "var(--signal)", fontWeight: 600 }}>operational</span></span>
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
        className="text-[14px] text-ink hover:text-signal transition-colors"
        style={{ letterSpacing: "-0.005em" }}
      >
        {children}
      </Link>
    </li>
  );
}
