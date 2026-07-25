import type { Language } from "@/lib/catalog";
import type { SpokenSegment } from "@/lib/use-speech-queue";

/** Wording that only exists in the spoken version of a plan. */
const SPOKEN = {
  step: { en: (n: number) => `Step ${n}.`, ml: (n: number) => `ഘട്ടം ${n}.` },
  sayThis: { en: "Now say this out loud.", ml: "ഇനി ഇത് ഉറക്കെ പറയൂ." },
  closing: {
    en: "That is the whole plan. Stay with the timer. This will pass.",
    ml: "ഇത്രയുമാണ് പ്ലാൻ. ടൈമറിനൊപ്പം നിൽക്കൂ. ഇത് കടന്നുപോകും.",
  },
} as const;

interface SpeakablePlan {
  headline?: string;
  readOutLoud?: string;
  steps?: readonly ({ action?: string; why?: string } | undefined)[];
  sayThis?: string;
}

/**
 * Turn a rescue plan into something worth listening to.
 *
 * Not just the fields concatenated: steps are numbered aloud so the listener
 * can track position without looking, and the closing line exists because
 * silence at the end of a crisis instruction is its own kind of alarming.
 *
 * Pure and exported so `lib/spoken-plan.test.ts` can pin the ordering.
 */
export function toSpokenPlan(
  plan: SpeakablePlan | undefined,
  lang: Language,
): SpokenSegment[] {
  if (!plan) return [];

  const segments: SpokenSegment[] = [];

  if (plan.headline) segments.push({ text: plan.headline });
  if (plan.readOutLoud) segments.push({ text: plan.readOutLoud });

  plan.steps?.forEach((step, index) => {
    if (!step?.action) return;
    const parts = [SPOKEN.step[lang](index + 1), step.action];
    if (step.why) parts.push(step.why);
    segments.push({ text: parts.join(" "), stepIndex: index });
  });

  if (plan.sayThis) {
    segments.push({ text: `${SPOKEN.sayThis[lang]} ${plan.sayThis}` });
  }

  if (segments.length > 0) segments.push({ text: SPOKEN.closing[lang] });

  return segments;
}
