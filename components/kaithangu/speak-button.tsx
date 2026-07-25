"use client";

import { Square, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

/**
 * Read the plan out loud.
 *
 * Reading is a cognitive task, and this app exists for the moments when that
 * capacity is gone. Speech synthesis is built into the browser, so this costs
 * nothing and works offline once the page is loaded.
 */
export function SpeakButton({
  text,
  lang,
}: {
  text: string | undefined;
  lang: Language;
}) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => window.speechSynthesis?.cancel();
  }, []);

  if (!supported || !text) return null;

  function toggle() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "ml" ? "ml-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={toggle}
      aria-pressed={speaking}
      className="min-h-11"
    >
      {speaking ? (
        <Square className="size-4" aria-hidden />
      ) : (
        <Volume2 className="size-4" aria-hidden />
      )}
      {speaking ? t("stopReading", lang) : t("readAloud", lang)}
    </Button>
  );
}
