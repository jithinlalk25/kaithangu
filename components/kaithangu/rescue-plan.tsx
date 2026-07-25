"use client";

import { Ban, MessageCircle } from "lucide-react";

import { Citations } from "@/components/kaithangu/citations";
import { HandsFreeBar } from "@/components/kaithangu/hands-free-bar";
import { ActionList, PlainList } from "@/components/kaithangu/result/action-list";
import { EscalationAlert } from "@/components/kaithangu/result/escalation";
import { ResultHeader } from "@/components/kaithangu/result/result-header";
import { ResultSection } from "@/components/kaithangu/result/result-section";
import { SpokenLine } from "@/components/kaithangu/result/spoken-line";
import {
  PendingBlocks,
  StreamedPanel,
} from "@/components/kaithangu/result/streamed-panel";
import { UrgeTimer } from "@/components/kaithangu/urge-timer";
import { Skeleton } from "@/components/ui/skeleton";
import type { Language, Role } from "@/lib/catalog";
import type { Rescue } from "@/lib/schemas";
import { toSpokenPlan } from "@/lib/spoken-plan";
import { t } from "@/lib/ui-text";
import { useSpeechQueue } from "@/lib/use-speech-queue";

/** The streamed object, where every field may still be missing. */
type PartialRescue = {
  [K in keyof Rescue]?: Rescue[K] extends readonly (infer Item)[]
    ? readonly (Partial<Item> | undefined)[]
    : Rescue[K];
};

/**
 * The rendered intervention.
 *
 * Ordered by what a person in crisis needs first: the reassurance, then the
 * body, then the words, then the evidence. Escalation jumps above all of it.
 */
export function RescuePlan({
  plan,
  isLoading,
  role,
  lang,
}: {
  plan: PartialRescue | undefined;
  isLoading: boolean;
  role: Role;
  lang: Language;
}) {
  const { speak, stop, supported, speaking, activeSegment } = useSpeechQueue(lang);

  return (
    <StreamedPanel isLoading={isLoading}>
      <EscalationAlert
        escalate={plan?.escalate}
        reason={plan?.escalateReason}
        lang={lang}
      />

      <header className="space-y-3">
        <ResultHeader
          title={plan?.headline}
          level={plan?.urgency}
          danger={plan?.urgency === "critical"}
          lang={lang}
        />

        {plan?.readOutLoud ? (
          <SpokenLine
            text={plan.readOutLoud}
            lang={lang}
            quoted={false}
            className="bg-secondary/60 rounded-2xl p-4"
          />
        ) : (
          <Skeleton className="h-24 w-full" />
        )}
      </header>

      {/* Offered only once the plan is complete: half a plan read aloud is
          worse than none, because you cannot see where it stopped. */}
      {supported && !isLoading && plan?.headline ? (
        <HandsFreeBar
          lang={lang}
          speaking={speaking}
          onStart={() => speak(toSpokenPlan(plan, lang))}
          onStop={stop}
        />
      ) : null}

      {plan?.steps?.length ? (
        <ResultSection heading={t("doThisNow", lang)}>
          <ActionList
            items={plan.steps}
            lang={lang}
            numbered
            activeIndex={activeSegment?.stepIndex ?? null}
          />
        </ResultSection>
      ) : (
        <PendingBlocks />
      )}

      {plan?.sayThis ? (
        <ResultSection heading={t("sayThis", lang)} icon={MessageCircle} tone="accent">
          <SpokenLine text={plan.sayThis} lang={lang} />
        </ResultSection>
      ) : null}

      {plan?.avoid?.length ? (
        <ResultSection heading={t("avoid", lang)} icon={Ban}>
          <PlainList items={plan.avoid} />
        </ResultSection>
      ) : null}

      {/* Urge surfing is for the person having the urge; showing a caregiver a
          craving timer would be answering the wrong question. */}
      {role === "person" && plan?.urgeTimerSeconds ? (
        <UrgeTimer seconds={plan.urgeTimerSeconds} lang={lang} />
      ) : null}

      <Citations citations={plan?.education} lang={lang} />
    </StreamedPanel>
  );
}
