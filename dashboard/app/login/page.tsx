import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { AuthForm } from "@/components/marketing/AuthForm";

export const metadata = {
  title: "Sign in · Iteron AI",
  description: "Sign in to your Iteron workspace.",
};

export default function LoginPage() {
  return (
    <>
      <MarketingNav />
      <main className="hero-wash min-h-[calc(100vh-var(--nav-height))]">
        <div className="page-shell py-16 md:py-24">
          <div className="mx-auto max-w-[440px]">
            <AuthForm
              mode="login"
              title="Welcome back."
              subtitle="Sign in to pick up where the loop left off."
            />
            <p className="mt-6 text-center text-[13.5px]" style={{ color: "var(--ink-muted)" }}>
              New here?{" "}
              <Link href="/signup" style={{ color: "var(--deep)", fontWeight: 600 }}>
                Create a workspace
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
