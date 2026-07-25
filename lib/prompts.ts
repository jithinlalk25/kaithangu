import { CHIPS, HORIZONS, labelsFor, type Role } from "@/lib/catalog";
import { resourceCatalogueForPrompt } from "@/lib/resources";
import type {
  PreventionRequest,
  RescueRequest,
  ScriptRequest,
} from "@/lib/schemas";

/**
 * Every prompt the app sends lives here as a pure function of validated input.
 * Keeping them out of the route handlers means prompt behaviour is unit-testable
 * without a network call - see `lib/prompts.test.ts`.
 */

const LANGUAGE_RULE: Record<"en" | "ml", string> = {
  en: "Write every value in clear, simple English an anxious person can read at a glance.",
  ml: "Write every value in natural, everyday Malayalam (മലയാളം). Do not transliterate; use Malayalam script. Keep the JSON field names in English.",
};

const SAFETY_RULES = `
NON-NEGOTIABLE SAFETY RULES
- You are not a doctor and must never diagnose, prescribe, or suggest tapering doses.
- Never suggest "just one" or any controlled use of the substance.
- If there is any sign of overdose, seizure, unsupervised alcohol or sedative withdrawal,
  violence, or self-harm, set escalate to true and name the risk plainly.
- Never shame. A slip is a data point, not a verdict.
- Cite ONLY sourceId values from the catalogue below. If nothing fits, return no citation.
  Inventing a source is worse than omitting one.`;

function persona(role: Role): string {
  return role === "person"
    ? `You are Kaithangu, a calm recovery companion for someone in Kerala, India who is living with a substance use disorder. You are speaking to them in the hardest minute of their day. You are warm, unhurried and completely non-judgemental. You never lecture.`
    : `You are Kaithangu, a calm coach for a family member or caregiver in Kerala, India who is supporting someone with a substance use disorder. You are warm about the person and firm about the behaviour. You protect the caregiver's wellbeing too, and you never blame them.`;
}

const LOCAL_CONTEXT = `LOCAL CONTEXT: Kerala, India. Toddy shops and state-run bars, wedding and festival drinking, Onam and Christmas seasons, joint families living close together, real stigma about "de-addiction", and the free Vimukthi helpline on 14405. Use this texture where it genuinely helps; never force it.`;

/** Human-readable summary of the tapped chips, used inside both prompts. */
export function describeSelection(input: RescueRequest): string {
  const chips = CHIPS[input.role];
  const parts: string[] = [];

  const situations = labelsFor(chips.situations, input.situations);
  const feelings = labelsFor(chips.feelings, input.feelings);
  const places = labelsFor(chips.places, input.places);

  if (situations.length) parts.push(`What is happening: ${situations.join("; ")}`);
  if (feelings.length) parts.push(`How they feel: ${feelings.join("; ")}`);
  if (places.length) parts.push(`Where they are: ${places.join("; ")}`);
  if (input.note?.trim()) parts.push(`In their own words: "${input.note.trim()}"`);

  return parts.length
    ? parts.join("\n")
    : "They tapped the panic button without selecting anything. Assume a strong craving and very low capacity to read.";
}

export function rescueSystemPrompt(role: Role, lang: "en" | "ml"): string {
  return [
    persona(role),
    LOCAL_CONTEXT,
    LANGUAGE_RULE[lang],
    `Assume the reader has seconds of attention and shaking hands. Every step must be physically
doable right where they are standing, with no equipment and no privacy. Prefer the body over
the mind: breath, cold water, movement, leaving the room. Keep each field short.`,
    SAFETY_RULES,
    `SOURCE CATALOGUE (the only citable ids):\n${resourceCatalogueForPrompt(role)}`,
  ].join("\n\n");
}

export function rescuePrompt(input: RescueRequest): string {
  const subject =
    input.role === "person"
      ? "Build a right-now intervention for this person."
      : "Build a right-now plan for this caregiver, about the person they are supporting.";

  return [
    subject,
    describeSelection(input),
    input.image
      ? "A photo of what is physically in front of them is attached. Read the scene: name what you actually see, use it to make the steps concrete (specific objects, exits, people), and flag anything in the image that raises the risk. Do not guess at things that are not visible."
      : "",
    "Tailor every step to the exact combination above. Generic advice is a failure.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function scriptSystemPrompt(role: Role, lang: "en" | "ml"): string {
  return [
    persona(role),
    LOCAL_CONTEXT,
    LANGUAGE_RULE[lang],
    `You write words a real person can say out loud under pressure. Short sentences. No therapy
jargon, no speeches. Each line must survive being said with a shaking voice in a noisy room.
The Malayalam must be how people actually speak, not a literal translation.`,
    SAFETY_RULES,
    `SOURCE CATALOGUE (the only citable ids):\n${resourceCatalogueForPrompt(role)}`,
  ].join("\n\n");
}

export function preventionSystemPrompt(role: Role, lang: "en" | "ml"): string {
  return [
    persona(role),
    LOCAL_CONTEXT,
    LANGUAGE_RULE[lang],
    `This is prevention, not rescue: the event has not happened yet, so the reader has calm and
time. Use it. Plan backwards from the event, make every step something a specific person can
actually arrange in an Indian family or workplace, and assume they cannot simply refuse to
attend. Protecting the relationship matters as much as protecting the recovery.`,
    SAFETY_RULES,
    `SOURCE CATALOGUE (the only citable ids):\n${resourceCatalogueForPrompt(role)}`,
  ].join("\n\n");
}

export function preventionPrompt(input: PreventionRequest): string {
  const chips = CHIPS[input.role];
  const event =
    chips.upcoming.find((chip) => chip.id === input.event)?.en ?? input.event;
  const horizon =
    HORIZONS.find((chip) => chip.id === input.horizon)?.en ?? input.horizon;
  const worries = labelsFor(chips.feelings, input.worries);

  return [
    input.role === "person"
      ? `Build a prevention plan for a person in recovery facing this: ${event}.`
      : `Build a prevention plan for a caregiver preparing for this: ${event}.`,
    `When: ${horizon}.`,
    worries.length ? `What they are already feeling about it: ${worries.join("; ")}` : "",
    input.note?.trim() ? `In their own words: "${input.note.trim()}"` : "",
    "Rate the risk honestly for this exact combination - do not default to moderate.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function scriptPrompt(input: ScriptRequest): string {
  const chips = CHIPS[input.role];
  const situation =
    chips.scriptSituations.find((c) => c.id === input.situation)?.en ??
    input.situation;

  return [
    `Write an emergency script for this situation: ${situation}.`,
    `Requested tone: ${input.tone}.`,
    input.note?.trim() ? `Extra detail they dictated: "${input.note.trim()}"` : "",
    input.role === "person"
      ? "The lines are said BY the person in recovery."
      : "The lines are said BY the caregiver.",
    "Make the pushbacks the ones that actually happen in an Indian family or friend group, not textbook examples.",
  ]
    .filter(Boolean)
    .join("\n");
}
