import { structuredStreamResponse } from "@/lib/ai";
import { guard, upstreamError } from "@/lib/api";
import { preventionPrompt, preventionSystemPrompt } from "@/lib/prompts";
import { preventionRequestSchema, preventionSchema } from "@/lib/schemas";

export const maxDuration = 30;

/**
 * POST /api/prevent - the prevention half of the platform.
 *
 * Most relapses happen in a small number of predictable situations. This turns a
 * named upcoming event into a plan made before the event, when the person still
 * has the capacity to make one.
 */
export async function POST(request: Request): Promise<Response> {
  const parsed = await guard(request, preventionRequestSchema);
  if (!parsed.ok) return parsed.response;

  const input = parsed.data;

  try {
    return structuredStreamResponse(preventionSchema, {
      system: preventionSystemPrompt(input.role, input.lang),
      text: preventionPrompt(input),
    });
  } catch (error) {
    return upstreamError(error);
  }
}
