import { z } from "zod";

/**
 * Contracts for both directions of every AI call.
 *
 * - `*RequestSchema` validates untrusted browser input at the API boundary.
 * - `*Schema` is the structured output contract handed to Gemini, which is also
 *   what the UI renders. Schemas are deliberately flat: Gemini accepts an
 *   OpenAPI-3.0 subset of JSON Schema, so unions and records are avoided.
 */

/** Hard caps. Cheap defence against oversized payloads and prompt-stuffing. */
export const LIMITS = {
  maxNoteChars: 600,
  maxChipsPerGroup: 4,
  /** ~6 MB of base64 ≈ a 4.5 MB photo. */
  maxImageChars: 6_000_000,
} as const;

const roleSchema = z.enum(["person", "caregiver"]);
const languageSchema = z.enum(["en", "ml"]);
const chipIds = z
  .array(z.string().min(1).max(64))
  .max(LIMITS.maxChipsPerGroup)
  .default([]);

/** A data URL produced by the browser's FileReader, e.g. `data:image/jpeg;base64,...`. */
const imageDataUrl = z
  .string()
  .max(LIMITS.maxImageChars)
  .regex(
    /^data:image\/(jpeg|jpg|png|webp|heic);base64,[A-Za-z0-9+/=]+$/,
    "Only base64 JPEG, PNG, WebP or HEIC images are accepted",
  );

// ---------------------------------------------------------------------------
// Rescue - the zero-typing intervention
// ---------------------------------------------------------------------------

export const rescueRequestSchema = z.object({
  role: roleSchema,
  lang: languageSchema,
  situations: chipIds,
  feelings: chipIds,
  places: chipIds,
  /** Optional dictated note. Spoken, never required to be typed. */
  note: z.string().max(LIMITS.maxNoteChars).optional(),
  /** Optional photo of the room the user is standing in. */
  image: imageDataUrl.optional(),
});

export type RescueRequest = z.infer<typeof rescueRequestSchema>;

const citationSchema = z.object({
  sourceId: z
    .string()
    .describe("An id from the provided source catalogue. Never invent one."),
  point: z
    .string()
    .describe("One plain-language sentence this source supports."),
});

export const rescueSchema = z.object({
  headline: z
    .string()
    .describe("Six to ten warm words that land before anything else is read."),
  urgency: z
    .enum(["steady", "rising", "critical"])
    .describe("How dangerous this moment is right now."),
  readOutLoud: z
    .string()
    .describe(
      "One or two sentences to be spoken aloud to the user, second person, calm.",
    ),
  steps: z
    .array(
      z.object({
        action: z.string().describe("One physical thing to do, imperative."),
        seconds: z.number().describe("Roughly how long it takes, 10 to 120."),
        why: z.string().describe("One short line on why this works."),
      }),
    )
    .describe("Three or four steps, doable without leaving the situation."),
  sayThis: z
    .string()
    .describe("One sentence the user can say out loud to whoever is present."),
  avoid: z
    .array(z.string())
    .describe("Two or three things that make this moment worse."),
  urgeTimerSeconds: z
    .number()
    .describe("Seconds for the guided urge-surfing timer, 60 to 600."),
  education: z
    .array(citationSchema)
    .describe("Two or three grounded points, each citing a catalogue source."),
  escalate: z
    .boolean()
    .describe("True if this needs a helpline or emergency services now."),
  escalateReason: z
    .string()
    .describe("If escalating, one line naming the medical or safety risk."),
});

export type Rescue = z.infer<typeof rescueSchema>;

// ---------------------------------------------------------------------------
// Script - the personalised emergency script
// ---------------------------------------------------------------------------

export const scriptRequestSchema = z.object({
  role: roleSchema,
  lang: languageSchema,
  situation: z.string().min(1).max(64),
  tone: z.string().min(1).max(32),
  note: z.string().max(LIMITS.maxNoteChars).optional(),
});

export type ScriptRequest = z.infer<typeof scriptRequestSchema>;

export const scriptSchema = z.object({
  title: z.string().describe("Short name for this script."),
  setup: z
    .string()
    .describe("One line on how to position yourself before speaking."),
  lines: z
    .array(
      z.object({
        en: z.string().describe("The exact words, in English."),
        ml: z.string().describe("The same words in natural Malayalam."),
      }),
    )
    .describe("Three or four short lines, said in order."),
  ifTheyPush: z
    .array(
      z.object({
        theySay: z.string().describe("The likely pushback, in their words."),
        youSay: z.string().describe("A short, non-escalating reply."),
      }),
    )
    .describe("Two or three realistic pushbacks and replies."),
  exitPlan: z
    .array(z.string())
    .describe("Two or three concrete steps to leave the situation safely."),
  afterwards: z
    .string()
    .describe("One line on what to do in the ten minutes after."),
  education: z
    .array(citationSchema)
    .describe("One or two grounded points, each citing a catalogue source."),
});

export type Script = z.infer<typeof scriptSchema>;

// ---------------------------------------------------------------------------
// Prevention - the other half of the brief
// ---------------------------------------------------------------------------

export const preventionRequestSchema = z.object({
  role: roleSchema,
  lang: languageSchema,
  /** A chip id from `CHIPS[role].upcoming`. */
  event: z.string().min(1).max(64),
  /** A chip id from `HORIZONS` - how soon the event is. */
  horizon: z.string().min(1).max(32),
  worries: chipIds,
  note: z.string().max(LIMITS.maxNoteChars).optional(),
});

export type PreventionRequest = z.infer<typeof preventionRequestSchema>;

export const preventionSchema = z.object({
  title: z.string().describe("Short name for this plan."),
  riskLevel: z
    .enum(["low", "moderate", "high"])
    .describe("How risky this specific event is for this specific person."),
  riskReason: z
    .string()
    .describe("One line naming what exactly makes it risky."),
  before: z
    .array(
      z.object({
        action: z.string().describe("One concrete thing to do beforehand."),
        when: z.string().describe("When to do it, e.g. 'the night before'."),
        why: z.string().describe("One short line on what this prevents."),
      }),
    )
    .describe("Three or four preparation steps, ordered by when they happen."),
  during: z
    .array(
      z.object({
        action: z.string().describe("One concrete thing to do in the moment."),
        why: z.string().describe("One short line on why it works."),
      }),
    )
    .describe("Three steps for the event itself."),
  exitLine: z
    .string()
    .describe("A ready-made sentence for leaving early without a scene."),
  allyAsk: z
    .string()
    .describe("Exactly what to ask one trusted person to do on the day."),
  warningSigns: z
    .array(z.string())
    .describe("Two or three early signals that this is going wrong."),
  afterwards: z
    .string()
    .describe("One line on what to do once the event is over."),
  education: z
    .array(citationSchema)
    .describe("One or two grounded points, each citing a catalogue source."),
});

export type Prevention = z.infer<typeof preventionSchema>;
