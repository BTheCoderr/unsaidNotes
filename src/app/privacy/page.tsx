import Link from "next/link";

import { Wordmark } from "@/components/Wordmark";
import { UNSAID_SAFETY_NOTE } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl px-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark href="/" size="sm" />
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            ← Home
          </Link>
        </div>
        <h1 className="font-display mt-6 text-3xl font-bold text-ink">Privacy &amp; disclaimer</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-ink">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">What Unsaid Notes is</h2>
            <p className="text-muted">
              Unsaid Notes is a private journaling and reflection tool. It helps you organize your
              thoughts about difficult conversations.
            </p>
            <p className="rounded-2xl border border-border bg-card p-4 text-sm text-ink shadow-sm">
              <strong className="font-semibold">Important:</strong> {UNSAID_SAFETY_NOTE}
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">What it is not</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted">
              <li>Not therapy, counseling, or medical advice.</li>
              <li>Not legal advice.</li>
              <li>Not crisis support, an emergency hotline, or professional counseling.</li>
              <li>Not a substitute for in-person emergency or safety planning.</li>
              <li>Not mediation or professional conflict resolution.</li>
            </ul>
            <p className="text-sm text-ink">
              Unsaid Notes is <strong className="font-semibold">not</strong> therapy, legal advice,
              crisis support, or professional counseling.
            </p>
            <p className="text-muted">
              If you or someone else may be in immediate danger, contact local emergency services. If
              you are experiencing abuse or coercion, consider reaching out to a trusted professional
              or specialized support in your area.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold">Your data</h2>
            <p className="text-muted">
              Reflections are stored in your account with row-level security so only you can access
              them. Use a strong password and keep your login credentials safe.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
