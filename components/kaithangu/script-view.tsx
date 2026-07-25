"use client";

import { useObject } from "@ai-sdk/react";
import { DoorOpen, MessagesSquare, Quote, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ChipGroup } from "@/components/kaithangu/chip-group";
import { Citations } from "@/components/kaithangu/citations";
import { SpeakButton } from "@/components/kaithangu/speak-button";
import { VoiceInput } from "@/components/kaithangu/voice-input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CHIPS, TONES, type Language, type Role } from "@/lib/catalog";
import { scriptSchema } from "@/lib/schemas";
import { t } from "@/lib/ui-text";

/**
 * Personalised emergency scripts: the exact words to say, in both languages.
 *
 * Knowing what to do is not the hard part in these situations - knowing what to
 * say, out loud, to a specific person who will push back, is.
 */
export function ScriptView({ role, lang }: { role: Role; lang: Language }) {
  const [situation, setSituation] = useState<string[]>([]);
  const [tone, setTone] = useState<string[]>(["firm"]);
  const [note, setNote] = useState("");

  const { object, submit, isLoading, clear } = useObject({
    api: "/api/script",
    schema: scriptSchema,
    onError: () => toast.error("Could not write the script. Please try again."),
  });

  const chips = CHIPS[role];
  const script = object;

  function generate() {
    if (!situation[0]) {
      toast.error("Pick the situation first.");
      return;
    }
    submit({
      role,
      lang,
      situation: situation[0],
      tone: tone[0] ?? "firm",
      note: note.trim() || undefined,
    });
  }

  const spokenScript = script?.lines
    ?.map((line) => (lang === "ml" ? line?.ml : line?.en))
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-8">
      <ChipGroup
        legend={t("situation", lang)}
        chips={chips.scriptSituations}
        selected={situation}
        onChange={(next) => {
          setSituation(next);
          clear();
        }}
        lang={lang}
        single
      />
      <ChipGroup
        legend={t("tone", lang)}
        chips={TONES}
        selected={tone}
        onChange={setTone}
        lang={lang}
        single
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
          {t("makeScript", lang)}
        </Button>
      </div>
      {note ? (
        <p className="bg-secondary text-secondary-foreground rounded-lg p-3 text-sm italic">
          “{note}”
        </p>
      ) : null}

      {isLoading || script ? (
        <div aria-live="polite" aria-busy={isLoading} className="space-y-6">
          {script?.title ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-balance">{script.title}</h2>
              <SpeakButton text={spokenScript} lang={lang} />
            </div>
          ) : (
            <Skeleton className="h-8 w-2/3" />
          )}

          {script?.setup ? (
            <p className="text-muted-foreground text-sm">{script.setup}</p>
          ) : null}

          {script?.lines?.length ? (
            <section aria-labelledby="lines-heading" className="space-y-3">
              <h3
                id="lines-heading"
                className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
              >
                <Quote className="size-4" aria-hidden />
                Say this, in order
              </h3>
              <ol className="space-y-3">
                {script.lines.filter(Boolean).map((line, index) => (
                  <li
                    key={index}
                    className="border-primary/30 bg-primary/5 rounded-2xl border p-4"
                  >
                    <p className="text-lg leading-relaxed text-pretty">“{line?.en}”</p>
                    {line?.ml ? (
                      <p
                        lang="ml"
                        className="text-muted-foreground mt-2 text-base leading-relaxed"
                      >
                        “{line.ml}”
                      </p>
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

          {script?.ifTheyPush?.length ? (
            <section aria-labelledby="push-heading" className="space-y-3">
              <h3
                id="push-heading"
                className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
              >
                <MessagesSquare className="size-4" aria-hidden />
                {t("ifTheyPush", lang)}
              </h3>
              <ul className="space-y-3">
                {script.ifTheyPush.filter(Boolean).map((exchange, index) => (
                  <li
                    key={index}
                    className="border-border bg-card space-y-2 rounded-2xl border p-4"
                  >
                    <p className="text-muted-foreground text-sm">
                      They say: “{exchange?.theySay}”
                    </p>
                    <p className="font-medium text-pretty">
                      You say: “{exchange?.youSay}”
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {script?.exitPlan?.length ? (
            <section aria-labelledby="exit-heading" className="space-y-2">
              <h3
                id="exit-heading"
                className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
              >
                <DoorOpen className="size-4" aria-hidden />
                {t("exitPlan", lang)}
              </h3>
              <ol className="space-y-2">
                {script.exitPlan.filter(Boolean).map((step, index) => (
                  <li
                    key={index}
                    className="border-border rounded-xl border px-4 py-3 text-sm"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {script?.afterwards ? (
            <section className="bg-secondary/60 rounded-2xl p-4">
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold tracking-wide uppercase">
                {t("afterwards", lang)}
              </h3>
              <p className="text-pretty">{script.afterwards}</p>
            </section>
          ) : null}

          <Citations citations={script?.education} lang={lang} />
        </div>
      ) : null}
    </div>
  );
}
