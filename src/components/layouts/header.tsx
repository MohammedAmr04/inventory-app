"use client";

import { useAppStore } from "@/stores/app-store";
import { useThemeStore } from "@/stores/theme-store";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

export function Header() {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const { theme, toggleTheme } = useThemeStore();
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 hover:bg-accent"
          aria-label={t("common.toggleSidebar")}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={switchLocale}
          className="rounded-lg px-3 py-2 text-sm hover:bg-accent"
        >
          {locale === "en" ? "العربية" : "English"}
        </button>

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 hover:bg-accent"
          aria-label={t("common.toggleTheme")}
        >
          {theme === "light" ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
