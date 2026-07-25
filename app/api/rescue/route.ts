import { structuredStreamResponse } from "@/lib/ai";
import { guard, upstreamError } from "@/lib/api";
import { rescuePrompt, rescueSystemPrompt } from "@/lib/prompts";
import { rescueRequestSchema, rescueSchema } from "@/lib/schemas";

/** Vision calls are slower than text; allow headroom without hanging the user. */
export const maxDuration = 45;

/**
 * POST /api/rescue - the zero-typing intervention.
 *
 * Input is tapped chips (plus an optional dictated note or a photo of the room).
 * Output is streamed as a partial JSON object so the first step is on screen and
 * actionable within a second or two.
 */
export async function POST(request: Request): Promise<Response> {
  const parsed = await guard(request, rescueRequestSchema);
  if (!parsed.ok) return parsed.response;

  const input = parsed.data;

  try {
    return structuredStreamResponse(rescueSchema, {
      system: rescueSystemPrompt(input.role, input.lang),
      text: rescuePrompt(input),
      imageDataUrl: input.image,
    });
  } catch (error) {
    return upstreamError(error);
  }
}
