"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CategoryPicker } from "@/components/CategoryPicker";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { IntensitySelector } from "@/components/IntensitySelector";
import { REFLECTION_CATEGORIES, type ReflectionCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ReflectionForm({ className }: { className?: string }) {
  const router = useRouter();
  const [rawInput, setRawInput] = useState("");
  const [category, setCategory] = useState<ReflectionCategory>(REFLECTION_CATEGORIES[0]);
  const [personContext, setPersonContext] = useState("");
  const [intensity, setIntensity] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successHint, setSuccessHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessHint(null);
    setLoading(true);
    let navigated = false;
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawInput: rawInput.trim(),
          category,
          personContext: personContext.trim() || null,
          intensity,
        }),
      });

      let body: { error?: string; reflection?: { id: string } };
      try {
        body = (await res.json()) as typeof body;
      } catch {
        setError("Unexpected response from server. Try again.");
        return;
      }

      if (!res.ok) {
        setError(body.error ?? "Something went wrong.");
        return;
      }
      if (body.reflection?.id) {
        setSuccessHint("Opening your saved note…");
        navigated = true;
        router.push(`/app/reflect/${body.reflection.id}`);
        router.refresh();
        return;
      }
      setError("Reflection saved but no link returned. Check your library.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      if (!navigated) setLoading(false);
    }
  }

  const emptyInput = rawInput.trim().length === 0;

  return (
    <form
      onSubmit={onSubmit}
      aria-busy={loading}
      className={cn("mx-auto max-w-2xl space-y-6", className)}
    >
      <DisclaimerBanner />

      <div className="space-y-2">
        <label htmlFor="thoughts" className="text-sm font-medium text-ink">
          The draft you&apos;re sitting with
        </label>
        <textarea
          id="thoughts"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={8}
          placeholder="Say the messy part out loud here—before it goes anywhere else."
          className="w-full resize-y rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink shadow-sm outline-none ring-primary/30 placeholder:text-muted focus:ring-2"
          required
        />
        {emptyInput ? (
          <p className="text-xs text-muted">
            A few real lines are enough. Honesty beats polish at this step.
          </p>
        ) : null}
      </div>

      <CategoryPicker value={category} onChange={setCategory} />

      <div className="space-y-2">
        <label htmlFor="context" className="text-sm font-medium text-ink">
          Person / context <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="context"
          value={personContext}
          onChange={(e) => setPersonContext(e.target.value)}
          placeholder="e.g. Partner, manager, old friend…"
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink shadow-sm outline-none ring-primary/30 placeholder:text-muted focus:ring-2"
        />
      </div>

      <IntensitySelector value={intensity} onChange={setIntensity} />

      {successHint ? (
        <p
          className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-sm text-ink"
          role="status"
        >
          {successHint}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-danger/25 bg-red-50 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={loading || !rawInput.trim()}
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Cooling it down…" : "Help me say this better"}
        </button>
        <Link
          href="/app/dashboard"
          className="text-center text-sm font-medium text-muted hover:text-primary sm:text-right"
        >
          Back to library
        </Link>
      </div>
    </form>
  );
}
