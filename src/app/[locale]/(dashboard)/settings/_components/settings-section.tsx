"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StoreSettingsForm } from "@/features/settings/components";
import { UserManagement } from "@/features/settings/components";
import { cn } from "@/lib/utils";

export function SettingsSection() {
  const t = useTranslations("settings");
  const [tab, setTab] = useState("general");

  return (
    <div>
      <div className="inline-flex h-9 items-center gap-1 rounded-lg bg-muted p-0.5 text-muted-foreground">
        <button
          type="button"
          onClick={() => setTab("general")}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all",
            tab === "general" ? "bg-background text-foreground shadow-xs" : "hover:bg-background/50"
          )}
        >
          {t("general")}
        </button>
        <button
          type="button"
          onClick={() => setTab("users")}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all",
            tab === "users" ? "bg-background text-foreground shadow-xs" : "hover:bg-background/50"
          )}
        >
          {t("users")}
        </button>
      </div>
      <div className="mt-4">
        {tab === "general" && <StoreSettingsForm />}
        {tab === "users" && <UserManagement />}
      </div>
    </div>
  );
}
