import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  Banknote,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Folder,
  Gift,
  GraduationCap,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  UploadCloud,
  UserCog,
  UserCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import {
  AvatarUpload,
  Badge,
  Button,
  Card,
  CardContent,
  Checkbox,
  CrudSelect,
  EmptyState,
  FileUploadZone,
  Input,
  Modal,
  ModalFooter,
  Pagination,
  SearchField,
  SearchableSelect,
  Select,
  StatusBadge,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  Textarea,
} from "../../components/ui";
import {
  mockEmployees,
  mockPayrollRecords,
  payrollOperations,
  payrollPayments,
  payrollSalaryHistory,
  employeeRoles,
  roleModuleIds,
  type EmployeeRecord,
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
type EmployeeDetailModal = "vacation" | "uploadDocument" | "documents" | "assignGroups" | null;

const employeeDocuments = [
  { id: "passport", name: "паспорт.pdf", type: "Паспорт", format: "PDF", size: "452 КБ", date: "15.02.2024" },
  { id: "diploma", name: "диплом.pdf", type: "Диплом", format: "PDF", size: "1.2 МБ", date: "15.02.2024" },
  { id: "contract", name: "трудовой_договор.pdf", type: "Договор", format: "PDF", size: "968 КБ", date: "15.02.2024" },
  { id: "medical", name: "медкнижка.pdf", type: "Медицинская книжка", format: "PDF", size: "786 КБ", date: "21.02.2024" },
  { id: "certificate", name: "сертификат_повышения.pdf", type: "Сертификат", format: "PDF", size: "640 КБ", date: "04.03.2024" },
  { id: "reference", name: "справка.pdf", type: "Прочее", format: "PDF", size: "312 КБ", date: "12.03.2024" },
];

export function EmployeesPage({ onNavigate, initialTab = "employees" }: EmployeesPageProps) {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<EmployeeTabId>(initialTab);
  const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollRecord | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(() => {
    const match = window.location.pathname.match(/^\/employees\/(\d+)/);
    return match ? Number(match[1]) : null;
  });
  const [detailModal, setDetailModal] = useState<EmployeeDetailModal>(null);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [editEmployeeOpen, setEditEmployeeOpen] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeRoleFilter, setEmployeeRoleFilter] = useState("all");
  const [employeePositionFilter, setEmployeePositionFilter] = useState("all");
  const [employeeBranchFilter, setEmployeeBranchFilter] = useState("all");
  const [employeeSort, setEmployeeSort] = useState("newest");
  const [payrollSearch, setPayrollSearch] = useState("");
  const [payrollBranch, setPayrollBranch] = useState("all");
  const [payrollPosition, setPayrollPosition] = useState("all");
  const [payrollSort, setPayrollSort] = useState("newest");

  useEffect(() => {
    setActiveTab(initialTab);
    setPage(1);
  }, [initialTab]);

  const roles = useMemo(() => Array.from(new Set(mockEmployees.map((employee) => employee.systemRole))), []);
  const positions = useMemo(() => Array.from(new Set(mockEmployees.map((employee) => employee.position))), []);
  const branches = useMemo(() => Array.from(new Set(mockEmployees.map((employee) => employee.branch))), []);
  const filteredEmployees = useMemo(() => {
    const query = employeeSearch.trim().toLocaleLowerCase();

    return mockEmployees
      .filter((employee) => {
        const matchesSearch =
          !query ||
          employee.fullName.toLocaleLowerCase().includes(query) ||
          employee.phone.toLocaleLowerCase().includes(query) ||
          employee.passport.toLocaleLowerCase().includes(query);
        const matchesRole = employeeRoleFilter === "all" || employee.systemRole === employeeRoleFilter;
        const matchesPosition = employeePositionFilter === "all" || employee.position === employeePositionFilter;
        const matchesBranch = employeeBranchFilter === "all" || employee.branch === employeeBranchFilter;
        return matchesSearch && matchesRole && matchesPosition && matchesBranch;
      })
      .sort((first, second) => {
        if (employeeSort === "name") return first.fullName.localeCompare(second.fullName, "ru");
        if (employeeSort === "salary") return moneyToNumber(second.salary) - moneyToNumber(first.salary);
        return employeeSort === "oldest" ? first.id - second.id : second.id - first.id;
      });
  }, [employeeBranchFilter, employeePositionFilter, employeeRoleFilter, employeeSearch, employeeSort]);
  const payrollBranches = useMemo(() => Array.from(new Set(mockPayrollRecords.map((record) => record.organizationBranch))), []);
  const payrollPositions = useMemo(() => Array.from(new Set(mockPayrollRecords.map((record) => record.position))), []);
  const filteredPayrollRecords = useMemo(() => {
    const query = payrollSearch.trim().toLocaleLowerCase();

    return mockPayrollRecords
      .filter((record) => {
        const matchesSearch = !query || record.fullName.toLocaleLowerCase().includes(query);
        const matchesBranch = payrollBranch === "all" || record.organizationBranch === payrollBranch;
        const matchesPosition = payrollPosition === "all" || record.position === payrollPosition;
        return matchesSearch && matchesBranch && matchesPosition;
      })
      .sort((first, second) => {
        if (payrollSort === "name") return first.fullName.localeCompare(second.fullName, "ru");
        if (payrollSort === "salary") return second.currentSalary - first.currentSalary;
        if (payrollSort === "oldest") return parseRuDate(first.paymentDate) - parseRuDate(second.paymentDate);
        return parseRuDate(second.paymentDate) - parseRuDate(first.paymentDate);
      });
  }, [payrollBranch, payrollPosition, payrollSearch, payrollSort]);

  const isPayroll = activeTab === "payroll";
  const isRoles = activeTab === "roles";
  const selectedEmployee = selectedEmployeeId ? (mockEmployees.find((employee) => employee.id === selectedEmployeeId) ?? mockEmployees[0]) : null;
  const activeNavigation: SidebarNavigationKey =
    activeTab === "payroll" ? "employeePayroll" : activeTab === "calendar" ? "employeeCalendar" : activeTab === "roles" ? "employeeRoles" : "employees";

  return (
    <AppShell activeNavigation={activeNavigation} onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title={selectedEmployee ? selectedEmployee.fullName : isPayroll ? t("employees.payroll.title") : isRoles ? t("employees.roles.title") : activeTab === "employees" ? t("employees.page.title") : t("employees.tabs.calendar")}
          description={selectedEmployee ? undefined : isPayroll ? t("employees.payroll.description") : isRoles ? t("employees.roles.description") : t("employees.page.description")}
          breadcrumbs={[
            { label: t("navigation.home"), href: "#" },
            { label: t("navigation.employees") },
            ...(selectedEmployee ? [{ label: selectedEmployee.fullName }] : []),
            ...(isPayroll ? [{ label: t("employees.tabs.payroll") }] : []),
            ...(isRoles ? [{ label: t("employees.tabs.roles") }] : []),
          ]}
          actions={
            selectedEmployee ? (
              <>
                <Button variant="outline" leftIcon={<ChevronRight className="h-4 w-4 rotate-180" />} onClick={() => setSelectedEmployeeId(null)}>
                  {t("employees.actions.backToEmployees")}
                </Button>
                <Button leftIcon={<CalendarDays className="h-4 w-4" />} onClick={() => setDetailModal("vacation")}>
                  {t("employees.detail.vacation.action")}
                </Button>
                <Button variant="outline" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => setEditEmployeeOpen(true)}>
                  {t("common.actions.edit")}
                </Button>
              </>
            ) : activeTab === "employees" && !selectedEmployeeId ? (
              <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddEmployeeOpen(true)}>{t("employees.actions.addEmployee")}</Button>
            ) : isPayroll && selectedPayrollRecord ? (
              <PayrollActions />
            ) : null
          }
        />

        <div className="space-y-6">
          {activeTab === "employees" && selectedEmployee ? (
            <EmployeeDetailView
              employee={selectedEmployee}
              onUploadDocument={() => setDetailModal("uploadDocument")}
              onOpenDocuments={() => setDetailModal("documents")}
              onAssignGroups={() => setDetailModal("assignGroups")}
              onPayrollOpen={() => {
                setActiveTab("payroll");
                setSelectedEmployeeId(null);
              }}
              onKanbanOpen={() => onNavigate?.("kanban")}
              onGroupOpen={() => onNavigate?.("groups")}
            />
          ) : activeTab === "employees" ? (
            <EmployeesTableView
              employees={filteredEmployees}
              roles={roles}
              positions={positions}
              branches={branches}
              search={employeeSearch}
              roleFilter={employeeRoleFilter}
              positionFilter={employeePositionFilter}
              branchFilter={employeeBranchFilter}
              sort={employeeSort}
              page={page}
              onSearchChange={setEmployeeSearch}
              onRoleFilterChange={setEmployeeRoleFilter}
              onPositionFilterChange={setEmployeePositionFilter}
              onBranchFilterChange={setEmployeeBranchFilter}
              onSortChange={setEmployeeSort}
              onPageChange={setPage}
              onEmployeeOpen={(employee) => setSelectedEmployeeId(employee.id)}
            />
          ) : isPayroll && selectedPayrollRecord ? (
            <PayrollDetailView
              record={selectedPayrollRecord}
              page={page}
              onPageChange={setPage}
              onEmployeeOpen={() => {
                const employee = mockEmployees.find((item) => item.fullName === selectedPayrollRecord.fullName);
                setActiveTab("employees");
                setSelectedEmployeeId(employee?.id ?? 1);
                setSelectedPayrollRecord(null);
              }}
            />
          ) : isPayroll ? (
            <PayrollTableView
              records={filteredPayrollRecords}
              search={payrollSearch}
              branch={payrollBranch}
              position={payrollPosition}
              sort={payrollSort}
              branches={payrollBranches}
              positions={payrollPositions}
              page={page}
              onSearchChange={setPayrollSearch}
              onBranchChange={setPayrollBranch}
              onPositionChange={setPayrollPosition}
              onSortChange={setPayrollSort}
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

        {selectedEmployee ? (
          <>
            <VacationModal open={detailModal === "vacation"} employee={selectedEmployee} onClose={() => setDetailModal(null)} />
            <UploadDocumentModal open={detailModal === "uploadDocument"} employee={selectedEmployee} onClose={() => setDetailModal(null)} />
            <AllDocumentsModal open={detailModal === "documents"} employee={selectedEmployee} onClose={() => setDetailModal(null)} />
            <AssignGroupsModal open={detailModal === "assignGroups"} employee={selectedEmployee} onClose={() => setDetailModal(null)} />
            <AddEmployeeModal open={editEmployeeOpen} onClose={() => setEditEmployeeOpen(false)} employee={selectedEmployee} mode="edit" />
          </>
        ) : null}
        <AddEmployeeModal open={addEmployeeOpen} onClose={() => setAddEmployeeOpen(false)} />
      </PageContainer>
    </AppShell>
  );
}

function AddEmployeeModal({
  open,
  onClose,
  employee,
  mode = "create",
}: {
  open: boolean;
  onClose: () => void;
  employee?: EmployeeRecord;
  mode?: "create" | "edit";
}) {
  const { t } = useI18n();
  const [hasExperience, setHasExperience] = useState(true);
  const [experienceRows, setExperienceRows] = useState([{ id: "experience-1" }]);
  const [specialization, setSpecialization] = useState("speech");
  const [position, setPosition] = useState("teacher");
  const workDays = [
    ["monday", t("employees.addEmployee.schedule.days.monday")],
    ["tuesday", t("employees.addEmployee.schedule.days.tuesday")],
    ["wednesday", t("employees.addEmployee.schedule.days.wednesday")],
    ["thursday", t("employees.addEmployee.schedule.days.thursday")],
    ["friday", t("employees.addEmployee.schedule.days.friday")],
    ["saturday", t("employees.addEmployee.schedule.days.saturday")],
    ["sunday", t("employees.addEmployee.schedule.days.sunday")],
  ];

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={mode === "edit" ? t("employees.addEmployee.editTitle") : t("employees.addEmployee.title")}
      description={mode === "edit" ? t("employees.addEmployee.editDescription") : t("employees.addEmployee.description")}
      size="xl"
      footer={
        <ModalFooter
          right={
            <>
              <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
              <Button onClick={onClose}>{mode === "edit" ? t("common.actions.save") : t("employees.addEmployee.submit")}</Button>
            </>
          }
        />
      }
    >
      <div className="space-y-5">
        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-card-title text-text-primary">{t("employees.addEmployee.sections.personal")}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <AvatarUpload
                  label={t("employees.addEmployee.avatar")}
                  actionLabel={t("common.actions.add")}
                  fallback="С"
                  helperText={t("employees.addEmployee.avatarHint")}
                  accept="image/png,image/jpeg,image/jpg,image/heic"
                />
              </div>
              <Input label={t("employees.addEmployee.fullName")} placeholder={t("employees.addEmployee.fullNamePlaceholder")} defaultValue={employee?.fullName} />
              <Input label={t("employees.addEmployee.birthDate")} type="date" />
              <Select
                label={t("employees.addEmployee.gender")}
                defaultValue="female"
                options={[
                  { label: t("employees.addEmployee.genderOptions.female"), value: "female" },
                  { label: t("employees.addEmployee.genderOptions.male"), value: "male" },
                ]}
              />
              <Input label={t("employees.addEmployee.phone")} placeholder="+998 90 000 00 00" defaultValue={employee?.phone} />
              <Input label={t("employees.addEmployee.passport")} placeholder="AB 1234567 / 41234567890012" defaultValue={employee?.passport} />
              <Select
                label={t("employees.addEmployee.education")}
                defaultValue="higherProfile"
                options={[
                  { label: t("employees.addEmployee.educationOptions.secondary"), value: "secondary" },
                  { label: t("employees.addEmployee.educationOptions.incompleteSecondary"), value: "incompleteSecondary" },
                  { label: t("employees.addEmployee.educationOptions.specialSecondary"), value: "specialSecondary" },
                  { label: t("employees.addEmployee.educationOptions.higherProfile"), value: "higherProfile" },
                  { label: t("employees.addEmployee.educationOptions.higherNonProfile"), value: "higherNonProfile" },
                ]}
              />
              <CrudSelect
                label={t("employees.addEmployee.specialization")}
                value={specialization}
                onValueChange={setSpecialization}
                options={[
                  { label: t("employees.addEmployee.specializationOptions.speech"), value: "speech" },
                  { label: t("employees.addEmployee.specializationOptions.defectologist"), value: "defectologist" },
                  { label: t("employees.addEmployee.specializationOptions.psychologist"), value: "psychologist" },
                ]}
                addLabel={t("common.actions.addNew")}
                newItemLabel={t("common.labels.newValueName")}
                newItemPlaceholder={t("common.placeholders.enterName")}
                saveLabel={t("common.actions.save")}
                cancelLabel={t("common.actions.cancel")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-card-title text-text-primary">{t("employees.addEmployee.sections.experience")}</h3>
            <Switch
              checked={hasExperience}
              onCheckedChange={setHasExperience}
              label={`${t("employees.addEmployee.hasExperience")}: ${hasExperience ? t("common.options.yes") : t("common.options.no")}`}
            />
            {hasExperience ? (
              <div className="space-y-3">
                {experienceRows.map((row, index) => (
                  <div key={row.id} className="grid gap-3 rounded-input border border-border p-3 md:grid-cols-[minmax(0,1fr)_220px]">
                    <Input label={t("employees.addEmployee.workplace")} placeholder={t("employees.addEmployee.workplacePlaceholder")} />
                    <Input label={t("employees.addEmployee.workedTime")} placeholder="2 года" />
                    {experienceRows.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="justify-start md:col-span-2"
                        onClick={() => setExperienceRows((current) => current.filter((item) => item.id !== row.id))}
                      >
                        {t("common.actions.delete")} #{index + 1}
                      </Button>
                    ) : null}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setExperienceRows((current) => [...current, { id: `experience-${current.length + 1}` }])}
                >
                  {t("employees.addEmployee.addExperience")}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-card-title text-text-primary">{t("employees.addEmployee.sections.role")}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <CrudSelect
                label={t("employees.addEmployee.position")}
                value={position}
                onValueChange={setPosition}
                options={[
                  { label: t("employees.addEmployee.positionOptions.teacher"), value: "teacher" },
                  { label: t("employees.addEmployee.positionOptions.guard"), value: "guard" },
                  { label: t("employees.addEmployee.positionOptions.cook"), value: "cook" },
                  { label: t("employees.addEmployee.positionOptions.psychologist"), value: "psychologist" },
                ]}
                addLabel={t("common.actions.addNew")}
                newItemLabel={t("common.labels.newValueName")}
                newItemPlaceholder={t("common.placeholders.enterName")}
                saveLabel={t("common.actions.save")}
                cancelLabel={t("common.actions.cancel")}
              />
              <Input label={t("employees.addEmployee.salary")} type="number" placeholder="6500000" defaultValue={employee ? moneyToNumber(employee.salary) : undefined} />
              <Select
                label={t("employees.addEmployee.branches")}
                defaultValue="sun"
                options={[
                  { label: "Солнышко", value: "sun" },
                  { label: "Звёздочка", value: "stars" },
                  { label: "Радуга", value: "rainbow" },
                  { label: "Умнички", value: "smart" },
                ]}
              />
              <Select
                label={t("employees.addEmployee.role")}
                defaultValue="teacher"
                options={[
                  { label: t("employees.addEmployee.positionOptions.teacher"), value: "teacher" },
                  { label: t("employees.addEmployee.positionOptions.psychologist"), value: "psychologist" },
                  { label: t("employees.addEmployee.roleOptions.admin"), value: "admin" },
                ]}
              />
              <Select
                label={t("employees.addEmployee.status")}
                defaultValue="active"
                options={[
                  { label: t("employees.addEmployee.statusOptions.active"), value: "active" },
                  { label: t("employees.addEmployee.statusOptions.vacation"), value: "vacation" },
                  { label: t("employees.addEmployee.statusOptions.sick"), value: "sick" },
                  { label: t("employees.addEmployee.statusOptions.maternity"), value: "maternity" },
                  { label: t("employees.addEmployee.statusOptions.unpaid"), value: "unpaid" },
                  { label: t("employees.addEmployee.statusOptions.fired"), value: "fired" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-card-title text-text-primary">{t("employees.addEmployee.sections.documents")}</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <DocumentUploadGroup title={t("employees.addEmployee.documents.passport")} limit={t("employees.addEmployee.documents.passportLimit")} />
              <DocumentUploadGroup title={t("employees.addEmployee.documents.diploma")} limit={t("employees.addEmployee.documents.diplomaLimit")} />
              <DocumentUploadGroup title={t("employees.addEmployee.documents.certificates")} limit={t("employees.addEmployee.documents.certificatesLimit")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-card-title text-text-primary">{t("employees.addEmployee.sections.schedule")}</h3>
              <p className="text-sm text-text-muted">{t("employees.addEmployee.schedule.description")}</p>
            </div>
            <div className="space-y-2">
              {workDays.map(([dayKey, dayLabel], index) => (
                <div key={dayKey} className="grid gap-3 rounded-input border border-border p-3 md:grid-cols-[180px_1fr_1fr_160px] md:items-center">
                  <Checkbox label={dayLabel} defaultChecked={index < 6} />
                  <Input aria-label={`${dayLabel} ${t("employees.addEmployee.schedule.from")}`} type="time" defaultValue={index === 5 ? "08:00" : index === 6 ? "" : "08:00"} />
                  <Input aria-label={`${dayLabel} ${t("employees.addEmployee.schedule.to")}`} type="time" defaultValue={index === 5 ? "13:00" : index === 6 ? "" : "17:00"} />
                  <Badge variant={index === 6 ? "danger" : "success"} className="justify-center">
                    {index === 6 ? t("employees.addEmployee.schedule.dayOff") : t("employees.addEmployee.schedule.workDay")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
}

function DocumentUploadGroup({ title, limit }: { title: string; limit: string }) {
  return (
    <div className="space-y-3 rounded-card border border-border bg-page p-3">
      <div>
        <div className="text-sm font-semibold text-text-primary">{title}</div>
        <div className="text-xs text-text-muted">{limit}</div>
      </div>
      <FileUploadZone label={title} description={limit} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
    </div>
  );
}

function VacationModal({ open, employee, onClose }: { open: boolean; employee: EmployeeRecord; onClose: () => void }) {
  const { t } = useI18n();

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={t("employees.detail.vacation.title")}
      description={employee.fullName}
      size="md"
      footer={
        <ModalFooter
          right={
            <>
              <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
              <Button onClick={onClose}>{t("employees.detail.vacation.submit")}</Button>
            </>
          }
        />
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          className="md:col-span-2"
          label={t("employees.detail.vacation.type")}
          defaultValue="vacation"
          options={[
            { label: t("employees.detail.vacation.types.sick"), value: "sick" },
            { label: t("employees.detail.vacation.types.vacation"), value: "vacation" },
            { label: t("employees.detail.vacation.types.maternity"), value: "maternity" },
            { label: t("employees.detail.vacation.types.unpaid"), value: "unpaid" },
          ]}
        />
        <Input label={t("employees.detail.vacation.dateFrom")} type="date" defaultValue="2026-05-13" />
        <Input label={t("employees.detail.vacation.dateTo")} type="date" defaultValue="2026-05-20" />
        <Select
          className="md:col-span-2"
          label={t("employees.detail.vacation.paid")}
          defaultValue="yes"
          options={[
            { label: t("common.options.yes"), value: "yes" },
            { label: t("common.options.no"), value: "no" },
          ]}
        />
      </div>
    </Modal>
  );
}

function UploadDocumentModal({ open, employee, onClose }: { open: boolean; employee: EmployeeRecord; onClose: () => void }) {
  const { t } = useI18n();
  const [documents, setDocuments] = useState([{ id: "document-1" }]);

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={t("employees.detail.documents.uploadTitle")}
      description={employee.fullName}
      size="lg"
      footer={
        <ModalFooter
          right={
            <>
              <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
              <Button onClick={onClose}>{t("employees.detail.documents.upload")}</Button>
            </>
          }
        />
      }
    >
      <div className="space-y-4">
        {documents.map((document, index) => (
          <div key={document.id} className="grid gap-3 rounded-card border border-border bg-page p-3 md:grid-cols-[220px_minmax(0,1fr)_minmax(260px,0.8fr)]">
            <Select
              label={t("employees.detail.documents.type")}
              defaultValue="passport"
              options={[
                { label: t("employees.detail.documents.types.passport"), value: "passport" },
                { label: t("employees.detail.documents.types.diploma"), value: "diploma" },
                { label: t("employees.detail.documents.types.certificate"), value: "certificate" },
                { label: t("employees.detail.documents.types.medical"), value: "medical" },
                { label: t("employees.detail.documents.types.other"), value: "other" },
              ]}
            />
            <Input label={t("employees.detail.documents.name")} placeholder={t("employees.detail.documents.namePlaceholder")} />
            <FileUploadZone
              label={t("employees.detail.documents.dropLabel")}
              description={t("employees.detail.documents.rules")}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            />
            {documents.length > 1 ? (
              <Button type="button" variant="ghost" className="justify-start md:col-span-3" onClick={() => setDocuments((current) => current.filter((item) => item.id !== document.id))}>
                {t("common.actions.delete")} #{index + 1}
              </Button>
            ) : null}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setDocuments((current) => [...current, { id: `document-${current.length + 1}` }])}
        >
          {t("employees.detail.documents.addAnother")}
        </Button>
        </div>
    </Modal>
  );
}

function AllDocumentsModal({ open, employee, onClose }: { open: boolean; employee: EmployeeRecord; onClose: () => void }) {
  const { t } = useI18n();

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={t("employees.detail.documents.allTitle")}
      description={employee.fullName}
      size="lg"
      footer={
        <ModalFooter
          right={<Button variant="outline" onClick={onClose}>{t("common.actions.close")}</Button>}
        />
      }
    >
      <TableContainer>
        <Table>
          <TableHeader className="normal-case">
            <TableRow>
              <TableHead>{t("employees.detail.documents.name")}</TableHead>
              <TableHead>{t("employees.detail.documents.type")}</TableHead>
              <TableHead>{t("employees.detail.documents.format")}</TableHead>
              <TableHead>{t("employees.detail.documents.size")}</TableHead>
              <TableHead>{t("employees.detail.documents.date")}</TableHead>
              <TableHead className="w-24 text-right">{t("employees.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeDocuments.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell><Badge variant="danger">{document.format}</Badge></TableCell>
                <TableCell>{document.size}</TableCell>
                <TableCell>{document.date}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label={t("common.actions.download")}><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" aria-label={t("employees.table.actions")}><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Modal>
  );
}

function AssignGroupsModal({ open, employee, onClose }: { open: boolean; employee: EmployeeRecord; onClose: () => void }) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(["jasmine"]);
  const groupOptions = [
    { label: "Жасмин", value: "jasmine", description: "3–4 года" },
    { label: "Солнышко", value: "sun", description: "4–5 лет" },
    { label: "Звёздочки", value: "stars", description: "5–6 лет" },
    { label: "Радуга", value: "rainbow", description: "4–5 лет" },
  ];
  const availableOptions = groupOptions.filter((option) => !selectedGroups.includes(option.value));

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title="Назначить группы"
      description={employee.fullName}
      footer={
        <ModalFooter
          right={
            <>
              <Button variant="outline" onClick={onClose}>Отмена</Button>
              <Button onClick={onClose}>Добавить</Button>
            </>
          }
        />
      }
    >
      <div className="space-y-4">
        <SearchableSelect
          placeholder="Выберите группу"
          searchPlaceholder="Поиск группы"
          options={availableOptions}
          onChange={(value) => setSelectedGroups((current) => (current.includes(value) ? current : [...current, value]))}
        />
        <div className="space-y-2">
          {selectedGroups.map((groupId) => {
            const group = groupOptions.find((option) => option.value === groupId);
            if (!group) return null;
            return (
              <div key={groupId} className="flex items-center justify-between gap-3 rounded-input border border-border p-3">
                <div>
                  <div className="font-semibold text-text-primary">{group.label}</div>
                  <div className="text-xs text-text-muted">{group.description}</div>
                </div>
                <Button type="button" variant="ghost" onClick={() => setSelectedGroups((current) => current.filter((item) => item !== groupId))}>
                  Открепить
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

function PayrollActions() {
  const { t } = useI18n();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);

  return (
    <>
      <Button variant="outline" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => setSalaryOpen(true)}>{t("employees.payroll.actions.editSalary")}</Button>
      <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setPaymentOpen(true)}>{t("employees.payroll.actions.addPayment")}</Button>
      <EditSalaryModal open={salaryOpen} onClose={() => setSalaryOpen(false)} />
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
  const [sort, setSort] = useState("newest");
  const [createOpen, setCreateOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<EmployeeRole | null>(null);

  const filteredRoles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return employeeRoles
      .filter((role) => !normalizedQuery || role.name.toLocaleLowerCase().includes(normalizedQuery))
      .sort((first, second) => (sort === "name" ? first.name.localeCompare(second.name, "ru") : second.id - first.id));
  }, [query, sort]);

  return (
    <>
      <Card>
        <CardContent className="space-y-5">
          <TableToolbar
            title={t("employees.roles.listTitle")}
            search={
              <SearchField
                aria-label={t("employees.roles.filters.searchLabel")}
                placeholder={t("employees.roles.filters.search")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            }
            actions={
              <>
                <Select
                  className="w-56"
                  aria-label={t("employees.roles.filters.sort")}
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  options={[
                    { label: t("employees.roles.filters.newest"), value: "newest" },
                    { label: t("employees.filters.byName"), value: "name" },
                  ]}
                />
                <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
                  {t("employees.roles.actions.create")}
                </Button>
              </>
            }
          />
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
  employees: EmployeeRecord[];
  roles: string[];
  positions: string[];
  branches: string[];
  search: string;
  roleFilter: string;
  positionFilter: string;
  branchFilter: string;
  sort: string;
  page: number;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onPositionFilterChange: (value: string) => void;
  onBranchFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onEmployeeOpen: (employee: EmployeeRecord) => void;
}

function EmployeesTableView({
  employees,
  roles,
  positions,
  branches,
  search,
  roleFilter,
  positionFilter,
  branchFilter,
  sort,
  page,
  onSearchChange,
  onRoleFilterChange,
  onPositionFilterChange,
  onBranchFilterChange,
  onSortChange,
  onPageChange,
  onEmployeeOpen,
}: EmployeesTableViewProps) {
  const { t } = useI18n();

  return (
    <Card>
      <CardContent className="space-y-5">
        <TableToolbar
          search={
            <SearchField
              aria-label={t("employees.filters.search")}
              placeholder={t("employees.filters.search")}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          }
          filters={
            <>
              <Select
                label={t("employees.filters.role")}
                value={roleFilter}
                onChange={(event) => onRoleFilterChange(event.target.value)}
                options={[{ label: t("employees.filters.allRoles"), value: "all" }, ...roles.map((item) => ({ label: item, value: item }))]}
              />
              <Select
                label={t("employees.filters.position")}
                value={positionFilter}
                onChange={(event) => onPositionFilterChange(event.target.value)}
                options={[{ label: t("employees.filters.allPositions"), value: "all" }, ...positions.map((item) => ({ label: item, value: item }))]}
              />
              <Select
                label={t("employees.filters.branch")}
                value={branchFilter}
                onChange={(event) => onBranchFilterChange(event.target.value)}
                options={[{ label: t("employees.filters.allBranches"), value: "all" }, ...branches.map((item) => ({ label: item, value: item }))]}
              />
            </>
          }
          actions={
            <Select
              className="w-full sm:w-56"
              aria-label={t("employees.filters.sort")}
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              options={[
                { label: t("employees.filters.newestFirst"), value: "newest" },
                { label: t("employees.filters.oldestFirst"), value: "oldest" },
                { label: t("employees.filters.byName"), value: "name" },
                { label: t("employees.filters.bySalary"), value: "salary" },
              ]}
            />
          }
        />

        <h3 className="text-card-title text-text-primary">{t("employees.table.title")}</h3>

        <TableContainer>
          <Table className="min-w-[1480px]">
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
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="cursor-pointer" onClick={() => onEmployeeOpen(employee)}>
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
                    <ChevronRight className="h-4 w-4 text-text-muted" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {employees.length ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm font-medium text-text-secondary">{t("employees.table.total", { shown: employees.length, total: mockEmployees.length })}</div>
            <div className="flex items-center gap-3">
              <Pagination page={page} pageCount={6} onPageChange={onPageChange} />
              <Select className="w-40" defaultValue="10" options={[{ label: t("employees.table.perPage"), value: "10" }]} />
            </div>
          </div>
        ) : (
          <EmptyState title={t("employees.empty.title")} description={t("employees.empty.description")} />
        )}
      </CardContent>
    </Card>
  );
}

function EmployeeDetailView({
  employee,
  onUploadDocument,
  onOpenDocuments,
  onAssignGroups,
  onPayrollOpen,
  onKanbanOpen,
  onGroupOpen,
}: {
  employee: EmployeeRecord;
  onUploadDocument: () => void;
  onOpenDocuments: () => void;
  onAssignGroups: () => void;
  onPayrollOpen: () => void;
  onKanbanOpen: () => void;
  onGroupOpen: () => void;
}) {
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-muted">
            <span>Когда добавлен в систему: <span className="text-text-secondary">15.02.2024</span></span>
            <span className="h-4 w-px bg-border" />
            <span>Кем добавлен: <span className="text-text-secondary">Дилфуза Каримова</span></span>
          </div>
          <div className="grid gap-6 xl:grid-cols-[220px_minmax(260px,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex items-start justify-center xl:justify-start">
              <div className="h-40 w-40 shrink-0 overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_28%,#fee2e2_0_18%,#f8fafc_19%_100%)] shadow-card">
                <div className="mx-auto mt-11 h-24 w-24 rounded-full bg-[linear-gradient(135deg,#111827,#6b7280)]" />
              </div>
            </div>
            <div className="space-y-4 self-center">
              <h2 className="max-w-[560px] text-2xl font-semibold leading-tight text-text-primary">{employee.fullName}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">{employee.position}</Badge>
                <StatusBadge status="success">Активен</StatusBadge>
              </div>
            </div>
            <div className="space-y-5 border-border xl:border-l xl:pl-6">
              <EmployeeIconInfo icon={<CalendarDays className="h-5 w-5" />} label="Дата рождения" value="12.05.1989" />
              <EmployeeIconInfo icon={<FileText className="h-5 w-5" />} label="Паспорт / ПИНФЛ" value={`${employee.passport} / 41234567890012`} />
              <EmployeeIconInfo icon={<BriefcaseBusiness className="h-5 w-5" />} label="Должность" value={employee.position} />
            </div>
            <div className="space-y-5 border-border xl:border-l xl:pl-6">
              <EmployeeIconInfo icon={<UserRound className="h-5 w-5" />} label="Пол" value="Женский" />
              <EmployeeIconInfo icon={<UserCog className="h-5 w-5" />} label="Роль" value={employee.systemRole} />
              <EmployeeIconInfo icon={<Building2 className="h-5 w-5" />} label="Организация (филиал)" value="Детский сад №12" />
            </div>
            <div className="space-y-5 border-border xl:border-l xl:pl-6">
              <EmployeeIconInfo icon={<Phone className="h-5 w-5" />} label="Телефон" value={employee.phone} />
              <EmployeeIconInfo icon={<Clock3 className="h-5 w-5" />} label="Сколько времени уже работает" value="1 год 3 мес." />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-3">
        <ScheduleCard />
        <AttendanceLiveCard />
        <SalaryCard salary={employee.salary} onOpen={onPayrollOpen} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.7fr_1fr_1fr]">
        <div className="space-y-5">
          <ExperienceCard compact />
          <EducationCard />
        </div>
        <DocumentsCard onUpload={onUploadDocument} onOpenAll={onOpenDocuments} />
        <EmployeeGroupsCard onAssign={onAssignGroups} onGroupOpen={onGroupOpen} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <KanbanMetricCard onOpen={onKanbanOpen} />
      </div>
    </div>
  );
}

function EmployeeIconInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 gap-3">
      <span className="mt-0.5 shrink-0 text-primary">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs font-medium text-text-muted">{label}</div>
        <div className="mt-1 text-sm font-semibold leading-5 text-text-primary">{value}</div>
      </div>
    </div>
  );
}

function EmployeeInfoPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-border p-3">
      <div className="text-sm text-text-muted">{label}</div>
      <div className="mt-1.5 text-base font-semibold leading-6 text-text-primary">{value}</div>
    </div>
  );
}

function DetailCard({
  title,
  icon,
  children,
  action,
  stretch = true,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  stretch?: boolean;
}) {
  return (
    <Card className={cn(stretch && "h-full")}>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-primary">{icon}</span>
            <h3 className="truncate text-card-title text-text-primary">{title}</h3>
          </div>
          {action}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function ScheduleCard() {
  const days = [
    ["Пн", "Понедельник", "08:00 – 17:00", "info"],
    ["Вт", "Вторник", "08:00 – 17:00", "info"],
    ["Ср", "Среда", "08:00 – 17:00", "info"],
    ["Чт", "Четверг", "08:00 – 17:00", "info"],
    ["Пт", "Пятница", "08:00 – 17:00", "info"],
    ["Сб", "Суббота", "08:00 – 13:00", "purple"],
    ["Вс", "Воскресенье", "выходной", "danger"],
  ];

  return (
    <DetailCard title="График работы" icon={<CalendarDays className="h-5 w-5" />}>
      <div className="space-y-2">
        {days.map(([short, day, time, tone]) => (
          <div key={day} className="grid grid-cols-[36px_1fr_auto] items-center gap-3 border-b border-border pb-2 last:border-b-0 last:pb-0">
            <Badge variant={tone as "info" | "purple" | "danger"} className="justify-center px-2 py-0.5">{short}</Badge>
            <span className="text-sm text-text-secondary">{day}</span>
            <span className={cn("text-sm font-semibold", tone === "danger" ? "text-danger-text" : tone === "purple" ? "text-primary" : "text-text-primary")}>{time}</span>
          </div>
        ))}
      </div>
    </DetailCard>
  );
}

function AttendanceLiveCard() {
  const [open, setOpen] = useState(true);
  return (
    <DetailCard
      title="Посещение"
      icon={<UserCheck className="h-5 w-5" />}
      action={<Badge variant={open ? "success" : "neutral"}>{open ? "LIVE" : "Закрыта"}</Badge>}
    >
      <div className="flex min-h-44 flex-col items-center justify-center text-center">
        <div className={cn("grid h-20 w-20 place-items-center rounded-full border", open ? "border-success-bg bg-success-bg text-success-text" : "border-border bg-page text-text-secondary")}>
          {open ? <Activity className="h-9 w-9" /> : <CheckCircle2 className="h-9 w-9" />}
        </div>
        <div className={cn("mt-4 text-2xl font-semibold", open ? "text-success-text" : "text-text-secondary")}>
          {open ? "В работе с 08:00" : "Смена закрыта в 17:00"}
        </div>
        <div className="mt-3 text-sm text-text-muted">{open ? "Последний статус: Отошел в 12:40" : "Рабочий день завершен"}</div>
        <Button className="mt-5" variant={open ? "outline" : "primary"} onClick={() => setOpen((current) => !current)}>
          {open ? "Закрыть смену" : "Открыть смену"}
        </Button>
      </div>
    </DetailCard>
  );
}

function ExperienceCard({ compact = false }: { compact?: boolean }) {
  const items = [
    ["ДОО “Звёздочка”", "2 года"],
    ["Частный сад “Happy Kids”", "1 год 8 мес."],
  ];
  return (
    <DetailCard title="Опыт работы в ДОУ" icon={<BriefcaseBusiness className="h-5 w-5" />}>
      <div className="space-y-3">
        {items.map(([place, period]) => (
          <div key={place} className="grid grid-cols-[16px_1fr_auto] items-center gap-3 border-b border-border pb-3 last:border-b-0">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-primary" />
            <span className="text-sm font-medium text-text-primary">{place}</span>
            <span className="text-sm text-text-secondary">{period}</span>
          </div>
        ))}
        <div className="rounded-input border border-border bg-page py-3 text-center text-sm">
          <span className="text-primary">Общий опыт:</span> <span className="font-semibold text-text-primary">4 года 11 мес.</span>
        </div>
      </div>
    </DetailCard>
  );
}

function EducationCard() {
  return (
    <DetailCard title="Образование" icon={<GraduationCap className="h-5 w-5" />}>
      <div className="grid gap-3 text-sm">
        <EmployeeInfoLine label="Образование" value="Высшее профильное" strong />
        <EmployeeInfoLine label="Специализация" value="Дошкольная педагогика и психология" />
      </div>
    </DetailCard>
  );
}

function DocumentsCard({ onUpload, onOpenAll }: { onUpload: () => void; onOpenAll: () => void }) {
  const documents = employeeDocuments.slice(0, 4);
  return (
    <DetailCard
      title="Документы"
      icon={<Folder className="h-5 w-5" />}
      action={<Button variant="outline" size="sm" leftIcon={<UploadCloud className="h-4 w-4" />} onClick={onUpload}>Загрузить документ</Button>}
    >
      <div className="space-y-2">
        {documents.map((document) => (
          <div key={document.id} className="grid grid-cols-[28px_1fr_auto_32px_24px] items-center gap-3 border-b border-border pb-2 last:border-b-0">
            <Badge variant="danger" className="h-6 min-h-6 justify-center px-1 text-[10px]">PDF</Badge>
            <span className="truncate text-sm font-medium text-text-primary">{document.name}</span>
            <span className="text-xs text-text-muted">{document.size}</span>
            <Download className="h-4 w-4 text-text-secondary" />
            <MoreVertical className="h-4 w-4 text-text-muted" />
          </div>
        ))}
        <Button variant="ghost" className="w-full justify-center text-primary" onClick={onOpenAll}>Показать все документы (6) <ChevronRight className="h-4 w-4" /></Button>
      </div>
    </DetailCard>
  );
}

function SalaryCard({ salary, onOpen }: { salary: string; onOpen: () => void }) {
  return (
    <button type="button" className="block h-full w-full appearance-none border-0 bg-transparent p-0 text-left" onClick={onOpen}>
      <DetailCard title="Заработная плата" icon={<WalletCards className="h-5 w-5" />}>
      <div className="space-y-3 text-sm">
        <EmployeeInfoLine label="Оклад" value={salary} strong />
        <EmployeeInfoLine label="Последняя выплата" value={salary} strong />
        <EmployeeInfoLine label="Дата выплаты" value="30.04.2026" strong />
        <div className="flex items-center gap-3 rounded-input border border-success-bg bg-success-bg px-3 py-2 text-success-text">
          <CheckCircle2 className="h-4 w-4" />
          <span className="min-w-0 flex-1 text-sm font-medium">Выплата за апрель 2026 года проведена</span>
          <span className="h-2 w-24 rounded-full bg-success-text" />
          <CheckCircle2 className="h-4 w-4" />
        </div>
      </div>
      </DetailCard>
    </button>
  );
}

function KanbanMetricCard({ onOpen }: { onOpen: () => void }) {
  const metrics = [
    ["8", "Активные задачи", <CalendarDays className="h-6 w-6" />, "info"],
    ["42", "Выполненные задачи", <CheckCircle2 className="h-6 w-6" />, "success"],
    ["2.4 дня", "Среднее время выполнения", <Clock3 className="h-6 w-6" />, "purple"],
    ["3", "Просроченные задачи", <AlertTriangle className="h-6 w-6" />, "danger"],
  ];
  return (
    <button type="button" className="block w-full appearance-none border-0 bg-transparent p-0 text-left" onClick={onOpen}>
      <DetailCard title="Метрика по канбан" icon={<BarChart3 className="h-5 w-5" />} stretch={false}>
      <div className="grid gap-3 sm:grid-cols-4">
        {metrics.map(([value, label, icon, tone]) => (
          <div key={String(label)} className={cn("rounded-card border p-4", tone === "success" ? "border-success-bg bg-success-bg/40" : tone === "danger" ? "border-danger-bg bg-danger-bg/40" : tone === "purple" ? "border-purple-bg bg-purple-bg/40" : "border-info-bg bg-info-bg/40")}>
            <div className={cn("mb-6", tone === "success" ? "text-success-text" : tone === "danger" ? "text-danger-text" : tone === "purple" ? "text-purple-text" : "text-primary")}>{icon}</div>
            <div className={cn("text-2xl font-semibold", tone === "success" ? "text-success-text" : tone === "danger" ? "text-danger-text" : tone === "purple" ? "text-purple-text" : "text-primary")}>{value}</div>
            <div className="mt-2 text-xs font-medium text-text-secondary">{label}</div>
          </div>
        ))}
      </div>
      </DetailCard>
    </button>
  );
}

function EmployeeGroupsCard({ onAssign, onGroupOpen }: { onAssign: () => void; onGroupOpen: () => void }) {
  const rows = [
    ["Жасмин", "3–4 года", "Общеразвивающая"],
    ["Солнышко", "4–5 лет", "Общеразвивающая"],
    ["Звёздочки", "5–6 лет", "Углублённая подготовка"],
  ];
  return (
    <DetailCard
      title="Группы"
      icon={<Users className="h-5 w-5" />}
      action={<Button variant="outline" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={onAssign}>Назначить</Button>}
    >
      <TableContainer>
        <Table>
          <TableHeader className="normal-case">
            <TableRow>
              <TableHead>Название группы</TableHead>
              <TableHead>Возрастная группа</TableHead>
              <TableHead>Направленность</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(([name, age, direction]) => (
              <TableRow key={name} className="cursor-pointer" onClick={onGroupOpen}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell>{age}</TableCell>
                <TableCell>{direction}</TableCell>
                <TableCell><ChevronRight className="h-4 w-4 text-primary" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="outline" className="w-full justify-center text-primary" onClick={onGroupOpen}>Посмотреть все группы (3) <ChevronRight className="h-4 w-4" /></Button>
    </DetailCard>
  );
}

function EmployeeInfoLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(120px,0.8fr)_minmax(0,1fr)] gap-4 border-b border-border pb-2 last:border-b-0">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <span className={cn("text-sm text-text-primary", strong && "font-semibold text-right")}>{value}</span>
    </div>
  );
}

function PayrollDetailView({
  record,
  page,
  onPageChange,
  onEmployeeOpen,
}: {
  record: PayrollRecord;
  page: number;
  onPageChange: (page: number) => void;
  onEmployeeOpen: () => void;
}) {
  const { t } = useI18n();
  const currencySuffix = t("employees.payroll.currencySuffix");
  const [paymentDateFrom, setPaymentDateFrom] = useState("");
  const [paymentDateTo, setPaymentDateTo] = useState("");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [paymentResponsibleFilter, setPaymentResponsibleFilter] = useState("all");
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
  const responsibleOptions = useMemo(() => Array.from(new Set(payrollPayments.map((payment) => payment.responsible))), []);
  const filteredPayments = useMemo(() => {
    const from = paymentDateFrom ? new Date(paymentDateFrom).getTime() : null;
    const to = paymentDateTo ? new Date(paymentDateTo).getTime() : null;

    return payrollPayments.filter((payment) => {
      const paymentTime = parseRuDate(payment.date);
      const matchesFrom = from === null || paymentTime >= from;
      const matchesTo = to === null || paymentTime <= to;
      const matchesType = paymentTypeFilter === "all" || payment.type === paymentTypeFilter;
      const matchesResponsible = paymentResponsibleFilter === "all" || payment.responsible === paymentResponsibleFilter;
      return matchesFrom && matchesTo && matchesType && matchesResponsible;
    });
  }, [paymentDateFrom, paymentDateTo, paymentResponsibleFilter, paymentTypeFilter]);

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
                <button type="button" className="text-left text-2xl font-semibold leading-tight text-primary hover:underline" onClick={onEmployeeOpen}>
                  {profile.fullName}
                </button>
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
            <TableToolbar
              title={t("employees.payroll.paymentsTable.title")}
              filters={
                <>
                  <Input label={t("employees.payroll.paymentsTable.dateFrom")} type="date" value={paymentDateFrom} onChange={(event) => setPaymentDateFrom(event.target.value)} />
                  <Input label={t("employees.payroll.paymentsTable.dateTo")} type="date" value={paymentDateTo} onChange={(event) => setPaymentDateTo(event.target.value)} />
                  <Select
                    label={t("employees.payroll.paymentsTable.type")}
                    value={paymentTypeFilter}
                    onChange={(event) => setPaymentTypeFilter(event.target.value)}
                    options={[
                      { label: t("employees.payroll.paymentsTable.allTypes"), value: "all" },
                      { label: t("employees.payroll.types.salary"), value: "salary" },
                      { label: t("employees.payroll.types.advance"), value: "advance" },
                      { label: t("employees.payroll.types.bonus"), value: "bonus" },
                    ]}
                  />
                  <Select
                    label={t("employees.payroll.paymentsTable.responsible")}
                    value={paymentResponsibleFilter}
                    onChange={(event) => setPaymentResponsibleFilter(event.target.value)}
                    options={[{ label: t("employees.payroll.paymentsTable.allResponsible"), value: "all" }, ...responsibleOptions.map((item) => ({ label: item, value: item }))]}
                  />
                </>
              }
            />
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
                  {filteredPayments.map((payment) => (
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
              <div className="text-sm font-medium text-text-secondary">{t("employees.payroll.paymentsTable.total", { shown: filteredPayments.length, total: payrollPayments.length })}</div>
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
              <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(var(--color-primary) 0 76%, var(--color-info-text) 76% 98%, var(--color-warning-text) 98% 100%)" }}>
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-surface text-center">
                  <span className="text-base font-semibold text-text-primary">{formatSom(yearlyTotal, currencySuffix)}</span>
                  <span className="text-xs text-text-muted">{t("employees.payroll.structure.total")}</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <PayrollLegend dot="bg-primary" label={t("employees.payroll.types.salary")} value={`84 500 000 ${currencySuffix} (76,1%)`} />
                <PayrollLegend dot="bg-info-text" label={t("employees.payroll.types.advance")} value={`24 000 000 ${currencySuffix} (21,6%)`} />
                <PayrollLegend dot="bg-warning-text" label={t("employees.payroll.types.bonus")} value={`2 700 000 ${currencySuffix} (2,4%)`} />
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

function EditSalaryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const currencySuffix = t("employees.payroll.currencySuffix");

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={t("employees.payroll.salaryModal.title")}
      description={t("employees.payroll.salaryModal.description")}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
          <Button onClick={onClose}>{t("common.actions.save")}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label={t("employees.payroll.salaryModal.currentSalary")} defaultValue={`6 500 000 ${currencySuffix}`} disabled />
        <Input label={t("employees.payroll.salaryModal.newSalary")} placeholder={`7 000 000 ${currencySuffix}`} />
      </div>
    </Modal>
  );
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
        <CrudSelect
          label={t("employees.payroll.paymentModal.paymentType")}
          value={paymentType}
          onValueChange={(value) => setPaymentType(value as PayrollPaymentType)}
          addLabel={t("common.actions.add")}
          newItemLabel={t("employees.payroll.paymentModal.newPaymentType")}
          newItemPlaceholder={t("employees.payroll.paymentModal.newPaymentTypePlaceholder")}
          saveLabel={t("common.actions.save")}
          cancelLabel={t("common.actions.cancel")}
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
  sort: string;
  branches: string[];
  positions: string[];
  page: number;
  onSearchChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onOpenRecord: (record: PayrollRecord) => void;
}

function PayrollTableView({
  records,
  search,
  branch,
  position,
  sort,
  branches,
  positions,
  page,
  onSearchChange,
  onBranchChange,
  onPositionChange,
  onSortChange,
  onPageChange,
  onOpenRecord,
}: PayrollTableViewProps) {
  const { t } = useI18n();
  const currencySuffix = t("employees.payroll.currencySuffix");

  return (
    <Card>
      <CardContent className="space-y-5">
        <TableToolbar
          title={t("employees.payroll.table.title")}
          search={
            <SearchField
              className="w-full"
              aria-label={t("employees.payroll.filters.search")}
              placeholder={t("employees.payroll.filters.search")}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          }
          filters={
            <>
              <Select
                label={t("employees.payroll.filters.branch")}
                value={branch}
                onChange={(event) => onBranchChange(event.target.value)}
                options={[{ label: t("employees.payroll.filters.allBranches"), value: "all" }, ...branches.map((item) => ({ label: item, value: item }))]}
              />
              <Select
                label={t("employees.payroll.filters.position")}
                value={position}
                onChange={(event) => onPositionChange(event.target.value)}
                options={[{ label: t("employees.payroll.filters.allPositions"), value: "all" }, ...positions.map((item) => ({ label: item, value: item }))]}
              />
            </>
          }
          actions={
            <Select
              className="w-56"
              aria-label={t("employees.payroll.filters.sort")}
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              options={[
                { label: t("employees.payroll.filters.newestFirst"), value: "newest" },
                { label: t("employees.payroll.filters.oldestFirst"), value: "oldest" },
                { label: t("employees.payroll.filters.byName"), value: "name" },
                { label: t("employees.payroll.filters.bySalary"), value: "salary" },
              ]}
            />
          }
        />

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
  );
}

function formatSom(value: number, currencySuffix: string) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ${currencySuffix}`;
}

function moneyToNumber(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

function parseRuDate(value: string) {
  const [day, month, year] = value.split(".").map(Number);
  return new Date(year, month - 1, day).getTime();
}
