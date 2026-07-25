import { structuredStreamResponse } from "@/lib/ai";
import { guard, upstreamError } from "@/lib/api";
import { patternsPrompt, patternsSystemPrompt } from "@/lib/prompts";
import { patternsRequestSchema, patternsSchema } from "@/lib/schemas";

export const maxDuration = 30;

/**
 * POST /api/patterns - what this person's own history has in common.
 *
 * The history lives in the browser and is posted only when the user explicitly
 * asks for this analysis. Nothing is stored server-side: the request is read,
 * used to build the prompt, and discarded with the response.
 */
export async function POST(request: Request): Promise<Response> {
  const parsed = await guard(request, patternsRequestSchema);
  if (!parsed.ok) return parsed.response;

  const input = parsed.data;

  try {
    return structuredStreamResponse(patternsSchema, {
      system: patternsSystemPrompt(input.role, input.lang),
      text: patternsPrompt(input),
    });
  } catch (error) {
    return upstreamError(error);
  }
}
