"use client";

import { useObject } from "@ai-sdk/react";
import { LifeBuoy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Helplines } from "@/components/kaithangu/helplines";
import {
  EMPTY_CONTEXT,
  RescueContextForm,
  type RescueContext,
} from "@/components/kaithangu/rescue-context-form";
import { RescuePlan } from "@/components/kaithangu/rescue-plan";
import { Button } from "@/components/ui/button";
import type { Language, Role } from "@/lib/catalog";
import { appendEntry, HISTORY_KEY, type HistoryEntry } from "@/lib/history";
import { rescueSchema } from "@/lib/schemas";
import { t } from "@/lib/ui-text";
import { useLocalStorage } from "@/lib/use-local-storage";

const NO_HISTORY: HistoryEntry[] = [];

type Stage = "idle" | "context" | "result";

/**
 * The core flow: panic button, a few taps, a streamed situation-specific plan.
 *
 * This component owns only the stage machine and the network call; the intake
 * form and the rendered plan are their own components.
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
  const [context, setContext] = useState<RescueContext>(EMPTY_CONTEXT);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    HISTORY_KEY,
    NO_HISTORY,
  );

  /** What was actually sent, so the log records the request and not later edits. */
  const submittedRef = useRef<RescueContext>(EMPTY_CONTEXT);
  /** Guards against logging the same finished plan on every re-render. */
  const loggedRef = useRef<string | null>(null);

  const { object: plan, submit, isLoading, clear } = useObject({
    api: "/api/rescue",
    schema: rescueSchema,
    onError: () =>
      toast.error(t("errGeneric", lang)),
  });

  // Log the moment, not the plan: chip ids and a timestamp, on this device only.
  // This is what "My patterns" later reads, and it never leaves until asked.
  useEffect(() => {
    if (isLoading || !plan?.headline || loggedRef.current === plan.headline) return;
    loggedRef.current = plan.headline;
    const sent = submittedRef.current;
    setHistory(
      appendEntry(history, {
        at: Date.now(),
        role,
        situations: sent.situations,
        feelings: sent.feelings,
        places: sent.places,
        urgency: plan.urgency,
      }),
    );
  }, [isLoading, plan?.headline, plan?.urgency, history, role, setHistory]);

  function generate(from: RescueContext) {
    submittedRef.current = from;
    loggedRef.current = null;
    setStage("result");
    submit({
      role,
      lang,
      situations: from.situations,
      feelings: from.feelings,
      places: from.places,
      note: from.note.trim() || undefined,
      image: from.image,
    });
  }

  function reset() {
    clear();
    setStage("idle");
    setContext(EMPTY_CONTEXT);
  }

  function savePlan() {
    if (!plan?.headline) return;
    // Headline, then the steps in order, then the line to say - the same order
    // they appear on screen, so a saved plan reads the way it was lived.
    onSavePlan(
      [
        plan.headline,
        ...(plan.steps ?? []).map((step) => step?.action),
        plan.sayThis,
      ]
        .filter(Boolean)
        .join("\n"),
    );
    toast.success(t("savedToKit", lang));
  }

  if (stage === "idle") {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => setStage("context")}
            className="h-auto w-full flex-col gap-2 rounded-3xl px-8 py-10 text-xl font-semibold shadow-lg sm:text-2xl"
          >
            <LifeBuoy className="size-9" aria-hidden />
            {t("panic", lang)}
          </Button>
          <p className="text-muted-foreground mt-3 text-sm">{t("panicHint", lang)}</p>
          {/* The last resort: no questions at all, straight to a plan. */}
          <Button
            variant="ghost"
            onClick={() => generate(EMPTY_CONTEXT)}
            className="text-muted-foreground mt-2 min-h-11 text-sm"
          >
            {t("cannotAnswer", lang)}
          </Button>
        </div>

        <Helplines lang={lang} />
      </div>
    );
  }

  if (stage === "context") {
    return (
      <RescueContextForm
        role={role}
        lang={lang}
        value={context}
        onChange={setContext}
        onBack={reset}
        onSubmit={() => generate(context)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <RescuePlan plan={plan} isLoading={isLoading} role={role} lang={lang} />

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={reset} className="min-h-12">
          {t("again", lang)}
        </Button>
        {plan?.headline && !isLoading ? (
          <Button variant="secondary" className="min-h-12" onClick={savePlan}>
            {t("savePlan", lang)}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
