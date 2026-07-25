"use client";

import { ArrowLeft, Sparkles } from "lucide-react";

import { ChipGroup } from "@/components/kaithangu/chip-group";
import { PhotoInput } from "@/components/kaithangu/photo-input";
import { DictatedNote } from "@/components/kaithangu/result/spoken-line";
import { VoiceInput } from "@/components/kaithangu/voice-input";
import { Button } from "@/components/ui/button";
import { CHIPS, type Language, type Role } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

/** Everything the rescue flow collects, all of it optional. */
export interface RescueContext {
  situations: string[];
  feelings: string[];
  places: string[];
  note: string;
  image: string | undefined;
}

export const EMPTY_CONTEXT: RescueContext = {
  situations: [],
  feelings: [],
  places: [],
  note: "",
  image: undefined,
};

/**
 * The tap-only intake. Three chip groups and two optional enrichments - speech
 * and a photo - and nothing that requires a keyboard.
 */
export function RescueContextForm({
  role,
  lang,
  value,
  onChange,
  onBack,
  onSubmit,
}: {
  role: Role;
  lang: Language;
  value: RescueContext;
  onChange: (next: RescueContext) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const chips = CHIPS[role];
  const patch = (part: Partial<RescueContext>) => onChange({ ...value, ...part });

  return (
    <div className="space-y-8">
      <ChipGroup
        legend={t("whatsHappening", lang)}
        chips={chips.situations}
        selected={value.situations}
        onChange={(situations) => patch({ situations })}
        lang={lang}
      />
      <ChipGroup
        legend={t("howYouFeel", lang)}
        chips={chips.feelings}
        selected={value.feelings}
        onChange={(feelings) => patch({ feelings })}
        lang={lang}
      />
      <ChipGroup
        legend={t("whereYouAre", lang)}
        chips={chips.places}
        selected={value.places}
        onChange={(places) => patch({ places })}
        lang={lang}
        single
      />

      <div className="border-border space-y-3 rounded-2xl border border-dashed p-4">
        <p className="text-muted-foreground text-sm">{t("optionalHint", lang)}</p>
        <div className="flex flex-wrap gap-2">
          <VoiceInput
            lang={lang}
            onTranscript={(text) =>
              patch({ note: value.note ? `${value.note} ${text}` : text })
            }
          />
          <PhotoInput
            lang={lang}
            value={value.image}
            onChange={(image) => patch({ image })}
          />
        </div>
        <DictatedNote note={value.note} />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="min-h-12">
          <ArrowLeft className="size-4" aria-hidden />
          {t("back", lang)}
        </Button>
        <Button onClick={onSubmit} size="lg" className="min-h-12 flex-1">
          <Sparkles className="size-4" aria-hidden />
          {t("getHelp", lang)}
        </Button>
      </div>
    </div>
  );
}
