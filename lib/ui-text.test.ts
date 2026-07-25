import { describe, expect, it } from "vitest";

import { levelLabel, secondsLabel, t } from "@/lib/ui-text";

describe("interface copy", () => {
  it("returns Malayalam script for the Malayalam locale", () => {
    expect(/[ഀ-ൿ]/.test(t("panic", "ml"))).toBe(true);
    expect(t("panic", "en")).toBe("I need help right now");
  });

  it("never returns an empty string for either language", () => {
    for (const key of ["tagline", "rescue", "scripts", "prevent", "toolkit"] as const) {
      expect(t(key, "en").trim()).not.toBe("");
      expect(t(key, "ml").trim()).not.toBe("");
    }
  });
});

describe("model enum labels", () => {
  it("translates the levels the model can return", () => {
    expect(levelLabel("high", "en")).toBe("high risk");
    expect(/[ഀ-ൿ]/.test(levelLabel("high", "ml"))).toBe(true);
  });

  it("falls back to the raw value if the model invents a level", () => {
    expect(levelLabel("catastrophic", "en")).toBe("catastrophic");
  });

  it("renders nothing for a level that has not streamed in yet", () => {
    expect(levelLabel(undefined, "en")).toBe("");
  });
});

describe("duration labels", () => {
  it("rounds and localises", () => {
    expect(secondsLabel(30.4, "en")).toBe("about 30 seconds");
    expect(/[ഀ-ൿ]/.test(secondsLabel(30, "ml"))).toBe(true);
  });
});
