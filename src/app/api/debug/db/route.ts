import { type NextRequest, NextResponse } from "next/server";

import { isDebugEndpointsEnabled } from "@/lib/debug-endpoints";
import { getSupabaseAndUserForApi } from "@/lib/supabase/mobile-bearer-client";

export const runtime = "nodejs";

function isLikelyMissingAiReminderColumn(error: {
  code?: string;
  message?: string | null;
}): boolean {
  const msg = (error.message ?? "").toLowerCase();
  return (
    msg.includes("ai_reminder") ||
    (msg.includes("column") && msg.includes("does not exist")) ||
    error.code === "42703"
  );
}

/**
 * Requires `DEBUG_ENDPOINTS_ENABLED=true`, then auth (cookies or Bearer).
 * Safe response body: no secrets, no row data.
 */
export async function GET(request: NextRequest) {
  if (!isDebugEndpointsEnabled()) {
    return new NextResponse(null, { status: 404 });
  }

  let supabase;
  try {
    const ctx = await getSupabaseAndUserForApi(request);
    supabase = ctx.supabase;
  } catch {
    console.error("[api/debug/db] auth_failed");
    return NextResponse.json(
      {
        ok: false as const,
        code: "auth_failed",
        message: "Sign in required to check the database.",
      },
      { status: 401 },
    );
  }

  const { error } = await supabase.from("reflections").select("id, ai_reminder").limit(1);

  if (error) {
    if (isLikelyMissingAiReminderColumn(error)) {
      console.error("[api/debug/db] missing_ai_reminder_column");
      return NextResponse.json(
        {
          ok: false as const,
          code: "missing_ai_reminder_column",
          message: "Run supabase/migrations/002_ai_reminder.sql",
        },
        { status: 503 },
      );
    }
    console.error("[api/debug/db] select_failed");
    return NextResponse.json(
      {
        ok: false as const,
        code: "db_select_failed",
        message: "Could not read from reflections. Check Supabase logs and RLS.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true as const,
    canSelectReflections: true,
    hasAiReminderColumn: true,
  });
}
