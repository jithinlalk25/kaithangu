import type { Language } from "@/lib/catalog";

/**
 * Interface copy in both languages.
 *
 * Kaithangu is for Kerala, where the person most likely to be handed this phone
 * by a worried relative may not read English comfortably. The AI output is
 * generated in the selected language; this table covers the chrome around it.
 */
const TEXT = {
  tagline: {
    en: "A hand to hold, right now",
    ml: "ഇപ്പോൾ പിടിക്കാൻ ഒരു കൈ",
  },
  person: { en: "I am in recovery", ml: "ഞാൻ ചികിത്സയിലാണ്" },
  caregiver: { en: "I am a caregiver", ml: "ഞാൻ പരിചരിക്കുന്നയാളാണ്" },
  panic: { en: "I need help right now", ml: "എനിക്ക് ഇപ്പോൾ സഹായം വേണം" },
  panicHint: {
    en: "One tap. No typing. No sign-up.",
    ml: "ഒരു ടാപ്പ്. ടൈപ്പ് ചെയ്യേണ്ട. രജിസ്റ്റർ ചെയ്യേണ്ട.",
  },
  rescue: { en: "Right now", ml: "ഇപ്പോൾ" },
  scripts: { en: "What to say", ml: "എന്ത് പറയണം" },
  prevent: { en: "Plan ahead", ml: "മുൻകൂട്ടി" },
  toolkit: { en: "Safety kit", ml: "സുരക്ഷാ കിറ്റ്" },
  whatsComing: { en: "What is coming up?", ml: "എന്താണ് വരാൻ പോകുന്നത്?" },
  when: { en: "When is it?", ml: "എപ്പോഴാണ്?" },
  alreadyFeeling: {
    en: "How do you feel about it already?",
    ml: "ഇപ്പോൾ തന്നെ എങ്ങനെ തോന്നുന്നു?",
  },
  makePlan: { en: "Build my plan", ml: "എന്റെ പ്ലാൻ ഉണ്ടാക്കൂ" },
  beforehand: { en: "Before the day", ml: "അന്നത്തിന് മുൻപ്" },
  onTheDay: { en: "On the day", ml: "അന്നേ ദിവസം" },
  exitLine: { en: "Your way out", ml: "ഒഴിവാകാനുള്ള വഴി" },
  askYourAlly: { en: "Ask one person for this", ml: "ഒരാളോട് ഇത് ചോദിക്കൂ" },
  warningSigns: { en: "Watch for these", ml: "ഇവ ശ്രദ്ധിക്കൂ" },
  whatsHappening: { en: "What is happening?", ml: "എന്താണ് സംഭവിക്കുന്നത്?" },
  howYouFeel: { en: "How does it feel?", ml: "എങ്ങനെ തോന്നുന്നു?" },
  whereYouAre: { en: "Where are you?", ml: "എവിടെയാണ്?" },
  optional: { en: "Optional", ml: "നിർബന്ധമില്ല" },
  getHelp: { en: "Get my plan", ml: "എന്റെ പ്ലാൻ തരൂ" },
  again: { en: "Start over", ml: "വീണ്ടും തുടങ്ങുക" },
  speak: { en: "Speak instead of typing", ml: "ടൈപ്പിന് പകരം പറയൂ" },
  listening: { en: "Listening…", ml: "കേൾക്കുന്നു…" },
  photo: { en: "Show me the room", ml: "ചുറ്റുപാട് കാണിക്കൂ" },
  readAloud: { en: "Read aloud", ml: "ഉറക്കെ വായിക്കൂ" },
  stopReading: { en: "Stop", ml: "നിർത്തൂ" },
  doThisNow: { en: "Do this now", ml: "ഇത് ഇപ്പോൾ ചെയ്യൂ" },
  sayThis: { en: "Say this out loud", ml: "ഇത് ഉറക്കെ പറയൂ" },
  avoid: { en: "Do not do this", ml: "ഇത് ചെയ്യരുത്" },
  whyThisWorks: { en: "Why this works", ml: "എന്തുകൊണ്ട് ഇത് ഫലിക്കും" },
  rideItOut: { en: "Ride it out", ml: "ഇത് കടന്നുപോകും" },
  helplines: { en: "Free helplines", ml: "സൗജന്യ ഹെൽപ്പ് ലൈനുകൾ" },
  callNow: { en: "Call", ml: "വിളിക്കൂ" },
  situation: { en: "Which situation?", ml: "ഏത് സാഹചര്യം?" },
  tone: { en: "How should it sound?", ml: "എങ്ങനെ പറയണം?" },
  makeScript: { en: "Write my script", ml: "എന്റെ സ്ക്രിപ്റ്റ് എഴുതൂ" },
  ifTheyPush: { en: "If they push back", ml: "അവർ നിർബന്ധിച്ചാൽ" },
  exitPlan: { en: "How to leave", ml: "എങ്ങനെ ഒഴിവാകാം" },
  afterwards: { en: "Afterwards", ml: "അതിനുശേഷം" },
  anchor: { en: "My anchor person", ml: "എന്റെ ആശ്രയം" },
  anchorHint: {
    en: "One person you will call before you use. Stored only on this device.",
    ml: "ഉപയോഗിക്കുന്നതിന് മുൻപ് വിളിക്കേണ്ട ഒരാൾ. ഈ ഫോണിൽ മാത്രം സൂക്ഷിക്കുന്നു.",
  },
  savedPlan: { en: "My saved plan", ml: "സൂക്ഷിച്ച പ്ലാൻ" },
  savePlan: { en: "Save this plan", ml: "ഈ പ്ലാൻ സൂക്ഷിക്കൂ" },
  learn: { en: "Learn", ml: "പഠിക്കൂ" },
  thinking: { en: "Kaithangu is with you…", ml: "കൈത്താങ്ങ് നിങ്ങളോടൊപ്പമുണ്ട്…" },
  cannotAnswer: {
    en: "I cannot answer anything — just help me",
    ml: "എനിക്ക് ഒന്നും ഉത്തരം പറയാൻ വയ്യ — വെറുതെ സഹായിക്കൂ",
  },
  back: { en: "Back", ml: "തിരികെ" },
  start: { en: "Start", ml: "തുടങ്ങൂ" },
  pause: { en: "Pause", ml: "നിർത്തൂ" },
  goAgain: { en: "Go again", ml: "വീണ്ടും" },
  sayInOrder: { en: "Say this, in order", ml: "ഈ ക്രമത്തിൽ പറയൂ" },
  removePhoto: { en: "Remove photo", ml: "ഫോട്ടോ ഒഴിവാക്കൂ" },
  readingPhoto: { en: "Reading photo…", ml: "ഫോട്ടോ വായിക്കുന്നു…" },
  optionalHint: {
    en: "Optional — say it out loud, or show Kaithangu the room.",
    ml: "നിർബന്ധമില്ല — ഉറക്കെ പറയാം, അല്ലെങ്കിൽ ചുറ്റുപാട് കാണിക്കാം.",
  },
  needsMore: {
    en: "This needs more than an app right now",
    ml: "ഇതിന് ഇപ്പോൾ ഒരു ആപ്പ് മാത്രം പോരാ",
  },
  disclaimer: {
    en: "Kaithangu supports recovery. It does not replace medical care.",
    ml: "കൈത്താങ്ങ് ഒരു പിന്തുണയാണ്. ഇത് ചികിത്സയ്ക്ക് പകരമല്ല.",
  },
  emergencyCall: { en: "In an emergency call", ml: "അടിയന്തര ഘട്ടത്തിൽ വിളിക്കൂ" },
  handsFree: { en: "Hands-free", ml: "കൈ ഉപയോഗിക്കാതെ" },
  handsFreeHint: {
    en: "Put the phone down. Kaithangu will talk you through it.",
    ml: "ഫോൺ താഴെ വെക്കൂ. കൈത്താങ്ങ് പറഞ്ഞുതരും.",
  },
  playPlan: { en: "Talk me through it", ml: "എന്നോട് പറഞ്ഞുതരൂ" },
  patterns: { en: "My patterns", ml: "എന്റെ രീതികൾ" },
  patternsHint: {
    en: "Kaithangu can look across the times you have asked for help and find what they have in common. Your history never leaves this device until you tap the button.",
    ml: "നിങ്ങൾ സഹായം തേടിയ സന്ദർഭങ്ങളിൽ പൊതുവായത് കൈത്താങ്ങിന് കണ്ടെത്താം. ബട്ടൺ അമർത്തുന്നത് വരെ ചരിത്രം ഈ ഫോണിൽ തന്നെ.",
  },
  findPatterns: { en: "Find my patterns", ml: "എന്റെ രീതികൾ കണ്ടെത്തൂ" },
  needMoreHistory: {
    en: "Use the rescue button a few times and Kaithangu will start spotting patterns here.",
    ml: "കുറച്ച് തവണ സഹായം തേടിയാൽ കൈത്താങ്ങ് ഇവിടെ രീതികൾ കണ്ടെത്തും.",
  },
  riskWindow: { en: "Your riskiest window", ml: "ഏറ്റവും അപകടകരമായ സമയം" },
  oneAction: { en: "One thing to change", ml: "മാറ്റേണ്ട ഒരു കാര്യം" },
  clearHistory: { en: "Delete my history", ml: "ചരിത്രം മായ്ക്കൂ" },
  timesAsked: { en: "times you asked for help", ml: "തവണ സഹായം തേടി" },
  nameLabel: { en: "Name", ml: "പേര്" },
  phoneLabel: { en: "Phone", ml: "ഫോൺ നമ്പർ" },
  namePlaceholder: { en: "Amma, Rahul, my sponsor…", ml: "അമ്മ, രാഹുൽ, എന്റെ സ്പോൺസർ…" },
  sayTheName: { en: "Say the name", ml: "പേര് പറയൂ" },
  libraryHint: {
    en: "The complete, human-verified library Kaithangu is allowed to cite. It cannot cite anything outside this list.",
    ml: "കൈത്താങ്ങിന് ഉദ്ധരിക്കാൻ അനുവാദമുള്ള, മനുഷ്യർ പരിശോധിച്ച മുഴുവൻ പട്ടിക. ഇതിന് പുറത്തുനിന്ന് ഒന്നും ഉദ്ധരിക്കാനാവില്ല.",
  },
  errGeneric: {
    en: "Could not reach Kaithangu. Check your connection and try again.",
    ml: "കൈത്താങ്ങുമായി ബന്ധപ്പെടാനായില്ല. കണക്ഷൻ നോക്കി വീണ്ടും ശ്രമിക്കൂ.",
  },
  errPhoto: {
    en: "That image could not be read. Try another photo.",
    ml: "ആ ചിത്രം വായിക്കാനായില്ല. മറ്റൊരു ഫോട്ടോ ശ്രമിക്കൂ.",
  },
  pickFirst: { en: "Choose an option first.", ml: "ആദ്യം ഒരെണ്ണം തിരഞ്ഞെടുക്കൂ." },
  savedToKit: {
    en: "Saved to your safety kit, on this device only.",
    ml: "നിങ്ങളുടെ സുരക്ഷാ കിറ്റിൽ, ഈ ഫോണിൽ മാത്രം സൂക്ഷിച്ചു.",
  },
  historyDeleted: {
    en: "History deleted from this device.",
    ml: "ചരിത്രം ഈ ഫോണിൽ നിന്ന് മായ്ച്ചു.",
  },
  howItWorks: {
    en: "How Kaithangu works, and what it never does",
    ml: "കൈത്താങ്ങ് എങ്ങനെ പ്രവർത്തിക്കുന്നു, എന്തൊക്കെ ചെയ്യില്ല",
  },
  pipeline: { en: "The pipeline", ml: "പ്രവർത്തന ക്രമം" },
  guarantees: { en: "Guarantees, not intentions", ml: "വാഗ്ദാനങ്ങളല്ല, ഉറപ്പുകൾ" },
  guaranteeHelplines: {
    en: "Every helpline shown to you is hard-coded and human-verified. The model cannot add a number to that list.",
    ml: "കാണിക്കുന്ന എല്ലാ ഹെൽപ്പ് ലൈനുകളും മുൻകൂട്ടി പരിശോധിച്ചവയാണ്. ആ പട്ടികയിലേക്ക് മോഡലിന് ഒന്നും ചേർക്കാനാവില്ല.",
  },
  guaranteeCitations: {
    en: "Invented citations are dropped before rendering.",
    ml: "കെട്ടിച്ചമച്ച ഉദ്ധരണികൾ കാണിക്കുന്നതിന് മുൻപ് ഒഴിവാക്കുന്നു.",
  },
  guaranteeSafety: {
    en: "The system prompt forbids diagnosis, dosing advice and any suggestion of controlled use, and requires escalation on signs of overdose or unsupervised withdrawal.",
    ml: "രോഗനിർണയം, മരുന്നിന്റെ അളവ്, നിയന്ത്രിത ഉപയോഗം എന്നിവ നിർദ്ദേശിക്കുന്നത് വിലക്കിയിട്ടുണ്ട്; അപകട ലക്ഷണങ്ങളിൽ അടിയന്തര മുന്നറിയിപ്പ് നിർബന്ധമാണ്.",
  },
  guaranteePrivacy: {
    en: "No account, no analytics, no server-side profile. Your anchor contact and saved plan stay in this browser.",
    ml: "അക്കൗണ്ടില്ല, ട്രാക്കിംഗില്ല, സെർവറിൽ വിവരങ്ങളില്ല. നിങ്ങളുടെ ആശ്രയവും പ്ലാനും ഈ ഫോണിൽ തന്നെ.",
  },
  guaranteeKey: {
    en: "The Gemini key lives only on the server; the browser never sees it.",
    ml: "ജെമിനി കീ സെർവറിൽ മാത്രം; ബ്രൗസർ അത് കാണുന്നില്ല.",
  },
  notMedicalCare: {
    en: "Kaithangu is a support tool, not a substitute for medical care. Withdrawal from alcohol or sedatives can be life-threatening and needs a doctor.",
    ml: "കൈത്താങ്ങ് ഒരു പിന്തുണ മാത്രമാണ്, ചികിത്സയ്ക്ക് പകരമല്ല. മദ്യത്തിൽ നിന്നുള്ള പിൻവാങ്ങൽ ജീവന് ഭീഷണിയാകാം; ഡോക്ടറെ കാണണം.',".replace("',", '",'),
  },
} as const satisfies Record<string, Record<Language, string>>;

/** Exposed so `ui-text.test.ts` can assert every entry is translated. */
export const ALL_TEXT: Record<string, Record<Language, string>> = TEXT;

export type TextKey = keyof typeof TEXT;

export function t(key: TextKey, lang: Language): string {
  return TEXT[key][lang];
}

/** Model-returned enum values, shown to the user as words rather than raw ids. */
const LEVELS = {
  steady: { en: "steady", ml: "സ്ഥിരം" },
  rising: { en: "rising", ml: "ഉയരുന്നു" },
  critical: { en: "critical", ml: "ഗുരുതരം" },
  low: { en: "low risk", ml: "കുറഞ്ഞ അപകടം" },
  moderate: { en: "moderate risk", ml: "ഇടത്തരം അപകടം" },
  high: { en: "high risk", ml: "ഉയർന്ന അപകടം" },
} as const satisfies Record<string, Record<Language, string>>;

export function levelLabel(level: string | undefined, lang: Language): string {
  if (!level) return "";
  return LEVELS[level as keyof typeof LEVELS]?.[lang] ?? level;
}

/** "about 30 seconds" / "ഏകദേശം 30 സെക്കൻഡ്" */
export function secondsLabel(seconds: number, lang: Language): string {
  const rounded = Math.round(seconds);
  return lang === "ml"
    ? `ഏകദേശം ${rounded} സെക്കൻഡ്`
    : `about ${rounded} seconds`;
}
