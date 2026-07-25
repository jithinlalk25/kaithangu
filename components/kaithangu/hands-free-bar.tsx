"use client";

import { Headphones, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

/**
 * Hands-free playback control.
 *
 * The whole app is built for someone who cannot type. This is for the moment
 * they cannot read either: put the phone down and be talked through the plan,
 * step by step, at a pace you can follow.
 */
export function HandsFreeBar({
  lang,
  speaking,
  onStart,
  onStop,
  disabled,
}: {
  lang: Language;
  speaking: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="border-primary/30 bg-primary/5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4">
      <div className="min-w-0">
        <p className="text-primary text-sm font-semibold">{t("handsFree", lang)}</p>
        <p className="text-muted-foreground text-sm text-pretty">
          {t("handsFreeHint", lang)}
        </p>
      </div>
      <Button
        type="button"
        size="lg"
        variant={speaking ? "secondary" : "default"}
        disabled={disabled}
        aria-pressed={speaking}
        onClick={speaking ? onStop : onStart}
        className="min-h-12"
      >
        {speaking ? (
          <Square className="size-4" aria-hidden />
        ) : (
          <Headphones className="size-4" aria-hidden />
        )}
        {speaking ? t("stopReading", lang) : t("playPlan", lang)}
      </Button>
    </div>
  );
}
