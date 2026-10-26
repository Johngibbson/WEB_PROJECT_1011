import { useEffect, useState } from 'react';

// Reads a value from localStorage safely.
// If the key is missing, the JSON is corrupted, or the data has the wrong shape,
// we fall back to initialValue instead of crashing the app.
function readStoredValue(key, initialValue, isValid) {
  try {
    const storedText = window.localStorage.getItem(key);
    if (storedText === null) {
      return initialValue;
    }
    const parsed = JSON.parse(storedText);
    if (isValid && !isValid(parsed)) {
      return initialValue;
    }
    return parsed;
  } catch {
    return initialValue;
  }
}

// Custom hook: works like useState, but the value is also saved in localStorage
// so it survives page refreshes.
// isValid (optional) is a function that checks the stored data looks correct.
export default function useLocalStorage(key, initialValue, isValid) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue, isValid));

  // Every time the value changes, write it back to localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be full or blocked (e.g. private mode). The app still works in memory.
    }
  }, [key, value]);

  return [value, setValue];
}
