import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function DisclaimerBanner({ className }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm leading-relaxed text-muted shadow-sm",
        className,
      )}
      role="note"
    >
      <strong className="font-semibold text-ink">Heads up:</strong> Unsaid Notes is a private
      reflection tool. It is{" "}
      <strong className="font-semibold text-ink">not</strong> therapy, legal advice, crisis
      support, or professional counseling. If you are in danger, contact local emergency services or
      someone you trust.
    </div>
  );
}
