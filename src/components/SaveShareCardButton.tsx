"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  reflectionId: string;
  shareCardText: string;
  className?: string;
};

/**
 * Pins the reflection (is_favorite) — mirrors the DeenNotes "save card" affordance without a second table.
 */
export function SaveShareCardButton({ reflectionId, shareCardText: _shareCardText, className }: Props) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    try {
      const res = await fetch(`/api/reflections/${reflectionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_favorite: true }),
      });
      if (!res.ok) {
        setState("error");
        return;
      }
      setState("saved");
    } catch {
      setState("error");
    }
  }

  const label =
    state === "saving"
      ? "Saving…"
      : state === "saved"
        ? "Pinned"
        : state === "error"
          ? "Retry"
          : "Pin reflection";

  return (
    <button
      type="button"
      onClick={save}
      disabled={state === "saving" || state === "saved"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60",
        className,
      )}
    >
      {label}
    </button>
  );
}
