import Link from "next/link";

import type { ReflectionRow } from "@/types/database.types";
import { cn } from "@/lib/utils";

type Props = {
  reflection: ReflectionRow;
  className?: string;
};

export function ReflectionCard({ reflection, className }: Props) {
  const preview =
    reflection.ai_summary?.trim() ||
    reflection.raw_input.slice(0, 120) + (reflection.raw_input.length > 120 ? "…" : "");

  const date = new Date(reflection.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/app/reflect/${reflection.id}`}
      className={cn(
        "block rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display truncate text-base font-semibold text-ink">
            {reflection.title || "Reflection"}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{preview}</p>
        </div>
        <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted">
          {reflection.category}
        </span>
      </div>
      <p className="mt-3 text-xs text-muted">{date}</p>
    </Link>
  );
}
