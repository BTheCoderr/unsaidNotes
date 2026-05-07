import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { getSupabaseBrowserConfig } from "@/lib/supabase/env";
import { getSupabaseAndUserForApi } from "@/lib/supabase/mobile-bearer-client";

export const runtime = "nodejs";

const bodySchema = z.object({
  useful: z.boolean(),
  betterTextSendable: z.boolean(),
  useAgain: z.boolean(),
  feltOff: z.string().max(4000).optional().nullable(),
  email: z.string().max(320).optional().nullable(),
});

function normalizeEmail(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const t = raw.trim();
  if (t.length === 0) return null;
  const ok = z.string().email().safeParse(t);
  return ok.success ? t : null;
}

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const emailNorm = normalizeEmail(parsed.data.email);
  if (parsed.data.email != null && parsed.data.email.trim().length > 0 && emailNorm === null) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  let userId: string | null = null;
  let supabase;
  try {
    const ctx = await getSupabaseAndUserForApi(request);
    userId = ctx.user.id;
    supabase = ctx.supabase;
  } catch {
    try {
      const { url, anonKey } = getSupabaseBrowserConfig();
      supabase = createClient(url, anonKey);
    } catch {
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 503 });
    }
  }

  const felt = parsed.data.feltOff?.trim() ?? "";
  const { error } = await supabase.from("tester_feedback").insert({
    user_id: userId,
    useful: parsed.data.useful,
    better_text_sendable: parsed.data.betterTextSendable,
    use_again: parsed.data.useAgain,
    felt_off: felt.length > 0 ? felt : null,
    email: emailNorm,
  });

  if (error) {
    console.error("[api/feedback] insert failed", error.code);
    return NextResponse.json({ ok: false, error: "Could not save feedback" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
