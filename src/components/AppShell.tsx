"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Wordmark } from "@/components/Wordmark";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/app/dashboard", label: "Library", short: "Library" },
  { href: "/app/reflect/new", label: "Say it first", short: "Write" },
  { href: "/app/settings/privacy", label: "Privacy", short: "Privacy" },
  { href: "/feedback", label: "Feedback", short: "Feedback" },
];

function navActive(pathname: string, href: string): boolean {
  if (href === "/app/dashboard") return pathname === "/app/dashboard";
  if (href === "/app/settings/privacy") return pathname.startsWith("/app/settings");
  if (href === "/feedback") return pathname === "/feedback";
  return pathname.startsWith("/app/reflect");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hideBottomNav = pathname.startsWith("/app/reflect/new");

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-background",
        !hideBottomNav && "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0",
      )}
    >
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6">
          <Wordmark href="/app/dashboard" size="sm" className="shrink-0 min-h-11 min-w-[8rem] py-2 md:min-h-0 md:py-0" />
          <nav className="hidden max-w-full flex-1 flex-wrap items-center justify-end gap-1 md:flex md:gap-0">
            {nav.map((item) => {
              const active = navActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "min-h-11 rounded-full px-4 py-2.5 text-sm font-medium transition md:min-h-10 md:py-2",
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
              className="ml-2 min-h-11 rounded-full px-4 py-2.5 text-sm font-medium text-muted hover:text-ink md:min-h-10 md:py-2"
            >
              Sign out
            </button>
          </nav>
          <button
            type="button"
            onClick={() => void signOut()}
            className="min-h-11 rounded-full px-4 py-2 text-sm font-semibold text-muted hover:text-ink md:hidden"
          >
            Sign out
          </button>
        </div>
      </header>

      <main
        className={cn(
          "mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-10",
          hideBottomNav
            ? "pb-32 sm:pb-10 md:pb-10"
            : "md:pb-10",
        )}
      >
        {children}
      </main>

      {!hideBottomNav ? (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_24px_-8px_rgba(31,41,55,0.12)] backdrop-blur-lg md:hidden"
          aria-label="Main navigation"
        >
          <div className="mx-auto flex max-w-3xl">
            {nav.map((item) => {
              const active = navActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-center text-[0.7rem] font-semibold leading-tight transition active:bg-primary/5",
                    active ? "text-primary" : "text-muted",
                  )}
                >
                  <span
                    className={cn(
                      "h-1 w-8 rounded-full transition",
                      active ? "bg-primary" : "bg-transparent",
                    )}
                    aria-hidden
                  />
                  {item.short}
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
