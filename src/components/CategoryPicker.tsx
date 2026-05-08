"use client";

import { REFLECTION_CATEGORIES, type ReflectionCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  value: ReflectionCategory;
  onChange: (c: ReflectionCategory) => void;
  className?: string;
};

export function CategoryPicker({ value, onChange, className }: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-ink">What does this feel like right now?</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {REFLECTION_CATEGORIES.map((cat) => {
          const selected = cat === value;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={cn(
                "min-h-12 w-full rounded-full border px-4 py-2.5 text-left text-sm font-medium leading-snug transition sm:min-h-10 sm:w-auto sm:px-3 sm:py-2",
                selected
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-card text-ink hover:border-primary/40",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
