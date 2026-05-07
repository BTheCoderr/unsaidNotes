import Link from "next/link";

import { TesterFeedbackForm } from "@/components/TesterFeedbackForm";
import { Wordmark } from "@/components/Wordmark";

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-xl px-1">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark href="/" size="sm" />
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            ← Home
          </Link>
        </div>
        <h1 className="font-display mt-8 text-3xl font-bold text-ink">Tester feedback</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Quick pulse on what&apos;s working. Takes under a minute—no private messages needed in the
          box below.
        </p>
        <div className="mt-10">
          <TesterFeedbackForm />
        </div>
      </div>
    </div>
  );
}
