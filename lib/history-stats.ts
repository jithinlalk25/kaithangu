import { CHIPS, labelsFor, type Role } from "@/lib/catalog";
import type { PatternsRequest } from "@/lib/schemas";

/**
 * Counting, done by code rather than by the model.
 *
 * Language models are unreliable at arithmetic over a list, and this is the one
 * place in Kaithangu where a number is the whole point: "4 of your last 6" is
 * only worth saying if it is true. So the counts are computed here, exactly,
 * and handed to the model as facts it must quote rather than derive. The model
 * does what it is good at - deciding which pattern matters and what to do about
 * it - and never touches the arithmetic.
 */

type Entry = PatternsRequest["entries"][number];

/** Buckets chosen for what they mean in practice, not for even spacing. */
const TIME_BANDS = [
  { label: "late night (22:00-03:59)", from: 22, to: 4 },
  { label: "morning (04:00-11:59)", from: 4, to: 12 },
  { label: "afternoon (12:00-17:59)", from: 12, to: 18 },
  { label: "evening (18:00-21:59)", from: 18, to: 22 },
] as const;

function bandFor(hour: number): string {
  for (const band of TIME_BANDS) {
    const wraps = band.from > band.to;
    const inBand = wraps
      ? hour >= band.from || hour < band.to
      : hour >= band.from && hour < band.to;
    if (inBand) return band.label;
  }
  return "unknown";
}

/** `"Friday 21:00"` → `{ day: "Friday", hour: 21 }`. */
export function parseWhen(when: string): { day: string; hour: number } | undefined {
  const match = /^([A-Za-z]+)\s+(\d{1,2}):\d{2}$/.exec(when.trim());
  if (!match) return undefined;
  const hour = Number(match[2]);
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return undefined;
  return { day: match[1]!, hour };
}

function tally(values: readonly string[]): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function line(label: string, counts: { value: string; count: number }[]): string | null {
  if (counts.length === 0) return null;
  return `${label}: ${counts.map((c) => `${c.value} ${c.count}`).join(", ")}`;
}

/**
 * The exact, pre-computed facts block injected into the patterns prompt.
 * Every number the model is allowed to state appears here.
 */
export function summariseHistory(
  entries: readonly Entry[],
  role: Role,
): string {
  const chips = CHIPS[role];
  const parsed = entries.map((entry) => parseWhen(entry.when)).filter(Boolean) as {
    day: string;
    hour: number;
  }[];

  const rows = [
    `Total entries: ${entries.length}`,
    line("By day", tally(parsed.map((p) => p.day))),
    line("By time of day", tally(parsed.map((p) => bandFor(p.hour)))),
    line(
      "Situations",
      tally(entries.flatMap((e) => labelsFor(chips.situations, e.situations))),
    ),
    line(
      "Feelings",
      tally(entries.flatMap((e) => labelsFor(chips.feelings, e.feelings))),
    ),
    line("Places", tally(entries.flatMap((e) => labelsFor(chips.places, e.places)))),
    line(
      "Urgency",
      tally(entries.map((e) => e.urgency).filter((u): u is string => Boolean(u))),
    ),
  ];

  return rows.filter(Boolean).join("\n");
}
