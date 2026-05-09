import { Bell, MessageSquare, Search, Settings } from "lucide-react";
import { useI18n } from "../../i18n";
import { Avatar, AvatarFallback, Button, Tooltip } from "../ui";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-20 flex h-header items-center justify-between border-b border-border bg-surface px-6">
      <div className="flex items-center gap-3 text-sm text-text-muted">
        <span>{t("layout.headerContext")}</span>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content={t("layout.tooltips.search")}>
          <Button variant="ghost" size="icon" aria-label={t("layout.tooltips.search")}>
            <Search className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content={t("layout.tooltips.messages")}>
          <Button variant="ghost" size="icon" aria-label={t("layout.tooltips.messages")}>
            <MessageSquare className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content={t("layout.tooltips.notifications")}>
          <Button variant="ghost" size="icon" aria-label={t("layout.tooltips.notifications")}>
            <Bell className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip content={t("layout.tooltips.settings")}>
          <Button variant="ghost" size="icon" aria-label={t("layout.tooltips.settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </Tooltip>
        <LanguageSwitcher />
        <div className="ml-2 flex items-center gap-3 border-l border-border pl-4">
          <Avatar>
            <AvatarFallback>{t("layout.avatarFallback")}</AvatarFallback>
          </Avatar>
          <div className="hidden text-right sm:block">
            <div className="text-sm font-semibold text-text-primary">{t("layout.userName")}</div>
            <div className="text-xs text-text-muted">{t("layout.userContext")}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
