"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Language } from "@/lib/catalog";
import { levelLabel } from "@/lib/ui-text";

/**
 * Title plus an optional severity badge, with a skeleton until the model has
 * written the title. Shared so "high" always renders the same way, in the same
 * colour, in the same language, in every flow.
 */
export function ResultHeader({
  title,
  level,
  danger = false,
  children,
  lang,
}: {
  title: string | undefined;
  level?: string;
  /** Render the badge as destructive - reserved for genuine danger. */
  danger?: boolean;
  children?: ReactNode;
  lang: Language;
}) {
  if (!title) return <Skeleton className="h-8 w-2/3" />;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-2xl font-semibold text-balance">{title}</h3>
      <div className="flex items-center gap-2">
        {level ? (
          <Badge variant={danger ? "destructive" : "secondary"}>
            {levelLabel(level, lang)}
          </Badge>
        ) : null}
        {children}
      </div>
    </div>
  );
}
