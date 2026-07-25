import { google } from "@ai-sdk/google";
import {
  createTextStreamResponse,
  generateText,
  Output,
  streamText,
  toTextStream,
  type ModelMessage,
} from "ai";
import type { z } from "zod";

import { DEMO_MODEL, DEV_MODEL } from "@/lib/models";

/**
 * Single place where the app talks to Gemini.
 *
 * The API key is read from the environment by the provider and never leaves the
 * server - no `NEXT_PUBLIC_` variable exists for it anywhere in this repo.
 */
export const DEFAULT_MODEL =
  process.env.GEMINI_MODEL ??
  (process.env.NODE_ENV === "development" ? DEV_MODEL : DEMO_MODEL);

export const model = google(DEFAULT_MODEL);

/**
 * Minimal thinking. Kaithangu is used mid-crisis, so first token on screen
 * matters more than a marginally better sentence, and these prompts are not
 * reasoning problems. Note: temperature/topP/topK are deprecated on Gemini 3.x.
 */
const FAST_OPTIONS = {
  providerOptions: { google: { thinkingConfig: { thinkingLevel: "minimal" } } },
} as const;

export interface MultimodalPrompt {
  readonly system: string;
  readonly text: string;
  /** A `data:image/...;base64,...` URL from the browser, already validated. */
  readonly imageDataUrl?: string;
}

/** Split a validated data URL into the parts the AI SDK wants. */
export function parseImageDataUrl(
  dataUrl: string,
): { mediaType: string; data: string } | undefined {
  const match = /^data:(image\/[a-z]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return undefined;
  return { mediaType: match[1]!, data: match[2]! };
}

function toMessages({ text, imageDataUrl }: MultimodalPrompt): ModelMessage[] {
  const image = imageDataUrl ? parseImageDataUrl(imageDataUrl) : undefined;

  if (!image) {
    return [{ role: "user", content: text }];
  }

  return [
    {
      role: "user",
      content: [
        { type: "text", text },
        { type: "file", mediaType: image.mediaType, data: image.data },
      ],
    },
  ];
}

/**
 * Stream a schema-shaped object, optionally grounded in a photo.
 *
 * Streaming is not decoration here: a partially rendered first step the user can
 * start doing beats a complete answer that arrives after the urge has won.
 */
export function streamStructured<T>(
  schema: z.ZodType<T>,
  prompt: MultimodalPrompt,
) {
  return streamText({
    model,
    output: Output.object({ schema }),
    system: prompt.system,
    messages: toMessages(prompt),
    ...FAST_OPTIONS,
  });
}

/** Non-streaming variant, for callers that need the whole object at once. */
export async function generateStructured<T>(
  schema: z.ZodType<T>,
  prompt: MultimodalPrompt,
): Promise<T> {
  const { output } = await generateText({
    model,
    output: Output.object({ schema }),
    system: prompt.system,
    messages: toMessages(prompt),
    ...FAST_OPTIONS,
  });
  return output;
}

/** Wrap a structured stream in the text-stream response `useObject` consumes. */
export function structuredStreamResponse<T>(
  schema: z.ZodType<T>,
  prompt: MultimodalPrompt,
): Response {
  const result = streamStructured(schema, prompt);
  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}

export { createTextStreamResponse, generateText, Output, streamText, toTextStream };
