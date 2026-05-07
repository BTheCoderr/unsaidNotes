import Link from "next/link";

import { PrivacyPromiseCard } from "@/components/PrivacyPromiseCard";
import { Wordmark } from "@/components/Wordmark";

const whatYouGet = [
  {
    title: "What’s really going on",
    body: "A short read on the tension underneath your words—so the feeling makes sense before you decide anything.",
  },
  {
    title: "The version not to send",
    body: "The hot draft spelled out as a warning label, not a weapon. Recognition, not permission to hit send.",
  },
  {
    title: "The better text",
    body: "Something you could actually paste into Messages—plain language, shorter breath, one honest beat.",
  },
  {
    title: "The boundary",
    body: "A firm line in calm words when you need to protect your nervous system, not win a fight.",
  },
  {
    title: "The reminder",
    body: "One line worth saving—something you might screenshot when the spiral tries to rush you again.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-gradient-to-b from-primary/[0.07] via-primary/[0.02] to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-48 bg-gradient-to-t from-secondary/[0.04] to-transparent" />

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

      <main className="relative mx-auto max-w-3xl px-4 pb-28 sm:px-6">
        {/* Hero */}
        <p className="mt-2 inline-block rounded-full border border-border/80 bg-card/90 px-3 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur-sm">
          Private AI reflection journal
        </p>
        <h1 className="font-display mt-8 text-[2rem] font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl sm:leading-tight">
          Say it here before you say it out loud.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg sm:leading-relaxed">
          Unsaid Notes helps you cool down, understand what you really mean, and turn emotional drafts
          into calmer words.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/signup"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90"
          >
            Write the text you shouldn&apos;t send
          </Link>
          <Link
            href="#what-you-get"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card/90 px-8 py-3.5 text-center text-base font-semibold text-ink shadow-sm backdrop-blur-sm transition hover:border-primary/35 hover:bg-card"
          >
            See how it works
          </Link>
        </div>

        {/* Built for the moment */}
        <section className="mt-20 sm:mt-24" aria-labelledby="moment-heading">
          <h2
            id="moment-heading"
            className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl"
          >
            Built for the moment before you react
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-[1.05rem]">
            Half-written texts, shaky thumbs, replay loops at midnight—this is the pocket between
            feeling it and sending it. Unsaid Notes holds that pause: you get structure without
            being talked down to, and language that still sounds like you.
          </p>
        </section>

        {/* What you get */}
        <section
          id="what-you-get"
          className="scroll-mt-24 mt-20 sm:mt-24"
          aria-labelledby="what-heading"
        >
          <h2
            id="what-heading"
            className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl"
          >
            What you get
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Each reflection is one private note with a few clear pieces—nothing clinical, just a path
            from heat to clarity.
          </p>
          <ul className="mt-8 space-y-4">
            {whatYouGet.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-border/90 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition hover:border-primary/20 hover:shadow-md sm:p-6"
              >
                <h3 className="font-display text-base font-semibold text-ink sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Private by default */}
        <section className="mt-20 sm:mt-24" aria-labelledby="private-heading">
          <h2
            id="private-heading"
            className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl"
          >
            Private by default
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Your words stay yours. Nothing is posted to a feed or indexed for strangers.
          </p>
          <PrivacyPromiseCard hideCardLabel className="mt-6" />
        </section>

        {/* Example — fictional copy only */}
        <section className="mt-20 sm:mt-24" aria-labelledby="example-heading">
          <h2
            id="example-heading"
            className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl"
          >
            From heat to something you can stand behind
          </h2>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
            Fictional sample — not a real conversation
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-danger/90">Before</p>
              <p className="mt-3 whitespace-pre-wrap text-pretty text-sm leading-relaxed text-ink sm:text-base">
                {`You always do this!!! I’m done explaining myself. If you can’t see how you’ve been dismissive for MONTHS then don’t bother replying. I’m not going to beg for basic respect.`}
              </p>
            </div>
            <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">After</p>
              <p className="mt-3 whitespace-pre-wrap text-pretty text-sm leading-relaxed text-ink sm:text-base">
                {`I’m pretty worked up and I don’t want to say something cruel. Can we talk tomorrow when I’ve cooled off? What I need is to feel heard about last week—not a debate tonight.`}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-16 max-w-md">
          <Link
            href="/signup"
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-secondary px-8 py-3.5 text-center text-base font-semibold text-white shadow-md transition hover:bg-secondary/90"
          >
            Write the text you shouldn&apos;t send
          </Link>
        </div>

        <p className="mt-14 text-center text-xs leading-relaxed text-muted">
          Not therapy, legal advice, or crisis support.{" "}
          <Link href="/privacy" className="underline-offset-2 hover:text-primary hover:underline">
            Privacy &amp; disclaimer
          </Link>
          {" · "}
          <Link href="/feedback" className="underline-offset-2 hover:text-primary hover:underline">
            Tester feedback
          </Link>
        </p>
      </main>
    </div>
  );
}
