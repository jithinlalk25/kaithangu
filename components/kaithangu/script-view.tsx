"use client";

import { useObject } from "@ai-sdk/react";
import { DoorOpen, MessagesSquare, Quote } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ChipGroup } from "@/components/kaithangu/chip-group";
import { Citations } from "@/components/kaithangu/citations";
import { PlainList } from "@/components/kaithangu/result/action-list";
import { GenerateRow } from "@/components/kaithangu/result/generate-button";
import { ResultHeader } from "@/components/kaithangu/result/result-header";
import { ResultSection } from "@/components/kaithangu/result/result-section";
import { DictatedNote } from "@/components/kaithangu/result/spoken-line";
import {
  PendingBlocks,
  StreamedPanel,
} from "@/components/kaithangu/result/streamed-panel";
import { SpeakButton } from "@/components/kaithangu/speak-button";
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

  const { object: script, submit, isLoading, clear } = useObject({
    api: "/api/script",
    schema: scriptSchema,
    onError: () => toast.error("Could not write the script. Please try again."),
  });

  const chips = CHIPS[role];

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

  /** The whole script as one utterance, so it can be rehearsed by ear. */
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

      <GenerateRow
        label={t("makeScript", lang)}
        lang={lang}
        onGenerate={generate}
        onTranscript={(text) =>
          setNote((current) => (current ? `${current} ${text}` : text))
        }
      />
      <DictatedNote note={note} />

      {isLoading || script ? (
        <StreamedPanel isLoading={isLoading}>
          <ResultHeader title={script?.title} lang={lang}>
            <SpeakButton text={spokenScript} lang={lang} />
          </ResultHeader>

          {script?.setup ? (
            <p className="text-muted-foreground text-sm">{script.setup}</p>
          ) : null}

          {script?.lines?.length ? (
            <ResultSection heading={t("sayInOrder", lang)} icon={Quote}>
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
            </ResultSection>
          ) : (
            <PendingBlocks />
          )}

          {script?.ifTheyPush?.length ? (
            <ResultSection heading={t("ifTheyPush", lang)} icon={MessagesSquare}>
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
            </ResultSection>
          ) : null}

          {script?.exitPlan?.length ? (
            <ResultSection heading={t("exitPlan", lang)} icon={DoorOpen}>
              <PlainList items={script.exitPlan} ordered dashed={false} />
            </ResultSection>
          ) : null}

          {script?.afterwards ? (
            <ResultSection heading={t("afterwards", lang)} tone="muted">
              <p className="text-pretty">{script.afterwards}</p>
            </ResultSection>
          ) : null}

          <Citations citations={script?.education} lang={lang} />
        </StreamedPanel>
      ) : null}
    </div>
  );
}
