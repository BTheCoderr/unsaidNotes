"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CopyButton } from "@/components/CopyButton";
import { ShareCard } from "@/components/ShareCard";
import type { ReflectionRow } from "@/types/database.types";
import { UNSAID_SAFETY_NOTE } from "@/lib/constants";
import { cn } from "@/lib/utils";

function Section({
  title,
  body,
  copyLabel,
}: {
  title: string;
  body: string | null | undefined;
  copyLabel: string;
}) {
  const text = body?.trim();
  if (!text) return null;
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-sm font-semibold text-primary">{title}</h2>
          <p className="mt-2 whitespace-pre-wrap text-pretty text-base leading-relaxed text-ink">
            {text}
          </p>
        </div>
        <CopyButton text={text} idleLabel={copyLabel} className="shrink-0 rounded-xl" />
      </div>
    </section>
  );
}

type Props = {
  reflection: ReflectionRow;
  className?: string;
};

export function ReflectionResult({ reflection, className }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this reflection? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/reflections/${reflection.id}`, { method: "DELETE" });
      if (!res.ok) return;
      router.push("/app/dashboard");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  const hasShare =
    Boolean(reflection.share_card_text?.trim()) || Boolean(reflection.ai_reminder?.trim());

  return (
    <div className={cn("mx-auto max-w-2xl space-y-5 pb-24", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/app/dashboard"
          className="text-sm font-medium text-muted hover:text-primary"
        >
          ← Library
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/app/reflect/new"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-ink shadow-sm hover:border-primary/40"
          >
            Another round
          </Link>
          <button
            type="button"
            disabled={deleting}
            onClick={() => void handleDelete()}
            className="rounded-full border border-danger/30 px-4 py-2 text-sm font-medium text-danger hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {reflection.category}
          {reflection.person_context ? ` · ${reflection.person_context}` : ""}
        </p>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          {reflection.title || "Reflection"}
        </h1>
        <p className="text-sm text-muted">
          Saved{" "}
          {new Date(reflection.created_at).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </header>

      <details className="rounded-2xl border border-border bg-background/80 px-4 py-3 text-sm text-muted">
        <summary className="cursor-pointer font-medium text-ink">What you first wrote</summary>
        <p className="mt-3 whitespace-pre-wrap text-pretty">{reflection.raw_input}</p>
      </details>

      <Section
        title={"What's really going on"}
        body={reflection.ai_summary}
        copyLabel="Copy summary"
      />
      <Section
        title="What you might be feeling"
        body={reflection.ai_feeling}
        copyLabel="Copy feelings"
      />
      <Section
        title={"What you're probably needing"}
        body={reflection.ai_need}
        copyLabel="Copy needs"
      />
      <Section
        title="The version not to send"
        body={reflection.ai_not_to_say}
        copyLabel={'Copy "not to send"'}
      />
      <Section title="The better text" body={reflection.ai_repair_message} copyLabel="Copy text" />
      <Section title="The boundary" body={reflection.ai_boundary} copyLabel="Copy boundary" />
      <Section title="The next calm move" body={reflection.ai_next_step} copyLabel="Copy next move" />
      <Section title="The reminder" body={reflection.ai_reminder} copyLabel="Copy reminder" />

      {hasShare ? (
        <ShareCard
          shareCardText={reflection.share_card_text}
          reminder={reflection.ai_reminder}
          reflectionId={reflection.id}
        />
      ) : null}

      <p className="text-center text-xs leading-relaxed text-muted">{UNSAID_SAFETY_NOTE}</p>
    </div>
  );
}
