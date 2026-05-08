import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { safeAppPath } from "@/lib/safe-app-path";
import { getSupabaseBrowserConfig } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname === "/" && url.searchParams.has("code")) {
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const { url: supabaseUrl, anonKey } = getSupabaseBrowserConfig();
  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (path === "/" && request.nextUrl.searchParams.get("pwa_launch") === "1") {
    if (user) {
      const dash = request.nextUrl.clone();
      dash.pathname = "/app/dashboard";
      dash.search = "";
      return NextResponse.redirect(dash);
    }
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("pwa_launch");
    clean.search = clean.searchParams.toString() ? `?${clean.searchParams.toString()}` : "";
    if (clean.href !== request.nextUrl.href) {
      return NextResponse.redirect(clean);
    }
  }

  const isProtected = path.startsWith("/app/");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && (path.startsWith("/login") || path.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    const next = request.nextUrl.searchParams.get("next");
    url.pathname = safeAppPath(next);
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
