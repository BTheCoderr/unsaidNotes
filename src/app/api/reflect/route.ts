import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generateReflection } from "@/lib/ai";
import { REFLECTION_CATEGORIES } from "@/lib/constants";
import { consumeReflectRateLimit } from "@/lib/rate-limit-reflect";
import { getSupabaseAndUserForApi } from "@/lib/supabase/mobile-bearer-client";
import type { ReflectionRow } from "@/types/database.types";

const SESSION_ERROR = "Your session expired. Please sign in again.";

const categorySchema = z.enum(REFLECTION_CATEGORIES);

const bodySchema = z.object({
  rawInput: z.string().min(1, "Write something to reflect on."),
  category: categorySchema,
  personContext: z.string().max(4000).optional().nullable(),
  intensity: z.number().int().min(1).max(5).optional().nullable(),
});

export async function POST(request: NextRequest) {
  let supabase;
  let user;
  try {
    const ctx = await getSupabaseAndUserForApi(request);
    supabase = ctx.supabase;
    user = ctx.user;
  } catch {
    return NextResponse.json({ error: SESSION_ERROR }, { status: 401 });
  }

  const limit = consumeReflectRateLimit(user.id);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many reflections. Try again in ${limit.retryAfterSec} seconds.` },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const msg =
      flat.fieldErrors.rawInput?.[0] ??
      flat.fieldErrors.category?.[0] ??
      flat.fieldErrors.intensity?.[0] ??
      flat.fieldErrors.personContext?.[0] ??
      "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { rawInput, category, personContext, intensity } = parsed.data;

  let ai;
  try {
    ai = await generateReflection({
      category,
      rawInput,
      personContext: personContext ?? null,
      intensity: intensity ?? null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "We couldn't generate your reflection. Try again in a moment." },
      { status: 502 },
    );
  }

  const { data, error } = await supabase
    .from("reflections")
    .insert({
      user_id: user.id,
      title: ai.title,
      raw_input: rawInput,
      category,
      person_context: personContext?.trim() || null,
      intensity: intensity ?? null,
      ai_summary: ai.summary,
      ai_feeling: ai.feeling,
      ai_need: ai.need,
      ai_not_to_say: ai.notToSay,
      ai_repair_message: ai.repairMessage,
      ai_boundary: ai.boundary,
      ai_next_step: ai.nextStep,
      share_card_text: ai.shareCardText,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error(error);
    return NextResponse.json(
      { error: "Your reflection was generated but could not be saved." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    reflection: data as ReflectionRow,
    safetyNote: ai.safetyNote,
  });
}
