"use client";

import { toPng } from "html-to-image";
import { useState } from "react";

import { CopyButton } from "@/components/CopyButton";
import { SaveShareCardButton } from "@/components/SaveShareCardButton";
import { trackClientEvent } from "@/lib/analytics/client-track";
import { cn } from "@/lib/utils";

export type ShareCardStyle = "soft" | "bold" | "minimal";

type ShareCardProps = {
  /** Public-safe line on the card: reminder preferred, else share_card_text. */
  shareCardText: string | null | undefined;
  reminder: string | null | undefined;
  reflectionId: string;
  /** For copy only — never rendered on the share card. */
  repairMessage?: string | null;
  boundary?: string | null;
  /** Coarse context for analytics only (no user-generated text). */
  analyticsCategory: string;
  analyticsIntensity: number | null;
  className?: string;
};

const STYLE_OPTIONS: { id: ShareCardStyle; label: string }[] = [
  { id: "soft", label: "Soft" },
  { id: "bold", label: "Bold" },
  { id: "minimal", label: "Minimal" },
];

function cardStyleClasses(style: ShareCardStyle): string {
  switch (style) {
    case "soft":
      return cn(
        "border border-border/80 bg-gradient-to-b from-primary/[0.08] via-card to-card",
        "text-ink shadow-[0_4px_28px_-8px_rgba(124,58,237,0.14),0_2px_8px_-4px_rgba(31,41,55,0.06)]",
      );
    case "bold":
      return cn(
        "border-2 border-ink bg-zinc-900 text-white",
        "shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)]",
      );
    case "minimal":
      return cn(
        "border border-border bg-background text-ink shadow-sm",
      );
    default:
      return "";
  }
}

function cardAccentOrbs(style: ShareCardStyle) {
  if (style === "minimal") return null;
  if (style === "bold") {
    return (
      <>
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-primary/25 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"
          aria-hidden
        />
      </>
    );
  }
  return (
    <>
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-secondary/15 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
        aria-hidden
      />
    </>
  );
}

function cardTypography(style: ShareCardStyle): {
  brand: string;
  quote: string;
  tagline: string;
  disclaimer: string;
} {
  if (style === "bold") {
    return {
      brand: "font-display text-sm font-bold tracking-wide text-primary",
      quote: "mt-6 whitespace-pre-wrap text-pretty text-lg font-semibold leading-snug text-white md:text-xl",
      tagline: "mt-6 text-sm font-medium text-zinc-300",
      disclaimer:
        "mt-6 border-t border-white/15 pt-5 text-[0.65rem] leading-relaxed text-zinc-400 md:text-[0.7rem]",
    };
  }
  if (style === "minimal") {
    return {
      brand: "text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted",
      quote: "mt-8 whitespace-pre-wrap text-pretty text-lg font-medium leading-relaxed text-ink md:text-xl",
      tagline: "mt-8 text-sm text-muted",
      disclaimer:
        "mt-8 border-t border-border pt-5 text-[0.65rem] leading-relaxed text-muted md:text-xs",
    };
  }
  return {
    brand: "font-display text-sm font-semibold tracking-wide text-primary",
    quote: "mt-6 whitespace-pre-wrap text-pretty text-base font-medium leading-relaxed text-ink md:text-lg",
    tagline: "mt-6 text-sm font-medium italic text-muted",
    disclaimer:
      "mt-6 border-t border-border pt-5 text-[0.7rem] leading-relaxed text-muted md:text-xs",
  };
}

function pngBackgroundForStyle(style: ShareCardStyle): string {
  switch (style) {
    case "bold":
      return "#18181b";
    case "minimal":
      return "#ffffff";
    default:
      return "#fafafa";
  }
}

function ShareCardFace({
  cardStyle,
  displayLine,
}: {
  cardStyle: ShareCardStyle;
  displayLine: string;
}) {
  const typo = cardTypography(cardStyle);
  return (
    <div
      id="unsaid-share-card"
      className={cn(
        "relative overflow-hidden rounded-2xl px-5 py-8 md:px-8 md:py-10",
        cardStyleClasses(cardStyle),
      )}
    >
      {cardAccentOrbs(cardStyle)}

      <div className="relative">
        <p className={typo.brand}>Unsaid Notes</p>
        <p className="sr-only">Share card preview</p>

        <p className={typo.quote}>{displayLine}</p>

        <p className={typo.tagline}>Say it here before you say it out loud.</p>

        <p className={typo.disclaimer}>Reflection tool, not therapy or crisis support.</p>
      </div>
    </div>
  );
}

export function ShareCard({
  shareCardText,
  reminder,
  repairMessage,
  boundary,
  analyticsCategory,
  analyticsIntensity,
  reflectionId,
  className,
}: ShareCardProps) {
  const displayLine = (reminder?.trim() || shareCardText?.trim() || "").trim();
  const reminderCopyText = (reminder?.trim() || shareCardText?.trim() || "").trim();
  const repairCopy = repairMessage?.trim() ?? "";
  const boundaryCopy = boundary?.trim() ?? "";

  const hasCardPreview = Boolean(displayLine);
  const hasAnyCopy =
    Boolean(reminderCopyText) || Boolean(repairCopy) || Boolean(boundaryCopy);

  const copyMeta = { category: analyticsCategory, intensity: analyticsIntensity };

  const [cardStyle, setCardStyle] = useState<ShareCardStyle>("soft");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!hasCardPreview && !hasAnyCopy) return null;

  async function handleDownloadPng() {
    if (!hasCardPreview) return;
    setDownloadError(null);
    const el = document.getElementById("unsaid-share-card");
    if (!el) {
      setDownloadError("We couldn't find your card. Try refreshing.");
      return;
    }

    setDownloading(true);
    try {
      // html-to-image: captures #unsaid-share-card for sharing (same-origin; fallback is error UI).
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: pngBackgroundForStyle(cardStyle),
      });
      const link = document.createElement("a");
      link.download = `unsaid-card-${cardStyle}-${reflectionId.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setDownloadError("Could not create the image. You can still copy text.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className={cn("mt-8", className)} aria-labelledby="share-card-heading">
      <h2 id="share-card-heading" className="font-display mb-4 text-lg font-semibold text-ink">
        Share card
      </h2>

      <p className="mb-3 text-xs text-muted">
        Only your reminder or share line appears on the image—never your raw note or context.
      </p>

      {hasCardPreview ? (
        <div
          className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3"
          role="group"
          aria-label="Card style"
        >
          {STYLE_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCardStyle(id)}
              aria-pressed={cardStyle === id}
              className={cn(
                "min-h-12 rounded-full border px-4 py-2.5 text-sm font-medium transition sm:min-h-10 sm:py-2",
                cardStyle === id
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-card text-ink hover:border-primary/40",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {hasCardPreview ? (
        <ShareCardFace cardStyle={cardStyle} displayLine={displayLine} />
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 px-4 py-3 text-sm text-muted">
          Add a reminder or share line on your next reflection to preview a card image. You can still
          copy text below.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3">
        <p className="text-xs font-medium text-muted">Copy</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {reminderCopyText ? (
            <CopyButton
              text={reminderCopyText}
              idleLabel="Copy reminder"
              className="min-h-12 w-full justify-center rounded-xl px-4 py-2.5 sm:w-auto sm:min-h-10"
              onCopied={() => trackClientEvent("share_card_copied", copyMeta)}
            />
          ) : null}
          {repairCopy ? (
            <CopyButton
              text={repairCopy}
              idleLabel="Copy better text"
              className="min-h-12 w-full justify-center rounded-xl px-4 py-2.5 sm:w-auto sm:min-h-10"
              onCopied={() => trackClientEvent("repair_message_copied", copyMeta)}
            />
          ) : null}
          {boundaryCopy ? (
            <CopyButton
              text={boundaryCopy}
              idleLabel="Copy boundary"
              className="min-h-12 w-full justify-center rounded-xl px-4 py-2.5 sm:w-auto sm:min-h-10"
              onCopied={() => trackClientEvent("boundary_copied", copyMeta)}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
          {hasCardPreview ? (
            <button
              type="button"
              onClick={() => void handleDownloadPng()}
              disabled={downloading}
              aria-busy={downloading}
              className="inline-flex w-full items-center justify-center rounded-xl border border-primary/30 bg-card px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/[0.06] disabled:opacity-60 sm:w-auto sm:py-2.5"
            >
              {downloading ? "Saving image…" : "Download PNG"}
            </button>
          ) : null}
          {hasCardPreview ? (
            <SaveShareCardButton
              reflectionId={reflectionId}
              shareCardText={displayLine}
              className="w-full justify-center rounded-xl py-3 sm:w-auto sm:py-2.5"
            />
          ) : null}
        </div>
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
