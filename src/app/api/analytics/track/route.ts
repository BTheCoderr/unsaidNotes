import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  appEventNameSchema,
  categorySchema,
  isClientTrackableAppEvent,
} from "@/lib/analytics/app-events";
import { trackAppEvent } from "@/lib/analytics/track-app-event";
import { getSupabaseAndUserForApi } from "@/lib/supabase/mobile-bearer-client";

export const runtime = "nodejs";

const SESSION_ERROR = "Your session expired. Please sign in again.";

const bodySchema = z.object({
  eventName: appEventNameSchema,
  category: z.string().optional().nullable(),
  intensity: z.number().int().min(1).max(5).optional().nullable(),
  success: z.boolean().optional().nullable(),
  errorCode: z.string().max(80).optional().nullable(),
});

export async function POST(request: NextRequest) {
  let supabase;
  let user;
  try {
    const ctx = await getSupabaseAndUserForApi(request);
    supabase = ctx.supabase;
    user = ctx.user;
  } catch {
    return NextResponse.json({ ok: false, error: SESSION_ERROR }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const { eventName, category: rawCategory, intensity, success, errorCode } = parsed.data;

  let category: string | null = null;
  if (rawCategory != null && rawCategory.trim().length > 0) {
    const c = categorySchema.safeParse(rawCategory);
    if (!c.success) {
      return NextResponse.json({ ok: false, error: "Invalid category" }, { status: 400 });
    }
    category = c.data;
  }

  if (!isClientTrackableAppEvent(eventName)) {
    return NextResponse.json({ ok: false, error: "Event not allowed from client" }, { status: 403 });
  }

  await trackAppEvent(supabase, {
    eventName,
    userId: user.id,
    category,
    intensity: intensity ?? null,
    success: success ?? null,
    errorCode: errorCode ?? null,
  });

  return NextResponse.json({ ok: true });
}
