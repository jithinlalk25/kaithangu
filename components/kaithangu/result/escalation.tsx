"use client";

import { AlertTriangle } from "lucide-react";

import { Helplines } from "@/components/kaithangu/helplines";
import type { Language } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

/**
 * The one thing that must never arrive late or land below the fold.
 *
 * Rendered at the very top of every flow that can meet a live crisis, with the
 * emergency numbers immediately underneath rather than at the bottom of the
 * plan. `escalate` is the first field in each schema, so this appears while the
 * rest of the answer is still streaming.
 */
export function EscalationAlert({
  escalate,
  reason,
  lang,
}: {
  escalate: boolean | undefined;
  reason: string | undefined;
  lang: Language;
}) {
  if (!escalate) return null;

  return (
    <div className="space-y-4">
      <div
        role="alert"
        className="border-destructive/40 bg-destructive/10 flex gap-3 rounded-2xl border p-4"
      >
        <AlertTriangle
          className="text-destructive mt-0.5 size-5 shrink-0"
          aria-hidden
        />
        <div>
          <p className="text-destructive font-semibold">{t("needsMore", lang)}</p>
          {reason ? <p className="text-sm">{reason}</p> : null}
        </div>
      </div>
      <Helplines lang={lang} crisisOnly />
    </div>
  );
}
