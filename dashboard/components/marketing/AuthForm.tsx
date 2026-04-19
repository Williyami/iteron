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
      className="rounded-xl px-4 py-2.5 text-[13.5px] font-semibold transition-colors flex items-center justify-center gap-2"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border)",
        color: "var(--ink)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--hairline-strong, rgba(15,31,46,0.22))";
        e.currentTarget.style.background = "var(--surface)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "var(--paper)";
      }}
    >
      {label === "Google" ? <GoogleIcon /> : <GitHubIcon />}
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.41 5.41 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.03l2.99-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.63 7.63 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  );
}
