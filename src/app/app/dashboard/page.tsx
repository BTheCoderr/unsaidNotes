import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/EmptyState";
import { InstallPwaHint } from "@/components/InstallPwaHint";
import { ReflectionCard } from "@/components/ReflectionCard";
import { CATEGORY_BOUNDARY_MODE, CATEGORY_RISKY_TEXT } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { ReflectionRow } from "@/types/database.types";

function Shelf({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("reflections")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(80);

  const reflections = (error ? [] : data) as ReflectionRow[];

  const pinned = reflections.filter((r) => r.is_favorite).slice(0, 8);
  const riskyShelf = reflections.filter((r) => r.category === CATEGORY_RISKY_TEXT).slice(0, 6);
  const boundaryShelf = reflections
    .filter((r) => r.category === CATEGORY_BOUNDARY_MODE)
    .slice(0, 6);

  const shelvedIds = new Set([
    ...pinned.map((r) => r.id),
    ...riskyShelf.map((r) => r.id),
    ...boundaryShelf.map((r) => r.id),
  ]);
  const recent = reflections.filter((r) => !shelvedIds.has(r.id));

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            Reflection library
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Raw draft → calmer read → clearer language → saved note → share card. Everything here
            stays private until you choose otherwise.
          </p>
        </div>
        <Link
          href="/app/reflect/new"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-secondary px-6 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-secondary/90"
        >
          Say it first
        </Link>
      </div>

      <InstallPwaHint />

      {reflections.length === 0 ? (
        <EmptyState
          title="Your shelves are waiting"
          description="When you're ready, write what you haven't sent yet. We'll help you cool it into something truer."
          action={
            <Link
              href="/app/reflect/new"
              className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary/90"
            >
              Start here
            </Link>
          }
        />
      ) : (
        <>
          {pinned.length > 0 ? (
            <Shelf
              title="Saved reminders"
              description="Pinned lines you wanted to keep close—open one when the feeling spikes again."
            >
              <ul className="space-y-3">
                {pinned.map((r) => (
                  <li key={r.id}>
                    <ReflectionCard reflection={r} />
                  </li>
                ))}
              </ul>
            </Shelf>
          ) : null}

          <Shelf
            title="Texts I didn't send"
            description="Reflections you started when a risky text was on your tongue."

          >
            {riskyShelf.length > 0 ? (
              <ul className="space-y-3">
                {riskyShelf.map((r) => (
                  <li key={r.id}>
                    <ReflectionCard reflection={r} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-card/60 px-4 py-6 text-sm text-muted">
                Nothing here yet. When you choose{" "}
                <span className="font-medium text-ink">I&apos;m about to send a risky text</span>,
                those entries land on this shelf.
              </p>
            )}
          </Shelf>

          <Shelf
            title="Boundaries I'm practicing"
            description="Moments you named a line you're learning to hold."

          >
            {boundaryShelf.length > 0 ? (
              <ul className="space-y-3">
                {boundaryShelf.map((r) => (
                  <li key={r.id}>
                    <ReflectionCard reflection={r} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-card/60 px-4 py-6 text-sm text-muted">
                Nothing here yet. Choose{" "}
                <span className="font-medium text-ink">I need a boundary</span> on a new note to
                fill this row.
              </p>
            )}
          </Shelf>

          <Shelf
            title="Recent reflections"
            description="The rest of your notes, newest first."
          >
            {recent.length > 0 ? (
              <ul className="space-y-3">
                {recent.map((r) => (
                  <li key={r.id}>
                    <ReflectionCard reflection={r} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">
                Your latest notes are all in the sections above—keep reflecting and this list will
                grow.
              </p>
            )}
          </Shelf>
        </>
      )}
    </div>
  );
}
