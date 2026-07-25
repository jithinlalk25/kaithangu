"use client";

import { ChevronDown } from "lucide-react";

import type { Language } from "@/lib/catalog";
import { DEMO_MODEL } from "@/lib/models";
import { RESOURCES } from "@/lib/resources";
import { t } from "@/lib/ui-text";

/**
 * Deliberately shows the machinery.
 *
 * Anyone being asked to trust an AI in a medical-adjacent crisis deserves to see
 * exactly what it does with their input, what it is allowed to say, and what
 * never leaves their phone.
 */
export function HowItWorks({ lang }: { lang: Language }) {
  return (
    <details className="border-border bg-card group rounded-2xl border">
      <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 focus-visible:ring-2 focus-visible:outline-none">
        <span className="text-sm font-medium">{t("howItWorks", lang)}</span>
        <ChevronDown
          className="size-4 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>

      <div className="text-muted-foreground space-y-4 px-5 pb-5 text-sm">
        <div>
          <h4 className="text-foreground mb-1 font-medium">{t("pipeline", lang)}</h4>
          <p className="font-mono text-xs leading-relaxed">
            tapped chips (+ optional speech / photo) → validated with zod →
            situation-specific system prompt + verified source catalogue →{" "}
            {DEMO_MODEL} with a strict JSON schema → streamed to the screen →
            every citation checked against the catalogue before it renders
          </p>
        </div>

        <div>
          <h4 className="text-foreground mb-1 font-medium">
            {t("guarantees", lang)}
          </h4>
          <ul className="list-inside list-disc space-y-1">
            <li>{t("guaranteeHelplines", lang)}</li>
            <li>
              {RESOURCES.length} — {t("guaranteeCitations", lang)}
            </li>
            <li>{t("guaranteeSafety", lang)}</li>
            <li>{t("guaranteePrivacy", lang)}</li>
            <li>{t("guaranteeKey", lang)}</li>
          </ul>
        </div>

        <p className="border-border border-t pt-3 text-xs">
          {t("notMedicalCare", lang)}
        </p>
      </div>
    </details>
  );
}
