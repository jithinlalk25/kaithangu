"use client";

import { Phone } from "lucide-react";

import type { Language } from "@/lib/catalog";
import { HELPLINES } from "@/lib/resources";
import { t } from "@/lib/ui-text";
import { cn } from "@/lib/utils";

/**
 * Real, dialable numbers - never generated.
 *
 * A model that invents a helpline number in a crisis app is the worst possible
 * failure mode, so these live in a hand-verified constant and are rendered as
 * `tel:` links that open the dialler with one tap.
 */
export function Helplines({
  lang,
  crisisOnly = false,
}: {
  lang: Language;
  crisisOnly?: boolean;
}) {
  const lines = crisisOnly ? HELPLINES.filter((line) => line.crisis) : HELPLINES;

  return (
    <section aria-labelledby="helplines-heading" className="space-y-3">
      <h3
        id="helplines-heading"
        className="text-muted-foreground text-sm font-semibold tracking-wide uppercase"
      >
        {t("helplines", lang)}
      </h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {lines.map((line) => (
          <li key={line.number}>
            <a
              href={`tel:${line.number.replace(/[^0-9+]/g, "")}`}
              className={cn(
                "border-border bg-card hover:bg-secondary focus-visible:ring-ring flex min-h-14 items-center gap-3",
                "rounded-xl border px-4 py-3 transition-colors focus-visible:ring-2",
                "focus-visible:ring-offset-2 focus-visible:outline-none",
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  line.crisis
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary",
                )}
              >
                <Phone className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {line.name[lang]}
                </span>
                <span className="text-muted-foreground block truncate text-xs">
                  {line.number} · {line.detail[lang]}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
