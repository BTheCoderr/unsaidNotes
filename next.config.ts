import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid broken webpack vendor chunks for Supabase in dev (MODULE_NOT_FOUND under .next/server).
  serverExternalPackages: ["@supabase/supabase-js", "@supabase/ssr"],
};

export default nextConfig;
