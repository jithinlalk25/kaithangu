"use client";

import type { Language } from "@/lib/catalog";
import { secondsLabel } from "@/lib/ui-text";

/**
 * The one list shape every flow returns: a thing to do, why it works, and
 * optionally when to do it or how long it takes.
 *
 * Fields are all optional because these render mid-stream, before the model has
 * finished writing the object.
 */
export interface Action {
  action?: string;
  why?: string;
  when?: string;
  seconds?: number;
}

export function ActionList({
  items,
  lang,
  numbered = false,
}: {
  items: readonly (Action | undefined)[];
  lang: Language;
  /** Numbered for steps done in order; plain for a set of tactics. */
  numbered?: boolean;
}) {
  const List = numbered ? "ol" : "ul";

  return (
    <List className="space-y-3">
      {items.filter(Boolean).map((item, index) => (
        <li
          key={index}
          className="border-border bg-card flex gap-4 rounded-2xl border p-4"
        >
          {numbered ? (
            <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              {index + 1}
            </span>
          ) : null}
          <div className="min-w-0">
            {item?.when ? (
              <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                {item.when}
              </p>
            ) : null}
            <p className="font-medium text-pretty">{item?.action}</p>
            {item?.why ? (
              <p className="text-muted-foreground mt-1 text-sm">{item.why}</p>
            ) : null}
            {item?.seconds ? (
              <p className="text-muted-foreground mt-1 text-xs tabular-nums">
                {secondsLabel(item.seconds, lang)}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </List>
  );
}

/** A list of bare sentences: things to avoid, exit steps, warning signs. */
export function PlainList({
  items,
  ordered = false,
  dashed = true,
}: {
  items: readonly (string | undefined)[];
  ordered?: boolean;
  dashed?: boolean;
}) {
  const List = ordered ? "ol" : "ul";

  return (
    <List className="space-y-2">
      {items.filter(Boolean).map((item, index) => (
        <li
          key={index}
          className={
            dashed
              ? "border-border text-muted-foreground rounded-xl border border-dashed px-4 py-3 text-sm"
              : "border-border rounded-xl border px-4 py-3 text-sm"
          }
        >
          {item}
        </li>
      ))}
    </List>
  );
}
