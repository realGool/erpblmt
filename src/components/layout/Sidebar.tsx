import { useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  | "financeTariffs"
  | "financePayments"
  | "financeDebts"
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
  { key: "finance", labelKey: "navigation.finance", icon: CreditCard, expandable: true },
  { key: "analytics", labelKey: "navigation.analytics", icon: BarChart3 },
  { key: "notifications", labelKey: "navigation.notifications", icon: Bell },
  { key: "settings", labelKey: "navigation.settings", icon: Settings },
];

const financeNavigationKeys: SidebarNavigationKey[] = ["finance", "financeTariffs", "financePayments", "financeDebts"];

const financeSubItems = [
  { key: "financeTariffs", labelKey: "finance.nav.tariffs" },
  { key: "financePayments", labelKey: "finance.nav.payments" },
  { key: "financeDebts", labelKey: "finance.nav.debts" },
] as const;

export interface SidebarProps {
  activeNavigation?: SidebarNavigationKey;
  onNavigate?: (key: SidebarNavigationKey) => void;
}

export function Sidebar({ activeNavigation = "organization", onNavigate }: SidebarProps) {
  const { t } = useI18n();
  const [financeOpen, setFinanceOpen] = useState(() => financeNavigationKeys.includes(activeNavigation));

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
        {navItems.map((item) => {
          const isFinanceGroup = item.key === "finance";
          const isFinanceActive = isFinanceGroup && financeNavigationKeys.includes(activeNavigation);
          const isActive = activeNavigation === item.key || isFinanceActive;
          const ItemIcon = item.icon;

          return (
            <div key={item.key}>
              <button
                type="button"
                className={cn(
                  "flex h-11 w-full items-center gap-3 rounded-input px-3 text-left text-sm font-medium transition-colors",
                  isActive ? "bg-primary-soft text-primary" : "text-text-secondary hover:bg-page hover:text-text-primary",
                )}
                onClick={() => {
                  if (isFinanceGroup) {
                    setFinanceOpen((open) => !open);
                    return;
                  }

                  onNavigate?.(item.key as SidebarNavigationKey);
                }}
                aria-expanded={isFinanceGroup ? financeOpen : undefined}
              >
                <ItemIcon className="h-5 w-5" />
                <span className="min-w-0 flex-1">{t(item.labelKey)}</span>
                {isFinanceGroup ? (
                  financeOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                ) : null}
              </button>

              {isFinanceGroup && financeOpen ? (
                <div className="mt-1 space-y-1 pl-8">
                  {financeSubItems.map((subItem) => (
                    <button
                      key={subItem.key}
                      type="button"
                      className={cn(
                        "flex h-9 w-full items-center rounded-input px-3 text-left text-sm font-medium transition-colors",
                        activeNavigation === subItem.key
                          ? "bg-primary-soft text-primary"
                          : "text-text-secondary hover:bg-page hover:text-text-primary",
                      )}
                      onClick={() => onNavigate?.(subItem.key)}
                    >
                      {t(subItem.labelKey)}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Button variant="ghost" className="w-full justify-start" leftIcon={<ChevronLeft className="h-4 w-4" />}>
          {t("navigation.collapseMenu")}
        </Button>
      </div>
    </aside>
  );
}
