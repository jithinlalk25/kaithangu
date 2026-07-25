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
} as const satisfies Record<string, Record<Language, string>>;

export type TextKey = keyof typeof TEXT;

export function t(key: TextKey, lang: Language): string {
  return TEXT[key][lang];
}
