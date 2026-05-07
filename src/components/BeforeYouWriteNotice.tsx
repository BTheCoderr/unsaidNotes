import { cn } from "@/lib/utils";

type Props = { className?: string };

export function BeforeYouWriteNotice({ className }: Props) {
  return (
    <p
      className={cn(
        "rounded-2xl border border-border/80 bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted sm:text-sm",
        className,
      )}
      role="note"
    >
      <span className="font-medium text-ink">Before you write: </span>
      Write honestly, but avoid entering passwords, financial information, addresses, or anything
      you would not want stored.
    </p>
  );
}
