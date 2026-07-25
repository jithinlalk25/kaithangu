"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persist a small value on the device.
 *
 * Deliberately localStorage and not a database: nothing about a person's
 * relapse triggers or their anchor contact leaves their own phone. There is no
 * account, no server-side profile and nothing to breach.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);

  // Read after mount so server and client render the same first paint.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch {
      // Corrupt or unavailable storage (private mode) - keep the default.
    }
  }, [key]);

  const store = useCallback(
    (next: T) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage full or blocked; the in-memory value still works this session.
      }
    },
    [key],
  );

  return [value, store];
}
