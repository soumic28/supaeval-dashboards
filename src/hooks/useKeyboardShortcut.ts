import { useEffect } from "react";

type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  description?: string;
};

export function useKeyboardShortcut(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Don't trigger if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const { key, ctrlKey, shiftKey, altKey, callback } = shortcut;

        // Key must match (case insensitive)
        const matchesKey = event.key.toLowerCase() === key.toLowerCase();
        if (!matchesKey) continue;

        // Check modifiers - they must match exactly unless undefined
        // If ctrlKey is true in shortcut, event.ctrlKey must be true
        // If ctrlKey is false or undefined in shortcut, event.ctrlKey must be false
        const ctrlMatches =
          (ctrlKey === true && (event.ctrlKey || event.metaKey)) || // Allow Cmd on Mac
          (ctrlKey !== true && !event.ctrlKey && !event.metaKey);

        const shiftMatches =
          (shiftKey === true && event.shiftKey) ||
          (shiftKey !== true && !event.shiftKey);

        const altMatches =
          (altKey === true && event.altKey) ||
          (altKey !== true && !event.altKey);

        // For simple keys like 'n', 'r', we want NO modifiers pressed
        // For '?', we want only Shift pressed
        if (matchesKey && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          callback();
          break; // Only trigger first matching shortcut
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

// Common keyboard shortcuts
export const SHORTCUTS = {
  COMMAND_PALETTE: {
    key: "k",
    ctrlKey: true,
    description: "Open command palette",
  },
  SEARCH: { key: "/", description: "Focus search" },
  HELP: { key: "?", shiftKey: true, description: "Show keyboard shortcuts" },
  NEW_EVALUATION: { key: "n", description: "New evaluation" },
  REFRESH: { key: "r", description: "Refresh page" },
  SAVE: { key: "s", ctrlKey: true, description: "Save" },
  CLOSE: { key: "Escape", description: "Close dialog" },
};
