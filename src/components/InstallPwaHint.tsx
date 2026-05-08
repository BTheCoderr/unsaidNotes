"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Lightweight install hints for iOS (manual add) and Android (install prompt when available).
 */
export function InstallPwaHint({ className }: { className?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [ios, setIos] = useState(false);
  const [showAndroidThanks, setShowAndroidThanks] = useState(false);

  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isIos = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIos(isIos);

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  async function tryInstall() {
    if (!deferred) return;
    setInstalling(true);
    try {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") {
        setShowAndroidThanks(true);
      }
    } finally {
      setInstalling(false);
      setDeferred(null);
    }
  }

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6",
        className,
      )}
      aria-label="Install app"
    >
      <h2 className="font-display text-base font-semibold text-ink sm:text-lg">
        Add Unsaid Notes to your home screen
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Use it like a small app: faster to open when you need a pause before you hit send.
      </p>

      {ios ? (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink">
          <li>Tap the Share button <span className="font-medium">(square with arrow)</span> in Safari.</li>
          <li>Scroll and tap <span className="font-medium">Add to Home Screen</span>, then Add.</li>
        </ol>
      ) : (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink">
          <li>
            Open the browser menu <span className="font-medium">(⋮ or ⋯)</span>.
          </li>
          <li>
            Tap <span className="font-medium">Install app</span>,{" "}
            <span className="font-medium">Add to Home screen</span>, or similar (wording varies by
            browser).
          </li>
        </ol>
      )}

      {deferred ? (
        <button
          type="button"
          onClick={() => void tryInstall()}
          disabled={installing}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-primary/40 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:opacity-60 sm:w-auto"
        >
          {installing ? "Opening install…" : "Install (Android / Chrome)"}
        </button>
      ) : null}

      {showAndroidThanks ? (
        <p className="mt-3 text-sm font-medium text-primary" role="status">
          Great — you can open Unsaid Notes from your home screen.
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Installing saves a shortcut; your notes still live in your account as usual.
      </p>
    </aside>
  );
}
