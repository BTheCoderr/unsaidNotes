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
      <div className="flex flex-wrap gap-2">
        {REFLECTION_CATEGORIES.map((cat) => {
          const selected = cat === value;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onChange(cat)}
              className={cn(
                "max-w-full rounded-full border px-3 py-2 text-left text-xs font-medium leading-snug transition sm:text-sm",
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
