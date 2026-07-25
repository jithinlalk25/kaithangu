"use client";

import { Camera, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Language } from "@/lib/catalog";
import { t } from "@/lib/ui-text";

const MAX_EDGE_PX = 1024;
const JPEG_QUALITY = 0.7;

/**
 * Downscale in the browser before upload.
 *
 * A modern phone photo is 4-8 MB; Gemini does not need more than ~1024px to read
 * a room, and shrinking first cuts both the upload time on venue wifi and the
 * image tokens billed on every call.
 */
async function toCompressedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE_PX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

interface PhotoInputProps {
  lang: Language;
  value: string | undefined;
  onChange: (dataUrl: string | undefined) => void;
}

export function PhotoInput({ lang, value, onChange }: PhotoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await toCompressedDataUrl(file));
    } catch {
      toast.error("That image could not be read. Try another photo.");
    } finally {
      setBusy(false);
    }
  }

  if (value) {
    return (
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- local data URL, never a remote asset */}
        <img
          src={value}
          alt="The situation you photographed, sent to Kaithangu for context"
          className="border-border size-16 rounded-lg border object-cover"
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => onChange(undefined)}
          className="min-h-11"
        >
          <X className="size-4" aria-hidden />
          Remove photo
        </Button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-label={t("photo", lang)}
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      <Button
        type="button"
        variant="outline"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="min-h-11"
      >
        <Camera className="size-4" aria-hidden />
        {busy ? "Reading photo…" : t("photo", lang)}
      </Button>
    </>
  );
}
