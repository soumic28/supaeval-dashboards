import { useEffect, useCallback, useRef } from "react";

// Default timeout: 24 hours in milliseconds
const DEFAULT_TIMEOUT = 24 * 60 * 60 * 1000;

const EVENTS = [
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
  "touchstart",
  "touchmove",
];

export function useAutoLogout(
  logoutAction: () => void,
  isActive: boolean,
  timeout = DEFAULT_TIMEOUT,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (isActive) {
      timerRef.current = setTimeout(() => {
        console.log("Auto-logout triggered due to inactivity");
        logoutAction();
      }, timeout);
    }
  }, [isActive, timeout, logoutAction]);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    // Set initial timer
    resetTimer();

    // Add event listeners
    const handleActivity = () => {
      resetTimer();
    };

    // Use a throttled version if performance becomes an issue,
    // but for these events, simple reset is usually fine if not too heavy.
    // For mousemove/scroll, we might want to throttle in a real high-perf scenario,
    // but React state updates aren't happening here, just timer resets.

    EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isActive, resetTimer]);
}
