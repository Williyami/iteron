"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase-client";

type Mode = "login" | "signup";

export function AuthForm({
  mode,
  title,
  subtitle,
}: {
  mode: Mode;
  title: string;
  subtitle: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const supabase = getSupabase();
    if (!supabase) {
      setError("Auth is not configured.");
      setLoading(false);
      return;
    }

    const { error: authError } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="surface-card-lift p-8 md:p-10">
      <h1
        className="text-[28px] leading-[1.1] font-bold"
        style={{ letterSpacing: "-0.03em" }}
      >
        {title}
      </h1>
      <p
        className="mt-3 text-[14.5px] leading-[1.6]"
        style={{ color: "var(--ink-muted)" }}
      >
        {subtitle}
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        {mode === "signup" && (
          <Field label="Workspace name" id="workspace" placeholder="e.g. Driftwood Books" />
        )}
        <Field label="Work email" id="email" type="email" placeholder="you@company.com" />
        <Field
          label="Password"
          id="password"
          type="password"
          placeholder={mode === "signup" ? "At least 10 characters" : "••••••••"}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 justify-center"
          style={{ width: "100%", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Please wait…" : mode === "signup" ? "Create workspace" : "Sign in"}
          {!loading && (
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M2.5 6h7m0 0L6 2.5M9.5 6L6 9.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {error && (
          <div
            className="mt-1 rounded-xl px-4 py-3 text-[13px] leading-[1.55]"
            style={{
              background: "rgba(220, 38, 38, 0.08)",
              border: "1px solid rgba(220, 38, 38, 0.25)",
              color: "var(--deep)",
            }}
            role="alert"
          >
            {error}
          </div>
        )}
      </form>

      <div className="mt-7 flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-faint)" }}>
        <span className="flex-1 h-px" style={{ background: "var(--border)" }} />
        or continue with
        <span className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <SocialButton label="Google" />
        <SocialButton label="GitHub" />
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold" style={{ color: "var(--ink)" }}>
        {label}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required
        autoComplete={
          type === "password"
            ? id === "password"
              ? "current-password"
              : "new-password"
            : type === "email"
            ? "email"
            : undefined
        }
        className="rounded-xl px-4 py-3 text-[14px] outline-none transition-all"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--ink)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(29, 158, 117, 0.5)";
          e.currentTarget.style.background = "var(--paper)";
          e.currentTarget.style.boxShadow = "0 0 0 4px rgba(29, 158, 117, 0.12)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.background = "var(--surface-2)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </label>
  );
}

function SocialButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-xl px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border)",
        color: "var(--ink)",
      }}
    >
      {label}
    </button>
  );
}
