/**
 * Validates `next` for post-login redirects: same-origin relative path under `/app` only.
 */
export function safeAppPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/app")) {
    return "/app/dashboard";
  }
  if (next.includes("..") || next.includes("//")) {
    return "/app/dashboard";
  }
  return next;
}
