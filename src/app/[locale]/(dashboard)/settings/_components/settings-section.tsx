"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StoreSettingsForm } from "@/features/settings/components";
import { UserManagement } from "@/features/settings/components";
import { BackupManager } from "@/features/backup/components";
import { cn } from "@/lib/utils";

export function SettingsSection() {
  const t = useTranslations("settings");
  const [tab, setTab] = useState("general");

  const tabs = [
    { key: "general", label: t("general") },
    { key: "users", label: t("users") },
    { key: "backup", label: t("backup") },
  ];

  return (
    <div>
      <div className="inline-flex h-9 items-center gap-1 rounded-lg bg-muted p-0.5 text-muted-foreground">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all",
              tab === key ? "bg-background text-foreground shadow-xs" : "hover:bg-background/50"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tab === "general" && <StoreSettingsForm />}
        {tab === "users" && <UserManagement />}
        {tab === "backup" && <BackupManager />}
      </div>
    </div>
  );
}
