"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CONFIRM_PHRASE = "DELETE ALL";

export function DeleteAllReflectionsCard() {
  const router = useRouter();
  const [phrase, setPhrase] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const canSubmit = phrase.trim() === CONFIRM_PHRASE && status !== "loading";

  async function handleDelete() {
    if (!canSubmit) return;
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/reflections", { method: "DELETE" });
      const body = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(body.error ?? body.message ?? "Could not delete reflections.");
        return;
      }
      setStatus("done");
      setMessage("All reflections have been removed from your account.");
      setPhrase("");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Delete all reflections</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Permanently removes every saved reflection tied to your account. This cannot be undone.
      </p>
      <label htmlFor="delete-confirm" className="mt-4 block text-sm font-medium text-ink">
        Type <span className="font-mono text-xs text-primary">{CONFIRM_PHRASE}</span> to confirm
      </label>
      <input
        id="delete-confirm"
        type="text"
        autoComplete="off"
        value={phrase}
        onChange={(e) => {
          setPhrase(e.target.value);
          if (status === "done" || status === "error") setStatus("idle");
        }}
        className="mt-2 w-full max-w-md rounded-xl border border-border bg-background px-3 py-2 text-sm text-ink shadow-sm outline-none ring-primary/25 focus:ring-2"
        placeholder={CONFIRM_PHRASE}
      />
      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => void handleDelete()}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-danger/40 bg-red-50 px-6 py-2.5 text-sm font-semibold text-danger hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? "Deleting…" : "Delete all reflections"}
      </button>
      {message ? (
        <p
          className={
            status === "error"
              ? "mt-3 text-sm text-danger"
              : "mt-3 text-sm text-muted"
          }
          role="status"
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
