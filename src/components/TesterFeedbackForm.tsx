"use client";

import Link from "next/link";
import { useState } from "react";

type Tri = "unset" | "yes" | "no";

function triToBool(t: Tri): boolean | null {
  if (t === "yes") return true;
  if (t === "no") return false;
  return null;
}

function BoolChoice({
  legend,
  value,
  onChange,
  name,
}: {
  legend: string;
  value: Tri;
  onChange: (v: Tri) => void;
  name: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {(
          [
            { k: "yes" as const, label: "Yes" },
            { k: "no" as const, label: "No" },
          ] as const
        ).map(({ k, label }) => (
          <label
            key={k}
            className={`inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-5 py-2 text-sm font-medium transition sm:min-h-0 ${
              value === k
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border bg-card text-ink hover:border-primary/35"
            }`}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={value === k}
              onChange={() => onChange(k)}
            />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function TesterFeedbackForm() {
  const [useful, setUseful] = useState<Tri>("unset");
  const [sendable, setSendable] = useState<Tri>("unset");
  const [useAgain, setUseAgain] = useState<Tri>("unset");
  const [feltOff, setFeltOff] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const u = triToBool(useful);
    const s = triToBool(sendable);
    const a = triToBool(useAgain);
    if (u === null || s === null || a === null) {
      setErrorMsg("Please answer all three yes / no questions.");
      return;
    }
    setErrorMsg(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          useful: u,
          betterTextSendable: s,
          useAgain: a,
          feltOff: feltOff.trim() || null,
          email: email.trim() || null,
        }),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !body.ok) {
        setErrorMsg(body.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/[0.06] px-5 py-8 text-center sm:px-8">
        <p className="font-display text-lg font-semibold text-ink">Thank you</p>
        <p className="mt-2 text-sm text-muted">
          Your notes help us make Unsaid Notes sharper and kinder. You can close this page or keep
          exploring.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-ink shadow-sm hover:border-primary/40"
          >
            Home
          </Link>
          <Link
            href="/app/dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-8">
      <BoolChoice legend="Was this useful?" value={useful} onChange={setUseful} name="useful" />
      <BoolChoice
        legend="Was the better text sendable?"
        value={sendable}
        onChange={setSendable}
        name="sendable"
      />
      <div className="space-y-2">
        <label htmlFor="feltOff" className="text-sm font-medium text-ink">
          What felt off? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="feltOff"
          value={feltOff}
          onChange={(e) => setFeltOff(e.target.value)}
          rows={4}
          maxLength={4000}
          placeholder="Tone, length, anything that missed—no need to paste private messages."
          className="w-full resize-y rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink shadow-sm outline-none ring-primary/30 placeholder:text-muted focus:ring-2"
        />
      </div>
      <BoolChoice
        legend="Would you use this again?"
        value={useAgain}
        onChange={setUseAgain}
        name="useAgain"
      />
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email <span className="font-normal text-muted">(optional, for follow-up)</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base text-ink shadow-sm outline-none ring-primary/30 placeholder:text-muted focus:ring-2"
        />
      </div>

      {errorMsg ? (
        <p className="rounded-xl border border-danger/25 bg-red-50 px-3 py-2 text-sm text-danger">
          {errorMsg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-secondary px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-secondary/90 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send feedback"}
      </button>
      <p className="text-xs text-muted">
        No account required. If you&apos;re signed in, we attach your user id only—never your note
        text from here.
      </p>
    </form>
  );
}
