import { describe, expect, it } from "vitest";

import {
  appendEntry,
  describeEntryTime,
  entriesForRole,
  MAX_HISTORY_ENTRIES,
  type HistoryEntry,
} from "@/lib/history";

const entry = (over: Partial<HistoryEntry> = {}): HistoryEntry => ({
  at: 1_800_000_000_000,
  role: "person",
  situations: ["urge-hit"],
  feelings: ["lonely"],
  places: ["home"],
  ...over,
});

describe("history log", () => {
  it("keeps the newest entry first", () => {
    const history = appendEntry([entry({ at: 1 })], entry({ at: 2 }));
    expect(history.map((item) => item.at)).toEqual([2, 1]);
  });

  it("never grows past the cap", () => {
    let history: HistoryEntry[] = [];
    for (let i = 0; i < MAX_HISTORY_ENTRIES + 15; i += 1) {
      history = appendEntry(history, entry({ at: i }));
    }
    expect(history).toHaveLength(MAX_HISTORY_ENTRIES);
    // The oldest entries are the ones dropped.
    expect(history[0]!.at).toBe(MAX_HISTORY_ENTRIES + 14);
  });

  it("does not mutate the array it was given", () => {
    const original = [entry({ at: 1 })];
    appendEntry(original, entry({ at: 2 }));
    expect(original).toHaveLength(1);
  });

  it("keeps the two roles' histories apart", () => {
    const history = [
      entry({ role: "person" }),
      entry({ role: "caregiver" }),
      entry({ role: "person" }),
    ];
    expect(entriesForRole(history, "person")).toHaveLength(2);
    expect(entriesForRole(history, "caregiver")).toHaveLength(1);
  });
});

describe("entry time description", () => {
  it("reduces a timestamp to a weekday and hour", () => {
    // Local-time formatting, so assert the shape rather than a fixed zone.
    const described = describeEntryTime(new Date(2026, 6, 24, 21, 37).getTime());
    expect(described).toBe("Friday 21:00");
  });

  it("pads single-digit hours so entries sort readably", () => {
    const described = describeEntryTime(new Date(2026, 6, 25, 9, 5).getTime());
    expect(described).toBe("Saturday 09:00");
  });

  it("discloses no date, only weekday and hour", () => {
    const described = describeEntryTime(new Date(2026, 6, 25, 9, 5).getTime());
    expect(described).not.toMatch(/2026|Jul|25/);
  });
});
