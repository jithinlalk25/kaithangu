"use client";

import { Sparkles } from "lucide-react";

import { VoiceInput } from "@/components/kaithangu/voice-input";
import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/catalog";

/**
 * The "speak instead of typing, then generate" row that ends every input form.
 */
export function GenerateRow({
  label,
  lang,
  onGenerate,
  onTranscript,
}: {
  label: string;
  lang: Language;
  onGenerate: () => void;
  onTranscript: (text: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <VoiceInput lang={lang} onTranscript={onTranscript} />
      <Button onClick={onGenerate} size="lg" className="min-h-12 flex-1">
        <Sparkles className="size-4" aria-hidden />
        {label}
      </Button>
    </div>
  );
}
