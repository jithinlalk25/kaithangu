/**
 * Manual check that an image genuinely reaches the model.
 *
 * Run: node scripts/vision-check.mjs <path-to-image>
 * Prints the model's description. If it cannot name what is in the picture,
 * the multi-modal path is broken regardless of what the UI appears to do.
 */
import { readFileSync } from "node:fs";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const path = process.argv[2];
if (!path) {
  console.error("usage: node scripts/vision-check.mjs <image>");
  process.exit(1);
}

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^"|"$/g, "");
  }
}

const data = readFileSync(path).toString("base64");

const { text } = await generateText({
  model: google(process.env.GEMINI_MODEL ?? "gemini-3.6-flash"),
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "List every object you can see in this image." },
        { type: "file", mediaType: "image/jpeg", data },
      ],
    },
  ],
});

console.log(text);
