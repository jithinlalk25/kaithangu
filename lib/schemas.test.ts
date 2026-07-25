import { describe, expect, it } from "vitest";

import {
  LIMITS,
  preventionRequestSchema,
  rescueRequestSchema,
  scriptRequestSchema,
} from "@/lib/schemas";

/**
 * The API boundary. Everything past this point is trusted, so everything
 * before it has to be checked.
 */
describe("rescue request validation", () => {
  const valid = {
    role: "person",
    lang: "en",
    situations: ["urge-hit"],
    feelings: ["anxious"],
    places: ["bar"],
  };

  it("accepts a well-formed request", () => {
    expect(rescueRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts the panic path with nothing selected", () => {
    const parsed = rescueRequestSchema.safeParse({ role: "person", lang: "en" });
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.situations).toEqual([]);
  });

  it("rejects an unknown role", () => {
    expect(
      rescueRequestSchema.safeParse({ ...valid, role: "administrator" }).success,
    ).toBe(false);
  });

  it("caps how many chips one group may carry", () => {
    const tooMany = Array.from({ length: LIMITS.maxChipsPerGroup + 1 }, (_, i) => `c${i}`);
    expect(rescueRequestSchema.safeParse({ ...valid, feelings: tooMany }).success).toBe(
      false,
    );
  });

  it("caps the dictated note length", () => {
    const note = "a".repeat(LIMITS.maxNoteChars + 1);
    expect(rescueRequestSchema.safeParse({ ...valid, note }).success).toBe(false);
  });

  it("accepts a base64 jpeg data url", () => {
    const image = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";
    expect(rescueRequestSchema.safeParse({ ...valid, image }).success).toBe(true);
  });

  it("rejects non-image and non-data-url payloads in the image field", () => {
    for (const image of [
      "https://example.com/photo.jpg",
      "data:text/html;base64,PHNjcmlwdD4=",
      "data:image/svg+xml;base64,PHN2Zz4=",
      "javascript:alert(1)",
    ]) {
      expect(rescueRequestSchema.safeParse({ ...valid, image }).success, image).toBe(
        false,
      );
    }
  });
});

describe("prevention request validation", () => {
  it("requires an event and a horizon", () => {
    expect(
      preventionRequestSchema.safeParse({ role: "person", lang: "en" }).success,
    ).toBe(false);
    expect(
      preventionRequestSchema.safeParse({
        role: "person",
        lang: "en",
        event: "wedding",
        horizon: "this-week",
      }).success,
    ).toBe(true);
  });

  it("caps the number of worries", () => {
    const tooMany = Array.from({ length: LIMITS.maxChipsPerGroup + 1 }, (_, i) => `w${i}`);
    expect(
      preventionRequestSchema.safeParse({
        role: "person",
        lang: "en",
        event: "wedding",
        horizon: "this-week",
        worries: tooMany,
      }).success,
    ).toBe(false);
  });
});

describe("script request validation", () => {
  it("requires a situation and a tone", () => {
    expect(
      scriptRequestSchema.safeParse({ role: "caregiver", lang: "ml" }).success,
    ).toBe(false);
    expect(
      scriptRequestSchema.safeParse({
        role: "caregiver",
        lang: "ml",
        situation: "money-boundary",
        tone: "firm",
      }).success,
    ).toBe(true);
  });

  it("rejects an oversized situation string", () => {
    expect(
      scriptRequestSchema.safeParse({
        role: "person",
        lang: "en",
        situation: "x".repeat(200),
        tone: "firm",
      }).success,
    ).toBe(false);
  });
});
