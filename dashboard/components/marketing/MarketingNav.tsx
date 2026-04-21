"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { IteronLogo } from "@/components/brand/IteronLogo";

const NAV = [
  { href: "/product", label: "Product" },
  { href: "/product#loop", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
];

export function MarketingNav({
  rightSlot,
}: {
  rightSlot?: ReactNode;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div style={{ height: "var(--nav-height)" }} aria-hidden />
      <nav className="nav-pill" data-scrolled={scrolled}>
        <div className="flex items-center w-full max-w-[1320px] mx-auto gap-2">
        <Link href="/" className="flex items-center shrink-0 pr-3">
          <IteronLogo size={26} />
        </Link>

        <div className="hidden md:flex items-center gap-1 pr-2">
          {NAV.map((item) => {
            const active =
              item.href === pathname ||
              (item.href.startsWith("/product") && pathname === "/product");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                data-active={active}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link href="/login" className="nav-btn-ghost">
            Sign in
          </Link>
          <Link href="/signup" className="nav-btn-primary">
            Get started
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M2.5 6h7m0 0L6 2.5M9.5 6L6 9.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          {rightSlot}
        </div>
        </div>
      </nav>
    </>
  );
}
