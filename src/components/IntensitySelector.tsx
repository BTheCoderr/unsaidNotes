"use client";

import { cn } from "@/lib/utils";

type Props = {
  value: number | null;
  onChange: (n: number | null) => void;
  className?: string;
};

export function IntensitySelector({ value, onChange, className }: Props) {
  const levels = [1, 2, 3, 4, 5] as const;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">Emotional intensity</p>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs font-medium text-muted underline-offset-2 hover:text-primary hover:underline"
        >
          Clear
        </button>
      </div>
      <p className="text-xs text-muted">1 = calmer · 5 = very intense (optional)</p>
      <div className="flex flex-wrap gap-2">
        {levels.map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-semibold transition",
                selected
                  ? "border-secondary bg-secondary text-white shadow-sm"
                  : "border-border bg-card text-ink hover:border-secondary/50",
              )}
              aria-pressed={selected}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
