/**
 * Small in-process rate limiter for the AI routes.
 *
 * A public, unauthenticated endpoint that spends money on every call needs a
 * brake. This is deliberately dependency-free and per-instance: enough to stop
 * a single client hammering the model, without pretending to be a distributed
 * limiter. A multi-region deployment would move this to a shared store.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

const hits = new Map<string, number[]>();

/** Best-effort client identity from proxy headers. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "anonymous";
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  now: number = Date.now(),
): RateLimitResult {
  const cutoff = now - WINDOW_MS;
  const recent = (hits.get(key) ?? []).filter((time) => time > cutoff);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, recent);
    const retryAfterSeconds = Math.ceil((recent[0]! + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 5_000) {
    for (const [existingKey, times] of hits) {
      if (times.every((time) => time <= cutoff)) hits.delete(existingKey);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Exposed for tests. */
export function resetRateLimits(): void {
  hits.clear();
}
