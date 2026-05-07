import "server-only";

/**
 * Per-user sliding-window cap for POST /api/reflect.
 *
 * TODO: On Vercel/serverless this Map is per-isolate and resets cold starts are not coordinated.
 * For production hardening, use Upstash Redis, @vercel/kv, or edge rate limiting so limits are global.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
type Bucket = number[];
const buckets = new Map<string, Bucket>();

export type ReflectRateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

export function consumeReflectRateLimit(userId: string): ReflectRateLimitResult {
  const now = Date.now();
  let times = buckets.get(userId) ?? [];
  times = times.filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_PER_WINDOW) {
    const oldest = times[0]!;
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000)),
    };
  }
  times.push(now);
  buckets.set(userId, times);
  return { ok: true };
}
