"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { HELPLINES } from "@/lib/resources";

/**
 * If the app itself breaks, the helplines must still be reachable.
 *
 * A blank error screen is an acceptable outcome for most products. It is not an
 * acceptable outcome here, so this boundary degrades to the one thing that
 * always works: real phone numbers.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[kaithangu] unhandled error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">Something broke on our side</h1>
        <p className="text-muted-foreground mt-2">
          Not your fault, and you do not have to wait for us. These numbers are
          free and answer right now.
        </p>
      </div>

      <ul className="space-y-2">
        {HELPLINES.filter((line) => line.crisis).map((line) => (
          <li key={line.number}>
            <a
              href={`tel:${line.number.replace(/[^0-9+]/g, "")}`}
              className="border-border bg-card hover:bg-secondary flex min-h-14 items-center justify-between rounded-xl border px-4 py-3"
            >
              <span className="text-sm font-medium">{line.name}</span>
              <span className="text-muted-foreground text-sm">{line.number}</span>
            </a>
          </li>
        ))}
      </ul>

      <Button onClick={reset} size="lg" className="min-h-12">
        Try again
      </Button>
    </main>
  );
}
