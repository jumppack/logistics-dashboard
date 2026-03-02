import { useEffect, useRef } from 'react';

// Custom hook to handle declarative setInterval.
// Performance rationale: It avoids stale closures and prevents the timer from resetting or causing 
// re-renders every time the provided callback function changes.
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]); // Only re-bind if delay changes
}
