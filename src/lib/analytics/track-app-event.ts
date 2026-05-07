import type { SupabaseClient } from "@supabase/supabase-js";

import type { AppEventName } from "@/lib/analytics/app-events";

export type TrackAppEventInput = {
  eventName: AppEventName;
  userId: string;
  category?: string | null;
  intensity?: number | null;
  success?: boolean | null;
  errorCode?: string | null;
};

/**
 * Best-effort insert; never throws. Does not log or persist user-generated content.
 */
export async function trackAppEvent(
  supabase: SupabaseClient,
  input: TrackAppEventInput,
): Promise<void> {
  try {
    const { error } = await supabase.from("app_events").insert({
      user_id: input.userId,
      event_name: input.eventName,
      category: input.category ?? null,
      intensity: input.intensity ?? null,
      success: input.success ?? null,
      error_code: input.errorCode ?? null,
    });
    if (error) {
      console.error("[analytics] app_events insert failed", error.code);
    }
  } catch {
    console.error("[analytics] app_events insert exception");
  }
}
