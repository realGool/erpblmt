import type { ChangeEvent } from "react";
import { useI18n, type Locale } from "../../i18n";

const locales: Locale[] = ["ru", "uz", "en"];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <label className="flex items-center gap-2 text-xs font-medium text-text-muted">
      <span className="sr-only">{t("language.switcherLabel")}</span>
      <select
        aria-label={t("language.switcherLabel")}
        className="focus-ring h-9 rounded-input border border-border bg-surface px-2 text-sm font-semibold text-text-primary shadow-card"
        value={locale}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => setLocale(event.target.value as Locale)}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {t(`language.${item}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
