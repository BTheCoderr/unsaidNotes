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
          ← Back to library
        </Link>
        <h1 className="font-display mt-4 text-2xl font-bold text-ink sm:text-3xl">
          Say it here first.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Write the version you probably should not send. Unsaid Notes will help you slow it down,
          understand what you really mean, and turn it into something clearer.
        </p>
      </div>
      <ReflectionForm />
    </div>
  );
}
