"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { AbstractIntlMessages } from "next-intl";

interface LocaleProviderProps {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
}

export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
