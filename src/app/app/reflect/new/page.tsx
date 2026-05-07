import Link from "next/link";
import { redirect } from "next/navigation";

import { ReflectionForm } from "@/components/ReflectionForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewReflectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <Link href="/app/dashboard" className="text-sm font-medium text-muted hover:text-primary">
          ← Back to reflections
        </Link>
        <h1 className="font-display mt-4 text-2xl font-bold text-ink sm:text-3xl">
          New reflection
        </h1>
        <p className="mt-2 text-sm text-muted">
          Write freely. You can edit tone later—but start with honesty.
        </p>
      </div>
      <ReflectionForm />
    </div>
  );
}
