"use client";

import { Check } from "lucide-react";

import { chipText, type Chip, type Language } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface ChipGroupProps {
  legend: string;
  chips: readonly Chip[];
  selected: readonly string[];
  onChange: (next: string[]) => void;
  lang: Language;
  /** Single-select behaves like a radio group; the default is multi-select. */
  single?: boolean;
  max?: number;
}

/**
 * The primary input of the whole app.
 *
 * Implemented as real buttons in a labelled group with `aria-pressed`, so a
 * screen reader announces both the option and its state, and every target is at
 * least 44px tall for shaking hands.
 */
export function ChipGroup({
  legend,
  chips,
  selected,
  onChange,
  lang,
  single = false,
  max = 4,
}: ChipGroupProps) {
  function toggle(id: string) {
    if (single) {
      onChange(selected[0] === id ? [] : [id]);
      return;
    }
    if (selected.includes(id)) {
      onChange(selected.filter((value) => value !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-foreground mb-3 text-base font-medium">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2" role="group">
        {chips.map((chip) => {
          const isSelected = selected.includes(chip.id);
          return (
            <button
              key={chip.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggle(chip.id)}
              className={cn(
                "focus-visible:ring-ring inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2.5",
                "text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2",
                "focus-visible:outline-none",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground font-medium"
                  : "border-border bg-card text-foreground hover:bg-secondary",
              )}
            >
              {isSelected ? <Check className="size-4 shrink-0" aria-hidden /> : null}
              {chipText(chip, lang)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
