import { useEffect, useState } from "react";

const PREFIX = "messaging-app-";

const useLocalStorage = <T>(key: string, initialValue?: T | (() => T)) => {
  const prefixedKey = PREFIX + key;

  const [value, setValue] = useState<T | undefined>(() => {
    // If running in non-browser environment, return initial value
    if (typeof window === "undefined") {
      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : (initialValue as T | undefined);
    }

    const jsonValue = localStorage.getItem(prefixedKey);

    if (jsonValue !== null) {
      // defensive: ignore literal "undefined" or malformed JSON
      if (jsonValue === "undefined") {
        localStorage.removeItem(prefixedKey);
      } else {
        try {
          return JSON.parse(jsonValue) as T;
        } catch (err) {
          // malformed JSON — remove key and fall back to initialValue
          // keep a console warning to aid debugging
          // eslint-disable-next-line no-console
          console.warn(
            `Failed to parse localStorage key "${prefixedKey}":`,
            err
          );
          localStorage.removeItem(prefixedKey);
        }
      }
    }

    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : (initialValue as T | undefined);
  });

  useEffect(() => {
    try {
      if (value === undefined) {
        localStorage.removeItem(prefixedKey);
      } else {
        localStorage.setItem(prefixedKey, JSON.stringify(value));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to write localStorage key "${prefixedKey}":`, err);
    }
  }, [prefixedKey, value]);

  return [value, setValue] as const;
};

export default useLocalStorage;
