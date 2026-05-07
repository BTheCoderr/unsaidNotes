import { type NextRequest, NextResponse } from "next/server";

import { getSupabaseAndUserForApi } from "@/lib/supabase/mobile-bearer-client";
import { trackAppEvent } from "@/lib/analytics/track-app-event";

const SESSION_ERROR = "Your session expired. Please sign in again.";

/** Delete all reflections for the authenticated user (RLS also restricts scope). */
export async function DELETE(request: NextRequest) {
  let supabase;
  let user;
  try {
    const c = await getSupabaseAndUserForApi(request);
    supabase = c.supabase;
    user = c.user;
  } catch {
    return NextResponse.json({ ok: false, error: SESSION_ERROR }, { status: 401 });
  }

  const { error } = await supabase.from("reflections").delete().eq("user_id", user.id);

  if (error) {
    console.error("[api/reflections] delete_all failed");
    return NextResponse.json(
      { ok: false, error: "Could not delete reflections." },
      { status: 500 },
    );
  }

  void trackAppEvent(supabase, {
    eventName: "reflection_deleted",
    userId: user.id,
    success: true,
  });

  return NextResponse.json({ ok: true });
}
