import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { en } from "./en";
import { ru } from "./ru";
import { uz } from "./uz";

export type Locale = "ru" | "uz" | "en";
export type TranslationKey = string;
export type TranslationParams = Record<string, string | number>;

const dictionaries = {
  ru,
  uz,
  en,
} as const;

export const glossary = {
  ru: ru.glossary,
  uz: uz.glossary,
  en: en.glossary,
} as const;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getValue(source: unknown, key: string): string | undefined {
  return key.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object" && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, source) as string | undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ru");

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => {
        const translated = getValue(dictionaries[locale], key);
        const value = typeof translated === "string" ? translated : getValue(dictionaries.ru, key);

        if (typeof value !== "string") return key;

        if (!params) return value;

        return Object.entries(params).reduce(
          (message, [paramKey, paramValue]) => message.split(`{${paramKey}}`).join(String(paramValue)),
          value,
        );
      },
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
