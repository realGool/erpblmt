import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronLeft,
  CreditCard,
  ListChecks,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";
import { Button } from "../ui";

export type SidebarNavigationKey =
  | "organization"
  | "groups"
  | "employees"
  | "calendar"
  | "kanban"
  | "bilimtoy"
  | "finance"
  | "analytics"
  | "notifications"
  | "settings";

const navItems = [
  { key: "organization", labelKey: "navigation.organization", icon: Building2 },
  { key: "groups", labelKey: "navigation.groups", icon: Users },
  { key: "employees", labelKey: "navigation.employees", icon: UserRound },
  { key: "calendar", labelKey: "navigation.calendar", icon: CalendarDays },
  { key: "kanban", labelKey: "navigation.kanban", icon: ListChecks },
  { key: "bilimtoy", labelKey: "navigation.bilimtoy", icon: BookOpen },
  { key: "finance", labelKey: "navigation.finance", icon: CreditCard },
  { key: "analytics", labelKey: "navigation.analytics", icon: BarChart3 },
  { key: "notifications", labelKey: "navigation.notifications", icon: Bell },
  { key: "settings", labelKey: "navigation.settings", icon: Settings },
];

export interface SidebarProps {
  activeNavigation?: SidebarNavigationKey;
  onNavigate?: (key: SidebarNavigationKey) => void;
}

export function Sidebar({ activeNavigation = "organization", onNavigate }: SidebarProps) {
  const { t } = useI18n();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-sidebar flex-col border-r border-border bg-surface">
      <div className="flex h-header items-center gap-3 border-b border-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-input bg-primary text-lg font-bold text-text-inverse">
          B
        </div>
        <div>
          <div className="text-base font-semibold text-text-primary">{t("layout.appName")}</div>
          <div className="text-xs text-text-muted">{t("layout.appSubtitle")}</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={cn(
              "flex h-11 w-full items-center gap-3 rounded-input px-3 text-left text-sm font-medium transition-colors",
              activeNavigation === item.key ? "bg-primary-soft text-primary" : "text-text-secondary hover:bg-page hover:text-text-primary",
            )}
            onClick={() => onNavigate?.(item.key as SidebarNavigationKey)}
          >
            <item.icon className="h-5 w-5" />
            {t(item.labelKey)}
          </button>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <Button variant="ghost" className="w-full justify-start" leftIcon={<ChevronLeft className="h-4 w-4" />}>
          {t("navigation.collapseMenu")}
        </Button>
      </div>
    </aside>
  );
}
