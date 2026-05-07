import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { reflectJsonError } from "@/lib/api/reflect-errors";
import { generateReflection } from "@/lib/ai";
import { getReflectAiEnvViolation } from "@/lib/ai/env-check";
import { REFLECTION_CATEGORIES } from "@/lib/constants";
import { consumeReflectRateLimit } from "@/lib/rate-limit-reflect";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";
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

function safeErrorMessage(err: unknown, maxLen = 240): string {
  if (err instanceof Error && typeof err.message === "string") {
    return err.message.slice(0, maxLen);
  }
  return "unknown_error";
}

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

export async function POST(request: NextRequest) {
  try {
    getSupabaseBrowserConfig();
  } catch (e) {
    console.error("[api/reflect] missing_env supabase", safeErrorMessage(e));
    return reflectJsonError(
      "Server is not fully configured. Try again later.",
      "missing_env",
      503,
    );
  }

  let supabase;
  let user;
  try {
    const ctx = await getSupabaseAndUserForApi(request);
    supabase = ctx.supabase;
    user = ctx.user;
  } catch (err) {
    const msg = safeErrorMessage(err);
    if (msg === "UNAUTHORIZED") {
      console.error("[api/reflect] auth_failed");
    } else {
      console.error("[api/reflect] auth_failed unexpected", msg);
    }
    return reflectJsonError(SESSION_ERROR, "auth_failed", 401);
  }

  const limit = consumeReflectRateLimit(user.id);
  if (!limit.ok) {
    return reflectJsonError(
      `Too many reflections. Try again in ${limit.retryAfterSec} seconds.`,
      "rate_limited",
      429,
      { headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return reflectJsonError("Invalid JSON body", "validation_failed", 400);
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
    return reflectJsonError(msg, "validation_failed", 400);
  }

  const { rawInput, category, personContext, intensity } = parsed.data;

  const aiEnvViolation = getReflectAiEnvViolation();
  if (aiEnvViolation) {
    console.error("[api/reflect] missing_env ai", { missing: aiEnvViolation });
    return reflectJsonError(
      "Server is not fully configured. Try again later.",
      "missing_env",
      503,
    );
  }

  let ai;
  try {
    ai = await generateReflection({
      category,
      rawInput,
      personContext: personContext ?? null,
      intensity: intensity ?? null,
    });
  } catch (e) {
    console.error("[api/reflect] ai_failed", {
      message: safeErrorMessage(e),
      name: e instanceof Error ? e.name : undefined,
    });
    return reflectJsonError(
      "We couldn't generate your reflection. Try again in a moment.",
      "ai_failed",
      502,
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
      ai_reminder: ai.reminder,
    })
    .select("*")
    .single();

  if (error || !data) {
    const missingCol = error ? isLikelyMissingAiReminderColumn(error) : false;
    console.error("[api/reflect] db_insert_failed", {
      code: error?.code,
      message: error?.message?.slice(0, 300),
      hint: missingCol ? "apply_supabase_migration_002_ai_reminder" : undefined,
    });
    return reflectJsonError(
      "Your reflection was generated but could not be saved.",
      "db_insert_failed",
      500,
    );
  }

  return NextResponse.json({
    reflection: data as ReflectionRow,
    safetyNote: ai.safetyNote,
  });
}
