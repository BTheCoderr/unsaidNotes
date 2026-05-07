import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseBrowserConfig } from "./env";

export type SupabaseApiRouteContext = {
  supabase: ReturnType<typeof createServerClient>;
  hasAuthCookies: boolean;
};

export async function createSupabaseApiRouteContext(): Promise<SupabaseApiRouteContext> {
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  const hasAuthCookies = all.some((c) => c.name.startsWith("sb-"));
  const { url, anonKey } = getSupabaseBrowserConfig();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* Route handler may not allow cookie writes */
        }
      },
    },
  });

  return { supabase, hasAuthCookies };
}
