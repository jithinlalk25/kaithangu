"use client";

import { useSyncExternalStore } from "react";

const neverChanges = () => () => {};

/**
 * True only after hydration, so a component can safely branch on a browser-only
 * capability (speech recognition, speech synthesis) without the server and the
 * client disagreeing on the first render.
 *
 * `useSyncExternalStore` is the sanctioned way to express "the server and the
 * client see different things here" - unlike setting state in an effect, it does
 * not cause a cascading render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );
}
