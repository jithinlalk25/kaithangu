"use client";

import { useCallback, useEffect, useState } from "react";

import type { Language } from "@/lib/catalog";
import { useHydrated } from "@/lib/use-hydrated";

/** One thing to say, optionally tied to a step so the UI can follow along. */
export interface SpokenSegment {
  readonly text: string;
  /** Index of the plan step this segment reads, if it reads one. */
  readonly stepIndex?: number;
}

/**
 * Speaks a sequence of segments and reports which one is being spoken.
 *
 * The browser's speech queue does the sequencing; this hook exists to map the
 * currently-speaking utterance back to the step it belongs to, so the screen
 * can highlight it. That is what makes the plan followable without reading.
 */
export function useSpeechQueue(lang: Language) {
  const [activeSegment, setActiveSegment] = useState<SpokenSegment | null>(null);
  const hydrated = useHydrated();
  const supported = hydrated && "speechSynthesis" in window;

  // Never leave the page talking after the component unmounts.
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setActiveSegment(null);
  }, []);

  const speak = useCallback(
    (segments: readonly SpokenSegment[]) => {
      if (!supported || segments.length === 0) return;
      window.speechSynthesis.cancel();

      segments.forEach((segment, index) => {
        const utterance = new SpeechSynthesisUtterance(segment.text);
        utterance.lang = lang === "ml" ? "ml-IN" : "en-IN";
        // Slower than the read-aloud button: this is being followed, not skimmed.
        utterance.rate = 0.9;
        utterance.onstart = () => setActiveSegment(segment);
        utterance.onerror = () => setActiveSegment(null);
        if (index === segments.length - 1) {
          utterance.onend = () => setActiveSegment(null);
        }
        window.speechSynthesis.speak(utterance);
      });
    },
    [lang, supported],
  );

  return {
    speak,
    stop,
    supported,
    activeSegment,
    speaking: activeSegment !== null,
  };
}
