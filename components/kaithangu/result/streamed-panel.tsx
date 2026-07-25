"use client";

import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Wrapper for anything the model is still writing.
 *
 * Everything inside is announced politely as it fills in rather than all at
 * once, and `aria-busy` tells a screen reader the region is still changing -
 * which matters because these results arrive a field at a time.
 */
export function StreamedPanel({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: ReactNode;
}) {
  return (
    <div aria-live="polite" aria-busy={isLoading} className="space-y-6">
      {children}
    </div>
  );
}

/** Placeholder for a block that has not streamed in yet. */
export function PendingBlocks({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-24 w-full" />
      ))}
    </div>
  );
}
