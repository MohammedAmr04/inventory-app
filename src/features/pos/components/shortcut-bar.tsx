"use client";

import { SHORTCUTS } from "../constants";
import { useTranslations } from "next-intl";

export function ShortcutBar() {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-2 border-t bg-muted/30 px-4 py-2">
      {SHORTCUTS.map((shortcut) => (
        <kbd
          key={shortcut.key}
          className="flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground"
        >
          <span className="font-medium text-foreground">{shortcut.key}</span>
          <span>{t(shortcut.actionKey)}</span>
        </kbd>
      ))}
    </div>
  );
}
