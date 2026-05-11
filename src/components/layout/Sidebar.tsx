import {
  Activity,
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Gamepad2,
  Library,
  ListChecks,
  UserRound,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

export type SidebarNavigationKey =
  | "organization"
  | "groups"
  | "childrenParents"
  | "children"
  | "parents"
  | "hr"
  | "employees"
  | "employeePayroll"
  | "employeeCalendar"
  | "employeeRoles"
  | "kanban"
  | "bilimtoy"
  | "bilimtoy-realtime"
  | "bilimtoy-games"
  | "bilimtoy-education"
  | "bilimtoy-development-map"
  | "bilimtoy-library"
  | "finance"
  | "financeTariffs"
  | "financePayments"
  | "financeDebts"
  | "analytics"
  | "analyticsDashboard"
  | "analyticsDastur"
  | "analyticsFinance"
  | "analyticsAttendance"
  | "analyticsReports";

const navItems = [
  { key: "organization", labelKey: "navigation.organization", icon: Building2 },
  { key: "groups", labelKey: "navigation.groups", icon: Users },
  { key: "kanban", labelKey: "navigation.kanban", icon: ListChecks },
  { key: "bilimtoy", labelKey: "navigation.bilimtoy", icon: BookOpen },
  { key: "finance", labelKey: "navigation.finance", icon: CreditCard },
  { key: "analytics", labelKey: "navigation.analytics", icon: BarChart3 },
] as const;

const childrenParentsNavItems = [
  { key: "children", labelKey: "navigation.children" },
  { key: "parents", labelKey: "navigation.parents" },
] as const;

const hrNavigationKeys: SidebarNavigationKey[] = ["employees", "employeePayroll", "employeeCalendar", "employeeRoles"];

const hrNavItems = [
  { key: "employees", labelKey: "employees.tabs.employees" },
  { key: "employeePayroll", labelKey: "employees.tabs.payroll" },
  { key: "employeeRoles", labelKey: "employees.tabs.roles" },
  { key: "employeeCalendar", labelKey: "employees.tabs.calendar" },
] as const;

const bilimtoyNavItems = [
  { key: "bilimtoy-realtime", labelKey: "navigation.bilimtoyRealtime", icon: Activity },
  { key: "bilimtoy-games", labelKey: "navigation.bilimtoyGames", icon: Gamepad2 },
  { key: "bilimtoy-education", labelKey: "navigation.bilimtoyEducation", icon: BookOpen },
  { key: "bilimtoy-development-map", labelKey: "navigation.bilimtoyDevelopmentMap", icon: BarChart3 },
  { key: "bilimtoy-library", labelKey: "navigation.bilimtoyLibrary", icon: Library },
] as const;

const financeNavigationKeys: SidebarNavigationKey[] = ["finance", "financeTariffs", "financePayments", "financeDebts"];

const financeSubItems = [
  { key: "financeTariffs", labelKey: "finance.nav.tariffs" },
  { key: "financePayments", labelKey: "finance.nav.payments" },
  { key: "financeDebts", labelKey: "finance.nav.debts" },
] as const;

const analyticsNavigationKeys: SidebarNavigationKey[] = ["analytics", "analyticsDashboard", "analyticsDastur", "analyticsFinance", "analyticsAttendance", "analyticsReports"];

const analyticsSubItems = [
  { key: "analyticsDashboard", labelKey: "analytics.nav.dashboard" },
  { key: "analyticsDastur", labelKey: "analytics.nav.dastur" },
  { key: "analyticsFinance", labelKey: "analytics.nav.finance" },
  { key: "analyticsAttendance", labelKey: "analytics.nav.attendance" },
  { key: "analyticsReports", labelKey: "analytics.nav.reports" },
] as const;

export interface SidebarProps {
  activeNavigation?: SidebarNavigationKey;
  onNavigate?: (key: SidebarNavigationKey) => void;
}

export function Sidebar({ activeNavigation = "organization", onNavigate }: SidebarProps) {
  const { t } = useI18n();
  const childrenParentsActive = activeNavigation === "children" || activeNavigation === "parents";
  const hrActive = hrNavigationKeys.includes(activeNavigation);
  const bilimtoyActive =
    activeNavigation === "bilimtoy" ||
    activeNavigation === "bilimtoy-realtime" ||
    activeNavigation === "bilimtoy-games" ||
    activeNavigation === "bilimtoy-education" ||
    activeNavigation === "bilimtoy-development-map" ||
    activeNavigation === "bilimtoy-library";
  const financeActive = financeNavigationKeys.includes(activeNavigation);
  const analyticsActive = analyticsNavigationKeys.includes(activeNavigation);

  const [childrenParentsExpanded, setChildrenParentsExpanded] = useState(childrenParentsActive);
  const [hrExpanded, setHrExpanded] = useState(hrActive);
  const [bilimtoyExpanded, setBilimtoyExpanded] = useState(bilimtoyActive);
  const [financeExpanded, setFinanceExpanded] = useState(financeActive);
  const [analyticsExpanded, setAnalyticsExpanded] = useState(analyticsActive);

  const topItems = navItems.slice(0, 2);
  const bottomItems = navItems.slice(2);

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
        {topItems.map((item) => (
          <SidebarNavButton key={item.key} active={activeNavigation === item.key} icon={<item.icon className="h-5 w-5" />} label={t(item.labelKey)} onClick={() => onNavigate?.(item.key)} />
        ))}

        <SidebarGroupButton active={childrenParentsActive} expanded={childrenParentsExpanded} icon={<UserRoundPlus className="h-5 w-5" />} label={t("navigation.childrenParents")} onClick={() => setChildrenParentsExpanded((current) => !current)} />
        {childrenParentsExpanded ? <SidebarSubList items={childrenParentsNavItems} activeNavigation={activeNavigation} onNavigate={onNavigate} /> : null}

        <SidebarGroupButton active={hrActive} expanded={hrExpanded} icon={<UserRound className="h-5 w-5" />} label="HR" onClick={() => setHrExpanded((current) => !current)} />
        {hrExpanded ? <SidebarSubList items={hrNavItems} activeNavigation={activeNavigation} onNavigate={onNavigate} /> : null}

        {bottomItems.map((item) => {
          if (item.key === "bilimtoy") {
            return (
              <div key={item.key}>
                <SidebarGroupButton active={bilimtoyActive} expanded={bilimtoyExpanded} icon={<item.icon className="h-5 w-5" />} label={t(item.labelKey)} onClick={() => setBilimtoyExpanded((current) => !current)} />
                {bilimtoyExpanded ? (
                  <div className="mt-1 space-y-1 pb-1 pl-4">
                    {bilimtoyNavItems.map((subItem) => (
                      <button
                        key={subItem.key}
                        type="button"
                        className={cn(
                          "flex min-h-10 w-full items-center gap-2 rounded-input px-3 py-2 text-left text-sm font-medium leading-5 transition-colors",
                          activeNavigation === subItem.key ? "bg-primary-soft text-primary" : "text-text-secondary hover:bg-page hover:text-text-primary",
                        )}
                        onClick={() => onNavigate?.(subItem.key)}
                      >
                        <subItem.icon className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 whitespace-normal break-words">{t(subItem.labelKey)}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }

          if (item.key === "finance") {
            return (
              <div key={item.key}>
                <SidebarGroupButton active={financeActive} expanded={financeExpanded} icon={<item.icon className="h-5 w-5" />} label={t(item.labelKey)} onClick={() => setFinanceExpanded((current) => !current)} />
                {financeExpanded ? <SidebarSubList items={financeSubItems} activeNavigation={activeNavigation} onNavigate={onNavigate} nested /> : null}
              </div>
            );
          }

          if (item.key === "analytics") {
            return (
              <div key={item.key}>
                <SidebarGroupButton active={analyticsActive} expanded={analyticsExpanded} icon={<item.icon className="h-5 w-5" />} label={t(item.labelKey)} onClick={() => setAnalyticsExpanded((current) => !current)} />
                {analyticsExpanded ? <SidebarSubList items={analyticsSubItems} activeNavigation={activeNavigation} onNavigate={onNavigate} nested /> : null}
              </div>
            );
          }

          return <SidebarNavButton key={item.key} active={activeNavigation === item.key} icon={<item.icon className="h-5 w-5" />} label={t(item.labelKey)} onClick={() => onNavigate?.(item.key)} />;
        })}
      </nav>
    </aside>
  );
}

function SidebarNavButton({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-11 w-full items-center gap-3 rounded-input px-3 text-left text-sm font-medium transition-colors",
        active ? "bg-primary-soft text-primary" : "text-text-secondary hover:bg-page hover:text-text-primary",
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function SidebarGroupButton({ active, expanded, icon, label, onClick }: { active: boolean; expanded: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex min-h-11 w-full items-center gap-3 rounded-input px-3 text-left text-sm font-medium transition-colors",
        active ? "bg-primary-soft text-primary" : "text-text-secondary hover:bg-page hover:text-text-primary",
      )}
      onClick={onClick}
      aria-expanded={expanded}
    >
      {icon}
      <span className="min-w-0 flex-1">{label}</span>
      {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
    </button>
  );
}

function SidebarSubList({ items, activeNavigation, onNavigate, nested = false }: { items: readonly { key: SidebarNavigationKey; labelKey: string }[]; activeNavigation: SidebarNavigationKey; onNavigate?: (key: SidebarNavigationKey) => void; nested?: boolean }) {
  const { t } = useI18n();
  return (
    <div className={cn("space-y-1 pb-1 pl-4", nested && "mt-1")}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={cn(
            "flex min-h-10 w-full items-center rounded-input px-3 py-2 text-left text-sm font-medium leading-5 transition-colors",
            activeNavigation === item.key ? "bg-primary-soft text-primary" : "text-text-secondary hover:bg-page hover:text-text-primary",
          )}
          onClick={() => onNavigate?.(item.key)}
        >
          {t(item.labelKey)}
        </button>
      ))}
    </div>
  );
}
