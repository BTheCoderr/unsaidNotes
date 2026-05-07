import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAndUserForApi } from "@/lib/supabase/mobile-bearer-client";
import { trackAppEvent } from "@/lib/analytics/track-app-event";
import type { ReflectionRow } from "@/types/database.types";

const SESSION_ERROR = "Your session expired. Please sign in again.";

const patchSchema = z.object({
  is_favorite: z.boolean().optional(),
  title: z.string().min(1).max(500).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  let supabase;
  let user;
  try {
    const c = await getSupabaseAndUserForApi(request);
    supabase = c.supabase;
    user = c.user;
  } catch {
    return NextResponse.json({ error: SESSION_ERROR }, { status: 401 });
  }

  const { id } = await ctx.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const patch = parsed.data;
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No updates" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reflections")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not update reflection." }, { status: 404 });
  }

  return NextResponse.json({ reflection: data as ReflectionRow });
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  let supabase;
  let user;
  try {
    const c = await getSupabaseAndUserForApi(request);
    supabase = c.supabase;
    user = c.user;
  } catch {
    return NextResponse.json({ error: SESSION_ERROR }, { status: 401 });
  }

  const { id } = await ctx.params;

  const { data, error } = await supabase
    .from("reflections")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Could not delete reflection." }, { status: 500 });
  }

  if (!data?.length) {
    return NextResponse.json({ error: "Reflection not found." }, { status: 404 });
  }

  void trackAppEvent(supabase, {
    eventName: "reflection_deleted",
    userId: user.id,
    success: true,
  });

  return NextResponse.json({ ok: true });
}
