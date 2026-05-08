"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BeforeYouWriteNotice } from "@/components/BeforeYouWriteNotice";
import { CategoryPicker } from "@/components/CategoryPicker";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { IntensitySelector } from "@/components/IntensitySelector";
import { CATEGORY_RISKY_TEXT, REFLECTION_CATEGORIES, type ReflectionCategory } from "@/lib/constants";
import { trackClientEvent } from "@/lib/analytics/client-track";
import { cn } from "@/lib/utils";

const REFLECT_CONNECTION_ERROR =
  "Connection dropped. Your draft is still here — try again when you're back online.";

function isBrowserOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

/** Fictional sample for the “Use a fake example” control — not a real conversation. */
const FAKE_EXAMPLE_PROMPT =
  "FAKE EXAMPLE FOR TESTING — made-up message, not something you should send:\n\n" +
  "You always do this. I'm done explaining myself. If you can't see how dismissive you've been lately, don't bother replying.";

export function ReflectionForm({ className }: { className?: string }) {
  const router = useRouter();
  const [rawInput, setRawInput] = useState("");
  const [category, setCategory] = useState<ReflectionCategory>(REFLECTION_CATEGORIES[0]);
  const [personContext, setPersonContext] = useState("");
  const [intensity, setIntensity] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successHint, setSuccessHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackClientEvent("reflection_started", {
      category,
      intensity,
      success: true,
    });
    // Once per mount; intentional empty deps (initial category / intensity only).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      let body: { ok?: boolean; message?: string; error?: string; reflection?: { id: string } };
      try {
        body = (await res.json()) as typeof body;
      } catch {
        setError(isBrowserOffline() ? REFLECT_CONNECTION_ERROR : "Unexpected response from server. Try again.");
        return;
      }

      if (!res.ok) {
        setError(body.message ?? body.error ?? "Something went wrong.");
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
      setError(REFLECT_CONNECTION_ERROR);
    } finally {
      if (!navigated) setLoading(false);
    }
  }

  function fillFakeExample() {
    setError(null);
    setSuccessHint(null);
    setRawInput(FAKE_EXAMPLE_PROMPT);
    setCategory(CATEGORY_RISKY_TEXT);
    setIntensity(4);
  }

  const emptyInput = rawInput.trim().length === 0;

  return (
    <>
    <form
      id="reflection-compose"
      onSubmit={onSubmit}
      aria-busy={loading}
      className={cn("mx-auto max-w-2xl space-y-6", className)}
    >
      <DisclaimerBanner />

      <BeforeYouWriteNotice />

      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label htmlFor="thoughts" className="text-sm font-medium text-ink">
            The draft you&apos;re sitting with
          </label>
          <div className="flex flex-col gap-1 sm:items-end">
            <button
              type="button"
              onClick={fillFakeExample}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-dashed border-primary/45 bg-primary/[0.07] px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/10 sm:w-auto"
            >
              Use a fake example
            </button>
            <p className="text-center text-[0.7rem] leading-snug text-muted sm:text-right">
              Fictional sample only — fills the box, sets &ldquo;I&apos;m about to send a risky text,&rdquo;
              intensity 4. You still choose when to submit.
            </p>
          </div>
        </div>
        <textarea
          id="thoughts"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={10}
          autoComplete="off"
          autoCorrect="on"
          enterKeyHint="done"
          placeholder="Say the messy part out loud here—before it goes anywhere else."
          className="min-h-[12rem] w-full resize-y rounded-2xl border border-border bg-card px-4 py-3 text-base leading-relaxed text-ink shadow-sm outline-none ring-primary/30 placeholder:text-muted focus:ring-2 md:min-h-0"
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

      <div className="hidden flex-col gap-3 md:flex md:flex-row md:items-center md:justify-between">
        <button
          type="submit"
          disabled={loading || !rawInput.trim()}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Cooling it down…" : "Help me say this better"}
        </button>
        <Link
          href="/app/dashboard"
          className="min-h-12 text-center text-sm font-medium leading-none text-muted hover:text-primary md:self-center md:py-3 md:text-right"
        >
          Back to library
        </Link>
      </div>
    </form>

    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 px-4 pt-3 shadow-[0_-4px_24px_-8px_rgba(31,41,55,0.12)] backdrop-blur-lg md:hidden"
      style={{
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mx-auto flex max-w-2xl gap-3">
        <Link
          href="/app/dashboard"
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-ink shadow-sm"
        >
          Library
        </Link>
        <button
          type="submit"
          form="reflection-compose"
          disabled={loading || !rawInput.trim()}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-white shadow-md transition hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Cooling it down…" : "Help me say this better"}
        </button>
      </div>
    </div>
    </>
  );
}
