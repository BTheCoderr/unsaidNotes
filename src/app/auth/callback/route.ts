import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabaseBrowserConfig } from "@/lib/supabase/env";

function safeCallbackRedirectPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("..")) {
    return "/dashboard";
  }
  return next;
}

/**
 * OAuth / email-confirm PKCE: exchange `code` for session cookies, then redirect.
 * Configure Supabase "Redirect URLs" to include `{SITE_URL}/auth/callback`.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextPath = safeCallbackRedirectPath(url.searchParams.get("next"));
  const failureRedirect = NextResponse.redirect(new URL("/login?error=auth_callback_failed", url.origin));

  if (!code) {
    return failureRedirect;
  }

  const redirectTarget = new URL(nextPath, url.origin);
  const response = NextResponse.redirect(redirectTarget);

  let supabaseUrl: string;
  let anonKey: string;
  try {
    const cfg = getSupabaseBrowserConfig();
    supabaseUrl = cfg.url;
    anonKey = cfg.anonKey;
  } catch {
    return failureRedirect;
  }

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("auth callback exchange failed", error.message);
    return failureRedirect;
  }

  return response;
}
