/**
 * The tap-only vocabulary of the app.
 *
 * Kaithangu is designed for the moment when cognitive load is highest, so the
 * primary input is never a text box - it is a small set of pre-written chips the
 * user taps. This file is the single source of truth for those chips: the UI
 * renders from it and the API validates against it, so the two can never drift.
 */

export type Role = "person" | "caregiver";
export type Language = "en" | "ml";

export interface Chip {
  readonly id: string;
  readonly en: string;
  readonly ml: string;
}

interface RoleChips {
  readonly situations: readonly Chip[];
  readonly feelings: readonly Chip[];
  readonly places: readonly Chip[];
  readonly scriptSituations: readonly Chip[];
}

const PERSON: RoleChips = {
  situations: [
    { id: "urge-hit", en: "The urge just hit me", ml: "പെട്ടെന്ന് ആസക്തി വന്നു" },
    { id: "others-using", en: "People around me are using", ml: "ചുറ്റുമുള്ളവർ ഉപയോഗിക്കുന്നു" },
    { id: "cash-in-hand", en: "I have cash in my pocket", ml: "കയ്യിൽ പണമുണ്ട്" },
    { id: "fight-at-home", en: "There was a fight at home", ml: "വീട്ടിൽ വഴക്കുണ്ടായി" },
    { id: "alone-tonight", en: "I am alone tonight", ml: "ഇന്ന് രാത്രി ഞാൻ ഒറ്റയ്ക്കാണ്" },
    { id: "celebration", en: "It is a party or celebration", ml: "ആഘോഷ പരിപാടിയാണ്" },
    { id: "withdrawal", en: "Withdrawal is hurting", ml: "പിൻവാങ്ങൽ ലക്ഷണങ്ങൾ വിഷമിപ്പിക്കുന്നു" },
    { id: "already-slipped", en: "I already slipped today", ml: "ഇന്ന് ഞാൻ വീണുപോയി" },
  ],
  feelings: [
    { id: "angry", en: "Angry", ml: "ദേഷ്യം" },
    { id: "anxious", en: "Anxious", ml: "ഉത്കണ്ഠ" },
    { id: "lonely", en: "Lonely", ml: "ഏകാന്തത" },
    { id: "bored", en: "Bored", ml: "മടുപ്പ്" },
    { id: "sad", en: "Low / sad", ml: "സങ്കടം" },
    { id: "ashamed", en: "Ashamed", ml: "ലജ്ജ" },
    { id: "restless", en: "Restless", ml: "അസ്വസ്ഥത" },
    { id: "good", en: "Actually feeling good", ml: "സന്തോഷത്തിലാണ്" },
  ],
  places: [
    { id: "home", en: "At home", ml: "വീട്ടിൽ" },
    { id: "work", en: "At work", ml: "ജോലിസ്ഥലത്ത്" },
    { id: "street", en: "On the street", ml: "പുറത്ത്" },
    { id: "bar", en: "At a bar / toddy shop", ml: "ബാറിൽ / ഷാപ്പിൽ" },
    { id: "friends", en: "At a friend's place", ml: "സുഹൃത്തിന്റെ വീട്ടിൽ" },
    { id: "travelling", en: "Travelling", ml: "യാത്രയിലാണ്" },
  ],
  scriptSituations: [
    { id: "offered-drink", en: "Someone is offering me a drink", ml: "ആരോ മദ്യം വാഗ്ദാനം ചെയ്യുന്നു" },
    { id: "dealer-calling", en: "My dealer keeps calling", ml: "വിൽപ്പനക്കാരൻ വിളിക്കുന്നു" },
    { id: "family-confronting", en: "My family is confronting me", ml: "കുടുംബം ചോദ്യം ചെയ്യുന്നു" },
    { id: "office-party", en: "There is an office party tonight", ml: "ഓഫീസ് പാർട്ടിയുണ്ട്" },
    { id: "tell-boss", en: "I need to tell my boss", ml: "മേലധികാരിയോട് പറയണം" },
    { id: "ask-for-help", en: "I need to ask my family for help", ml: "കുടുംബത്തോട് സഹായം ചോദിക്കണം" },
    { id: "festival", en: "A wedding or festival at home", ml: "വീട്ടിൽ കല്യാണം / ഉത്സവം" },
    { id: "repeated-pressure", en: "Someone will not stop pressuring me", ml: "ആരോ നിർബന്ധിച്ചുകൊണ്ടിരിക്കുന്നു" },
  ],
};

const CAREGIVER: RoleChips = {
  situations: [
    { id: "using-now", en: "They are using right now", ml: "അവർ ഇപ്പോൾ ഉപയോഗിക്കുന്നു" },
    { id: "came-home-intoxicated", en: "They came home intoxicated", ml: "ലഹരിയിൽ വീട്ടിൽ വന്നു" },
    { id: "demanding-money", en: "They are demanding money", ml: "പണം ആവശ്യപ്പെടുന്നു" },
    { id: "relapsed", en: "They relapsed after doing well", ml: "നന്നായിരുന്നിട്ട് വീണ്ടും വീണു" },
    { id: "in-withdrawal", en: "They are in withdrawal", ml: "പിൻവാങ്ങൽ ലക്ഷണങ്ങളിലാണ്" },
    { id: "refusing-help", en: "They refuse any help", ml: "സഹായം സ്വീകരിക്കുന്നില്ല" },
    { id: "scared-for-safety", en: "I am scared for their safety", ml: "അവരുടെ സുരക്ഷയിൽ ഭയമുണ്ട്" },
    { id: "children-watching", en: "The children are watching this", ml: "കുട്ടികൾ ഇത് കാണുന്നുണ്ട്" },
  ],
  feelings: [
    { id: "angry", en: "Angry", ml: "ദേഷ്യം" },
    { id: "scared", en: "Scared", ml: "ഭയം" },
    { id: "exhausted", en: "Exhausted", ml: "ക്ഷീണം" },
    { id: "hopeless", en: "Hopeless", ml: "പ്രതീക്ഷയില്ലായ്മ" },
    { id: "guilty", en: "Guilty", ml: "കുറ്റബോധം" },
    { id: "resentful", en: "Resentful", ml: "നീരസം" },
    { id: "numb", en: "Numb", ml: "മരവിപ്പ്" },
    { id: "determined", en: "Determined", ml: "ദൃഢനിശ്ചയം" },
  ],
  places: [
    { id: "home", en: "At home", ml: "വീട്ടിൽ" },
    { id: "hospital", en: "At a hospital", ml: "ആശുപത്രിയിൽ" },
    { id: "phone", en: "On a phone call", ml: "ഫോൺ വിളിയിലാണ്" },
    { id: "public", en: "In public", ml: "പൊതുസ്ഥലത്ത്" },
    { id: "work", en: "At work", ml: "ജോലിസ്ഥലത്ത്" },
    { id: "travelling", en: "Travelling", ml: "യാത്രയിലാണ്" },
  ],
  scriptSituations: [
    { id: "money-boundary", en: "Saying no to a request for money", ml: "പണം നൽകാൻ വിസമ്മതിക്കണം" },
    { id: "ask-them-to-get-help", en: "Asking them to get help", ml: "ചികിത്സ തേടാൻ പറയണം" },
    { id: "talking-while-high", en: "Talking to them while they are high", ml: "ലഹരിയിലായിരിക്കുമ്പോൾ സംസാരിക്കണം" },
    { id: "explain-to-children", en: "Explaining it to our children", ml: "കുട്ടികളോട് പറയണം" },
    { id: "tell-relatives", en: "Telling relatives the truth", ml: "ബന്ധുക്കളോട് സത്യം പറയണം" },
    { id: "after-relapse", en: "Talking to them after a relapse", ml: "വീണ്ടും വീണതിന് ശേഷം സംസാരിക്കണം" },
    { id: "call-for-help", en: "Calling for emergency help", ml: "അടിയന്തര സഹായം വിളിക്കണം" },
    { id: "protect-myself", en: "Protecting my own wellbeing", ml: "എന്റെ ആരോഗ്യം സംരക്ഷിക്കണം" },
  ],
};

export const CHIPS: Record<Role, RoleChips> = {
  person: PERSON,
  caregiver: CAREGIVER,
};

export const TONES: readonly Chip[] = [
  { id: "firm", en: "Firm", ml: "ഉറച്ച" },
  { id: "gentle", en: "Gentle", ml: "സൗമ്യമായ" },
  { id: "brief", en: "Very brief", ml: "വളരെ ചുരുക്കം" },
  { id: "light", en: "Light-hearted", ml: "നർമ്മത്തോടെ" },
];

/** Resolve a chip id to readable text for the prompt. Unknown ids are dropped. */
export function labelsFor(chips: readonly Chip[], ids: readonly string[]): string[] {
  return ids
    .map((id) => chips.find((chip) => chip.id === id)?.en)
    .filter((label): label is string => Boolean(label));
}

export function chipText(chip: Chip, lang: Language): string {
  return lang === "ml" ? chip.ml : chip.en;
}
