"use client";

import type { LucideIcon } from "lucide-react";
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A labelled block of a generated result.
 *
 * All three flows render the same shape - an uppercase heading, an optional
 * icon, and a body - so it lives here once. The heading id is generated and
 * wired to `aria-labelledby`, which is the part that is easy to get wrong when
 * the markup is copy-pasted into a fourth place.
 */
export function ResultSection({
  heading,
  icon: Icon,
  tone = "plain",
  children,
}: {
  heading: string;
  icon?: LucideIcon;
  /** `accent` tints the block; reserved for the line the user must say. */
  tone?: "plain" | "accent" | "muted";
  children: ReactNode;
}) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "space-y-3",
        tone === "accent" && "border-primary/30 bg-primary/5 rounded-2xl border p-4",
        tone === "muted" && "bg-secondary/60 rounded-2xl p-4",
      )}
    >
      <h3
        id={headingId}
        className={cn(
          "flex items-center gap-2 text-sm font-semibold tracking-wide uppercase",
          tone === "accent" ? "text-primary" : "text-muted-foreground",
        )}
      >
        {Icon ? <Icon className="size-4" aria-hidden /> : null}
        {heading}
      </h3>
      {children}
    </section>
  );
}
