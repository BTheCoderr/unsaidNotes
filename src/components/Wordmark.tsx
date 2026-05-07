import Link from "next/link";

import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl sm:text-3xl",
};

/**
 * Launch wordmark: calm serif “Unsaid” + accent “Notes” + soft corner mark.
 */
export function Wordmark({ href = "/", className, size = "md" }: Props) {
  const label = (
    <span
      className={cn(
        "font-display inline-flex items-baseline gap-1.5 font-bold tracking-tight text-ink",
        sizes[size],
        className,
      )}
    >
      <span>Unsaid</span>
      <span className="font-semibold text-primary">Notes</span>
      <span
        className="hidden h-2 w-2 shrink-0 rounded-sm bg-secondary/90 sm:inline-block"
        aria-hidden
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md">
        {label}
      </Link>
    );
  }

  return label;
}
