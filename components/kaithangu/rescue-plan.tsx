"use client";

import { AlertTriangle, Ban, MessageCircle } from "lucide-react";

import { Citations } from "@/components/kaithangu/citations";
import { HandsFreeBar } from "@/components/kaithangu/hands-free-bar";
import { Helplines } from "@/components/kaithangu/helplines";
import { ActionList, PlainList } from "@/components/kaithangu/result/action-list";
import { ResultSection } from "@/components/kaithangu/result/result-section";
import { SpokenLine } from "@/components/kaithangu/result/spoken-line";
import {
  PendingBlocks,
  StreamedPanel,
} from "@/components/kaithangu/result/streamed-panel";
import { UrgeTimer } from "@/components/kaithangu/urge-timer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Language } from "@/lib/catalog";
import type { Rescue } from "@/lib/schemas";
import { toSpokenPlan } from "@/lib/spoken-plan";
import { levelLabel, t } from "@/lib/ui-text";
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
  lang,
}: {
  plan: PartialRescue | undefined;
  isLoading: boolean;
  lang: Language;
}) {
  const { speak, stop, supported, speaking, activeSegment } = useSpeechQueue(lang);

  return (
    <StreamedPanel isLoading={isLoading}>
      {plan?.escalate ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 flex gap-3 rounded-2xl border p-4"
        >
          <AlertTriangle
            className="text-destructive mt-0.5 size-5 shrink-0"
            aria-hidden
          />
          <div>
            <p className="text-destructive font-semibold">{t("needsMore", lang)}</p>
            <p className="text-sm">{plan.escalateReason}</p>
          </div>
        </div>
      ) : null}

      <header className="space-y-3">
        {plan?.headline ? (
          <h3 className="text-2xl font-semibold text-balance">{plan.headline}</h3>
        ) : (
          <Skeleton className="h-8 w-3/4" />
        )}

        {plan?.urgency ? (
          <Badge variant={plan.urgency === "critical" ? "destructive" : "secondary"}>
            {levelLabel(plan.urgency, lang)}
          </Badge>
        ) : null}

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

      {plan?.urgeTimerSeconds ? (
        <UrgeTimer seconds={plan.urgeTimerSeconds} lang={lang} />
      ) : null}

      <Citations citations={plan?.education} lang={lang} />

      {plan?.escalate ? <Helplines lang={lang} crisisOnly /> : null}
    </StreamedPanel>
  );
}
