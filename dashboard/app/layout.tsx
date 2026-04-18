import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const geistSans = GeistSans;

const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Iteron AI — autonomous personalization middleware",
  description: "The store that improves itself while you sleep. Analyst + Optimizer agents ship lifts in a 25-second loop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{
        ["--font-sans" as string]: "var(--font-geist-sans)",
        ["--font-mono" as string]: "var(--font-geist-mono)",
      }}
    >
      <body>{children}</body>
    </html>
  );
}
