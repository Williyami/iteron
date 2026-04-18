"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { ReactNode } from "react";
import { IteronLogo } from "@/components/brand/IteronLogo";

const NAV = [{ href: "/product", label: "product" }];

export function MarketingNav({
  rightSlot,
}: {
  rightSlot?: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 bg-bone/90 backdrop-blur-sm"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex h-[64px] w-full items-center pl-4 pr-3 md:pl-5 md:pr-5">
        <Link href="/" className="flex items-center shrink-0 group mr-10">
          <IteronLogo />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx("text-[13px] transition-colors")}
                style={{
                  color: active ? "var(--ink)" : "var(--ink-muted)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-[12px] px-4 py-2 transition-colors hover:opacity-90 rounded-lg"
            style={{
              background: pathname === "/dashboard" ? "var(--signal)" : "var(--ink)",
              color: "var(--paper)",
              fontWeight: 600,
            }}
          >
            Open dashboard
          </Link>
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
