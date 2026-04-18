"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { DemoModeToggle } from "./DemoModeToggle";
import { IteronLogo } from "@/components/brand/IteronLogo";

const NAV = [{ href: "/product", label: "product" }];

export function Header() {
  const pathname = usePathname();

  return (
    <header
      className="flex items-center h-full bg-bone"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex w-full items-center pl-4 pr-4 md:pl-5 md:pr-5">
        <Link href="/" className="flex items-center shrink-0 group mr-8">
          <IteronLogo />
        </Link>

        <nav className="flex-1 flex items-center gap-6">
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

        <div className="ml-auto flex items-center gap-5 shrink-0 justify-end">
          <Link
            href="/dashboard"
            className={clsx("text-[13px] transition-colors")}
            style={{
              color: pathname === "/dashboard" ? "var(--signal)" : "var(--ink-muted)",
              fontWeight: pathname === "/dashboard" ? 600 : 400,
            }}
          >
            dashboard
          </Link>
          <DemoModeToggle />
        </div>
      </div>
    </header>
  );
}
