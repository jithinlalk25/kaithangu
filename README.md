# Kaithangu · കൈത്താങ്ങ്

**A hand to hold, right now.**

A multi-modal, GenAI-powered recovery and prevention platform for people navigating
substance use disorders **and** the families who care for them — designed for the
minute when cognitive load is highest and typing is impossible.

> Built for PromptWars Kerala 2026. Live: _see the deployed link on the submission._

---

## The problem, and the design decision that follows from it

A craving does not arrive at a convenient time. It arrives at 11pm at a wedding, or in
a room with people drinking, or ten minutes after a fight at home. In that minute the
person has seconds of attention, shaking hands, and a great deal of shame. A caregiver
standing in the same room has no idea what to say.

That is the whole design brief. So Kaithangu has **no sign-up, no forms, and no text
box on the critical path**. The primary input is a handful of pre-written chips you
tap; speech and a photo are optional enrichments on top. Everything the model returns
is short, physical, and doable without leaving the room.

---

## How each requirement in the problem statement is met

| Requirement | Where it lives | What it actually does |
|---|---|---|
| **Zero keyboard, end to end** | `chip-group.tsx`, `voice-input.tsx`, `toolkit-view.tsx` | Every input in the app — including the anchor contact's name — can be given by tapping or speaking. The only thing you may want to type is a phone number, and that is a one-off setup step you can also dictate. |
| **Multi-modal** | `components/kaithangu/{chip-group,voice-input,photo-input,speak-button,hands-free-bar}.tsx` | Three real input modes — tap, speech (Web Speech API, `en-IN`/`ml-IN`), and camera → Gemini vision reads the room you are standing in. Two output modes — screen, and **hands-free playback** that talks you through the plan step by step, highlighting each step as it is spoken. |
| **Zero-typing interventions** | `components/kaithangu/rescue-view.tsx`, `app/api/rescue/route.ts` | A panic button, then 2–3 taps, produces a situation-specific intervention. An "I cannot answer anything" path skips even the chips. **No keyboard is required anywhere in the app** — every flow, and the anchor contact in the Safety kit, can be driven by tap and voice alone. With hands-free playback, no reading is required either. |
| **Personalised emergency scripts** | `components/kaithangu/script-view.tsx`, `app/api/script/route.ts` | The exact words to say in 8 named high-risk situations per role — in English *and* Malayalam — plus the pushbacks that actually follow ("just one, for me") with a reply for each, and a way out of the room. |
| **Backed by educational resources** | `lib/resources.ts`, `components/kaithangu/citations.tsx` | A hand-verified catalogue of 14 sources (WHO, NIDA, SAMHSA, NIMHANS, Tele-MANAS, Kerala's Vimukthi mission, NA/AA India). The model may cite **only** these ids; anything it invents is dropped before render. See "The anti-hallucination guarantee" below. |
| **Prevention**, not only recovery | `components/kaithangu/prevent-view.tsx`, `app/api/prevent/route.ts` | Most lapses happen in a small number of predictable situations, so the highest-leverage moment is the week before the wedding, not the craving. Name an upcoming high-risk event and get a plan: what to do before, what to do on the day, a ready-made exit line, exactly what to ask one ally for, and the early warning signs. |
| **Contextual safety tools** | `urge-timer.tsx`, `helplines.tsx`, `toolkit-view.tsx` | A guided urge-surfing timer whose duration the model sets from the actual situation; six real, dialable Indian helplines; an "anchor person" one-tap call; a saved plan. All work with the model offline. |
| **Learning from context over time** | `components/kaithangu/patterns-view.tsx`, `app/api/patterns/route.ts`, `lib/history.ts` | Every rescue logs the *moment* — chip ids and a timestamp, never the plan text or any free text — to `localStorage`. Once there are three, Gemini can read that record back and name what those moments have in common ("4 of your last 6 were late evening at a friend's place"), the riskiest recurring window, and the one change most likely to break it. The history is posted only when the user taps the button, is never stored server-side, and one button deletes it. |
| **Empowers users *and* families** | `lib/catalog.ts`, `lib/prompts.ts` | A first-class caregiver mode with its own chips, its own persona ("warm about the person, firm about the behaviour"), its own scripts, and its own source subset — not a relabelled copy of the person's mode. |

---

## The anti-hallucination guarantee

The stated brief asks for interventions "backed by educational resources". A language
model asked for a citation will invent a plausible one, and a model asked for a
helpline will invent a plausible phone number. In a substance-use crisis app that is
not a quality problem, it is a safety problem. Kaithangu makes it structurally
impossible rather than merely discouraged:

1. **Helpline numbers are never generated.** Every number Kaithangu offers to dial is a
   hand-verified constant in `lib/resources.ts`, rendered as a `tel:` link, and the model
   cannot add an entry to that list. Both the README and the in-app trust panel state this
   precisely — as a guarantee about the numbers the app *offers you*, not an unenforceable
   claim that a language model can never emit a digit.
2. **Citations are closed-vocabulary.** The system prompt shows the model the
   catalogue and permits only its `id`s. `resolveCitations()` then looks every id up
   and silently discards misses — a fabricated source cannot reach the screen.
3. **The system prompt has hard safety rules** (`lib/prompts.ts`): no diagnosis, no
   dosing, never "just one", and mandatory escalation on any sign of overdose,
   seizure, unsupervised alcohol/sedative withdrawal, violence or self-harm.
4. **Escalation is a schema field, not a hope.** `escalate` and `escalateReason` are the
   *first* fields in the rescue, script and prevention schemas — first because fields
   stream in declaration order, so a crisis banner declared last would arrive after the
   whole plan had rendered. When `escalate` is true, `EscalationAlert` renders the banner
   **and the emergency helplines directly beneath it**, above everything else. The
   patterns flow is deliberately excluded: it reflects on past entries rather than a live
   moment, so it is the one prompt that is not given the escalation rule — an instruction
   to raise a flag no schema can carry would be a dead letter.

---

## Architecture

```
tapped chips (+ optional speech / photo)
   │
   ▼  POST /api/rescue | /api/script | /api/prevent | /api/patterns
zod validation + per-IP rate limit         lib/schemas.ts · lib/api.ts · lib/rate-limit.ts
   │
   ▼
role-specific system prompt + verified source catalogue     lib/prompts.ts · lib/resources.ts
   │
   ▼
Gemini 3.6 Flash, structured output against a zod schema    lib/ai.ts
   │
   ▼  streamed as partial JSON
progressive render + citation resolution   components/kaithangu/*
```

**Why streaming.** Not decoration: a first step on screen in about a second, which the
user can start doing, beats a complete answer that arrives after the urge has won.

**Why the layers split this way.** Prompts are pure functions of validated input, so
prompt behaviour is unit-testable without a network call. The chip catalogue is a
single source of truth that both the UI renders and the API validates against, so the
two cannot drift.

| Path | Responsibility |
|---|---|
| `lib/catalog.ts` | The tap-only vocabulary — chips, roles, languages |
| `lib/resources.ts` | Verified knowledge base, helplines, citation resolution |
| `lib/schemas.ts` | Request validation + Gemini output contracts (zod) |
| `lib/prompts.ts` | Pure prompt builders, one per flow and role |
| `lib/ai.ts` | The only module that talks to Gemini |
| `lib/api.ts`, `lib/rate-limit.ts` | Shared route guard: rate limit → validate → typed error |
| `app/api/*/route.ts` | Thin handlers; no business logic |
| `components/kaithangu/*` | One component per idea, each with a stated reason to exist |
| `components/kaithangu/result/*` | Shared result primitives every flow composes (section, header, lists, streamed panel, escalation alert) |
| `components/ui/*` | Unmodified shadcn/Radix output, vendored by the CLI — not hand-written |

---

## Generative AI: what is used, and exactly where

- **Model:** Google **Gemini 3.6 Flash** in production, `gemini-3.5-flash-lite` in local
  development (`lib/models.ts`). Override with the `GEMINI_MODEL` environment variable.
- **SDK:** Vercel **AI SDK v7** (`ai`, `@ai-sdk/google`, `@ai-sdk/react`).
- **Structured output:** every call uses `Output.object()` against a zod schema, so the
  model returns renderable data rather than prose to be parsed.
- **Vision (multi-modal input):** the optional photo is sent as an image part in the
  same call, and the model is instructed to name only what it can actually see.
- **Streaming:** `streamText` → `useObject`, progressive render.
- **Thinking level:** `minimal`, because latency in a crisis matters more than a
  marginally better sentence.

| Call site | Prompt | Output schema |
|---|---|---|
| `app/api/rescue/route.ts` | `rescueSystemPrompt` + `rescuePrompt` | `rescueSchema` |
| `app/api/script/route.ts` | `scriptSystemPrompt` + `scriptPrompt` | `scriptSchema` |
| `app/api/prevent/route.ts` | `preventionSystemPrompt` + `preventionPrompt` | `preventionSchema` |
| `app/api/patterns/route.ts` | `patternsSystemPrompt` + `patternsPrompt` | `patternsSchema` |

Speech-to-text and text-to-speech use the browser's built-in Web Speech APIs — no audio
leaves the device and no second vendor is involved.

---

## Security and privacy

- The Gemini key is server-only. There is no `NEXT_PUBLIC_` variable for it anywhere in
  this repository, and the browser never receives it.
- Every request body is validated with zod before it can reach the model, with hard
  caps on note length, chip count and image size, and a strict allow-list on image
  media types.
- Per-IP rate limiting on **all four** AI routes (`lib/rate-limit.ts`), keyed on
  `x-real-ip` rather than the client-controlled first hop of `x-forwarded-for`.
- Errors are logged server-side and returned as generic typed JSON; internal messages
  are never leaked to the client.
- **Model failures are logged without the request body.** The AI SDK's default handler
  prints the whole error, and an `APICallError` carries `requestBodyValues` — which would
  put the user's dictated words and the base64 photo of their room into the host's logs on
  every ordinary 429. `logModelError` in `lib/ai.ts` logs only name, message and status.
- User text is delimited as `<user_words>` and the system prompt states it is data, never
  instructions; the escalation flag is explicitly not overridable by anything in it.
- **No account, no database, no analytics.** The anchor contact and saved plan live in
  `localStorage` on the user's own device. There is no server-side record that anyone
  used this app — which, for this user group, is a feature.

## Accessibility

Cognitive accessibility *is* the product here, so it is treated as a requirement:

- Every interactive target is at least 44px, inputs included; the panic button is far larger.
- Chips are real buttons in labelled groups with `aria-pressed`; streamed regions are
  `aria-live="polite"` with `aria-busy`, so a screen reader follows the plan as it
  arrives.
- Skip link, semantic landmarks and headings, visible focus rings throughout.
- Every plan can be read aloud, for users who cannot read a screen in that moment.
- **Full Malayalam interface and full Malayalam model output** — every screen, every
  control, every toast and the trust panel. The app shell carries `lang`, so a screen
  reader switches voice with the toggle instead of reading Malayalam with an English one.
  The error boundary is bilingual by design: it renders when the app has already failed,
  so it cannot depend on the language toggle still working.
- `prefers-reduced-motion` is respected; the breathing animation stops for users who
  ask for it.
- Colour is never the only signal, and red is reserved exclusively for real escalation.

## Testing and verification

```bash
npm test        # 81 unit tests
```

Unit tests cover the parts where a silent regression would be dangerous: the citation
resolver's rejection of invented sources, request-schema validation and its limits,
prompt construction for both roles and both languages, and the rate limiter's window
behaviour.

Beyond the unit tests, every claim in this README was checked against the deployed
build rather than assumed:

- **Lighthouse (mobile, production):** Accessibility **100**, Best Practices **100**,
  SEO **100** — 53 audits passed, 0 failed.
- **All four AI routes** were driven end-to-end against production and return real,
  situation-specific Gemini output — including the full Malayalam caregiver path.
- **Multi-modal input was verified, not assumed.** `scripts/vision-check.mjs` sends an
  image straight to the model and prints what it can see, and the rescue route was
  tested with a photo: the returned plan named the specific objects in the picture
  ("turn your back to the table with the green bottle, brown bottle, and yellow
  glasses"). A feature that only *looks* like it works is worse than no feature.
- **Input validation** was confirmed live: malformed bodies get `400`, not a model call.
- **Every citation link was checked from India** with `scripts/check-links.mjs`. That
  caught three real failures — samhsa.gov returns 403 to Indian traffic, and both
  `telemanas.mohfw.gov.in` and `nimhans.ac.in` time out — which is why some sources now
  point elsewhere and one is cited by name with no link at all.
- Zero console errors or warnings on the deployed app.

## Running locally

```bash
npm install
cp .env.example .env.local     # add your Gemini API key
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run build` | Production build + typecheck |
| `npm test` | Unit tests |
| `node scripts/check-links.mjs` | Verify every citation URL still resolves |
| `node scripts/vision-check.mjs <img>` | Confirm the model really can see an image |
| `npm run typecheck` | Types only |
| `npm run lint` | ESLint |

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
shadcn/ui on Radix · Vercel AI SDK v7 · Google Gemini · zod · Vitest.

---

## Disclaimer

Kaithangu is a support tool, not medical care, and does not diagnose or treat anything.
Withdrawal from alcohol or sedatives can be life-threatening and requires a doctor. In
an emergency call **112**. In Kerala, the free Vimukthi de-addiction helpline is
**14405** and Tele-MANAS is **14416**.
