"use client";

import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

/**
 * Speech input, so the user never has to type.
 *
 * Uses the browser's own SpeechRecognition - no audio is uploaded anywhere and
 * no extra API key is needed. Falls back silently: if the browser has no
 * support, the button simply does not render and the tap-only path still works.
 */

interface SpeechRecognitionAlternativeLike {
  readonly transcript: string;
}
interface SpeechRecognitionResultLike {
  readonly 0: SpeechRecognitionAlternativeLike;
  readonly isFinal: boolean;
}
interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionConstructor(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

interface VoiceInputProps {
  lang: Language;
  onTranscript: (text: string) => void;
}

export function VoiceInput({ lang, onTranscript }: VoiceInputProps) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupported(Boolean(getRecognitionConstructor()));
    return () => recognitionRef.current?.stop();
  }, []);

  function toggle() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const Recognition = getRecognitionConstructor();
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = lang === "ml" ? "ml-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        text += event.results[i]![0].transcript;
      }
      if (text.trim()) onTranscript(text.trim());
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  if (!supported) return null;

  return (
    <Button
      type="button"
      variant={listening ? "default" : "outline"}
      onClick={toggle}
      aria-pressed={listening}
      className="min-h-11"
    >
      {listening ? (
        <MicOff className="size-4" aria-hidden />
      ) : (
        <Mic className="size-4" aria-hidden />
      )}
      {listening ? t("listening", lang) : t("speak", lang)}
    </Button>
  );
}
