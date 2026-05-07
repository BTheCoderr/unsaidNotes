"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Wordmark } from "@/components/Wordmark";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/app/dashboard", label: "Library" },
  { href: "/app/reflect/new", label: "Say it first" },
  { href: "/app/settings/privacy", label: "Privacy" },
  { href: "/feedback", label: "Feedback" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <Wordmark href="/app/dashboard" size="sm" className="shrink-0" />
          <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-0">
            {nav.map((item) => {
              const active =
                item.href === "/app/dashboard"
                  ? pathname === "/app/dashboard"
                  : item.href === "/app/settings/privacy"
                    ? pathname.startsWith("/app/settings")
                    : item.href === "/feedback"
                      ? pathname === "/feedback"
                      : pathname.startsWith("/app/reflect");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "min-h-10 rounded-full px-3 py-2 text-sm font-medium transition sm:min-h-0",
                    active ? "bg-primary text-white shadow-sm" : "text-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => void signOut()}
              className="ml-1 rounded-full px-3 py-2 text-sm font-medium text-muted hover:text-ink"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
