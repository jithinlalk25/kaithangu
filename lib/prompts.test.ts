import { describe, expect, it } from "vitest";

import {
  describeSelection,
  preventionPrompt,
  preventionSystemPrompt,
  rescuePrompt,
  rescueSystemPrompt,
  scriptPrompt,
  scriptSystemPrompt,
} from "@/lib/prompts";
import type { RescueRequest } from "@/lib/schemas";

const base: RescueRequest = {
  role: "person",
  lang: "en",
  situations: ["urge-hit"],
  feelings: ["lonely"],
  places: ["home"],
};

/**
 * Prompts are pure functions of validated input, which is what makes the
 * model's behaviour testable without spending a token.
 */
describe("selection description", () => {
  it("turns chip ids into readable context", () => {
    const described = describeSelection(base);
    expect(described).toContain("The urge just hit me");
    expect(described).toContain("Lonely");
    expect(described).toContain("At home");
  });

  it("ignores chip ids that are not in the catalogue", () => {
    const described = describeSelection({ ...base, feelings: ["definitely-not-real"] });
    expect(described).not.toContain("definitely-not-real");
    expect(described).toContain("The urge just hit me");
  });

  it("uses the caregiver vocabulary for caregivers", () => {
    const described = describeSelection({
      ...base,
      role: "caregiver",
      situations: ["demanding-money"],
      feelings: ["exhausted"],
      places: ["home"],
    });
    expect(described).toContain("They are demanding money");
  });

  it("degrades gracefully when the user tapped nothing", () => {
    const described = describeSelection({
      ...base,
      situations: [],
      feelings: [],
      places: [],
    });
    expect(described).toContain("panic button");
  });

  it("includes a dictated note verbatim", () => {
    const described = describeSelection({ ...base, note: "my brother just called" });
    expect(described).toContain("my brother just called");
  });
});

describe("rescue prompts", () => {
  it("always carries the safety rules and the source catalogue", () => {
    for (const role of ["person", "caregiver"] as const) {
      const system = rescueSystemPrompt(role, "en");
      expect(system).toContain("NON-NEGOTIABLE SAFETY RULES");
      expect(system).toContain("nida-science");
      expect(system).toMatch(/never diagnose/i);
    }
  });

  it("switches the whole output language", () => {
    // Asserted on the instruction, not the word: the source catalogue mentions
    // Malayalam-language helplines in both languages.
    expect(rescueSystemPrompt("person", "ml")).toContain("natural, everyday Malayalam");
    expect(rescueSystemPrompt("person", "en")).toContain("simple English");
    expect(rescueSystemPrompt("person", "en")).not.toContain(
      "natural, everyday Malayalam",
    );
  });

  it("addresses the caregiver about the person they support", () => {
    expect(rescuePrompt({ ...base, role: "caregiver" })).toContain("caregiver");
    expect(rescuePrompt(base)).toContain("this person");
  });

  it("only asks the model to read a photo when one was sent", () => {
    expect(rescuePrompt(base)).not.toContain("photo");
    expect(
      rescuePrompt({ ...base, image: "data:image/jpeg;base64,AAA=" }),
    ).toContain("photo");
  });
});

describe("script prompts", () => {
  it("expands a situation id into its full description", () => {
    const prompt = scriptPrompt({
      role: "person",
      lang: "en",
      situation: "offered-drink",
      tone: "firm",
    });
    expect(prompt).toContain("Someone is offering me a drink");
    expect(prompt).toContain("firm");
    expect(prompt).toContain("said BY the person in recovery");
  });

  it("puts the words in the caregiver's mouth in caregiver mode", () => {
    const prompt = scriptPrompt({
      role: "caregiver",
      lang: "en",
      situation: "money-boundary",
      tone: "gentle",
    });
    expect(prompt).toContain("said BY the caregiver");
  });

  it("keeps the safety rules in the script system prompt too", () => {
    expect(scriptSystemPrompt("caregiver", "ml")).toContain(
      "NON-NEGOTIABLE SAFETY RULES",
    );
  });
});

describe("prevention prompts", () => {
  it("expands the event and horizon ids", () => {
    const prompt = preventionPrompt({
      role: "person",
      lang: "en",
      event: "wedding",
      horizon: "this-week",
      worries: ["anxious"],
    });
    expect(prompt).toContain("A wedding or family function");
    expect(prompt).toContain("This week");
    expect(prompt).toContain("Anxious");
  });

  it("uses the caregiver's own upcoming events", () => {
    const prompt = preventionPrompt({
      role: "caregiver",
      lang: "en",
      event: "home-from-treatment",
      horizon: "tomorrow",
      worries: [],
    });
    expect(prompt).toContain("They are coming home from treatment");
    expect(prompt).toContain("caregiver");
  });

  it("frames prevention as planning rather than rescue", () => {
    const system = preventionSystemPrompt("person", "en");
    expect(system).toContain("prevention, not rescue");
    expect(system).toContain("NON-NEGOTIABLE SAFETY RULES");
    expect(system).toContain("high-risk-situations");
  });
});
