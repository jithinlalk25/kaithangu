/**
 * A local log of the moments someone reached for help.
 *
 * This is the most sensitive data the app touches, so it is deliberately the
 * least ambitious store possible: chip ids and a timestamp, capped, in this
 * browser only. No free text, no plan contents, no identifiers, nothing on a
 * server. It leaves the device only when the user explicitly asks Kaithangu to
 * look for patterns, and they can delete all of it with one button.
 */

export const HISTORY_KEY = "kaithangu.history";

/** Enough to see a pattern, few enough to stay cheap to send and to store. */
export const MAX_HISTORY_ENTRIES = 30;

export interface HistoryEntry {
  /** Epoch milliseconds - the hour of day is the most predictive field here. */
  at: number;
  role: "person" | "caregiver";
  situations: string[];
  feelings: string[];
  places: string[];
  urgency?: string;
}

/** Newest first, oldest dropped once the cap is reached. */
export function appendEntry(
  history: readonly HistoryEntry[],
  entry: HistoryEntry,
): HistoryEntry[] {
  return [entry, ...history].slice(0, MAX_HISTORY_ENTRIES);
}

/** Only entries for the role currently in use; the two are not comparable. */
export function entriesForRole(
  history: readonly HistoryEntry[],
  role: "person" | "caregiver",
): HistoryEntry[] {
  return history.filter((entry) => entry.role === role);
}

/** Below this there is nothing to find, and pretending otherwise is noise. */
export const MIN_ENTRIES_FOR_PATTERNS = 3;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Render one entry for the prompt as a weekday and hour rather than a raw
 * timestamp: "Friday 21:00" is something a model can reason about, and it
 * discloses less than an exact date would.
 */
export function describeEntryTime(at: number): string {
  const date = new Date(at);
  const hour = date.getHours().toString().padStart(2, "0");
  return `${DAYS[date.getDay()]} ${hour}:00`;
}
