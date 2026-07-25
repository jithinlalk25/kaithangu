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
| **Multi-modal** | `components/kaithangu/{chip-group,voice-input,photo-input,speak-button}.tsx` | Three real input modes — tap, speech (Web Speech API, `en-IN`/`ml-IN`), and camera → Gemini vision reads the room you are standing in. Two output modes — screen and spoken (speech synthesis). |
| **Zero-typing interventions** | `components/kaithangu/rescue-view.tsx`, `app/api/rescue/route.ts` | A panic button, then 2–3 taps, produces a situation-specific intervention. An "I cannot answer anything" path skips even the chips. No keyboard is ever required. |
| **Personalised emergency scripts** | `components/kaithangu/script-view.tsx`, `app/api/script/route.ts` | The exact words to say in 8 named high-risk situations per role — in English *and* Malayalam — plus the pushbacks that actually follow ("just one, for me") with a reply for each, and a way out of the room. |
| **Backed by educational resources** | `lib/resources.ts`, `components/kaithangu/citations.tsx` | A hand-verified catalogue of 14 sources (WHO, NIDA, SAMHSA, NIMHANS, Tele-MANAS, Kerala's Vimukthi mission, NA/AA India). The model may cite **only** these ids; anything it invents is dropped before render. See "The anti-hallucination guarantee" below. |
| **Prevention**, not only recovery | `components/kaithangu/prevent-view.tsx`, `app/api/prevent/route.ts` | Most lapses happen in a small number of predictable situations, so the highest-leverage moment is the week before the wedding, not the craving. Name an upcoming high-risk event and get a plan: what to do before, what to do on the day, a ready-made exit line, exactly what to ask one ally for, and the early warning signs. |
| **Contextual safety tools** | `urge-timer.tsx`, `helplines.tsx`, `toolkit-view.tsx` | A guided urge-surfing timer whose duration the model sets from the actual situation; six real, dialable Indian helplines; an "anchor person" one-tap call; a saved plan. All work with the model offline. |
| **Empowers users *and* families** | `lib/catalog.ts`, `lib/prompts.ts` | A first-class caregiver mode with its own chips, its own persona ("warm about the person, firm about the behaviour"), its own scripts, and its own source subset — not a relabelled copy of the person's mode. |

---

## The anti-hallucination guarantee

The stated brief asks for interventions "backed by educational resources". A language
model asked for a citation will invent a plausible one, and a model asked for a
helpline will invent a plausible phone number. In a substance-use crisis app that is
not a quality problem, it is a safety problem. Kaithangu makes it structurally
impossible rather than merely discouraged:

1. **Helpline numbers are never generated.** They are a hand-verified constant in
   `lib/resources.ts`, rendered as `tel:` links. The output schema has no field a
   phone number could occupy.
2. **Citations are closed-vocabulary.** The system prompt shows the model the
   catalogue and permits only its `id`s. `resolveCitations()` then looks every id up
   and silently discards misses — a fabricated source cannot reach the screen.
3. **The system prompt has hard safety rules** (`lib/prompts.ts`): no diagnosis, no
   dosing, never "just one", and mandatory escalation on any sign of overdose,
   seizure, unsupervised alcohol/sedative withdrawal, violence or self-harm.
4. **Escalation is a schema field, not a hope.** When `escalate` is true the UI shows
   a crisis banner and pushes the emergency helplines to the top.

---

## Architecture

```
tapped chips (+ optional speech / photo)
   │
   ▼  POST /api/rescue | /api/script | /api/prevent
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

Speech-to-text and text-to-speech use the browser's built-in Web Speech APIs — no audio
leaves the device and no second vendor is involved.

---

## Security and privacy

- The Gemini key is server-only. There is no `NEXT_PUBLIC_` variable for it anywhere in
  this repository, and the browser never receives it.
- Every request body is validated with zod before it can reach the model, with hard
  caps on note length, chip count and image size, and a strict allow-list on image
  media types.
- Per-IP rate limiting on both AI routes (`lib/rate-limit.ts`).
- Errors are logged server-side and returned as generic typed JSON; internal messages
  are never leaked to the client.
- **No account, no database, no analytics.** The anchor contact and saved plan live in
  `localStorage` on the user's own device. There is no server-side record that anyone
  used this app — which, for this user group, is a feature.

## Accessibility

Cognitive accessibility *is* the product here, so it is treated as a requirement:

- Every tap target is at least 44px; the panic button is far larger.
- Chips are real buttons in labelled groups with `aria-pressed`; streamed regions are
  `aria-live="polite"` with `aria-busy`, so a screen reader follows the plan as it
  arrives.
- Skip link, semantic landmarks and headings, visible focus rings throughout.
- Every plan can be read aloud, for users who cannot read a screen in that moment.
- Full Malayalam interface *and* Malayalam model output, with `lang` attributes set
  correctly for screen readers.
- `prefers-reduced-motion` is respected; the breathing animation stops for users who
  ask for it.
- Colour is never the only signal, and red is reserved exclusively for real escalation.

## Testing and verification

```bash
npm test        # 42 unit tests
```

Unit tests cover the parts where a silent regression would be dangerous: the citation
resolver's rejection of invented sources, request-schema validation and its limits,
prompt construction for both roles and both languages, and the rate limiter's window
behaviour.

Beyond the unit tests, every claim in this README was checked against the deployed
build rather than assumed:

- **Lighthouse (mobile, production):** Accessibility **100**, Best Practices **100**,
  SEO **100** — 53 audits passed, 0 failed.
- **All three AI routes** were driven end-to-end against production and return real,
  situation-specific Gemini output — including the full Malayalam caregiver path.
- **Multi-modal input was verified, not assumed.** `scripts/vision-check.mjs` sends an
  image straight to the model and prints what it can see, and the rescue route was
  tested with a photo: the returned plan named the specific objects in the picture
  ("turn your back to the table with the green bottle, brown bottle, and yellow
  glasses"). A feature that only *looks* like it works is worse than no feature.
- **Input validation** was confirmed live: malformed bodies get `400`, not a model call.
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
