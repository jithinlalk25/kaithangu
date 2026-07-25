"use client";

import { ChevronDown } from "lucide-react";

import { DEMO_MODEL } from "@/lib/models";

/**
 * Deliberately shows the machinery.
 *
 * Anyone being asked to trust an AI in a medical-adjacent crisis deserves to see
 * exactly what it does with their input, what it is allowed to say, and what
 * never leaves their phone.
 */
export function HowItWorks() {
  return (
    <details className="border-border bg-card group rounded-2xl border">
      <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 focus-visible:ring-2 focus-visible:outline-none">
        <span className="text-sm font-medium">
          How Kaithangu works, and what it never does
        </span>
        <ChevronDown
          className="size-4 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>

      <div className="text-muted-foreground space-y-4 px-5 pb-5 text-sm">
        <div>
          <h4 className="text-foreground mb-1 font-medium">The pipeline</h4>
          <p className="font-mono text-xs leading-relaxed">
            tapped chips (+ optional speech / photo) → validated with zod →
            situation-specific system prompt + verified source catalogue →{" "}
            {DEMO_MODEL} with a strict JSON schema → streamed to the screen →
            every citation checked against the catalogue before it renders
          </p>
        </div>

        <div>
          <h4 className="text-foreground mb-1 font-medium">
            Guarantees, not intentions
          </h4>
          <ul className="list-inside list-disc space-y-1">
            <li>
              Helpline numbers are hard-coded and human-verified. The model
              cannot produce a phone number.
            </li>
            <li>
              The model may only cite the 14 sources in the catalogue. Invented
              citations are dropped before rendering.
            </li>
            <li>
              The system prompt forbids diagnosis, dosing advice and any
              suggestion of controlled use, and requires escalation on signs of
              overdose or unsupervised withdrawal.
            </li>
            <li>
              No account, no analytics, no server-side profile. Your anchor
              contact and saved plan stay in this browser.
            </li>
            <li>
              The Gemini key lives only on the server; the browser never sees it.
            </li>
          </ul>
        </div>

        <p className="border-border border-t pt-3 text-xs">
          Kaithangu is a support tool, not a substitute for medical care.
          Withdrawal from alcohol or sedatives can be life-threatening and needs
          a doctor.
        </p>
      </div>
    </details>
  );
}
