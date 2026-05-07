import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ReflectionResult } from "@/components/ReflectionResult";
import { createClient } from "@/lib/supabase/server";
import type { ReflectionRow } from "@/types/database.types";

type Props = { params: Promise<{ id: string }> };

export default async function ReflectionDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase.from("reflections").select("*").eq("id", id).maybeSingle();

  if (error || !data) notFound();

  return (
    <div>
      <ReflectionResult reflection={data as ReflectionRow} />
      <footer className="mx-auto max-w-2xl pt-8">
        <Link href="/privacy" className="text-xs text-muted hover:text-primary hover:underline">
          Privacy &amp; disclaimer
        </Link>
      </footer>
    </div>
  );
}
