import { beforeEach, describe, expect, it } from "vitest";

import { checkRateLimit, clientKey, resetRateLimits } from "@/lib/rate-limit";

describe("rate limiter", () => {
  beforeEach(resetRateLimits);

  it("allows a normal burst and then blocks", () => {
    const now = 1_000_000;
    for (let i = 0; i < 20; i += 1) {
      expect(checkRateLimit("1.1.1.1", now).allowed, `request ${i}`).toBe(true);
    }
    const blocked = checkRateLimit("1.1.1.1", now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("lets the same client back in once the window has passed", () => {
    const now = 1_000_000;
    for (let i = 0; i < 20; i += 1) checkRateLimit("2.2.2.2", now);
    expect(checkRateLimit("2.2.2.2", now).allowed).toBe(false);
    expect(checkRateLimit("2.2.2.2", now + 60_001).allowed).toBe(true);
  });

  it("keeps clients independent", () => {
    const now = 1_000_000;
    for (let i = 0; i < 20; i += 1) checkRateLimit("3.3.3.3", now);
    expect(checkRateLimit("3.3.3.3", now).allowed).toBe(false);
    expect(checkRateLimit("4.4.4.4", now).allowed).toBe(true);
  });
});

describe("client identity", () => {
  it("prefers x-real-ip, which a client cannot set", () => {
    const request = new Request("https://kaithangu.app/api/rescue", {
      headers: {
        "x-real-ip": "198.51.100.4",
        "x-forwarded-for": "203.0.113.9, 70.41.3.18",
      },
    });
    expect(clientKey(request)).toBe("198.51.100.4");
  });

  it("falls back to the LAST hop of x-forwarded-for, not the first", () => {
    // The first entry is the end a client controls: keying on it would let
    // anyone mint a fresh bucket per request and bypass the limit entirely.
    const request = new Request("https://kaithangu.app/api/rescue", {
      headers: { "x-forwarded-for": "203.0.113.9, 70.41.3.18" },
    });
    expect(clientKey(request)).toBe("70.41.3.18");
  });

  it("falls back when no proxy header is present", () => {
    expect(clientKey(new Request("https://kaithangu.app/api/rescue"))).toBe(
      "anonymous",
    );
  });
});
