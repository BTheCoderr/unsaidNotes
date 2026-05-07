import { cn } from "@/lib/utils";

const items = [
  "Your notes are saved to your account",
  "We do not show your reflections publicly",
  "This is not therapy, legal advice, crisis support, or counseling",
] as const;

type Props = {
  className?: string;
  /** When true, omit the inner “Privacy promise” label (use a page-level heading). */
  hideCardLabel?: boolean;
};

export function PrivacyPromiseCard({ className, hideCardLabel }: Props) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-5 shadow-sm sm:px-6",
        className,
      )}
      aria-label="Privacy promise"
    >
      {!hideCardLabel ? (
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
          Privacy promise
        </h2>
      ) : null}
      <ul
        className={cn(
          "space-y-3 text-sm leading-relaxed text-ink",
          !hideCardLabel ? "mt-4" : null,
        )}
      >
        {items.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-primary" aria-hidden="true">
              ·
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
