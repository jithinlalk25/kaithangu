import { describe, expect, it } from "vitest";

import { toSpokenPlan } from "@/lib/spoken-plan";

const plan = {
  headline: "You are safe right now",
  readOutLoud: "Take one slow breath.",
  steps: [
    { action: "Walk outside", why: "Distance breaks the trigger" },
    { action: "Splash cold water" },
  ],
  sayThis: "I need a minute.",
};

describe("spoken plan", () => {
  it("reads the plan in the order a listener needs it", () => {
    const segments = toSpokenPlan(plan, "en");
    expect(segments[0]!.text).toBe("You are safe right now");
    expect(segments[1]!.text).toBe("Take one slow breath.");
    expect(segments[2]!.text).toContain("Step 1.");
    expect(segments[3]!.text).toContain("Step 2.");
    expect(segments[4]!.text).toContain("I need a minute.");
  });

  it("ties each spoken step back to the step it highlights", () => {
    const segments = toSpokenPlan(plan, "en");
    expect(segments.filter((s) => s.stepIndex !== undefined).map((s) => s.stepIndex)).toEqual([
      0, 1,
    ]);
  });

  it("always ends with a closing line rather than silence", () => {
    const segments = toSpokenPlan(plan, "en");
    expect(segments.at(-1)!.text).toContain("This will pass");
  });

  it("speaks Malayalam when that is the chosen language", () => {
    const segments = toSpokenPlan(plan, "ml");
    expect(segments[2]!.text).toContain("ഘട്ടം 1.");
    expect(/[ഀ-ൿ]/.test(segments.at(-1)!.text)).toBe(true);
  });

  it("skips steps the model has not finished writing", () => {
    const segments = toSpokenPlan(
      { headline: "Hold on", steps: [{ why: "no action yet" }, { action: "Stand up" }] },
      "en",
    );
    expect(segments.filter((s) => s.stepIndex !== undefined)).toHaveLength(1);
    expect(segments.find((s) => s.stepIndex === 1)!.text).toContain("Stand up");
  });

  it("returns nothing at all for an empty plan", () => {
    expect(toSpokenPlan(undefined, "en")).toEqual([]);
    expect(toSpokenPlan({}, "en")).toEqual([]);
  });
});
