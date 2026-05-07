"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Wordmark } from "@/components/Wordmark";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { data, error: signErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (signErr) {
        setError(signErr.message);
        return;
      }
      if (data.session) {
        router.push("/app/dashboard");
        router.refresh();
        return;
      }
      setMessage("Check your email to confirm your account, then log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <div className="flex justify-center">
          <Wordmark href="/" size="md" />
        </div>
        <h1 className="font-display mt-6 text-2xl font-bold text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-muted">Your reflections stay private to you.</p>
      </div>

      <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-5">
        <DisclaimerBanner />
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
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-ink shadow-sm outline-none ring-primary/30 focus:ring-2"
          />
          <p className="text-xs text-muted">At least 8 characters.</p>
        </div>
        {error ? (
          <p className="rounded-xl border border-danger/25 bg-red-50 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-ink">
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary py-3.5 text-base font-semibold text-white shadow-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Sign up"}
        </button>
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
