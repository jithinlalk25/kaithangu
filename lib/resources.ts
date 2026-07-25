/**
 * Curated, human-verified knowledge base.
 *
 * WHY THIS FILE EXISTS: a generative model asked for "an educational source" will
 * happily invent a plausible-looking citation and URL. Kaithangu never lets it.
 * The model is shown this catalogue and may only cite an `id` from it; anything
 * else is discarded by `resolveCitations()` before it can reach a user.
 *
 * Every entry below was verified against the publishing organisation. Nothing here
 * is model-generated.
 */

export interface Resource {
  /** Stable citation key. The model may only emit these. */
  readonly id: string;
  readonly title: string;
  readonly org: string;
  /**
   * Omitted when the organisation has no reliably reachable page. A citation is
   * a source, not necessarily a hyperlink - shipping a dead link would break the
   * very guarantee this catalogue exists to make.
   */
  readonly url?: string;
  /** Shown to the model so it cites the *relevant* source, not just the first one. */
  readonly summary: string;
  readonly audience: "person" | "caregiver" | "both";
}

/**
 * Typed as `readonly Resource[]` rather than `as const`: some entries have no
 * url, and const-narrowing would give each literal a different shape.
 */
export const RESOURCES: readonly Resource[] = [
  {
    id: "nida-science",
    title: "Drugs, Brains, and Behavior: The Science of Addiction",
    org: "National Institute on Drug Abuse (NIDA)",
    url: "https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction",
    summary:
      "Addiction is a treatable, chronic medical condition involving changes to brain circuits. Relapse is a common part of the illness, not a moral failure or the end of recovery.",
    audience: "both",
  },
  {
    id: "urge-surfing",
    title: "Urge surfing and the time-limited nature of cravings",
    org: "Relapse Prevention model (Marlatt & Gordon)",
    url: "https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction/treatment-recovery",
    summary:
      "A craving rises, peaks and falls like a wave, usually subsiding within 15-30 minutes. Observing the urge without acting on it is more effective than trying to suppress it.",
    audience: "person",
  },
  {
    id: "high-risk-situations",
    title: "High-risk situations and trigger mapping",
    org: "Relapse Prevention model (Marlatt & Gordon)",
    url: "https://nida.nih.gov/research-topics/treatment",
    summary:
      "Most lapses happen in a small number of predictable situations: negative mood, interpersonal conflict, social pressure and celebration. Naming the situation reduces its power.",
    audience: "both",
  },
  {
    id: "who-alcohol",
    title: "Alcohol fact sheet",
    org: "World Health Organization",
    url: "https://www.who.int/news-room/fact-sheets/detail/alcohol",
    summary:
      "Global evidence on alcohol-related harm, dependence and the health benefits of reducing or stopping consumption.",
    audience: "both",
  },
  {
    id: "who-drugs",
    title: "Drugs (psychoactive) - health topic",
    org: "World Health Organization",
    url: "https://www.who.int/health-topics/drugs-psychoactive",
    summary:
      "Overview of psychoactive substance use, dependence, and evidence-based treatment approaches.",
    audience: "both",
  },
  {
    id: "who-opioid-overdose",
    title: "Opioid overdose - recognition and naloxone",
    org: "World Health Organization",
    url: "https://www.who.int/news-room/fact-sheets/detail/opioid-overdose",
    summary:
      "Overdose signs include pinpoint pupils, unconsciousness and slow or stopped breathing. It is a medical emergency; naloxone reverses opioid overdose.",
    audience: "both",
  },
  {
    id: "who-mhgap",
    title: "mhGAP Intervention Guide - substance use disorders",
    org: "World Health Organization",
    url: "https://www.who.int/teams/mental-health-and-substance-use/treatment-care/mental-health-gap-action-programme",
    summary:
      "Unsupervised withdrawal from alcohol or sedatives can cause seizures and delirium and can be fatal. Medically supervised detox is required for dependent users.",
    audience: "both",
  },
  {
    id: "recovery-basics",
    title: "Recovery: what it involves and how long it takes",
    org: "National Institute on Drug Abuse (NIDA)",
    url: "https://nida.nih.gov/research-topics/recovery",
    summary:
      "Recovery is built on health, home, purpose and community. It is a process of change, not a single event, and support networks are a core dimension of it.",
    audience: "both",
  },
  {
    id: "family-boundaries",
    title: "Supporting a family member: family involvement in care",
    org: "World Health Organization",
    url: "https://www.who.int/teams/mental-health-and-substance-use",
    summary:
      "Caregivers help most by being warm about the person and firm about the behaviour: clear boundaries, no shaming, no covering up consequences, and their own support system.",
    audience: "caregiver",
  },
  {
    id: "vimukthi",
    title: "Vimukthi - Kerala's de-addiction mission",
    org: "Kerala State Excise Department",
    url: "https://vimukthi.kerala.gov.in",
    summary:
      "Kerala's state de-addiction programme, running district de-addiction centres, counselling and the free 14405 helpline in Malayalam and English.",
    audience: "both",
  },
  {
    id: "telemanas",
    title: "Tele-MANAS national tele-mental-health service",
    org: "Ministry of Health and Family Welfare, Government of India",
    url: "https://www.mohfw.gov.in",
    summary:
      "Free 24x7 tele-mental-health counselling across India in regional languages, including Malayalam, on 14416.",
    audience: "both",
  },
  {
    id: "nimhans-cam",
    title: "Centre for Addiction Medicine",
    org: "NIMHANS, Bengaluru",
    summary:
      "India's leading centre for addiction treatment and research; outpatient, inpatient and family-therapy services for substance use disorders.",
    audience: "both",
  },
  {
    id: "na-india",
    title: "Narcotics Anonymous India",
    org: "Narcotics Anonymous",
    url: "https://naindia.in",
    summary:
      "Free peer-support fellowship with in-person and online meetings across India, including Kerala.",
    audience: "person",
  },
  {
    id: "aa-india",
    title: "Alcoholics Anonymous - General Service Office, India",
    org: "Alcoholics Anonymous",
    url: "https://www.aagsoindia.org",
    summary:
      "Free peer-support fellowship for alcohol dependence with meetings throughout India, including Malayalam-language groups in Kerala.",
    audience: "person",
  },
];

const RESOURCE_INDEX: ReadonlyMap<string, Resource> = new Map(
  RESOURCES.map((resource) => [resource.id, resource]),
);

/**
 * Real, dialable helplines. Ordered most-specific-to-Kerala first.
 *
 * Bilingual like the rest of the interface: these sit on the landing screen,
 * which is the one screen a person in crisis is guaranteed to see, so leaving
 * them in English would undo the point of the language toggle.
 */
export interface Helpline {
  readonly name: { readonly en: string; readonly ml: string };
  readonly number: string;
  readonly detail: { readonly en: string; readonly ml: string };
  /** Surfaced first when the model flags a situation as unsafe. */
  readonly crisis: boolean;
}

export const HELPLINES: readonly Helpline[] = [
  {
    name: { en: "Emergency services", ml: "അടിയന്തര സഹായം" },
    number: "112",
    detail: {
      en: "Overdose, seizure, unconsciousness or immediate danger",
      ml: "അമിത ഉപയോഗം, അപസ്മാരം, ബോധക്ഷയം അല്ലെങ്കിൽ ഉടനടി അപകടം",
    },
    crisis: true,
  },
  {
    name: { en: "Vimukthi de-addiction helpline", ml: "വിമുക്തി ലഹരിവിമുക്ത ഹെൽപ്പ് ലൈൻ" },
    number: "14405",
    detail: {
      en: "Kerala State Excise - free, Malayalam and English",
      ml: "കേരള എക്സൈസ് - സൗജന്യം, മലയാളത്തിലും ഇംഗ്ലീഷിലും",
    },
    crisis: false,
  },
  {
    name: { en: "Tele-MANAS", ml: "ടെലി-മനസ്" },
    number: "14416",
    detail: {
      en: "Govt. of India 24x7 mental health support",
      ml: "ഇന്ത്യാ ഗവൺമെന്റ് - 24x7 മാനസികാരോഗ്യ പിന്തുണ",
    },
    crisis: true,
  },
  {
    name: { en: "KIRAN mental health helpline", ml: "കിരൺ മാനസികാരോഗ്യ ഹെൽപ്പ് ലൈൻ" },
    number: "1800-599-0019",
    detail: {
      en: "Govt. of India, 13 languages, 24x7",
      ml: "ഇന്ത്യാ ഗവൺമെന്റ്, 13 ഭാഷകൾ, 24x7",
    },
    crisis: true,
  },
  {
    name: { en: "DISHA health helpline", ml: "ദിശ ആരോഗ്യ ഹെൽപ്പ് ലൈൻ" },
    number: "1056",
    detail: {
      en: "Kerala Government health information and referral",
      ml: "കേരള സർക്കാർ ആരോഗ്യ വിവരവും റഫറലും",
    },
    crisis: false,
  },
  {
    name: { en: "Vandrevala Foundation", ml: "വന്ദ്രേവാല ഫൗണ്ടേഷൻ" },
    number: "9999666555",
    detail: { en: "24x7 free counselling", ml: "24x7 സൗജന്യ കൗൺസലിംഗ്" },
    crisis: false,
  },
];

/**
 * The catalogue as the model sees it. Kept as a compact list so it costs few
 * tokens on every call while still letting the model pick a *relevant* source.
 */
export function resourceCatalogueForPrompt(
  audience: "person" | "caregiver",
): string {
  return RESOURCES.filter(
    (r) => r.audience === "both" || r.audience === audience,
  )
    .map((r) => `- ${r.id}: "${r.title}" (${r.org}) - ${r.summary}`)
    .join("\n");
}

/** Look up one citation. Returns `undefined` for anything not in the catalogue. */
export function findResource(id: string | undefined): Resource | undefined {
  return id ? RESOURCE_INDEX.get(id) : undefined;
}

/**
 * Drop every citation the model invented. This is the guard that makes
 * "backed by educational resources" true rather than merely claimed.
 */
export function resolveCitations(
  citations: readonly { sourceId?: string; point?: string }[] | undefined,
): { resource: Resource; point: string }[] {
  if (!citations) return [];
  const seen = new Set<string>();
  const resolved: { resource: Resource; point: string }[] = [];

  for (const citation of citations) {
    const resource = findResource(citation?.sourceId);
    if (!resource || !citation.point || seen.has(resource.id)) continue;
    seen.add(resource.id);
    resolved.push({ resource, point: citation.point });
  }
  return resolved;
}
