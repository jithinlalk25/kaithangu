"use client";

import { useObject } from "@ai-sdk/react";
import { CalendarClock, DoorOpen, Eye, HandHeart, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ChipGroup } from "@/components/kaithangu/chip-group";
import { Citations } from "@/components/kaithangu/citations";
import { EscalationAlert } from "@/components/kaithangu/result/escalation";
import { ActionList, PlainList } from "@/components/kaithangu/result/action-list";
import { GenerateRow } from "@/components/kaithangu/result/generate-button";
import { ResultHeader } from "@/components/kaithangu/result/result-header";
import { ResultSection } from "@/components/kaithangu/result/result-section";
import { SpokenLine, DictatedNote } from "@/components/kaithangu/result/spoken-line";
import {
  PendingBlocks,
  StreamedPanel,
} from "@/components/kaithangu/result/streamed-panel";
import { CHIPS, HORIZONS, type Language, type Role } from "@/lib/catalog";
import { preventionSchema } from "@/lib/schemas";
import { t } from "@/lib/ui-text";

/**
 * Prevention: the plan you make while you still can.
 *
 * Most lapses happen in a small number of predictable situations, so the highest
 * leverage moment is not the craving - it is the week before the wedding.
 */
export function PreventView({ role, lang }: { role: Role; lang: Language }) {
  const [event, setEvent] = useState<string[]>([]);
  const [horizon, setHorizon] = useState<string[]>(["this-week"]);
  const [worries, setWorries] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const { object: plan, submit, isLoading, clear } = useObject({
    api: "/api/prevent",
    schema: preventionSchema,
    onError: () => toast.error("Could not build the plan. Please try again."),
  });

  const chips = CHIPS[role];

  function generate() {
    if (!event[0]) {
      toast.error("Pick what is coming up first.");
      return;
    }
    submit({
      role,
      lang,
      event: event[0],
      horizon: horizon[0] ?? "this-week",
      worries,
      note: note.trim() || undefined,
    });
  }

  return (
    <div className="space-y-8">
      <ChipGroup
        legend={t("whatsComing", lang)}
        chips={chips.upcoming}
        selected={event}
        onChange={(next) => {
          setEvent(next);
          clear();
        }}
        lang={lang}
        single
      />
      <ChipGroup
        legend={t("when", lang)}
        chips={HORIZONS}
        selected={horizon}
        onChange={setHorizon}
        lang={lang}
        single
      />
      <ChipGroup
        legend={t("alreadyFeeling", lang)}
        chips={chips.feelings}
        selected={worries}
        onChange={setWorries}
        lang={lang}
      />

      <GenerateRow
        label={t("makePlan", lang)}
        lang={lang}
        onGenerate={generate}
        onTranscript={(text) =>
          setNote((current) => (current ? `${current} ${text}` : text))
        }
      />
      <DictatedNote note={note} />

      {isLoading || plan ? (
        <StreamedPanel isLoading={isLoading}>
          <EscalationAlert
            escalate={plan?.escalate}
            reason={plan?.escalateReason}
            lang={lang}
          />
          <ResultHeader
            title={plan?.title}
            level={plan?.riskLevel}
            danger={plan?.riskLevel === "high"}
            lang={lang}
          />

          {plan?.riskReason ? (
            <p className="text-muted-foreground text-pretty">{plan.riskReason}</p>
          ) : null}

          {plan?.before?.length ? (
            <ResultSection heading={t("beforehand", lang)} icon={CalendarClock}>
              <ActionList items={plan.before} lang={lang} numbered />
            </ResultSection>
          ) : (
            <PendingBlocks />
          )}

          {plan?.during?.length ? (
            <ResultSection heading={t("onTheDay", lang)} icon={ShieldCheck}>
              <ActionList items={plan.during} lang={lang} />
            </ResultSection>
          ) : null}

          {plan?.exitLine ? (
            <ResultSection heading={t("exitLine", lang)} icon={DoorOpen} tone="accent">
              <SpokenLine text={plan.exitLine} lang={lang} />
            </ResultSection>
          ) : null}

          {plan?.allyAsk ? (
            <ResultSection heading={t("askYourAlly", lang)} icon={HandHeart} tone="muted">
              <p className="text-pretty">{plan.allyAsk}</p>
            </ResultSection>
          ) : null}

          {plan?.warningSigns?.length ? (
            <ResultSection heading={t("warningSigns", lang)} icon={Eye}>
              <PlainList items={plan.warningSigns} />
            </ResultSection>
          ) : null}

          {plan?.afterwards ? (
            <ResultSection heading={t("afterwards", lang)} tone="muted">
              <p className="text-pretty">{plan.afterwards}</p>
            </ResultSection>
          ) : null}

          <Citations citations={plan?.education} lang={lang} />
        </StreamedPanel>
      ) : null}
    </div>
  );
}
