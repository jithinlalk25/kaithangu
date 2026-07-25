import { structuredStreamResponse } from "@/lib/ai";
import { guard, upstreamError } from "@/lib/api";
import { scriptPrompt, scriptSystemPrompt } from "@/lib/prompts";
import { scriptRequestSchema, scriptSchema } from "@/lib/schemas";

export const maxDuration = 30;

/**
 * POST /api/script - a personalised emergency script.
 *
 * Returns the exact words to say in a named high-risk situation, in English and
 * Malayalam, with the pushbacks that actually follow and a way out of the room.
 */
export async function POST(request: Request): Promise<Response> {
  const parsed = await guard(request, scriptRequestSchema);
  if (!parsed.ok) return parsed.response;

  const input = parsed.data;

  try {
    return structuredStreamResponse(scriptSchema, {
      system: scriptSystemPrompt(input.role, input.lang),
      text: scriptPrompt(input),
    });
  } catch (error) {
    return upstreamError(error);
  }
}
