import { redirect } from "next/navigation";

/** Canonical app dashboard lives under /app; this is the user-facing alias after email confirm. */
export default function DashboardAliasPage() {
  redirect("/app/dashboard");
}
