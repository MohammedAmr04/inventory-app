import { hasLocale, type AbstractIntlMessages } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { LocaleProvider } from "@/providers/locale-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { IonicProvider } from "@/providers/ionic-provider";
import { AppShell } from "@/components/layouts/app-shell";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="h-full">
      <body className="min-h-full antialiased">
        <LocaleProvider locale={locale} messages={messages}>
          <QueryProvider>
            <IonicProvider>
              <ThemeProvider>
                <AppShell>{children}</AppShell>
              </ThemeProvider>
            </IonicProvider>
          </QueryProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
