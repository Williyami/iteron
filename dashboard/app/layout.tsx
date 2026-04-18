import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = GeistSans;

const geistMono = GeistMono;

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "iteron",
  description: "The store that improves itself while you sleep. Analyst + Optimizer agents ship lifts in a 25-second loop.",
  icons: {
    icon: "/iteron-favicon.png",
    apple: "/iteron-favicon.png",
    shortcut: "/iteron-favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable}`}
      style={{
        ["--font-sans" as string]: "var(--font-geist-sans)",
        ["--font-mono" as string]: "var(--font-geist-mono)",
      }}
    >
      <body>{children}</body>
    </html>
  );
}
