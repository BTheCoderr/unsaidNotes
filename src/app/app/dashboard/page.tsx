import Link from "next/link";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/EmptyState";
import { ReflectionCard } from "@/components/ReflectionCard";
import { createClient } from "@/lib/supabase/server";
import type { ReflectionRow } from "@/types/database.types";

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
    .limit(50);

  const reflections = (error ? [] : data) as ReflectionRow[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Your reflections</h1>
          <p className="mt-2 text-sm text-muted">Recent entries, newest first.</p>
        </div>
        <Link
          href="/app/reflect/new"
          className="inline-flex justify-center rounded-full bg-secondary px-6 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-secondary/90"
        >
          New reflection
        </Link>
      </div>

      {reflections.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="When you're ready, write the messy version first—we'll help you see it more clearly."
          action={
            <Link
              href="/app/reflect/new"
              className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary/90"
            >
              Start a reflection
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {reflections.map((r) => (
            <li key={r.id}>
              <ReflectionCard reflection={r} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
