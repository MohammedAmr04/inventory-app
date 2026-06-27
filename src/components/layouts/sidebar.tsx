"use client";

import { usePathname } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

const navItems = [
  { href: ROUTES.DASHBOARD, label: "navigation.dashboard", icon: "📊" },
  { href: ROUTES.INVENTORY, label: "navigation.inventory", icon: "📦" },
  { href: ROUTES.SUPPLIERS, label: "navigation.suppliers", icon: "🏢" },
  { href: ROUTES.PURCHASES, label: "navigation.purchases", icon: "🛒" },
  { href: ROUTES.POS, label: "navigation.pos", icon: "💳" },
  { href: ROUTES.EXPENSES, label: "navigation.expenses", icon: "💰" },
  { href: ROUTES.REPORTS, label: "navigation.reports", icon: "📈" },
  { href: ROUTES.SETTINGS, label: "navigation.settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const t = useTranslations();

  const isActive = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {sidebarOpen && (
          <span className="text-lg font-bold text-sidebar-foreground">
            RetailX
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{t(item.label)}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
