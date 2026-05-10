import { useState } from "react";
import { CalendarPage } from "./app/routes/CalendarPage";
import { EmployeesPage } from "./app/routes/EmployeesPage";
import { FinancePage } from "./app/routes/FinancePage";
import { GroupsPage } from "./app/routes/GroupsPage";
import { KanbanPage } from "./app/routes/KanbanPage";
import { OrganizationPage } from "./app/routes/OrganizationPage";
import { UiKitPage } from "./app/routes/UiKitPage";
import type { SidebarNavigationKey } from "./components/layout/Sidebar";
import { I18nProvider } from "./i18n";

type AppView =
  | "organization"
  | "groups"
  | "employees"
  | "employeePayroll"
  | "employeeCalendar"
  | "employeeRoles"
  | "calendar"
  | "kanban"
  | "financeTariffs"
  | "financePayments"
  | "financeDebts"
  | "ui-kit";

export function App() {
  const [view, setView] = useState<AppView>(() => {
    if (window.location.pathname === "/ui-kit") return "ui-kit";
    if (window.location.pathname === "/groups") return "groups";
    if (window.location.pathname === "/employees") return "employees";
    if (window.location.pathname === "/employees/roles") return "employeeRoles";
    if (window.location.pathname === "/calendar") return "calendar";
    if (window.location.pathname === "/kanban") return "kanban";
    if (window.location.pathname === "/finance" || window.location.pathname === "/finance/tariffs") return "financeTariffs";
    if (window.location.pathname === "/finance/payments") return "financePayments";
    if (window.location.pathname === "/finance/debts") return "financeDebts";
    return "organization";
  });

  const navigate = (key: SidebarNavigationKey) => {
    if (
      key === "organization" ||
      key === "groups" ||
      key === "employees" ||
      key === "employeePayroll" ||
      key === "employeeCalendar" ||
      key === "employeeRoles" ||
      key === "calendar" ||
      key === "kanban" ||
      key === "financeTariffs" ||
      key === "financePayments" ||
      key === "financeDebts"
    ) {
      setView(key);
    }
  };

  return (
    <I18nProvider>
      {view === "ui-kit" ? <UiKitPage /> : null}
      {view === "organization" ? <OrganizationPage onNavigate={navigate} /> : null}
      {view === "groups" ? <GroupsPage onNavigate={navigate} /> : null}
      {view === "employees" ? <EmployeesPage onNavigate={navigate} initialTab="employees" /> : null}
      {view === "employeePayroll" ? <EmployeesPage onNavigate={navigate} initialTab="payroll" /> : null}
      {view === "employeeCalendar" ? <EmployeesPage onNavigate={navigate} initialTab="calendar" /> : null}
      {view === "employeeRoles" ? <EmployeesPage onNavigate={navigate} initialTab="roles" /> : null}
      {view === "calendar" ? <CalendarPage onNavigate={navigate} /> : null}
      {view === "kanban" ? <KanbanPage onNavigate={navigate} /> : null}
      {view === "financeTariffs" ? <FinancePage section="tariffs" onNavigate={navigate} /> : null}
      {view === "financePayments" ? <FinancePage section="payments" onNavigate={navigate} /> : null}
      {view === "financeDebts" ? <FinancePage section="debts" onNavigate={navigate} /> : null}
    </I18nProvider>
  );
}
