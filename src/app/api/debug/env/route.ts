import { NextResponse } from "next/server";

import { GROQ_DEFAULT_MVP_MODEL } from "@/lib/ai/providers/groq";
import { isDebugEndpointsEnabled } from "@/lib/debug-endpoints";

export const runtime = "nodejs";

/**
 * Safe production diagnostics: booleans and non-secret metadata only.
 * Requires `DEBUG_ENDPOINTS_ENABLED=true` (server env). Otherwise 404.
 */
export async function GET() {
  if (!isDebugEndpointsEnabled()) {
    return new NextResponse(null, { status: 404 });
  }

  const anon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const publishable = Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim());
  const aiTrimmed = process.env.AI_PROVIDER?.trim();
  const aiProvider =
    aiTrimmed && aiTrimmed.length > 0 ? aiTrimmed.toLowerCase() : null;

  const groqModelRaw = process.env.GROQ_MODEL?.trim();
  const groqModel =
    groqModelRaw && groqModelRaw.length > 0 ? groqModelRaw : GROQ_DEFAULT_MVP_MODEL;

  const body = {
    ok: true as const,
    runtime: "nodejs" as const,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
      /** True if anon **or** publishable key is set (either satisfies the app). */
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anon || publishable,
      AI_PROVIDER: aiProvider,
      GROQ_API_KEY: Boolean(process.env.GROQ_API_KEY?.trim()),
      GROQ_MODEL: groqModel,
      NEXT_PUBLIC_SITE_URL: Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim()),
      NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim()),
    },
  };

  return NextResponse.json(body);
}
