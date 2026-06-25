"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
