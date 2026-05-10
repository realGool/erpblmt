import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Banknote,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  Download,
  Gift,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  UserCog,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  EmptyState,
  FilterBar,
  Input,
  Modal,
  Pagination,
  Select,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui";
import {
  mockEmployees,
  mockPayrollRecords,
  payrollOperations,
  payrollPayments,
  payrollSalaryHistory,
  employeeRoles,
  roleModuleIds,
  type EmployeeRole,
  type PayrollPaymentType,
  type PayrollRecord,
  type RoleModuleId,
  type RolePermission,
} from "../../data/mockEmployees";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

interface EmployeesPageProps {
  onNavigate?: (key: SidebarNavigationKey) => void;
  initialTab?: EmployeeTabId;
}

type EmployeeTabId = "employees" | "payroll" | "calendar" | "roles";

export function EmployeesPage({ onNavigate, initialTab = "employees" }: EmployeesPageProps) {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<EmployeeTabId>(initialTab);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollRecord | null>(null);
  const [payrollSearch, setPayrollSearch] = useState("");
  const [payrollBranch, setPayrollBranch] = useState("all");
  const [payrollPosition, setPayrollPosition] = useState("all");

  useEffect(() => {
    setActiveTab(initialTab);
    setPage(1);
  }, [initialTab]);

  const roles = useMemo(() => Array.from(new Set(mockEmployees.map((employee) => employee.systemRole))), []);
  const positions = useMemo(() => Array.from(new Set(mockEmployees.map((employee) => employee.position))), []);
  const branches = useMemo(() => Array.from(new Set(mockEmployees.map((employee) => employee.branch))), []);
  const payrollBranches = useMemo(() => Array.from(new Set(mockPayrollRecords.map((record) => record.organizationBranch))), []);
  const payrollPositions = useMemo(() => Array.from(new Set(mockPayrollRecords.map((record) => record.position))), []);
  const filteredPayrollRecords = useMemo(() => {
    const query = payrollSearch.trim().toLocaleLowerCase();

    return mockPayrollRecords.filter((record) => {
      const matchesSearch = !query || record.fullName.toLocaleLowerCase().includes(query);
      const matchesBranch = payrollBranch === "all" || record.organizationBranch === payrollBranch;
      const matchesPosition = payrollPosition === "all" || record.position === payrollPosition;
      return matchesSearch && matchesBranch && matchesPosition;
    });
  }, [payrollBranch, payrollPosition, payrollSearch]);

  const isPayroll = activeTab === "payroll";
  const isRoles = activeTab === "roles";
  const activeNavigation: SidebarNavigationKey =
    activeTab === "payroll" ? "employeePayroll" : activeTab === "calendar" ? "employeeCalendar" : activeTab === "roles" ? "employeeRoles" : "employees";

  return (
    <AppShell activeNavigation={activeNavigation} onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title={isPayroll ? t("employees.payroll.title") : isRoles ? t("employees.roles.title") : activeTab === "employees" ? t("employees.page.title") : t("employees.tabs.calendar")}
          description={isPayroll ? t("employees.payroll.description") : isRoles ? t("employees.roles.description") : t("employees.page.description")}
          breadcrumbs={[
            { label: t("navigation.home"), href: "#" },
            { label: t("navigation.employees") },
            ...(isPayroll ? [{ label: t("employees.tabs.payroll") }] : []),
            ...(isRoles ? [{ label: t("employees.tabs.roles") }] : []),
          ]}
          actions={
            activeTab === "employees" ? (
              <>
                <Button leftIcon={<Plus className="h-4 w-4" />}>{t("employees.actions.addEmployee")}</Button>
                <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>{t("common.actions.export")}</Button>
              </>
            ) : isPayroll && selectedPayrollRecord ? (
              <PayrollActions />
            ) : null
          }
        />

        <div className="space-y-6">
          {activeTab === "employees" ? (
            <EmployeesTableView roles={roles} positions={positions} branches={branches} page={page} onPageChange={setPage} />
          ) : isPayroll && selectedPayrollRecord ? (
            <PayrollDetailView record={selectedPayrollRecord} page={page} onPageChange={setPage} />
          ) : isPayroll ? (
            <PayrollTableView
              records={filteredPayrollRecords}
              search={payrollSearch}
              branch={payrollBranch}
              position={payrollPosition}
              branches={payrollBranches}
              positions={payrollPositions}
              page={page}
              onSearchChange={setPayrollSearch}
              onBranchChange={setPayrollBranch}
              onPositionChange={setPayrollPosition}
              onPageChange={setPage}
              onOpenRecord={setSelectedPayrollRecord}
            />
          ) : isRoles ? (
            <RolesView page={page} onPageChange={setPage} />
          ) : (
            <Card>
              <CardContent>
                <EmptyState title={t("employees.placeholder.title")} description={t("employees.placeholder.description")} />
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}

function PayrollActions() {
  const { t } = useI18n();
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <>
      <Button variant="outline" leftIcon={<Pencil className="h-4 w-4" />}>{t("employees.payroll.actions.editSalary")}</Button>
      <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setPaymentOpen(true)}>{t("employees.payroll.actions.addPayment")}</Button>
      <PayrollPaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </>
  );
}

const roleModuleIcon: Record<RoleModuleId, ReactNode> = {
  organizations: <Building2 className="h-4 w-4" />,
  groups: <Users className="h-4 w-4" />,
  employees: <UserRound className="h-4 w-4" />,
  kanban: <ListChecksIcon />,
  childrenParents: <Users className="h-4 w-4" />,
  bilimtoy: <Gift className="h-4 w-4" />,
  resources: <BriefcaseBusiness className="h-4 w-4" />,
  finance: <WalletCards className="h-4 w-4" />,
  analytics: <BarChart3 className="h-4 w-4" />,
  notifications: <BellIcon />,
  profile: <UserCog className="h-4 w-4" />,
  dictionaries: <BookIcon />,
};

function ListChecksIcon() {
  return <MoreVertical className="h-4 w-4" />;
}

function BellIcon() {
  return <Clock3 className="h-4 w-4" />;
}

function BookIcon() {
  return <BriefcaseBusiness className="h-4 w-4" />;
}

function RolesView({ page, onPageChange }: { page: number; onPageChange: (page: number) => void }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<EmployeeRole | null>(null);

  const filteredRoles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return employeeRoles.filter((role) => !normalizedQuery || role.name.toLocaleLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[minmax(260px,1fr)_320px_auto] lg:items-end">
        <Input
          label={t("employees.roles.filters.searchLabel")}
          placeholder={t("employees.roles.filters.search")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
        <Select
          label={t("employees.roles.filters.sort")}
          defaultValue="newest"
          options={[{ label: t("employees.roles.filters.newest"), value: "newest" }]}
        />
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          {t("employees.roles.actions.create")}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-5">
          <h3 className="text-card-title text-text-primary">{t("employees.roles.listTitle")}</h3>
          <TableContainer>
            <Table>
              <TableHeader className="normal-case">
                <TableRow>
                  <TableHead className="w-20">№</TableHead>
                  <TableHead>{t("employees.roles.table.name")}</TableHead>
                  <TableHead>{t("employees.roles.table.userCount")}</TableHead>
                  <TableHead className="text-right">{t("employees.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id} className="cursor-pointer" onClick={() => setActiveRole(role)}>
                    <TableCell>{role.id}</TableCell>
                    <TableCell className="font-semibold">{role.name}</TableCell>
                    <TableCell>{role.userCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("employees.roles.actions.open")}
                        onClick={(event) => {
                          event.stopPropagation();
                          setActiveRole(role);
                        }}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Select className="w-40" defaultValue="10" options={[{ label: t("employees.table.perPage"), value: "10" }]} />
            <Pagination page={page} pageCount={5} onPageChange={onPageChange} />
          </div>
        </CardContent>
      </Card>

      <RoleFormModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <RoleReadModal role={activeRole} onClose={() => setActiveRole(null)} />
    </>
  );
}

function RoleFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<RolePermission[]>(createEmptyRolePermissions);

  useEffect(() => {
    if (!open) return;
    setRoleName("");
    setPermissions(createEmptyRolePermissions());
  }, [open]);

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={t("employees.roles.modal.addTitle")}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
          <Button onClick={onClose}>{t("common.actions.save")}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input
          label={t("employees.roles.fields.name")}
          placeholder={t("employees.roles.fields.namePlaceholder")}
          value={roleName}
          onChange={(event) => setRoleName(event.target.value)}
        />
        <RolePermissionEditor permissions={permissions} onPermissionsChange={setPermissions} />
      </div>
    </Modal>
  );
}

function createEmptyRolePermissions(): RolePermission[] {
  return roleModuleIds.map((moduleId) => ({ moduleId, read: false, write: false, full: false }));
}

function RolePermissionEditor({
  permissions,
  onPermissionsChange,
}: {
  permissions: RolePermission[];
  onPermissionsChange: (permissions: RolePermission[]) => void;
}) {
  const { t } = useI18n();

  const updatePermission = (moduleId: RoleModuleId, key: keyof Omit<RolePermission, "moduleId">, checked: boolean) => {
    onPermissionsChange(
      permissions.map((permission) =>
        permission.moduleId === moduleId ? { ...permission, [key]: checked } : permission,
      ),
    );
  };

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-text-primary">{t("employees.roles.permissions.title")}</h3>
      <div className="max-h-[520px] overflow-auto rounded-card border border-border">
        <Table>
          <TableHeader className="normal-case">
            <TableRow>
              <TableHead>{t("employees.roles.permissions.module")}</TableHead>
              <TableHead className="text-center">{t("employees.roles.permissions.read")}</TableHead>
              <TableHead className="text-center">{t("employees.roles.permissions.write")}</TableHead>
              <TableHead className="text-center">{t("employees.roles.permissions.full")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => {
              const moduleLabel = t(`employees.roles.modules.${permission.moduleId}`);

              return (
                <TableRow key={permission.moduleId}>
                  <TableCell>
                    <RoleModuleLabel moduleId={permission.moduleId} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Checkbox
                        aria-label={`${moduleLabel} ${t("employees.roles.permissions.read")}`}
                        checked={permission.read}
                        onChange={(event) => updatePermission(permission.moduleId, "read", event.target.checked)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Checkbox
                        aria-label={`${moduleLabel} ${t("employees.roles.permissions.write")}`}
                        checked={permission.write}
                        onChange={(event) => updatePermission(permission.moduleId, "write", event.target.checked)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Checkbox
                        aria-label={`${moduleLabel} ${t("employees.roles.permissions.full")}`}
                        checked={permission.full}
                        onChange={(event) => updatePermission(permission.moduleId, "full", event.target.checked)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RoleReadModal({ role, onClose }: { role: EmployeeRole | null; onClose: () => void }) {
  const { t } = useI18n();
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<RolePermission[]>([]);

  useEffect(() => {
    if (!role) return;
    setRoleName(role.name);
    setPermissions(role.permissions.map((permission) => ({ ...permission })));
  }, [role]);

  const isDirty = role
    ? roleName !== role.name || JSON.stringify(permissions) !== JSON.stringify(role.permissions)
    : false;

  return (
    <Modal
      open={Boolean(role)}
      onOpenChange={(open) => !open && onClose()}
      title={t("employees.roles.modal.readTitle")}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
          <Button disabled={!isDirty} onClick={onClose}>{t("common.actions.save")}</Button>
        </>
      }
    >
      {role ? (
        <div className="space-y-5">
          <Input
            label={t("employees.roles.fields.name")}
            value={roleName}
            onChange={(event) => setRoleName(event.target.value)}
          />
          <RolePermissionEditor permissions={permissions} onPermissionsChange={setPermissions} />

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">{t("employees.roles.users.title")}</h3>
            <div className="rounded-card border border-border">
              <Table>
                <TableHeader className="normal-case">
                  <TableRow>
                    <TableHead>{t("employees.roles.users.fullName")}</TableHead>
                    <TableHead>{t("employees.roles.users.position")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(role.users.length ? role.users : [{ id: "empty-user", fullName: "—", position: "—", initials: "—" }]).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.initials !== "—" ? <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">{user.initials}</div> : null}
                          <span>{user.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.position}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function RoleModuleLabel({ moduleId }: { moduleId: RoleModuleId }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3">
      <span className="text-text-secondary">{roleModuleIcon[moduleId]}</span>
      <span className="font-medium">{t(`employees.roles.modules.${moduleId}`)}</span>
    </div>
  );
}

interface EmployeesTableViewProps {
  roles: string[];
  positions: string[];
  branches: string[];
  page: number;
  onPageChange: (page: number) => void;
}

function EmployeesTableView({ roles, positions, branches, page, onPageChange }: EmployeesTableViewProps) {
  const { t } = useI18n();

  return (
    <>
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
              <Pagination page={page} pageCount={6} onPageChange={onPageChange} />
              <Select className="w-40" defaultValue="10" options={[{ label: t("employees.table.perPage"), value: "10" }]} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function PayrollDetailView({ record, page, onPageChange }: { record: PayrollRecord; page: number; onPageChange: (page: number) => void }) {
  const { t } = useI18n();
  const currencySuffix = t("employees.payroll.currencySuffix");
  const profile = {
    fullName: record.fullName,
    position: record.position,
    status: t("employees.payroll.profile.active"),
    employeeId: `EMP-${String(record.id).padStart(5, "0")}`,
    branch: record.organizationBranch,
    hiredAt: "15.02.2024",
    salary: record.currentSalary,
  };
  const yearlyTotal = payrollPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_390px]">
      <div className="space-y-5">
        <Card>
          <CardContent className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_180px] xl:items-center">
            <div className="flex items-center gap-5">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary-soft text-3xl font-semibold text-primary">
                СН
              </div>
              <div>
                <h2 className="text-2xl font-semibold leading-tight text-text-primary">{profile.fullName}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="info">{profile.position}</Badge>
                  <StatusBadge status="success">{profile.status}</StatusBadge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 border-y border-border py-5 md:grid-cols-2 xl:border-x xl:border-y-0 xl:px-5 xl:py-0">
              <PayrollInfo icon={<BriefcaseBusiness className="h-5 w-5" />} label={t("employees.payroll.profile.employeeId")} value={profile.employeeId} />
              <PayrollInfo icon={<MapPin className="h-5 w-5" />} label={t("employees.payroll.profile.branch")} value={profile.branch} />
              <PayrollInfo icon={<CalendarDays className="h-5 w-5" />} label={t("employees.payroll.profile.hiredAt")} value={profile.hiredAt} />
              <PayrollInfo icon={<UserRound className="h-5 w-5" />} label={t("employees.payroll.table.position")} value={profile.position} />
            </div>

            <div className="rounded-card bg-page p-4">
              <div className="flex items-center gap-3 text-text-secondary">
                <WalletCards className="h-5 w-5" />
                <span className="text-sm font-medium">{t("employees.payroll.profile.salary")}</span>
              </div>
              <div className="mt-2 text-lg font-semibold text-text-primary">{formatSom(profile.salary, currencySuffix)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-card-title text-text-primary">{t("employees.payroll.salaryHistory.title")}</h3>
            <TableContainer>
              <Table>
                <TableHeader className="normal-case">
                  <TableRow>
                    <TableHead>{t("employees.payroll.salaryHistory.changedAt")}</TableHead>
                    <TableHead>{t("employees.payroll.salaryHistory.type")}</TableHead>
                    <TableHead>{t("employees.payroll.salaryHistory.before")}</TableHead>
                    <TableHead>{t("employees.payroll.salaryHistory.after")}</TableHead>
                    <TableHead>{t("employees.payroll.salaryHistory.author")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollSalaryHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell><PayrollTypeBadge type={item.type} /></TableCell>
                      <TableCell>{item.beforeAmount ? formatSom(item.beforeAmount, currencySuffix) : "—"}</TableCell>
                      <TableCell>{formatSom(item.afterAmount, currencySuffix)}</TableCell>
                      <TableCell>{item.author}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-card-title text-text-primary">{t("employees.payroll.paymentsTable.title")}</h3>
            <TableContainer>
              <Table>
                <TableHeader className="normal-case">
                  <TableRow>
                    <TableHead>{t("employees.payroll.paymentsTable.date")}</TableHead>
                    <TableHead>{t("employees.payroll.paymentsTable.amount")}</TableHead>
                    <TableHead>{t("employees.payroll.paymentsTable.type")}</TableHead>
                    <TableHead>{t("employees.payroll.paymentsTable.responsible")}</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell className="font-semibold">{formatSom(payment.amount, currencySuffix)}</TableCell>
                      <TableCell><PayrollTypeBadge type={payment.type} /></TableCell>
                      <TableCell>{payment.responsible}</TableCell>
                      <TableCell><ChevronRight className="h-4 w-4 text-text-muted" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm font-medium text-text-secondary">{t("employees.payroll.paymentsTable.total", { shown: 10, total: 28 })}</div>
              <div className="flex items-center gap-3">
                <Pagination page={page} pageCount={3} onPageChange={onPageChange} />
                <Select className="w-40" defaultValue="10" options={[{ label: t("employees.table.perPage"), value: "10" }]} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardContent className="space-y-3">
            <h3 className="text-card-title text-text-primary">{t("employees.payroll.summary.title")}</h3>
            <PayrollSummaryLine icon={<WalletCards className="h-5 w-5" />} label={t("employees.payroll.summary.salary")} value={formatSom(profile.salary, currencySuffix)} tone="success" />
            <PayrollSummaryLine icon={<Banknote className="h-5 w-5" />} label={t("employees.payroll.summary.lastPayment")} value={formatSom(profile.salary, currencySuffix)} tone="info" />
            <PayrollSummaryLine icon={<CalendarDays className="h-5 w-5" />} label={t("employees.payroll.summary.paymentDate")} value="30.04.2026" tone="info" />
            <PayrollSummaryLine icon={<BarChart3 className="h-5 w-5" />} label={t("employees.payroll.summary.yearPayments")} value="14" tone="success" />
            <PayrollSummaryLine icon={<Gift className="h-5 w-5" />} label={t("employees.payroll.summary.yearBonuses")} value="3" tone="warning" />
            <PayrollSummaryLine icon={<Clock3 className="h-5 w-5" />} label={t("employees.payroll.summary.yearAdvances")} value="4" tone="purple" />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-card-title text-text-primary">{t("employees.payroll.structure.title")}</h3>
            <div className="mt-5 flex items-center gap-5">
              <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(var(--color-success-text) 0 76%, var(--color-warning-text) 76% 98%, var(--color-purple-text) 98% 100%)" }}>
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-surface text-center">
                  <span className="text-base font-semibold text-text-primary">{formatSom(yearlyTotal, currencySuffix)}</span>
                  <span className="text-xs text-text-muted">{t("employees.payroll.structure.total")}</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <PayrollLegend dot="bg-success-text" label={t("employees.payroll.types.salary")} value={`84 500 000 ${currencySuffix} (76,1%)`} />
                <PayrollLegend dot="bg-warning-text" label={t("employees.payroll.types.advance")} value={`24 000 000 ${currencySuffix} (21,6%)`} />
                <PayrollLegend dot="bg-purple-text" label={t("employees.payroll.types.bonus")} value={`2 700 000 ${currencySuffix} (2,4%)`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-card-title text-text-primary">{t("employees.payroll.operations.title")}</h3>
            <div className="mt-4 divide-y divide-border">
              {payrollOperations.map((operation) => (
                <div key={operation.id} className="flex items-center gap-3 py-3">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-input", operation.type === "salaryChanged" ? "bg-success-bg text-success-text" : operation.type === "bonusAdded" ? "bg-purple-bg text-purple-text" : "bg-info-bg text-info-text")}>
                    {operation.type === "salaryChanged" ? <Pencil className="h-4 w-4" /> : operation.type === "bonusAdded" ? <Gift className="h-4 w-4" /> : <WalletCards className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-text-primary">{operation.title}</div>
                    <div className="text-xs text-text-muted">{operation.meta}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PayrollInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-text-secondary">{icon}</div>
      <div>
        <div className="text-xs font-medium text-text-muted">{label}</div>
        <div className="mt-1 text-sm font-semibold text-text-primary">{value}</div>
      </div>
    </div>
  );
}

function PayrollSummaryLine({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: "success" | "info" | "warning" | "purple" }) {
  const toneClass = {
    success: "bg-success-bg text-success-text",
    info: "bg-info-bg text-info-text",
    warning: "bg-warning-bg text-warning-text",
    purple: "bg-purple-bg text-purple-text",
  }[tone];

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-input", toneClass)}>{icon}</div>
        <span className="text-sm font-medium text-text-secondary">{label}</span>
      </div>
      <span className="text-sm font-semibold text-text-primary">{value}</span>
    </div>
  );
}

function PayrollLegend({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={cn("mt-1.5 h-2.5 w-2.5 rounded-full", dot)} />
      <div>
        <div className="font-medium text-text-secondary">{label}</div>
        <div className="font-semibold text-text-primary">{value}</div>
      </div>
    </div>
  );
}

function PayrollTypeBadge({ type }: { type: PayrollPaymentType }) {
  const { t } = useI18n();
  const variant = type === "salary" ? "success" : type === "advance" ? "warning" : "purple";
  return <Badge variant={variant}>{t(`employees.payroll.types.${type}`)}</Badge>;
}

function PayrollPaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const currencySuffix = t("employees.payroll.currencySuffix");
  const [paymentType, setPaymentType] = useState<PayrollPaymentType>("salary");

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={t("employees.payroll.paymentModal.title")}
      description={t("employees.payroll.paymentModal.description")}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
          <Button onClick={onClose}>{t("employees.payroll.paymentModal.submit")}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label={t("employees.payroll.paymentModal.paymentType")}
          value={paymentType}
          onChange={(event) => setPaymentType(event.target.value as PayrollPaymentType)}
          options={[
            { label: t("employees.payroll.types.salary"), value: "salary" },
            { label: t("employees.payroll.types.advance"), value: "advance" },
            { label: t("employees.payroll.types.bonus"), value: "bonus" },
          ]}
        />
        <Input label={t("employees.payroll.profile.salary")} defaultValue={`6 500 000 ${currencySuffix}`} disabled />
        <Input label={t("employees.payroll.paymentModal.amount")} defaultValue={`6 500 000 ${currencySuffix}`} />
        <p className="text-xs text-text-muted">{t("employees.payroll.paymentModal.amountHint")}</p>
        <Input label={t("employees.payroll.paymentModal.paymentDate")} type="date" defaultValue="2026-04-30" />
      </div>
    </Modal>
  );
}

interface PayrollTableViewProps {
  records: PayrollRecord[];
  search: string;
  branch: string;
  position: string;
  branches: string[];
  positions: string[];
  page: number;
  onSearchChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onOpenRecord: (record: PayrollRecord) => void;
}

function PayrollTableView({
  records,
  search,
  branch,
  position,
  branches,
  positions,
  page,
  onSearchChange,
  onBranchChange,
  onPositionChange,
  onPageChange,
  onOpenRecord,
}: PayrollTableViewProps) {
  const { t } = useI18n();
  const currencySuffix = t("employees.payroll.currencySuffix");

  return (
    <>
      <Card>
        <CardContent>
          <FilterBar
            left={
              <Input
                className="w-full sm:w-[360px]"
                aria-label={t("employees.payroll.filters.search")}
                placeholder={t("employees.payroll.filters.search")}
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            }
            right={
              <>
                <Select
                  className="w-72"
                  label={t("employees.payroll.filters.branch")}
                  value={branch}
                  onChange={(event) => onBranchChange(event.target.value)}
                  options={[{ label: t("employees.payroll.filters.allBranches"), value: "all" }, ...branches.map((item) => ({ label: item, value: item }))]}
                />
                <Select
                  className="w-72"
                  label={t("employees.payroll.filters.position")}
                  value={position}
                  onChange={(event) => onPositionChange(event.target.value)}
                  options={[{ label: t("employees.payroll.filters.allPositions"), value: "all" }, ...positions.map((item) => ({ label: item, value: item }))]}
                />
              </>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5">
          {records.length ? (
            <>
              <TableContainer>
                <Table className="min-w-[1320px]">
                  <TableHeader className="normal-case">
                    <TableRow>
                      <TableHead>{t("employees.payroll.table.fullName")}</TableHead>
                      <TableHead>{t("employees.payroll.table.position")}</TableHead>
                      <TableHead>{t("employees.payroll.table.contractNumber")}</TableHead>
                      <TableHead>{t("employees.payroll.table.organizationBranch")}</TableHead>
                      <TableHead>{t("employees.payroll.table.currentSalary")}</TableHead>
                      <TableHead>{t("employees.payroll.table.lastPayment")}</TableHead>
                      <TableHead>{t("employees.payroll.table.paymentDate")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id} className="cursor-pointer" onClick={() => onOpenRecord(record)}>
                        <TableCell className="font-medium">{record.fullName}</TableCell>
                        <TableCell>{record.position}</TableCell>
                        <TableCell>{record.contractNumber}</TableCell>
                        <TableCell>{record.organizationBranch}</TableCell>
                        <TableCell>{formatSom(record.currentSalary, currencySuffix)}</TableCell>
                        <TableCell>{formatSom(record.lastPayment, currencySuffix)}</TableCell>
                        <TableCell>{record.paymentDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-sm font-medium text-text-secondary">
                  {t("employees.payroll.table.total", { shown: records.length, total: 27 })}
                </div>
                <div className="flex items-center gap-3">
                  <Pagination page={page} pageCount={6} onPageChange={onPageChange} />
                  <Select className="w-40" defaultValue="10" options={[{ label: t("employees.table.perPage"), value: "10" }]} />
                </div>
              </div>
            </>
          ) : (
            <EmptyState title={t("employees.payroll.empty.title")} description={t("employees.payroll.empty.description")} />
          )}
        </CardContent>
      </Card>
    </>
  );
}

function formatSom(value: number, currencySuffix: string) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ${currencySuffix}`;
}
