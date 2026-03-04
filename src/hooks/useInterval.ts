import { useEffect, useRef } from 'react';

// Custom hook to handle declarative setInterval.
// Performance rationale: It avoids stale closures and prevents the timer from resetting or causing 
// re-renders every time the provided callback function changes.
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  // EVERY time the component renders, the component provides a brand new `callback` 
  // with fresh versions of all its state variables.
  // We save this brand new function into our mutable box (.current).
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delay === null) {
      return;
    }

    // The setInterval is blissfully unaware that the function changed. 
    // It just blindly executes whatever is inside `.current` at that exact millisecond.
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]); // Only re-bind if delay changes
}
