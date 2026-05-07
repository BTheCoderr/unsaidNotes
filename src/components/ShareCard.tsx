"use client";

import { toPng } from "html-to-image";
import { useState } from "react";

import { CopyButton } from "@/components/CopyButton";
import { SaveShareCardButton } from "@/components/SaveShareCardButton";
import { cn } from "@/lib/utils";

type ShareCardProps = {
  shareCardText: string;
  reflectionId: string;
  className?: string;
};

export function ShareCard({ shareCardText, reflectionId, className }: ShareCardProps) {
  const trimmed = shareCardText.trim();
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!trimmed) return null;

  async function handleDownloadPng() {
    setDownloadError(null);
    const el = document.getElementById("unsaid-share-card");
    if (!el) {
      setDownloadError("We couldn't find your card. Try refreshing.");
      return;
    }

    setDownloading(true);
    try {
      const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement("a");
      link.download = `unsaid-card-${reflectionId.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setDownloadError("Could not create the image. You can still copy the text.");
    } finally {
      setDownloading(false);
    }
  }

  const fullText = [
    "Unsaid Notes",
    trimmed,
    "Say it here before you say it out loud.",
    "Reflection tool, not therapy or crisis support.",
  ].join("\n\n");

  return (
    <section className={cn("mt-8", className)} aria-labelledby="share-card-heading">
      <h2 id="share-card-heading" className="font-display mb-4 text-lg font-semibold text-ink">
        Share card
      </h2>

      <div
        id="unsaid-share-card"
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border px-5 py-8 md:px-8 md:py-10",
          "bg-gradient-to-b from-primary/[0.07] via-card to-card",
          "shadow-[0_4px_28px_-8px_rgba(124,58,237,0.12),0_2px_8px_-4px_rgba(31,41,55,0.06)]",
        )}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary/15 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
          aria-hidden
        />

        <div className="relative">
          <p className="font-display text-sm font-semibold tracking-wide text-primary">Unsaid Notes</p>
          <p className="sr-only">Share card preview</p>

          <p className="mt-6 whitespace-pre-wrap text-pretty text-base font-medium leading-relaxed text-ink md:text-lg">
            {trimmed}
          </p>

          <p className="mt-6 text-sm font-medium italic text-muted">
            Say it here before you say it out loud.
          </p>

          <p className="mt-6 border-t border-border pt-5 text-[0.7rem] leading-relaxed text-muted md:text-xs">
            Reflection tool, not therapy or crisis support.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
        <CopyButton
          text={fullText}
          idleLabel="Copy card text"
          className="w-full justify-center rounded-xl py-3 sm:w-auto sm:py-2.5"
        />
        <button
          type="button"
          onClick={() => void handleDownloadPng()}
          disabled={downloading}
          aria-busy={downloading}
          className="inline-flex w-full items-center justify-center rounded-xl border border-primary/30 bg-card px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/[0.06] disabled:opacity-60 sm:w-auto sm:py-2.5"
        >
          {downloading ? "Downloading…" : "Download card"}
        </button>
        <SaveShareCardButton
          reflectionId={reflectionId}
          shareCardText={trimmed}
          className="w-full justify-center rounded-xl py-3 sm:w-auto sm:py-2.5"
        />
      </div>

      {downloadError ? (
        <p
          className="mt-4 rounded-xl border border-danger/20 bg-red-50 px-3 py-2.5 text-sm text-danger"
          role="alert"
        >
          {downloadError}
        </p>
      ) : null}
    </section>
  );
}
