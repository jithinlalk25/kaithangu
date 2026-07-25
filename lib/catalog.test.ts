import { describe, expect, it } from "vitest";

import { CHIPS, HORIZONS, TONES, chipText, labelsFor } from "@/lib/catalog";

/**
 * The chip catalogue is the app's entire input vocabulary and its only
 * localisation surface for that input. A missing translation or a duplicate id
 * is silent at runtime, so it is caught here instead.
 */
const ROLES = ["person", "caregiver"] as const;
const GROUPS = ["situations", "feelings", "places", "scriptSituations", "upcoming"] as const;

describe("chip catalogue", () => {
  it("gives every chip an English and a Malayalam label", () => {
    for (const role of ROLES) {
      for (const group of GROUPS) {
        for (const chip of CHIPS[role][group]) {
          expect(chip.en.trim(), `${role}.${group}.${chip.id}`).not.toBe("");
          expect(chip.ml.trim(), `${role}.${group}.${chip.id}`).not.toBe("");
          // A Malayalam label that is still Latin script is an untranslated stub.
          expect(/[ഀ-ൿ]/.test(chip.ml), `${role}.${group}.${chip.id}`).toBe(
            true,
          );
        }
      }
    }
  });

  it("keeps ids unique within every group", () => {
    for (const role of ROLES) {
      for (const group of GROUPS) {
        const ids = CHIPS[role][group].map((chip) => chip.id);
        expect(new Set(ids).size, `${role}.${group}`).toBe(ids.length);
      }
    }
  });

  it("gives both roles the same set of groups, so no flow is role-specific", () => {
    for (const group of GROUPS) {
      expect(CHIPS.person[group].length).toBeGreaterThan(0);
      expect(CHIPS.caregiver[group].length).toBeGreaterThan(0);
    }
  });

  it("keeps the two roles' vocabularies genuinely different", () => {
    const personIds = CHIPS.person.situations.map((chip) => chip.id);
    const caregiverIds = CHIPS.caregiver.situations.map((chip) => chip.id);
    expect(personIds.some((id) => caregiverIds.includes(id))).toBe(false);
  });

  it("translates shared chip sets too", () => {
    for (const chip of [...TONES, ...HORIZONS]) {
      expect(/[ഀ-ൿ]/.test(chip.ml), chip.id).toBe(true);
    }
  });
});

describe("chip helpers", () => {
  it("returns the label for the selected language", () => {
    const chip = CHIPS.person.feelings[0]!;
    expect(chipText(chip, "en")).toBe(chip.en);
    expect(chipText(chip, "ml")).toBe(chip.ml);
  });

  it("silently drops ids that are not in the group", () => {
    expect(labelsFor(CHIPS.person.feelings, ["angry", "not-a-chip"])).toEqual(["Angry"]);
  });
});
