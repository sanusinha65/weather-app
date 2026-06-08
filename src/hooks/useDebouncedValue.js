import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delay`
 * milliseconds have passed without `value` changing.
 *
 * This is what lets the search box fire one request after the user pauses
 * typing instead of one request per keystroke.
 *
 * @template T
 * @param {T} value - the rapidly-changing source value
 * @param {number} delay - quiet period in milliseconds
 * @returns {T} the debounced value
 */
export default function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
