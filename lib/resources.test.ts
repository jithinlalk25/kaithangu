import { describe, expect, it } from "vitest";

import {
  findResource,
  HELPLINES,
  RESOURCES,
  resolveCitations,
  resourceCatalogueForPrompt,
} from "@/lib/resources";

/**
 * These tests guard the app's core safety property: a citation the model
 * invented must never reach a user. If this file goes red, the "backed by
 * educational resources" claim in the README has become false.
 */
describe("citation resolution", () => {
  it("drops sources that are not in the catalogue", () => {
    const resolved = resolveCitations([
      { sourceId: "nida-science", point: "Relapse is part of the illness." },
      { sourceId: "harvard-study-2024", point: "A confident-sounding invention." },
      { sourceId: "https://example.com/made-up", point: "A fabricated link." },
    ]);

    expect(resolved).toHaveLength(1);
    expect(resolved[0]!.resource.id).toBe("nida-science");
  });

  it("drops citations with no accompanying point", () => {
    expect(resolveCitations([{ sourceId: "nida-science" }])).toHaveLength(0);
  });

  it("de-duplicates a source the model cited twice", () => {
    const resolved = resolveCitations([
      { sourceId: "urge-surfing", point: "Cravings peak and fall." },
      { sourceId: "urge-surfing", point: "Cravings peak and fall." },
    ]);
    expect(resolved).toHaveLength(1);
  });

  it("handles a missing or partial stream without throwing", () => {
    expect(resolveCitations(undefined)).toEqual([]);
    expect(resolveCitations([{ point: "No id yet, still streaming." }])).toEqual([]);
  });

  it("returns undefined for an unknown id", () => {
    expect(findResource("not-a-real-id")).toBeUndefined();
    expect(findResource(undefined)).toBeUndefined();
  });
});

describe("resource catalogue", () => {
  it("has unique ids", () => {
    const ids = RESOURCES.map((resource) => resource.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every resource an organisation, and https when it has a url at all", () => {
    for (const resource of RESOURCES) {
      expect(resource.org.length, resource.id).toBeGreaterThan(0);
      expect(resource.title.length, resource.id).toBeGreaterThan(0);
      if (resource.url) {
        // Never http: a dead or downgraded link would break the very guarantee
        // this catalogue exists to make. `scripts/check-links.mjs` checks they resolve.
        expect(resource.url.startsWith("https://"), resource.id).toBe(true);
      }
    }
  });

  it("shows caregivers their own sources and hides person-only ones", () => {
    const forCaregiver = resourceCatalogueForPrompt("caregiver");
    expect(forCaregiver).toContain("family-boundaries");
    expect(forCaregiver).not.toContain("na-india");

    const forPerson = resourceCatalogueForPrompt("person");
    expect(forPerson).toContain("na-india");
    expect(forPerson).not.toContain("family-boundaries");
  });

  it("lists every citable id in the prompt catalogue", () => {
    const catalogue =
      resourceCatalogueForPrompt("person") + resourceCatalogueForPrompt("caregiver");
    for (const resource of RESOURCES) {
      expect(catalogue, resource.id).toContain(resource.id);
    }
  });
});

describe("helplines", () => {
  it("are dialable digits, never model output", () => {
    for (const line of HELPLINES) {
      expect(line.number.replace(/[^0-9+]/g, "").length).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes emergency services in the crisis subset", () => {
    const crisis = HELPLINES.filter((line) => line.crisis);
    expect(crisis.map((line) => line.number)).toContain("112");
  });
});
