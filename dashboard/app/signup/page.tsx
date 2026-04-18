import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { AuthForm } from "@/components/marketing/AuthForm";

export const metadata = {
  title: "Get started · Iteron AI",
  description: "Create an Iteron workspace.",
};

export default function SignupPage() {
  return (
    <>
      <MarketingNav />
      <main className="hero-wash min-h-[calc(100vh-var(--nav-height))]">
        <div className="page-shell py-16 md:py-24">
          <div className="mx-auto max-w-[440px]">
            <AuthForm
              mode="signup"
              title="Start the loop."
              subtitle="Create a workspace and connect your first store in under five minutes."
            />
            <p className="mt-6 text-center text-[13.5px]" style={{ color: "var(--ink-muted)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--deep)", fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
