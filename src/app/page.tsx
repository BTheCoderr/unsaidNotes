import Link from "next/link";

import { Wordmark } from "@/components/Wordmark";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent" />

      <header className="relative mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Wordmark href="/" size="md" />
        <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
          <Link
            href="/privacy"
            className="min-h-11 px-3 py-2 text-sm font-medium text-muted hover:text-ink sm:min-h-0"
          >
            Privacy
          </Link>
          <Link
            href="/login"
            className="min-h-11 rounded-full border border-border bg-card px-4 py-2.5 text-center text-sm font-semibold text-ink shadow-sm hover:border-primary/40 sm:py-2"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="min-h-11 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary/90 sm:py-2"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <p className="mt-2 inline-block rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted shadow-sm">
          Private AI reflection journal
        </p>
        <h1 className="font-display mt-8 text-[2rem] font-bold leading-[1.12] text-ink sm:text-5xl sm:leading-tight">
          Say it here before you say it out loud.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Unsaid Notes helps you process hard conversations—arguments, boundaries, apologies, texts you
          should not send—by turning messy thoughts into calmer reflection and clearer words.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/signup"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            Start reflecting
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-8 py-3.5 text-center text-base font-semibold text-ink shadow-sm hover:border-primary/40"
          >
            I already have an account
          </Link>
        </div>

        <section className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Dump the draft",
              body: "Write what you wish you could send. Get it out safely first.",
            },
            {
              title: "See it clearly",
              body: "AI reflects back needs, boundaries, and a shorter repair message you could actually send.",
            },
            {
              title: "Keep it private",
              body: "Your reflections stay in your account with strict access controls.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/20 hover:shadow-md"
            >
              <h2 className="font-display font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </section>

        <p className="mt-16 text-center text-xs leading-relaxed text-muted">
          Not therapy, legal advice, or crisis support.{" "}
          <Link href="/privacy" className="underline-offset-2 hover:text-primary hover:underline">
            Privacy &amp; disclaimer
          </Link>
        </p>
      </main>
    </div>
  );
}
