"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Wordmark } from "@/components/Wordmark";
import { createClient } from "@/lib/supabase/client";
import { safeAppPath } from "@/lib/safe-app-path";

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = safeAppPath(search.get("next"));
  const callbackError =
    search.get("error") === "auth_callback_failed"
      ? "We could not finish signing you in from that link. Try logging in again, or request a new confirmation email."
      : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) {
        setError(signErr.message);
        return;
      }
      router.push(next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-5">
      <DisclaimerBanner />
      {callbackError ? (
        <p
          className="rounded-xl border border-danger/25 bg-red-50 px-3 py-2.5 text-sm text-danger"
          role="alert"
        >
          {callbackError}
        </p>
      ) : null}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-ink shadow-sm outline-none ring-primary/30 focus:ring-2"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-ink shadow-sm outline-none ring-primary/30 focus:ring-2"
        />
      </div>
      {error ? (
        <p className="rounded-xl border border-danger/25 bg-red-50 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary py-3.5 text-base font-semibold text-white shadow-md hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-muted">
        No account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <div className="flex justify-center">
          <Wordmark href="/" size="md" />
        </div>
        <h1 className="font-display mt-6 text-2xl font-bold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Log in to your private reflections.</p>
      </div>
      <Suspense fallback={<p className="text-center text-muted">Loading…</p>}>
        <LoginInner />
      </Suspense>
    </div>
  );
}
