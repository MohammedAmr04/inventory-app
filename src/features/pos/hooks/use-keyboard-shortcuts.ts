"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
  onFocusSearch?: () => void;
  onHold?: () => void;
  onPrintLast?: () => void;
  onClear?: () => void;
  onSettle?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "F1":
          e.preventDefault();
          handlers.onFocusSearch?.();
          break;
        case "F2":
          e.preventDefault();
          handlers.onHold?.();
          break;
        case "F3":
          e.preventDefault();
          handlers.onPrintLast?.();
          break;
        case "F4":
          e.preventDefault();
          handlers.onClear?.();
          break;
        case "F12":
          e.preventDefault();
          handlers.onSettle?.();
          break;
        case "Enter":
          handlers.onConfirm?.();
          break;
        case "Escape":
          e.preventDefault();
          handlers.onClose?.();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
