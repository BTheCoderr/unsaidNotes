import type { ClientTrackableAppEvent } from "@/lib/analytics/app-events";

export function trackClientEvent(
  eventName: ClientTrackableAppEvent,
  meta: {
    category?: string | null;
    intensity?: number | null;
    success?: boolean;
    errorCode?: string | null;
  } = {},
): void {
  void fetch("/api/analytics/track", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      category: meta.category ?? undefined,
      intensity: meta.intensity ?? undefined,
      success: meta.success ?? true,
      errorCode: meta.errorCode ?? undefined,
    }),
  });
}
