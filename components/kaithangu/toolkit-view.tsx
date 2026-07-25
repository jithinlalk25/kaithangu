"use client";

import { BookOpen, ExternalLink, HeartHandshake, Phone } from "lucide-react";

import { Helplines } from "@/components/kaithangu/helplines";
import { HowItWorks } from "@/components/kaithangu/how-it-works";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Language } from "@/lib/catalog";
import { RESOURCES } from "@/lib/resources";
import { t } from "@/lib/ui-text";
import { useLocalStorage } from "@/lib/use-local-storage";

export interface Anchor {
  name: string;
  phone: string;
}

/** Module-level so its identity is stable across renders of the hook. */
const NO_ANCHOR: Anchor = { name: "", phone: "" };

/**
 * The always-available half of the app: the things that must work before any
 * model is called, and that keep working if every network request fails.
 */
export function ToolkitView({
  lang,
  savedPlan,
}: {
  lang: Language;
  savedPlan: string;
}) {
  const [anchor, setAnchor] = useLocalStorage<Anchor>(
    "kaithangu.anchor",
    NO_ANCHOR,
  );

  const dialable = anchor.phone.replace(/[^0-9+]/g, "");

  return (
    <div className="space-y-10">
      <section aria-labelledby="anchor-heading" className="space-y-4">
        <div>
          <h3
            id="anchor-heading"
            className="flex items-center gap-2 text-base font-medium"
          >
            <HeartHandshake className="text-primary size-5" aria-hidden />
            {t("anchor", lang)}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("anchorHint", lang)}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="anchor-name">Name</Label>
            <Input
              id="anchor-name"
              value={anchor.name}
              autoComplete="name"
              onChange={(event) =>
                setAnchor({ ...anchor, name: event.target.value })
              }
              placeholder="Amma, Rahul, my sponsor…"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="anchor-phone">Phone</Label>
            <Input
              id="anchor-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={anchor.phone}
              onChange={(event) =>
                setAnchor({ ...anchor, phone: event.target.value })
              }
              placeholder="98470 00000"
            />
          </div>
        </div>

        {dialable ? (
          <Button asChild size="lg" className="min-h-12 w-full">
            <a href={`tel:${dialable}`}>
              <Phone className="size-4" aria-hidden />
              {t("callNow", lang)} {anchor.name || dialable}
            </a>
          </Button>
        ) : null}
      </section>

      {savedPlan ? (
        <section aria-labelledby="saved-heading" className="space-y-3">
          <h3 id="saved-heading" className="text-base font-medium">
            {t("savedPlan", lang)}
          </h3>
          <pre className="border-border bg-card overflow-x-auto rounded-2xl border p-4 font-sans text-sm whitespace-pre-wrap">
            {savedPlan}
          </pre>
        </section>
      ) : null}

      <Helplines lang={lang} />

      <section aria-labelledby="library-heading" className="space-y-3">
        <h3
          id="library-heading"
          className="flex items-center gap-2 text-base font-medium"
        >
          <BookOpen className="text-primary size-5" aria-hidden />
          {t("learn", lang)}
        </h3>
        <p className="text-muted-foreground text-sm">
          The complete, human-verified library Kaithangu is allowed to cite. It
          cannot cite anything outside this list.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {RESOURCES.map((resource) => (
            <li key={resource.id}>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-card hover:bg-secondary focus-visible:ring-ring block h-full rounded-xl border p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium">{resource.title}</span>
                  <ExternalLink
                    className="text-muted-foreground mt-0.5 size-3.5 shrink-0"
                    aria-hidden
                  />
                </span>
                <span className="text-muted-foreground mt-1 block text-xs">
                  {resource.org}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <HowItWorks />
    </div>
  );
}
