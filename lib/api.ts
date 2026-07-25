import type { z } from "zod";

import { checkRateLimit, clientKey } from "@/lib/rate-limit";

/**
 * Shared guard rail for every AI route: rate limit, then validate.
 *
 * Every route is public and every route spends money, so none is allowed to reach
 * the model with unvalidated input. Errors are returned as plain JSON with the
 * right status code and never leak an internal message to the client.
 */

export interface GuardFailure {
  readonly response: Response;
}

export type GuardResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: Response };

export async function guard<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<GuardResult<T>> {
  const limit = checkRateLimit(clientKey(request));
  if (!limit.allowed) {
    return {
      ok: false,
      response: Response.json(
        { error: "Too many requests. Please wait a moment." },
        {
          status: 429,
          headers: { "retry-after": String(limit.retryAfterSeconds) },
        },
      ),
    };
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "Invalid JSON body." }, { status: 400 }),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: Response.json(
        { error: "Invalid request.", issues: parsed.error.issues.map((i) => i.message) },
        { status: 400 },
      ),
    };
  }

  return { ok: true, data: parsed.data };
}

/** Uniform failure for anything that goes wrong past validation. */
export function upstreamError(error: unknown): Response {
  console.error("[kaithangu] generation failed:", error);
  return Response.json(
    { error: "Kaithangu could not reach the model. Please try again." },
    { status: 502 },
  );
}
