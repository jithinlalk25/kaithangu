"use client";

import { useObject } from "@ai-sdk/react";
import { CalendarClock, DoorOpen, Eye, HandHeart, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ChipGroup } from "@/components/kaithangu/chip-group";
import { Citations } from "@/components/kaithangu/citations";
import { SpeakButton } from "@/components/kaithangu/speak-button";
import { VoiceInput } from "@/components/kaithangu/voice-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

  const { object, submit, isLoading, clear } = useObject({
    api: "/api/prevent",
    schema: preventionSchema,
    onError: () => toast.error("Could not build the plan. Please try again."),
  });

  const chips = CHIPS[role];
  const plan = object;

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

      <div className="flex flex-wrap items-center gap-3">
        <VoiceInput
          lang={lang}
          onTranscript={(text) =>
            setNote((current) => (current ? `${current} ${text}` : text))
          }
        />
        <Button onClick={generate} size="lg" className="min-h-12 flex-1">
          <Sparkles className="size-4" aria-hidden />
          {t("makePlan", lang)}
        </Button>
      </div>
      {note ? (
        <p className="bg-secondary text-secondary-foreground rounded-lg p-3 text-sm italic">
          “{note}”
        </p>
      ) : null}

      {isLoading || plan ? (
        <div aria-live="polite" aria-busy={isLoading} className="space-y-6">
          {plan?.title ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-balance">{plan.title}</h2>
              {plan.riskLevel ? (
                <Badge variant={plan.riskLevel === "high" ? "destructive" : "secondary"}>
                  {plan.riskLevel} risk
                </Badge>
              ) : null}
            </div>
          ) : (
            <Skeleton className="h-8 w-2/3" />
          )}

          {plan?.riskReason ? (
            <p className="text-muted-foreground text-pretty">{plan.riskReason}</p>
          ) : null}

          {plan?.before?.length ? (
            <section aria-labelledby="before-heading" className="space-y-3">
              <h3
                id="before-heading"
                className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
              >
                <CalendarClock className="size-4" aria-hidden />
                {t("beforehand", lang)}
              </h3>
              <ol className="space-y-3">
                {plan.before.filter(Boolean).map((step, index) => (
                  <li
                    key={index}
                    className="border-border bg-card rounded-2xl border p-4"
                  >
                    {step?.when ? (
                      <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                        {step.when}
                      </p>
                    ) : null}
                    <p className="mt-1 font-medium text-pretty">{step?.action}</p>
                    {step?.why ? (
                      <p className="text-muted-foreground mt-1 text-sm">{step.why}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {plan?.during?.length ? (
            <section aria-labelledby="during-heading" className="space-y-3">
              <h3
                id="during-heading"
                className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
              >
                <ShieldCheck className="size-4" aria-hidden />
                {t("onTheDay", lang)}
              </h3>
              <ul className="space-y-3">
                {plan.during.filter(Boolean).map((step, index) => (
                  <li
                    key={index}
                    className="border-border bg-card rounded-2xl border p-4"
                  >
                    <p className="font-medium text-pretty">{step?.action}</p>
                    {step?.why ? (
                      <p className="text-muted-foreground mt-1 text-sm">{step.why}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {plan?.exitLine ? (
            <section className="border-primary/30 bg-primary/5 rounded-2xl border p-4">
              <h3 className="text-primary mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
                <DoorOpen className="size-4" aria-hidden />
                {t("exitLine", lang)}
              </h3>
              <p className="text-lg leading-relaxed text-pretty">“{plan.exitLine}”</p>
              <div className="mt-3">
                <SpeakButton text={plan.exitLine} lang={lang} />
              </div>
            </section>
          ) : null}

          {plan?.allyAsk ? (
            <section className="bg-secondary/60 rounded-2xl p-4">
              <h3 className="text-muted-foreground mb-1 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
                <HandHeart className="size-4" aria-hidden />
                {t("askYourAlly", lang)}
              </h3>
              <p className="text-pretty">{plan.allyAsk}</p>
            </section>
          ) : null}

          {plan?.warningSigns?.length ? (
            <section aria-labelledby="signs-heading" className="space-y-2">
              <h3
                id="signs-heading"
                className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
              >
                <Eye className="size-4" aria-hidden />
                {t("warningSigns", lang)}
              </h3>
              <ul className="space-y-2">
                {plan.warningSigns.filter(Boolean).map((sign, index) => (
                  <li
                    key={index}
                    className="border-border rounded-xl border border-dashed px-4 py-3 text-sm"
                  >
                    {sign}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {plan?.afterwards ? (
            <section className="bg-secondary/60 rounded-2xl p-4">
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold tracking-wide uppercase">
                {t("afterwards", lang)}
              </h3>
              <p className="text-pretty">{plan.afterwards}</p>
            </section>
          ) : null}

          <Citations citations={plan?.education} lang={lang} />
        </div>
      ) : null}
    </div>
  );
}
