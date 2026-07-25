"use client";

import { useObject } from "@ai-sdk/react";
import { AlertTriangle, ArrowLeft, Ban, LifeBuoy, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Citations } from "@/components/kaithangu/citations";
import { ChipGroup } from "@/components/kaithangu/chip-group";
import { Helplines } from "@/components/kaithangu/helplines";
import { PhotoInput } from "@/components/kaithangu/photo-input";
import { SpeakButton } from "@/components/kaithangu/speak-button";
import { UrgeTimer } from "@/components/kaithangu/urge-timer";
import { VoiceInput } from "@/components/kaithangu/voice-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CHIPS, type Language, type Role } from "@/lib/catalog";
import { rescueSchema } from "@/lib/schemas";
import { t } from "@/lib/ui-text";

type Stage = "idle" | "context" | "result";

/**
 * The core flow: panic button → a few taps → a streamed, situation-specific plan.
 *
 * Nothing here requires typing. The chips carry the whole signal; speech and a
 * photo are strictly optional enrichments.
 */
export function RescueView({
  role,
  lang,
  onSavePlan,
}: {
  role: Role;
  lang: Language;
  onSavePlan: (summary: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const [situations, setSituations] = useState<string[]>([]);
  const [feelings, setFeelings] = useState<string[]>([]);
  const [places, setPlaces] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [image, setImage] = useState<string | undefined>();

  const { object, submit, isLoading, clear } = useObject({
    api: "/api/rescue",
    schema: rescueSchema,
    onError: () =>
      toast.error("Could not reach Kaithangu. Check your connection and try again."),
  });

  const chips = CHIPS[role];

  function start(skipContext: boolean) {
    setStage(skipContext ? "result" : "context");
    if (skipContext) {
      submit({ role, lang, situations: [], feelings: [], places: [] });
    }
  }

  function generate() {
    setStage("result");
    submit({
      role,
      lang,
      situations,
      feelings,
      places,
      note: note.trim() || undefined,
      image,
    });
  }

  function reset() {
    clear();
    setStage("idle");
    setSituations([]);
    setFeelings([]);
    setPlaces([]);
    setNote("");
    setImage(undefined);
  }

  if (stage === "idle") {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => start(false)}
            className="h-auto w-full flex-col gap-2 rounded-3xl px-8 py-10 text-xl font-semibold shadow-lg sm:text-2xl"
          >
            <LifeBuoy className="size-9" aria-hidden />
            {t("panic", lang)}
          </Button>
          <p className="text-muted-foreground mt-3 text-sm">{t("panicHint", lang)}</p>
          <Button
            variant="ghost"
            onClick={() => start(true)}
            className="text-muted-foreground mt-2 min-h-11 text-sm"
          >
            I cannot answer anything — just help me
          </Button>
        </div>

        <Helplines lang={lang} />
      </div>
    );
  }

  if (stage === "context") {
    return (
      <div className="space-y-8">
        <ChipGroup
          legend={t("whatsHappening", lang)}
          chips={chips.situations}
          selected={situations}
          onChange={setSituations}
          lang={lang}
        />
        <ChipGroup
          legend={t("howYouFeel", lang)}
          chips={chips.feelings}
          selected={feelings}
          onChange={setFeelings}
          lang={lang}
        />
        <ChipGroup
          legend={t("whereYouAre", lang)}
          chips={chips.places}
          selected={places}
          onChange={setPlaces}
          lang={lang}
          single
        />

        <div className="border-border space-y-3 rounded-2xl border border-dashed p-4">
          <p className="text-muted-foreground text-sm">
            {t("optional", lang)} — say it out loud, or show Kaithangu the room.
          </p>
          <div className="flex flex-wrap gap-2">
            <VoiceInput
              lang={lang}
              onTranscript={(text) =>
                setNote((current) => (current ? `${current} ${text}` : text))
              }
            />
            <PhotoInput lang={lang} value={image} onChange={setImage} />
          </div>
          {note ? (
            <p className="bg-secondary text-secondary-foreground rounded-lg p-3 text-sm italic">
              “{note}”
            </p>
          ) : null}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={reset} className="min-h-12">
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Button>
          <Button onClick={generate} size="lg" className="min-h-12 flex-1">
            <Sparkles className="size-4" aria-hidden />
            {t("getHelp", lang)}
          </Button>
        </div>
      </div>
    );
  }

  const plan = object;

  return (
    <div className="space-y-6">
      <div
        aria-live="polite"
        aria-busy={isLoading}
        className="space-y-6"
      >
        {plan?.escalate ? (
          <div
            role="alert"
            className="border-destructive/40 bg-destructive/10 flex gap-3 rounded-2xl border p-4"
          >
            <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="text-destructive font-semibold">
                This needs more than an app right now
              </p>
              <p className="text-sm">{plan.escalateReason}</p>
            </div>
          </div>
        ) : null}

        <header className="space-y-3">
          {plan?.headline ? (
            <h2 className="text-2xl font-semibold text-balance">{plan.headline}</h2>
          ) : (
            <Skeleton className="h-8 w-3/4" />
          )}

          {plan?.urgency ? (
            <Badge variant={plan.urgency === "critical" ? "destructive" : "secondary"}>
              {plan.urgency}
            </Badge>
          ) : null}

          {plan?.readOutLoud ? (
            <div className="bg-secondary/60 rounded-2xl p-4">
              <p className="text-lg leading-relaxed text-pretty">{plan.readOutLoud}</p>
              <div className="mt-3">
                <SpeakButton text={plan.readOutLoud} lang={lang} />
              </div>
            </div>
          ) : (
            <Skeleton className="h-24 w-full" />
          )}
        </header>

        {plan?.steps?.length ? (
          <section aria-labelledby="steps-heading" className="space-y-3">
            <h3
              id="steps-heading"
              className="text-muted-foreground text-sm font-semibold tracking-wide uppercase"
            >
              {t("doThisNow", lang)}
            </h3>
            <ol className="space-y-3">
              {plan.steps.filter(Boolean).map((step, index) => (
                <li
                  key={index}
                  className="border-border bg-card flex gap-4 rounded-2xl border p-4"
                >
                  <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-pretty">{step?.action}</p>
                    {step?.why ? (
                      <p className="text-muted-foreground mt-1 text-sm">{step.why}</p>
                    ) : null}
                    {step?.seconds ? (
                      <p className="text-muted-foreground mt-1 text-xs tabular-nums">
                        about {Math.round(step.seconds)} seconds
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {plan?.sayThis ? (
          <section
            aria-labelledby="say-heading"
            className="border-primary/30 bg-primary/5 rounded-2xl border p-4"
          >
            <h3
              id="say-heading"
              className="text-primary mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
            >
              <MessageCircle className="size-4" aria-hidden />
              {t("sayThis", lang)}
            </h3>
            <p className="text-lg leading-relaxed text-pretty">“{plan.sayThis}”</p>
            <div className="mt-3">
              <SpeakButton text={plan.sayThis} lang={lang} />
            </div>
          </section>
        ) : null}

        {plan?.avoid?.length ? (
          <section aria-labelledby="avoid-heading" className="space-y-2">
            <h3
              id="avoid-heading"
              className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
            >
              <Ban className="size-4" aria-hidden />
              {t("avoid", lang)}
            </h3>
            <ul className="space-y-2">
              {plan.avoid.filter(Boolean).map((item, index) => (
                <li
                  key={index}
                  className="border-border text-muted-foreground rounded-xl border border-dashed px-4 py-3 text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {plan?.urgeTimerSeconds ? (
          <UrgeTimer seconds={plan.urgeTimerSeconds} lang={lang} />
        ) : null}

        <Citations citations={plan?.education} lang={lang} />

        {plan?.escalate ? <Helplines lang={lang} crisisOnly /> : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={reset} className="min-h-12">
          {t("again", lang)}
        </Button>
        {plan?.headline && !isLoading ? (
          <Button
            variant="secondary"
            className="min-h-12"
            onClick={() => {
              onSavePlan(
                [plan.headline, plan.sayThis, ...(plan.steps ?? []).map((s) => s?.action)]
                  .filter(Boolean)
                  .join("\n"),
              );
              toast.success("Saved to your safety kit, on this device only.");
            }}
          >
            {t("savePlan", lang)}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
