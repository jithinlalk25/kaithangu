"use client";

import { Pause, Play, Waves } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

const INHALE_SECONDS = 4;
const HOLD_SECONDS = 2;
const EXHALE_SECONDS = 6;
const CYCLE_SECONDS = INHALE_SECONDS + HOLD_SECONDS + EXHALE_SECONDS;

const PHASES = {
  en: { inhale: "Breathe in", hold: "Hold", exhale: "Breathe out" },
  ml: { inhale: "ശ്വാസം എടുക്കൂ", hold: "പിടിക്കൂ", exhale: "ശ്വാസം വിടൂ" },
} as const;

/** Which part of the breathing cycle a given elapsed second falls in. */
export function breathPhase(elapsedSeconds: number): "inhale" | "hold" | "exhale" {
  const inCycle = elapsedSeconds % CYCLE_SECONDS;
  if (inCycle < INHALE_SECONDS) return "inhale";
  if (inCycle < INHALE_SECONDS + HOLD_SECONDS) return "hold";
  return "exhale";
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Guided urge-surfing timer.
 *
 * The single most evidence-backed thing this app does: a craving peaks and
 * subsides, usually inside 15-30 minutes, and the job is only to stay busy
 * until it passes. The duration is set by the model from the actual situation.
 */
export function UrgeTimer({
  seconds,
  lang,
}: {
  seconds: number;
  lang: Language;
}) {
  const total = Math.min(600, Math.max(60, Math.round(seconds)));
  const [remaining, setRemaining] = useState(total);
  const [running, setRunning] = useState(false);

  // Adjust state during render when the model streams in a new duration - the
  // React-recommended alternative to resetting state from an effect.
  const [previousTotal, setPreviousTotal] = useState(total);
  if (previousTotal !== total) {
    setPreviousTotal(total);
    setRemaining(total);
  }

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = window.setInterval(
      () => setRemaining((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [running, remaining]);

  const elapsed = total - remaining;
  const phase = breathPhase(elapsed);
  const done = remaining === 0;
  const progress = total === 0 ? 0 : elapsed / total;

  return (
    <div className="border-border bg-card flex flex-col items-center gap-4 rounded-2xl border p-6">
      <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
        <Waves className="size-4" aria-hidden />
        {t("rideItOut", lang)}
      </div>

      <div
        className="relative flex size-40 items-center justify-center"
        aria-hidden
      >
        {/* Progress sweep: a conic gradient masked into a ring. */}
        <div
          className="absolute inset-0 rounded-full transition-[background] duration-1000 ease-linear"
          style={{
            background: `conic-gradient(var(--primary) ${progress * 360}deg, var(--border) 0deg)`,
            mask: "radial-gradient(circle, transparent 63%, black 64%)",
            WebkitMask: "radial-gradient(circle, transparent 63%, black 64%)",
          }}
        />
        {/* Breathing disc: expands on the in-breath, contracts on the out. */}
        <div
          className="bg-primary/10 absolute inset-3 rounded-full transition-transform duration-1000 ease-in-out"
          style={{
            transform: `scale(${running && phase === "inhale" ? 1 : running && phase === "exhale" ? 0.72 : 0.86})`,
          }}
        />
        <div className="relative text-center">
          <div className="font-mono text-3xl font-semibold tabular-nums">
            {formatClock(remaining)}
          </div>
          {running && !done ? (
            <div className="text-muted-foreground mt-1 text-sm">
              {PHASES[lang][phase]}
            </div>
          ) : null}
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {done
          ? "The timer has finished. The urge has passed its peak."
          : running
            ? `${PHASES[lang][phase]}. ${formatClock(remaining)} remaining.`
            : "Timer paused."}
      </p>

      <Button
        type="button"
        onClick={() => {
          if (done) {
            setRemaining(total);
            setRunning(true);
            return;
          }
          setRunning(!running);
        }}
        className="min-h-12 w-full"
        size="lg"
      >
        {running && !done ? (
          <Pause className="size-4" aria-hidden />
        ) : (
          <Play className="size-4" aria-hidden />
        )}
        {done ? t("goAgain", lang) : running ? t("pause", lang) : t("start", lang)}
      </Button>
    </div>
  );
}
