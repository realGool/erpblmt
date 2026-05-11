import { useState } from "react";
import { AnalyticsPage } from "./app/routes/AnalyticsPage";
import { BilimtoyPage } from "./app/routes/BilimtoyPage";
import { CalendarPage } from "./app/routes/CalendarPage";
import { ChildrenPage } from "./app/routes/ChildrenPage";
import { EmployeesPage } from "./app/routes/EmployeesPage";
import { FinancePage } from "./app/routes/FinancePage";
import { GroupsPage } from "./app/routes/GroupsPage";
import { KanbanPage } from "./app/routes/KanbanPage";
import { OrganizationPage } from "./app/routes/OrganizationPage";
import { ParentsPage } from "./app/routes/ParentsPage";
import { ResourcesPage } from "./app/routes/ResourcesPage";
import { UiKitPage } from "./app/routes/UiKitPage";
import type { SidebarNavigationKey } from "./components/layout/Sidebar";
import { I18nProvider } from "./i18n";

type AppView =
  | "organization"
  | "groups"
  | "children"
  | "parents"
  | "employees"
  | "employeePayroll"
  | "employeeCalendar"
  | "employeeRoles"
  | "kanban"
  | "bilimtoy-realtime"
  | "bilimtoy-games"
  | "bilimtoy-education"
  | "bilimtoy-development-map"
  | "bilimtoy-library"
  | "financeTariffs"
  | "financePayments"
  | "financeDebts"
  | "resourcesInventory"
  | "resourcesFoodStock"
  | "resourcesPurchases"
  | "resourcesSuppliers"
  | "analyticsDashboard"
  | "analyticsDastur"
  | "analyticsComparison"
  | "analyticsFinance"
  | "analyticsAttendance"
  | "analyticsReports"
  | "ui-kit";

export function App() {
  const [view, setView] = useState<AppView>(() => {
    if (window.location.pathname === "/ui-kit") return "ui-kit";
    if (window.location.pathname === "/groups") return "groups";
    if (window.location.pathname === "/children") return "children";
    if (window.location.pathname === "/parents") return "parents";
    if (window.location.pathname.startsWith("/employees/") && !window.location.pathname.startsWith("/employees/payroll") && !window.location.pathname.startsWith("/employees/roles") && !window.location.pathname.startsWith("/employees/calendar")) return "employees";
    if (window.location.pathname === "/employees") return "employees";
    if (window.location.pathname === "/employees/payroll") return "employeePayroll";
    if (window.location.pathname === "/employees/roles") return "employeeRoles";
    if (window.location.pathname === "/hr/calendar" || window.location.pathname === "/calendar" || window.location.pathname === "/employees/calendar") return "employeeCalendar";
    if (window.location.pathname === "/kanban") return "kanban";
    if (window.location.pathname === "/bilimtoy/games") return "bilimtoy-games";
    if (window.location.pathname === "/bilimtoy/education") return "bilimtoy-education";
    if (window.location.pathname === "/bilimtoy/development-map") return "bilimtoy-development-map";
    if (window.location.pathname === "/bilimtoy/materials" || window.location.pathname === "/bilimtoy/library") return "bilimtoy-library";
    if (window.location.pathname === "/bilimtoy/realtime") return "bilimtoy-realtime";
    if (window.location.pathname === "/finance" || window.location.pathname === "/finance/tariffs") return "financeTariffs";
    if (window.location.pathname === "/finance/payments") return "financePayments";
    if (window.location.pathname === "/finance/debts") return "financeDebts";
    if (window.location.pathname === "/resources" || window.location.pathname === "/resources/inventory") return "resourcesInventory";
    if (window.location.pathname === "/resources/food-stock") return "resourcesFoodStock";
    if (window.location.pathname === "/resources/purchases") return "resourcesPurchases";
    if (window.location.pathname === "/resources/suppliers") return "resourcesSuppliers";
    if (window.location.pathname === "/analytics" || window.location.pathname === "/analytics/dashboard") return "analyticsDashboard";
    if (window.location.pathname === "/analytics/dastur") return "analyticsDastur";
    if (window.location.pathname === "/analytics/comparison") return "analyticsComparison";
    if (window.location.pathname === "/analytics/finance") return "analyticsFinance";
    if (window.location.pathname === "/analytics/attendance") return "analyticsAttendance";
    if (window.location.pathname === "/analytics/reports") return "analyticsReports";
    return "organization";
  });

  const navigate = (key: SidebarNavigationKey) => {
    if (key === "children") {
      setView("children");
      return;
    }
    if (key === "parents") {
      setView("parents");
      return;
    }
    if (key === "employees" || key === "employeePayroll" || key === "employeeCalendar" || key === "employeeRoles") {
      setView(key);
      return;
    }
    if (key === "bilimtoy" || key === "bilimtoy-realtime") {
      setView("bilimtoy-realtime");
      return;
    }
    if (key === "bilimtoy-games") {
      setView("bilimtoy-games");
      return;
    }
    if (key === "bilimtoy-education") {
      setView("bilimtoy-education");
      return;
    }
    if (key === "bilimtoy-development-map") {
      setView("bilimtoy-development-map");
      return;
    }
    if (key === "bilimtoy-library") {
      setView("bilimtoy-library");
      return;
    }
    if (key === "finance" || key === "financeTariffs") {
      setView("financeTariffs");
      return;
    }
    if (key === "financePayments") {
      setView("financePayments");
      return;
    }
    if (key === "financeDebts") {
      setView("financeDebts");
      return;
    }
    if (key === "resources" || key === "resourcesInventory") {
      setView("resourcesInventory");
      return;
    }
    if (key === "resourcesFoodStock" || key === "resourcesPurchases" || key === "resourcesSuppliers") {
      setView(key);
      return;
    }
    if (key === "kanban") {
      setView("kanban");
      return;
    }
    if (key === "analytics" || key === "analyticsDashboard") {
      setView("analyticsDashboard");
      return;
    }
    if (key === "analyticsDastur" || key === "analyticsComparison" || key === "analyticsFinance" || key === "analyticsAttendance" || key === "analyticsReports") {
      setView(key);
      return;
    }
    if (key === "organization" || key === "groups") {
      setView(key);
    }
  };

  return (
    <I18nProvider>
      {view === "ui-kit" ? <UiKitPage /> : null}
      {view === "organization" ? <OrganizationPage onNavigate={navigate} /> : null}
      {view === "groups" ? <GroupsPage onNavigate={navigate} /> : null}
      {view === "children" ? <ChildrenPage onNavigate={navigate} /> : null}
      {view === "parents" ? <ParentsPage onNavigate={navigate} /> : null}
      {view === "employees" ? <EmployeesPage onNavigate={navigate} initialTab="employees" /> : null}
      {view === "employeePayroll" ? <EmployeesPage onNavigate={navigate} initialTab="payroll" /> : null}
      {view === "employeeCalendar" ? <CalendarPage onNavigate={navigate} /> : null}
      {view === "employeeRoles" ? <EmployeesPage onNavigate={navigate} initialTab="roles" /> : null}
      {view === "bilimtoy-realtime" ? <BilimtoyPage section="realtime" onNavigate={navigate} /> : null}
      {view === "bilimtoy-games" ? <BilimtoyPage section="games" onNavigate={navigate} /> : null}
      {view === "bilimtoy-education" ? <BilimtoyPage section="education" onNavigate={navigate} /> : null}
      {view === "bilimtoy-development-map" ? <BilimtoyPage section="development-map" onNavigate={navigate} /> : null}
      {view === "bilimtoy-library" ? <BilimtoyPage section="library" onNavigate={navigate} /> : null}
      {view === "kanban" ? <KanbanPage onNavigate={navigate} /> : null}
      {view === "financeTariffs" ? <FinancePage section="tariffs" onNavigate={navigate} /> : null}
      {view === "financePayments" ? <FinancePage section="payments" onNavigate={navigate} /> : null}
      {view === "financeDebts" ? <FinancePage section="debts" onNavigate={navigate} /> : null}
      {view === "resourcesInventory" ? <ResourcesPage section="inventory" onNavigate={navigate} /> : null}
      {view === "resourcesFoodStock" ? <ResourcesPage section="foodStock" onNavigate={navigate} /> : null}
      {view === "resourcesPurchases" ? <ResourcesPage section="purchases" onNavigate={navigate} /> : null}
      {view === "resourcesSuppliers" ? <ResourcesPage section="suppliers" onNavigate={navigate} /> : null}
      {view === "analyticsDashboard" ? <AnalyticsPage section="dashboard" onNavigate={navigate} /> : null}
      {view === "analyticsDastur" ? <AnalyticsPage section="dastur" onNavigate={navigate} /> : null}
      {view === "analyticsComparison" ? <AnalyticsPage section="comparison" onNavigate={navigate} /> : null}
      {view === "analyticsFinance" ? <AnalyticsPage section="finance" onNavigate={navigate} /> : null}
      {view === "analyticsAttendance" ? <AnalyticsPage section="attendance" onNavigate={navigate} /> : null}
      {view === "analyticsReports" ? <AnalyticsPage section="reports" onNavigate={navigate} /> : null}
    </I18nProvider>
  );
}
