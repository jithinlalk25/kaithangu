import type { MetadataRoute } from "next";

/**
 * Installable as a PWA. This matters for the actual use case: the moment a
 * craving hits is not the moment to search for a website, so Kaithangu should
 * sit on the home screen next to the phone dialler.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kaithangu — a hand to hold, right now",
    short_name: "Kaithangu",
    description:
      "Zero-typing recovery support for people with substance use disorders and their caregivers.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f3",
    theme_color: "#0f4f4a",
    categories: ["health", "medical", "lifestyle"],
  };
}
