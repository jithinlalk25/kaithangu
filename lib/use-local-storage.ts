"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Persist a small value on the device.
 *
 * Deliberately localStorage and not a database: nothing about a person's relapse
 * triggers or their anchor contact leaves their own phone. There is no account,
 * no server-side profile and nothing to breach.
 *
 * Implemented with `useSyncExternalStore` so the server snapshot (nothing stored)
 * and the client snapshot can differ without a hydration mismatch, and without
 * setting state inside an effect.
 */

/** Fired on the current tab; the native `storage` event only reaches other tabs. */
const LOCAL_WRITE_EVENT = "kaithangu:local-write";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCAL_WRITE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCAL_WRITE_EVENT, onChange);
  };
}

export function useLocalStorage<T>(
  key: string,
  fallback: T,
): [T, (value: T) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Storage blocked (private mode); behave as if nothing is stored.
        return null;
      }
    },
    () => null,
  );

  const value = useMemo(() => {
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }, [raw, fallback]);

  const store = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage full or blocked - nothing useful to do, and never worth
        // interrupting someone mid-craving with an error about it.
      }
      window.dispatchEvent(new Event(LOCAL_WRITE_EVENT));
    },
    [key],
  );

  return [value, store];
}
