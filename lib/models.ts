/**
 * Model identifiers, kept in their own module so the UI can name the model it is
 * talking to without pulling the whole AI SDK into the client bundle.
 *
 * Cheapest model locally so iteration is free; Google's production flash model
 * for anything a real user sees. `GEMINI_MODEL` overrides both.
 */
export const DEV_MODEL = "gemini-3.5-flash-lite";
export const DEMO_MODEL = "gemini-3.6-flash";
