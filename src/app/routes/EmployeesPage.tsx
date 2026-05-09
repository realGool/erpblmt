import { useMemo, useState } from "react";
import { Download, MoreVertical, Plus } from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import { Button, Card, CardContent, FilterBar, Pagination, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "../../components/ui";
import { employeeTabs, mockEmployees } from "../../data/mockEmployees";
import { useI18n } from "../../i18n";

interface EmployeesPageProps {
  onNavigate?: (key: SidebarNavigationKey) => void;
}

export function EmployeesPage({ onNavigate }: EmployeesPageProps) {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("employees");

  const roles = useMemo(() => Array.from(new Set(mockEmployees.map((employee) => employee.systemRole))), []);
  const positions = useMemo(() => Array.from(new Set(mockEmployees.map((employee) => employee.position))), []);
  const branches = useMemo(() => Array.from(new Set(mockEmployees.map((employee) => employee.branch))), []);

  return (
    <AppShell activeNavigation="employees" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title={t("employees.page.title")}
          breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.employees") }]}
          actions={
            <>
              <Button leftIcon={<Plus className="h-4 w-4" />}>{t("employees.actions.addEmployee")}</Button>
              <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>{t("common.actions.export")}</Button>
            </>
          }
        />

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-7 border-b border-border">
            {employeeTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`border-b-2 pb-4 text-base font-medium transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Card>
            <CardContent>
              <FilterBar
                left={
                  <Select
                    className="w-72"
                    label={t("employees.filters.sort")}
                    defaultValue="newest"
                    options={[{ label: t("employees.filters.newestFirst"), value: "newest" }]}
                  />
                }
                right={
                  <>
                    <Select
                      className="w-72"
                      label={t("employees.filters.role")}
                      defaultValue="all"
                      options={[{ label: t("employees.filters.allRoles"), value: "all" }, ...roles.map((item) => ({ label: item, value: item }))]}
                    />
                    <Select
                      className="w-72"
                      label={t("employees.filters.position")}
                      defaultValue="all"
                      options={[{ label: t("employees.filters.allPositions"), value: "all" }, ...positions.map((item) => ({ label: item, value: item }))]}
                    />
                    <Select
                      className="w-72"
                      label={t("employees.filters.branch")}
                      defaultValue="all"
                      options={[{ label: t("employees.filters.allBranches"), value: "all" }, ...branches.map((item) => ({ label: item, value: item }))]}
                    />
                  </>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5">
              <h3 className="text-card-title text-text-primary">{t("employees.table.title")}</h3>

              <TableContainer>
                <Table className="min-w-[1500px]">
                  <TableHeader className="normal-case">
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>{t("employees.table.passport")}</TableHead>
                      <TableHead>{t("employees.table.fullName")}</TableHead>
                      <TableHead>{t("employees.table.position")}</TableHead>
                      <TableHead>{t("employees.table.systemRole")}</TableHead>
                      <TableHead>{t("employees.table.age")}</TableHead>
                      <TableHead>{t("employees.table.phone")}</TableHead>
                      <TableHead>{t("employees.table.branch")}</TableHead>
                      <TableHead>{t("employees.table.contract")}</TableHead>
                      <TableHead>{t("employees.table.salary")}</TableHead>
                      <TableHead>{t("employees.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>{employee.passport}</TableCell>
                        <TableCell className="font-medium">{employee.fullName}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.systemRole}</TableCell>
                        <TableCell>{employee.age}</TableCell>
                        <TableCell>{employee.phone}</TableCell>
                        <TableCell>{employee.branch}</TableCell>
                        <TableCell>{employee.contractNumber}</TableCell>
                        <TableCell>{employee.salary}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" aria-label={t("employees.table.actions")}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm font-medium text-text-secondary">{t("employees.table.total", { shown: 10, total: 27 })}</div>
                <div className="flex items-center gap-3">
                  <Pagination page={page} pageCount={6} onPageChange={setPage} />
                  <Select className="w-40" defaultValue="10" options={[{ label: t("employees.table.perPage"), value: "10" }]} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </AppShell>
  );
}
