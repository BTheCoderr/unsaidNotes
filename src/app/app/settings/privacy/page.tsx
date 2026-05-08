import Link from "next/link";
import { redirect } from "next/navigation";

import { DeleteAllReflectionsCard } from "@/components/DeleteAllReflectionsCard";
import { InstallPwaHint } from "@/components/InstallPwaHint";
import { createClient } from "@/lib/supabase/server";

export default async function PrivacySettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-10">
      <div>
        <Link href="/app/dashboard" className="text-sm font-medium text-muted hover:text-primary">
          ← Back to library
        </Link>
        <h1 className="font-display mt-4 text-2xl font-bold text-ink sm:text-3xl">
          Privacy &amp; your data
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Control what stays in your account. Deleting reflections here only removes your saved notes
          in Unsaid Notes—it does not end your login by itself.
        </p>
      </div>

      <InstallPwaHint />

      <DeleteAllReflectionsCard />

      <section className="rounded-2xl border border-dashed border-border bg-card/60 px-5 py-5 sm:px-6">
        <h2 className="font-display text-lg font-semibold text-ink">Delete your account</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Full account deletion (sign-in identity plus all data) is not wired in the app yet. When
          we add it, it will live here. For now you can remove all reflections above, sign out, and
          contact support if you need the auth account closed on the backend.
        </p>
        <p className="mt-3 text-sm text-muted">
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            Privacy &amp; disclaimer
          </Link>{" "}
          has more on what the product is and is not.
        </p>
      </section>
    </div>
  );
}
