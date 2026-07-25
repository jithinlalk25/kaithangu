"use client";

import { useObject } from "@ai-sdk/react";
import { Clock, Sparkles, Target, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { Citations } from "@/components/kaithangu/citations";
import { ResultSection } from "@/components/kaithangu/result/result-section";
import {
  PendingBlocks,
  StreamedPanel,
} from "@/components/kaithangu/result/streamed-panel";
import { Button } from "@/components/ui/button";
import type { Language, Role } from "@/lib/catalog";
import {
  describeEntryTime,
  entriesForRole,
  HISTORY_KEY,
  MIN_ENTRIES_FOR_PATTERNS,
  type HistoryEntry,
} from "@/lib/history";
import { patternsSchema } from "@/lib/schemas";
import { t } from "@/lib/ui-text";
import { useLocalStorage } from "@/lib/use-local-storage";

const NO_HISTORY: HistoryEntry[] = [];

/**
 * The reflective half of the app.
 *
 * Every other flow answers "what do I do now". This one answers "why does this
 * keep happening", which is the question that actually changes behaviour - and
 * it can only be answered from the user's own record, on their own device.
 */
export function PatternsView({ role, lang }: { role: Role; lang: Language }) {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    HISTORY_KEY,
    NO_HISTORY,
  );

  const { object: insight, submit, isLoading, clear } = useObject({
    api: "/api/patterns",
    schema: patternsSchema,
    onError: () => toast.error("Could not read your history. Please try again."),
  });

  const mine = entriesForRole(history, role);
  const enough = mine.length >= MIN_ENTRIES_FOR_PATTERNS;

  function analyse() {
    submit({
      role,
      lang,
      entries: mine.map((entry) => ({
        when: describeEntryTime(entry.at),
        situations: entry.situations,
        feelings: entry.feelings,
        places: entry.places,
        urgency: entry.urgency,
      })),
    });
  }

  function forget() {
    setHistory(history.filter((entry) => entry.role !== role));
    clear();
    toast.success("History deleted from this device.");
  }

  return (
    <section aria-labelledby="patterns-heading" className="space-y-4">
      <div>
        <h3
          id="patterns-heading"
          className="flex items-center gap-2 text-base font-medium"
        >
          <TrendingUp className="text-primary size-5" aria-hidden />
          {t("patterns", lang)}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm text-pretty">
          {t("patternsHint", lang)}
        </p>
      </div>

      {enough ? (
        <>
          <p className="text-muted-foreground text-sm tabular-nums">
            {mine.length} {t("timesAsked", lang)}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={analyse} size="lg" className="min-h-12 flex-1">
              <Sparkles className="size-4" aria-hidden />
              {t("findPatterns", lang)}
            </Button>
            <Button variant="ghost" onClick={forget} className="min-h-12">
              <Trash2 className="size-4" aria-hidden />
              {t("clearHistory", lang)}
            </Button>
          </div>
        </>
      ) : (
        <p className="border-border text-muted-foreground rounded-xl border border-dashed p-4 text-sm">
          {t("needMoreHistory", lang)}
        </p>
      )}

      {isLoading || insight ? (
        <StreamedPanel isLoading={isLoading}>
          {insight?.summary ? (
            <p className="bg-secondary/60 rounded-2xl p-4 text-lg leading-relaxed text-pretty">
              {insight.summary}
            </p>
          ) : (
            <PendingBlocks count={1} />
          )}

          {insight?.patterns?.length ? (
            <ResultSection heading={t("patterns", lang)} icon={TrendingUp}>
              <ul className="space-y-3">
                {insight.patterns.filter(Boolean).map((item, index) => (
                  <li
                    key={index}
                    className="border-border bg-card rounded-2xl border p-4"
                  >
                    <p className="font-medium text-pretty">{item?.pattern}</p>
                    {item?.evidence ? (
                      <p className="text-primary mt-1 text-sm font-semibold">
                        {item.evidence}
                      </p>
                    ) : null}
                    {item?.why ? (
                      <p className="text-muted-foreground mt-1 text-sm">{item.why}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </ResultSection>
          ) : null}

          {insight?.riskWindow ? (
            <ResultSection heading={t("riskWindow", lang)} icon={Clock} tone="muted">
              <p className="text-pretty">{insight.riskWindow}</p>
            </ResultSection>
          ) : null}

          {insight?.oneAction ? (
            <ResultSection heading={t("oneAction", lang)} icon={Target} tone="accent">
              <p className="text-lg leading-relaxed text-pretty">{insight.oneAction}</p>
            </ResultSection>
          ) : null}

          <Citations citations={insight?.education} lang={lang} />
        </StreamedPanel>
      ) : null}
    </section>
  );
}
