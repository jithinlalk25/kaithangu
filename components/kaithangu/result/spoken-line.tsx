"use client";

import { SpeakButton } from "@/components/kaithangu/speak-button";
import type { Language } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * A line meant to leave the screen and be said out loud, with a button to hear
 * it first. Set large and loose on purpose: this is the text a user reads while
 * their hands are shaking.
 */
export function SpokenLine({
  text,
  lang,
  quoted = true,
  className,
}: {
  text: string | undefined;
  lang: Language;
  quoted?: boolean;
  className?: string;
}) {
  if (!text) return null;

  return (
    <div className={className}>
      <p className={cn("text-lg leading-relaxed text-pretty")}>
        {quoted ? `“${text}”` : text}
      </p>
      <div className="mt-3">
        <SpeakButton text={text} lang={lang} />
      </div>
    </div>
  );
}

/** The dictated note echoed back, so the user can see they were heard. */
export function DictatedNote({ note }: { note: string }) {
  if (!note) return null;

  return (
    <p className="bg-secondary text-secondary-foreground rounded-lg p-3 text-sm italic">
      “{note}”
    </p>
  );
}
