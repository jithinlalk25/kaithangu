/**
 * Verify every citation URL is actually reachable.
 *
 * Run: node scripts/check-links.mjs
 *
 * The whole "backed by educational resources" guarantee is worth nothing if the
 * links 404 when a user taps them. This caught two real failures: SAMHSA returns
 * 403 to requests from India, and excise.kerala.gov.in has no working HTTPS.
 * Not part of `npm test` because it needs the network; run it before shipping.
 */
import { readFileSync } from "node:fs";

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

const source = readFileSync(new URL("../lib/resources.ts", import.meta.url), "utf8");
// Entries without a url are cited by name only and have nothing to check.
const urls = [...source.matchAll(/url: "([^"]+)"/g)].map((match) => match[1]);

if (urls.length === 0) {
  console.error("No URLs found in lib/resources.ts - has the format changed?");
  process.exit(1);
}

let failed = 0;

await Promise.all(
  urls.map(async (url) => {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": BROWSER_UA, accept: "text/html" },
        signal: AbortSignal.timeout(20_000),
      });
      const ok = response.status < 400;
      if (!ok) failed += 1;
      console.log(`${ok ? "OK  " : "FAIL"} ${response.status} ${url}`);
    } catch (error) {
      failed += 1;
      console.log(`FAIL --- ${url} (${error.message})`);
    }
  }),
);

console.log(`\n${urls.length - failed}/${urls.length} reachable`);
process.exit(failed === 0 ? 0 : 1);
