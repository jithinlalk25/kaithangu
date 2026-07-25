import { describe, expect, it } from "vitest";

import { parseWhen, summariseHistory } from "@/lib/history-stats";
import type { PatternsRequest } from "@/lib/schemas";

/**
 * These counts are the one thing in the app that must be arithmetically exact:
 * "4 of your last 6" is only worth saying if it is true. The model is forbidden
 * from deriving them, so they are pinned here instead.
 */
const entries: PatternsRequest["entries"] = [
  { when: "Friday 21:00", situations: ["others-using"], feelings: ["restless"], places: ["friends"], urgency: "rising" },
  { when: "Saturday 22:00", situations: ["celebration"], feelings: ["good"], places: ["bar"], urgency: "rising" },
  { when: "Friday 23:00", situations: ["cash-in-hand"], feelings: ["lonely"], places: ["street"], urgency: "critical" },
  { when: "Tuesday 14:00", situations: ["fight-at-home"], feelings: ["angry"], places: ["home"], urgency: "steady" },
  { when: "Friday 20:00", situations: ["others-using"], feelings: ["ashamed"], places: ["friends"], urgency: "rising" },
  { when: "Saturday 21:00", situations: ["celebration"], feelings: ["restless"], places: ["bar"], urgency: "rising" },
];

describe("when parsing", () => {
  it("reads a weekday and hour", () => {
    expect(parseWhen("Friday 21:00")).toEqual({ day: "Friday", hour: 21 });
    expect(parseWhen("Saturday 09:00")).toEqual({ day: "Saturday", hour: 9 });
  });

  it("rejects anything malformed rather than guessing", () => {
    for (const bad of ["Friday", "21:00", "Friday 25:00", "", "Friday 9"]) {
      expect(parseWhen(bad), bad).toBeUndefined();
    }
  });
});

describe("history summary", () => {
  const summary = summariseHistory(entries, "person");

  it("counts the total", () => {
    expect(summary).toContain("Total entries: 6");
  });

  it("counts days exactly", () => {
    // The real distribution is Friday 3, Saturday 2, Tuesday 1.
    expect(summary).toContain("Friday 3");
    expect(summary).toContain("Saturday 2");
    expect(summary).toContain("Tuesday 1");
  });

  it("buckets hours into meaningful bands", () => {
    // 21:00, 20:00, 21:00 → evening (3); 22:00, 23:00 → late night (2); 14:00 → afternoon (1).
    expect(summary).toContain("evening (18:00-21:59) 3");
    expect(summary).toContain("late night (22:00-03:59) 2");
    expect(summary).toContain("afternoon (12:00-17:59) 1");
  });

  it("resolves chip ids to labels and counts them", () => {
    expect(summary).toContain("People around me are using 2");
    expect(summary).toContain("At a friend's place 2");
    expect(summary).toContain("At a bar / toddy shop 2");
    expect(summary).toContain("Restless 2");
  });

  it("counts urgency, highest first", () => {
    expect(summary).toContain("rising 4");
    expect(summary).toContain("critical 1");
  });

  it("ignores unparseable timestamps instead of miscounting", () => {
    const withJunk = summariseHistory(
      [...entries, { when: "not a time", situations: [], feelings: [], places: [] }],
      "person",
    );
    expect(withJunk).toContain("Total entries: 7");
    // Day counts only include the six parseable entries.
    expect(withJunk).toContain("Friday 3");
  });

  it("uses the caregiver vocabulary for caregivers", () => {
    const caregiver = summariseHistory(
      [
        { when: "Monday 19:00", situations: ["demanding-money"], feelings: ["exhausted"], places: ["home"] },
        { when: "Monday 20:00", situations: ["demanding-money"], feelings: ["angry"], places: ["home"] },
        { when: "Sunday 12:00", situations: ["refusing-help"], feelings: ["hopeless"], places: ["home"] },
      ],
      "caregiver",
    );
    expect(caregiver).toContain("They are demanding money 2");
    expect(caregiver).toContain("At home 3");
  });
});
