"use client";

import { BookOpen, ExternalLink } from "lucide-react";

import type { Language } from "@/lib/catalog";
import { resolveCitations } from "@/lib/resources";
import { t } from "@/lib/ui-text";

/**
 * Renders only citations that resolve to a real entry in `lib/resources.ts`.
 *
 * `resolveCitations` silently drops anything the model made up, so a fabricated
 * source can never reach the screen - the user either sees a verified
 * organisation and a working link, or sees nothing at all.
 */
export function Citations({
  citations,
  lang,
}: {
  citations: readonly ({ sourceId?: string; point?: string } | undefined)[] | undefined;
  lang: Language;
}) {
  const resolved = resolveCitations(
    citations?.filter((c): c is { sourceId?: string; point?: string } => Boolean(c)),
  );
  if (resolved.length === 0) return null;

  return (
    <section aria-labelledby="citations-heading" className="space-y-3">
      <h3
        id="citations-heading"
        className="text-muted-foreground flex items-center gap-2 text-sm font-semibold tracking-wide uppercase"
      >
        <BookOpen className="size-4" aria-hidden />
        {t("whyThisWorks", lang)}
      </h3>
      <ul className="space-y-2">
        {resolved.map(({ resource, point }) => (
          <li
            key={resource.id}
            className="border-border bg-card rounded-xl border p-4 text-sm"
          >
            <p className="text-foreground">{point}</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary mt-2 inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
            >
              {resource.org}: {resource.title}
              <ExternalLink className="size-3" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
