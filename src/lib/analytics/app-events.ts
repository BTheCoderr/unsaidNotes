import { z } from "zod";

import { REFLECTION_CATEGORIES } from "@/lib/constants";

export const APP_EVENT_NAMES = [
  "reflection_started",
  "reflection_generate_attempt",
  "reflection_generate_success",
  "reflection_generate_failed",
  "repair_message_copied",
  "boundary_copied",
  "share_card_copied",
  "reflection_deleted",
] as const;

export type AppEventName = (typeof APP_EVENT_NAMES)[number];

/** Events the browser may POST to /api/analytics/track (server-only events rejected). */
export const CLIENT_TRACKABLE_APP_EVENTS = [
  "reflection_started",
  "repair_message_copied",
  "boundary_copied",
  "share_card_copied",
] as const satisfies ReadonlyArray<AppEventName>;

export type ClientTrackableAppEvent = (typeof CLIENT_TRACKABLE_APP_EVENTS)[number];

export function isClientTrackableAppEvent(name: AppEventName): name is ClientTrackableAppEvent {
  return (CLIENT_TRACKABLE_APP_EVENTS as readonly AppEventName[]).includes(name);
}

export const appEventNameSchema = z.enum(APP_EVENT_NAMES);

export const categorySchema = z.enum(REFLECTION_CATEGORIES);

export type SafeAppEventRow = {
  user_id: string;
  event_name: AppEventName;
  category: string | null;
  intensity: number | null;
  success: boolean | null;
  error_code: string | null;
};
