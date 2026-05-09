import { useState } from "react";
import { EmployeesPage } from "./app/routes/EmployeesPage";
import { GroupsPage } from "./app/routes/GroupsPage";
import { OrganizationPage } from "./app/routes/OrganizationPage";
import { UiKitPage } from "./app/routes/UiKitPage";
import type { SidebarNavigationKey } from "./components/layout/Sidebar";
import { I18nProvider } from "./i18n";

type AppView = "organization" | "groups" | "employees" | "ui-kit";

export function App() {
  const [view, setView] = useState<AppView>(() => {
    if (window.location.pathname === "/ui-kit") return "ui-kit";
    if (window.location.pathname === "/groups") return "groups";
    if (window.location.pathname === "/employees") return "employees";
    return "organization";
  });

  const navigate = (key: SidebarNavigationKey) => {
    if (key === "organization" || key === "groups" || key === "employees") setView(key);
  };

  return (
    <I18nProvider>
      {view === "ui-kit" ? <UiKitPage /> : null}
      {view === "organization" ? <OrganizationPage onNavigate={navigate} /> : null}
      {view === "groups" ? <GroupsPage onNavigate={navigate} /> : null}
      {view === "employees" ? <EmployeesPage onNavigate={navigate} /> : null}
    </I18nProvider>
  );
}
