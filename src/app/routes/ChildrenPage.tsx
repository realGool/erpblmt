import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Award,
  Baby,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Copy,
  Download,
  Edit,
  FileText,
  Filter,
  Folder,
  Gamepad2,
  Grid2X2,
  HeartPulse,
  Lightbulb,
  MapPin,
  MessageSquareText,
  MoreVertical,
  Phone,
  Plus,
  Sparkles,
  Trash2,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import {
  Avatar,
  AvatarUpload,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CircularMetric,
  DataSourceIcon,
  DevelopmentCompactMetrics,
  EmptyState,
  Checkbox,
  CommentComposer,
  Input,
  Modal,
  Pagination,
  SearchField,
  SearchableSelect,
  Select,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  type DataSourceIconType,
  type DevelopmentCompactMetric,
} from "../../components/ui";
import {
  developmentAreas,
  mockChildProfile,
  mockChildren,
  type ChildAttendanceStatus,
  type ChildListRecord,
  type ChildProfile,
  type ChildStatus,
  type DataSourceType,
  type DevelopmentAreaKey,
  type DevelopmentSubarea,
  type NicuScore,
  type SpecialistRole,
} from "../../data/mockChildren";
import { financeBranches, tariffs } from "../../data/mockFinance";
import { mockParents } from "../../data/mockParents";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

interface ChildrenPageProps {
  onNavigate?: (key: SidebarNavigationKey) => void;
}

type ModalState = "comments" | "games" | "documents" | "aiRecommendations" | { type: "subarea"; subarea: DevelopmentSubarea } | null;

const metricTones: Record<DevelopmentAreaKey, DevelopmentCompactMetric["tone"]> = {
  physical: "success",
  social: "warning",
  speech: "info",
  cognitive: "purple",
  creative: "warning",
};

export function ChildrenPage({ onNavigate }: ChildrenPageProps) {
  const { t } = useI18n();
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [addChildOpen, setAddChildOpen] = useState(false);

  const filteredChildren = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return mockChildren;

    return mockChildren.filter(
      (child) =>
        child.fullName.toLocaleLowerCase().includes(query) ||
        child.parentName.toLocaleLowerCase().includes(query) ||
        child.id.toLocaleLowerCase().includes(query),
    );
  }, [search]);

  const selectedChild = selectedChildId ? createChildProfile(selectedChildId) : null;

  return (
    <AppShell activeNavigation="children" onNavigate={onNavigate}>
      {selectedChild ? (
        <ChildProfileView child={selectedChild} onBack={() => setSelectedChildId(null)} onOpenModal={setModalState} onNavigate={onNavigate} />
      ) : (
        <ChildrenListView
          children={filteredChildren}
          search={search}
          page={page}
          onSearchChange={setSearch}
          onPageChange={setPage}
          onChildOpen={(child) => setSelectedChildId(child.id)}
          onAddChild={() => setAddChildOpen(true)}
        />
      )}

      <SpecialistCommentsModal child={selectedChild ?? mockChildProfile} open={modalState === "comments"} onOpenChange={(open) => !open && setModalState(null)} />
      <GameHistoryModal child={selectedChild ?? mockChildProfile} open={modalState === "games"} onOpenChange={(open) => !open && setModalState(null)} />
      <ChildDocumentsModal child={selectedChild ?? mockChildProfile} open={modalState === "documents"} onOpenChange={(open) => !open && setModalState(null)} />
      <AIRecommendationsDrawer child={selectedChild ?? mockChildProfile} open={modalState === "aiRecommendations"} onClose={() => setModalState(null)} />
      <SubareaGoalsModal
        child={selectedChild ?? mockChildProfile}
        state={modalState && typeof modalState === "object" ? modalState : null}
        onOpenChange={(open) => !open && setModalState(null)}
      />
      <AddChildModal
        open={addChildOpen}
        onOpenChange={setAddChildOpen}
        onCreate={() => {
          setAddChildOpen(false);
          setSelectedChildId(mockChildren[0]?.id ?? "CH-000124");
        }}
      />
    </AppShell>
  );
}

function AddChildModal({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (open: boolean) => void; onCreate: () => void }) {
  const { t } = useI18n();
  const [documents, setDocuments] = useState([{ id: "doc-1" }]);
  const [parentId, setParentId] = useState(mockParents[0]?.id ?? "");
  const parentOptions = mockParents.slice(0, 4);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("children.addChild.title")}
      description={t("children.addChild.description")}
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.actions.cancel")}
          </Button>
          <Button onClick={onCreate}>{t("common.actions.save")}</Button>
        </>
      }
    >
      <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>{t("children.addChild.sections.main")}</CardTitle>
              <CardDescription>{t("children.addChild.sections.mainDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input label={t("children.addChild.fullName")} placeholder={t("children.addChild.fullNamePlaceholder")} />
              <div className="md:col-span-2">
                <AvatarUpload
                  label={t("children.addChild.avatar")}
                  actionLabel={t("common.actions.add")}
                  fallback="Р"
                  helperText="PNG, JPG, HEIC"
                  accept="image/png,image/jpeg,image/jpg,image/heic,image/hevc"
                />
              </div>
              <Input label={t("children.addChild.birthDate")} type="date" />
              <Input label={t("children.addChild.address")} placeholder={t("children.addChild.addressPlaceholder")} />
              <Select
                label={t("children.addChild.organization")}
                defaultValue={financeBranches[0]?.value}
                options={financeBranches.map((branch) => ({ label: branch.label, value: branch.value }))}
              />
              <Select
                label={t("children.addChild.tariff")}
                defaultValue={tariffs[0]?.id}
                options={tariffs.filter((tariff) => tariff.status === "active").map((tariff) => ({ label: tariff.name, value: tariff.id }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("children.addChild.sections.documents")}</CardTitle>
              <CardDescription>{t("children.addChild.documentRules")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((document, index) => (
                <div key={document.id} className="grid gap-3 rounded-card border border-border bg-page p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <Input label={t("children.addChild.documentName")} placeholder={t("children.addChild.documentNamePlaceholder")} />
                  <Input label={t("children.addChild.documentFile")} type="file" accept=".pdf,.png,.jpg,.jpeg,.hevc,.doc,.docx" />
                  {index === documents.length - 1 ? (
                    <div className="md:col-span-2">
                      <Button
                        variant="outline"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => setDocuments((current) => [...current, { id: `doc-${current.length + 1}` }])}
                      >
                        {t("children.addChild.addDocument")}
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("children.addChild.sections.details")}</CardTitle>
              <CardDescription>{t("children.addChild.sections.detailsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                label={t("children.addChild.features")}
                helperText={t("children.addChild.featuresHelper")}
                placeholder={t("children.addChild.featuresPlaceholder")}
                className="min-h-32"
              />
              <SearchableSelect
                label={t("children.addChild.parents")}
                value={parentId}
                onChange={setParentId}
                placeholder={t("children.addChild.parents")}
                searchPlaceholder={t("parents.list.search")}
                options={parentOptions.map((parent) => ({
                  label: parent.fullName,
                  value: parent.id,
                  description: parent.phone,
                }))}
              />
            </CardContent>
          </Card>
      </div>
    </Modal>
  );
}

function AddChildSummaryItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-input border border-border p-3">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 font-medium text-text-primary">{value}</div>
    </div>
  );
}

function ChildrenListView({
  children,
  search,
  page,
  onSearchChange,
  onPageChange,
  onChildOpen,
  onAddChild,
}: {
  children: ChildListRecord[];
  search: string;
  page: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onChildOpen: (child: ChildListRecord) => void;
  onAddChild: () => void;
}) {
  const { t } = useI18n();

  return (
    <PageContainer>
      <PageHeader
        title={t("children.list.title")}
        breadcrumbs={[{ label: t("navigation.childrenParents"), href: "#" }, { label: t("navigation.children") }]}
        actions={<Button onClick={onAddChild}>{t("children.addChild.title")}</Button>}
      />

      <Card>
        <CardContent className="space-y-4">
          <TableToolbar
            search={
              <SearchField
                aria-label={t("children.list.search")}
                placeholder={t("children.list.search")}
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            }
            filters={
              <>
                <Select
                  label={t("children.list.table.age")}
                  defaultValue="all"
                  options={[
                    { label: t("groups.filters.all"), value: "all" },
                    { label: "3–4 года", value: "3-4" },
                    { label: "4–5 лет", value: "4-5" },
                    { label: "5–6 лет", value: "5-6" },
                  ]}
                />
                <Select
                  label={t("children.list.table.attendance")}
                  defaultValue="all"
                  options={[
                    { label: t("groups.filters.all"), value: "all" },
                    { label: t("children.attendanceStatus.present"), value: "present" },
                    { label: t("children.attendanceStatus.absent"), value: "absent" },
                  ]}
                />
                <Select
                  label={t("children.list.table.childStatus")}
                  defaultValue="all"
                  options={[
                    { label: t("groups.filters.all"), value: "all" },
                    { label: t("children.childStatus.active"), value: "active" },
                    { label: t("children.childStatus.paused"), value: "paused" },
                    { label: t("children.childStatus.expelled"), value: "expelled" },
                    { label: t("children.childStatus.graduate"), value: "graduate" },
                  ]}
                />
              </>
            }
          />

          {children.length ? (
            <>
              <TableContainer>
                <Table className="min-w-[1280px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("children.list.table.id")}</TableHead>
                      <TableHead>{t("children.list.table.fullName")}</TableHead>
                      <TableHead>{t("children.list.table.age")}</TableHead>
                      <TableHead>{t("children.list.table.development")}</TableHead>
                      <TableHead>{t("children.list.table.teacher")}</TableHead>
                      <TableHead>{t("children.list.table.attendance")}</TableHead>
                      <TableHead>{t("children.list.table.parent")}</TableHead>
                      <TableHead>{t("children.list.table.childStatus")}</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {children.map((child) => (
                      <TableRow key={child.id} className="cursor-pointer" onClick={() => onChildOpen(child)}>
                        <TableCell className="font-medium">{child.id}</TableCell>
                        <TableCell className="max-w-[220px] whitespace-normal font-medium">{child.fullName}</TableCell>
                        <TableCell>{child.age}</TableCell>
                        <TableCell className="min-w-[460px]">
                          <DevelopmentCompactMetrics metrics={toCompactMetrics(child, t)} />
                        </TableCell>
                        <TableCell>{child.teacher}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <AttendanceStatusBadge status={child.attendanceStatus} />
                            <div className="text-xs text-text-muted">{child.attendanceDate}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <button type="button" className="text-left font-medium text-primary" onClick={(event) => event.stopPropagation()}>
                            {child.parentName}
                          </button>
                        </TableCell>
                        <TableCell>
                          <ChildStatusBadge status={child.childStatus} />
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" aria-label={t("common.actions.open")}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-medium text-text-secondary">
                  {t("children.list.total", { shown: children.length, total: mockChildren.length })}
                </div>
                <Pagination page={page} pageCount={13} onPageChange={onPageChange} />
              </div>
            </>
          ) : (
            <EmptyState title={t("children.list.emptyTitle")} description={t("children.list.emptyDescription")} />
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function ChildProfileView({
  child,
  onBack,
  onOpenModal,
  onNavigate,
}: {
  child: ChildProfile;
  onBack: () => void;
  onOpenModal: (state: ModalState) => void;
  onNavigate?: (key: SidebarNavigationKey) => void;
}) {
  const { t } = useI18n();

  return (
    <PageContainer>
      <PageHeader
        title={child.fullName}
        breadcrumbs={[
          { label: t("navigation.childrenParents"), href: "#" },
          { label: t("navigation.children"), href: "#" },
          { label: t("children.profile.cardBreadcrumb") },
        ]}
        actions={
          <>
            <Button variant="outline" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={onBack}>
              {t("children.actions.backToChildren")}
            </Button>
            <Button leftIcon={<Edit className="h-4 w-4" />}>{t("common.actions.edit")}</Button>
          </>
        }
      />

      <div className="space-y-6">
        <ChildSummaryCard child={child} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)]">
          <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <RelatedAdultsCard child={child} onOpen={() => onNavigate?.("parents")} />
            <GroupCard child={child} onOpen={() => onNavigate?.("groups")} />
            <TariffCard child={child} onOpen={() => onNavigate?.("financePayments")} />
            <MedicalCard child={child} />
          </div>
          <DevelopmentJournalCard
            child={child}
            onSubareaOpen={(subarea) => onOpenModal({ type: "subarea", subarea })}
            onOpenDevelopmentMap={() => onNavigate?.("bilimtoy-development-map")}
          />
          <DevelopmentDynamicsCard child={child} />
        </div>

          <div className="space-y-6">
            <DocumentsCard child={child} onOpenAll={() => onOpenModal("documents")} />
            <BilimtoyMetricsCard child={child} />
            <AIRecommendationsCard onOpen={() => onOpenModal("aiRecommendations")} />
            <GameHistoryEntryCard child={child} onOpen={() => onOpenModal("games")} />
            <SpecialistCommentsEntryCard child={child} onOpen={() => onOpenModal("comments")} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function ChildSummaryCard({ child }: { child: ChildProfile }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<ChildStatus>(child.childStatus);

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-muted">
          <span>{t("children.profile.addedAt")}: <span className="text-text-secondary">{child.addedAt}</span></span>
          <span className="h-4 w-px bg-border" />
          <span>Кем добавлен: <span className="text-text-secondary">Дилфуза Каримова</span></span>
        </div>
        <div className="grid gap-6 xl:grid-cols-[180px_minmax(260px,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex items-start justify-center xl:justify-start">
            <Avatar size="lg" className="h-40 w-40 bg-info-bg text-4xl">
              <AvatarFallback>{child.photoInitials}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-4 self-center">
            <h2 className="max-w-[560px] text-2xl font-semibold leading-tight text-text-primary">{child.fullName}</h2>
            <div className="flex flex-wrap gap-2">
              <ChildStatusSelect value={status} onChange={setStatus} />
            </div>
          </div>
          <div className="space-y-5 border-border xl:border-l xl:pl-6">
            <ChildProfileIconInfo icon={<CalendarDays className="h-5 w-5" />} label={t("children.profile.birthDate")} value={`${child.birthDate} (${child.age})`} />
            <ChildProfileIconInfo icon={<FileText className="h-5 w-5" />} label={t("children.profile.idRow")} value={`${child.id} / ${child.rowNumber}`} />
          </div>
          <div className="space-y-5 border-border xl:border-l xl:pl-6">
            <ChildProfileIconInfo icon={<MapPin className="h-5 w-5" />} label={t("children.profile.address")} value={child.address} />
            <ChildProfileIconInfo icon={<Building2 className="h-5 w-5" />} label={t("children.profile.branch")} value={child.branchName} />
          </div>
          <div className="space-y-5 border-border xl:border-l xl:pl-6">
            <ChildProfileIconInfo
              icon={<Gamepad2 className="h-5 w-5" />}
              label={t("children.profile.bilimtoyCode")}
              value={
                <span className="inline-flex items-center gap-2 font-semibold text-primary">
                  {child.bilimtoyCode}
                  <Copy className="h-4 w-4 text-text-muted" />
                </span>
              }
            />
            <ChildProfileIconInfo icon={<CalendarDays className="h-5 w-5" />} label={t("children.profile.addedAt")} value={child.addedAt} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChildProfileIconInfo({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
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

function RelatedAdultsCard({ child, onOpen }: { child: ChildProfile; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("children.profile.relatedAdults.title")} icon={<Users className="h-5 w-5" />} action onClick={onOpen}>
      <div className="space-y-3">
        {child.relatives.map((relative) => (
          <div key={relative.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0">
            <Avatar size="sm">
              <AvatarFallback>{relative.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-text-primary">{relative.fullName}</div>
              <div className="text-xs text-text-muted">{t(`children.relations.${relative.relation}`)}</div>
            </div>
            <a href="#" className="text-xs font-medium text-primary">
              {relative.phone}
            </a>
            <Phone className="h-4 w-4 text-primary" />
          </div>
        ))}
        <LinkButton>{t("children.profile.relatedAdults.all")}</LinkButton>
      </div>
    </InfoCard>
  );
}

function GroupCard({ child, onOpen }: { child: ChildProfile; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("children.profile.group.title")} icon={<Users className="h-5 w-5" />} action onClick={onOpen}>
      <div className="space-y-3">
        <InfoLine label={t("children.profile.group.name")} value={child.group.name} />
        <InfoLine label={t("children.profile.group.ageCategory")} value={child.group.ageCategory} />
        <InfoLine label={t("children.profile.group.direction")} value={child.group.direction} />
        {child.group.teachers.map((teacher) => (
          <div key={teacher.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-text-primary">{teacher.fullName}</span>
            <span className="inline-flex items-center gap-1 text-primary">
              <Phone className="h-4 w-4" />
              {teacher.phone}
            </span>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}

function TariffCard({ child, onOpen }: { child: ChildProfile; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("children.profile.tariff.title")} icon={<FileText className="h-5 w-5" />} action onClick={onOpen}>
      <div className="space-y-3">
        <InfoLine label={t("children.profile.tariff.name")} value={child.tariff.name} />
        <InfoLine label={t("children.profile.tariff.type")} value={child.tariff.type} />
        <InfoLine label={t("children.profile.tariff.price")} value={child.tariff.monthlyPrice} />
        <StatusBadge status={child.tariff.paymentStatus === "paid" ? "success" : "warning"}>{t(`children.paymentStatus.${child.tariff.paymentStatus}`)}</StatusBadge>
      </div>
    </InfoCard>
  );
}

function DocumentsCard({ child, onOpenAll }: { child: ChildProfile; onOpenAll: () => void }) {
  const { t } = useI18n();
  const documents = child.documents.slice(0, 4);
  return (
    <InfoCard title={t("children.profile.documents.title")} icon={<Folder className="h-5 w-5" />} onClick={onOpenAll}>
      <div className="space-y-2">
        {documents.map((document) => (
          <div key={document.id} className="grid grid-cols-[28px_1fr_auto_32px_24px] items-center gap-3 border-b border-border pb-2 last:border-b-0">
            <Badge variant="danger" className="h-6 min-h-6 justify-center px-1 text-[10px]">PDF</Badge>
            <span className="truncate text-sm font-medium text-text-primary">{document.fileName}</span>
            <span className="text-xs text-text-muted">{document.date}</span>
            <Download className="h-4 w-4 text-text-secondary" />
            <MoreVertical className="h-4 w-4 text-text-muted" />
          </div>
        ))}
        <Button variant="ghost" className="w-full justify-center text-primary" onClick={(event) => { event.stopPropagation(); onOpenAll(); }}>
          {t("children.profile.documents.all")} ({child.documents.length}) <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </InfoCard>
  );
}

function MedicalCard({ child }: { child: ChildProfile }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("children.profile.medical.title")} icon={<HeartPulse className="h-5 w-5" />}>
      <InfoLine label={t("children.profile.medical.allergies")} value={child.medical.allergies} />
      <InfoLine label={t("children.profile.medical.diseases")} value={child.medical.diseases} />
      <InfoLine label={t("children.profile.medical.psychology")} value={child.medical.psychology} />
    </InfoCard>
  );
}

function BilimtoyMetricsCard({ child }: { child: ChildProfile }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("children.profile.bilimtoyMetrics.title")} icon={<Gamepad2 className="h-5 w-5" />}>
      <div className="space-y-4">
        {child.bilimtoyMetrics.map((metric) => (
          <div key={metric.id} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
            <CircularMetric value={metric.value} label={t(metric.labelKey)} tone={metric.tone} />
          </div>
        ))}
      </div>
    </InfoCard>
  );
}

function GameHistoryEntryCard({ child, onOpen }: { child: ChildProfile; onOpen: () => void }) {
  const { t } = useI18n();
  const latest = [
    { icon: <Award className="h-5 w-5" />, tone: "warning", title: "Сертификат «Знаток букв»", description: "Выдан за прохождение темы «Алфавит»", date: "18.05.2026" },
    { icon: <Trophy className="h-5 w-5" />, tone: "success", title: "Достижение «Быстрый мыслитель»", description: "Время выполнения задач улучшено на 20%", date: "16.05.2026" },
    { icon: <FileText className="h-5 w-5" />, tone: "info", title: "Сертификат «Математика»", description: "Выдан за прохождение темы «Счёт до 10»", date: "12.05.2026" },
  ];

  return (
    <InfoCard
      title={t("children.gameHistory.title")}
      icon={<Gamepad2 className="h-5 w-5" />}
      actionSlot={<Button variant="secondary" size="sm" onClick={(event) => { event.stopPropagation(); onOpen(); }}>{t("children.actions.details")}</Button>}
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <GameStat icon={<Grid2X2 className="h-5 w-5" />} label={t("children.gameHistory.topics")} value={child.gameHistory.topicsCount} tone="info" />
        <GameStat icon={<Gamepad2 className="h-5 w-5" />} label={t("children.gameHistory.games")} value={child.gameHistory.gamesCount} tone="info" />
        <GameStat icon={<Trophy className="h-5 w-5" />} label={t("children.gameHistory.achievements")} value={child.gameHistory.achievementsCount} tone="warning" />
        <GameStat icon={<Award className="h-5 w-5" />} label={t("children.gameHistory.certificates")} value={child.gameHistory.certificatesCount} tone="success" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-semibold text-text-primary">{t("children.gameHistory.latest")}</div>
        {latest.map((item) => (
          <div key={item.title} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-border pb-3 last:border-b-0">
            <span className={cn("flex h-10 w-10 items-center justify-center rounded-input", historyToneClass(item.tone))}>{item.icon}</span>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-text-primary">{item.title}</div>
              <div className="line-clamp-1 text-xs text-text-muted">{item.description}</div>
            </div>
            <span className="text-xs font-medium text-text-muted">{item.date}</span>
          </div>
        ))}
      </div>
      <LinkButton onClick={onOpen}>{t("children.gameHistory.open")}</LinkButton>
    </InfoCard>
  );
}

function SpecialistCommentsEntryCard({ child, onOpen }: { child: ChildProfile; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("children.specialistComments.title")} icon={<MessageSquareText className="h-5 w-5" />}>
      <div className="space-y-3">
        {child.specialistComments.slice(0, 2).map((comment) => (
          <div key={comment.id} className="flex gap-3 rounded-input border border-border p-3">
            <Avatar size="sm">
              <AvatarFallback>{comment.initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-xs text-text-muted">{t(`children.specialistRoles.${comment.role}`)}</div>
              <div className="text-sm font-semibold text-text-primary">{comment.specialistName}</div>
              <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{comment.text}</p>
            </div>
          </div>
        ))}
        <LinkButton onClick={onOpen}>{t("children.specialistComments.all")}</LinkButton>
      </div>
    </InfoCard>
  );
}

function DevelopmentJournalCard({
  child,
  onSubareaOpen,
  onOpenDevelopmentMap,
}: {
  child: ChildProfile;
  onSubareaOpen: (subarea: DevelopmentSubarea) => void;
  onOpenDevelopmentMap: () => void;
}) {
  const { t } = useI18n();
  const [openArea, setOpenArea] = useState<DevelopmentAreaKey>("speech");

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{t("children.developmentJournal.title")}</CardTitle>
          <CardDescription>{t("children.developmentJournal.description")}</CardDescription>
        </div>
        <Button variant="outline" onClick={onOpenDevelopmentMap}>{t("children.developmentJournal.openMap")}</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {child.developmentJournal.map((areaItem, index) => {
          const open = openArea === areaItem.area;
          return (
            <div key={areaItem.area} className="rounded-input border border-border">
              <button
                type="button"
                className={cn("flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold", open && "bg-primary-soft text-primary")}
                onClick={() => {
                  setOpenArea(areaItem.area);
                  onSubareaOpen(areaItem.subareas[0]);
                }}
              >
                <span>{`${index + 1}. ${t(`children.developmentAreas.${areaItem.area}`)}`}</span>
                <ChevronRight className={cn("h-4 w-4 transition-transform", open && "rotate-90")} />
              </button>
              {open ? (
                <div className="border-t border-border p-3">
                  <TableContainer>
                    <Table className="min-w-[760px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("children.developmentJournal.subarea")}</TableHead>
                          <TableHead>{t("children.developmentJournal.primary")}</TableHead>
                          <TableHead>{t("children.developmentJournal.goal")}</TableHead>
                          <TableHead>{t("children.developmentJournal.intermediate")}</TableHead>
                          <TableHead>{t("children.developmentJournal.goal")}</TableHead>
                          <TableHead>{t("children.developmentJournal.final")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {areaItem.subareas.map((subarea) => (
                          <TableRow key={subarea.id} className="cursor-pointer" onClick={() => onSubareaOpen(subarea)}>
                            <TableCell className="font-medium">{subarea.name}</TableCell>
                            <TableCell>
                              <ScoreWithSource score={subarea.primary.score} source={subarea.primary.source} />
                            </TableCell>
                            <TableCell>{subarea.primaryGoal}</TableCell>
                            <TableCell>
                              <ScoreWithSource score={subarea.intermediate.score} source={subarea.intermediate.source} />
                            </TableCell>
                            <TableCell>{subarea.intermediateGoal}</TableCell>
                            <TableCell>
                              <ScoreWithSource score={subarea.final.score} source={subarea.final.source} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ) : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function DevelopmentDynamicsCard({ child }: { child: ChildProfile }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("children.developmentDynamics.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("children.developmentDynamics.area")}</TableHead>
                <TableHead>{t("children.developmentDynamics.primary")}</TableHead>
                <TableHead>{t("children.developmentDynamics.intermediate")}</TableHead>
                <TableHead>{t("children.developmentDynamics.final")}</TableHead>
                <TableHead>{t("children.developmentDynamics.dynamics")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {child.developmentDynamics.map((row) => (
                <TableRow key={row.area}>
                  <TableCell className="font-medium">{t(`children.developmentAreas.${row.area}`)}</TableCell>
                  <TableCell>{row.observation1}%</TableCell>
                  <TableCell>{row.observation2}%</TableCell>
                  <TableCell>{row.observation3}%</TableCell>
                  <TableCell className="font-semibold text-success-text">+{row.dynamics}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

function SpecialistCommentsModal({ child, open, onOpenChange }: { child: ChildProfile; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const [comment, setComment] = useState("");

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("children.specialistComments.modalTitle")}
      description={t("children.specialistComments.modalDescription")}
      size="lg"
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {t("common.actions.close")}
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-3 rounded-input border border-border p-3 sm:grid-cols-2">
          <InfoLine label={t("children.profile.child")} value={child.fullName} />
          <InfoLine label={t("children.profile.group.title")} value={child.group.name} />
        </div>
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback>{child.photoInitials}</AvatarFallback>
          </Avatar>
          <CommentComposer
            className="flex-1 rounded-input border border-border p-3"
            placeholder={t("children.specialistComments.placeholder")}
            value={comment}
            onChange={setComment}
            attachmentLabel={t("children.specialistComments.attach")}
            sendLabel={t("children.specialistComments.send")}
            onSend={() => setComment("")}
          />
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-card-title text-text-primary">{t("children.specialistComments.title")}</h3>
            <Badge variant="info">{child.specialistComments.length}</Badge>
          </div>
          <div className="divide-y divide-border rounded-card border border-border">
            {child.specialistComments.map((item) => (
              <div key={item.id} className="flex gap-3 p-4">
                <Avatar>
                  <AvatarFallback>{item.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-text-primary">{item.specialistName}</span>
                    <Badge variant={specialistRoleVariant(item.role)}>{t(`children.specialistRoles.${item.role}`)}</Badge>
                    <span className="ml-auto text-sm text-text-muted">{item.dateTime}</span>
                    <Button variant="ghost" size="icon" aria-label={t("common.actions.edit")}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label={t("common.actions.delete")}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function GameHistoryModal({ child, open, onOpenChange }: { child: ChildProfile; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const history = child.gameHistory;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("children.gameHistory.title")}
      description={t("children.gameHistory.description")}
      size="xl"
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {t("common.actions.close")}
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-4">
          <MiniStat label={t("children.gameHistory.topics")} value={history.topicsCount} />
          <MiniStat label={t("children.gameHistory.games")} value={history.gamesCount} />
          <MiniStat label={t("children.gameHistory.achievements")} value={history.achievementsCount} />
          <MiniStat label={t("children.gameHistory.certificates")} value={history.certificatesCount} />
        </div>
        <Tabs defaultValue="topics">
          <TabsList className="w-full justify-between">
            <TabsTrigger value="topics">{t("children.gameHistory.tabs.topics")}</TabsTrigger>
            <TabsTrigger value="games">{t("children.gameHistory.tabs.games")}</TabsTrigger>
            <TabsTrigger value="achievements">{t("children.gameHistory.tabs.achievements")}</TabsTrigger>
            <TabsTrigger value="certificates">{t("children.gameHistory.tabs.certificates")}</TabsTrigger>
          </TabsList>
          <TabsContent value="topics">
            <SimpleScoreTable rows={history.topics} nameLabel={t("children.gameHistory.topicName")} />
          </TabsContent>
          <TabsContent value="games">
            <SimpleScoreTable rows={history.games} nameLabel={t("children.gameHistory.gameName")} />
          </TabsContent>
          <TabsContent value="achievements">
            <HistoryCards items={history.achievements} />
          </TabsContent>
          <TabsContent value="certificates">
            <HistoryCards items={history.certificates} />
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}

function SubareaGoalsModal({
  child,
  state,
  onOpenChange,
}: {
  child: ChildProfile;
  state: { type: "subarea"; subarea: DevelopmentSubarea } | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const subarea = state?.subarea;
  const [editing, setEditing] = useState(false);

  return (
    <Modal
      open={Boolean(subarea)}
      onOpenChange={onOpenChange}
      title={t("children.subareaGoals.title")}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.actions.close")}
          </Button>
          {editing ? <Button variant="outline" onClick={() => setEditing(false)}>{t("common.actions.save")}</Button> : null}
          <Button>{t("children.subareaGoals.goToMap")}</Button>
        </>
      }
    >
      {subarea ? (
        <div className="space-y-4">
          <div className="grid gap-3 rounded-input border border-border p-3 md:grid-cols-3">
            <InfoLine label={t("children.subareaGoals.area")} value={t(`children.developmentAreas.${subarea.area}`)} />
            <InfoLine label={t("children.subareaGoals.subarea")} value={subarea.name} />
            <InfoLine label={t("children.subareaGoals.basis")} value={t("children.subareaGoals.primaryBasis", { score: t(`children.nicu.${subarea.primary.score}`) })} />
          </div>
          <Panel title={t("children.subareaGoals.observationComment")}>
            {editing ? <Textarea rows={4} defaultValue={subarea.comment} /> : <button type="button" className="w-full text-left" onClick={() => setEditing(true)}>{subarea.comment}</button>}
          </Panel>
          <Panel title={t("children.subareaGoals.goal1")}>
            <InfoLine label={t("children.subareaGoals.indicator")} value={subarea.primaryGoal} />
            {editing ? <Textarea rows={4} defaultValue={subarea.intermediateGoal} /> : <InfoLine label={t("children.subareaGoals.goalText")} value={subarea.intermediateGoal} />}
          </Panel>
          <Panel title={t("children.subareaGoals.statusChanges")}>
            <div className="flex flex-wrap items-center gap-2">
              <ScoreWithSource score={subarea.primary.score} source={subarea.primary.source} />
              <ChevronRight className="h-4 w-4 text-text-muted" />
              <ScoreWithSource score={subarea.intermediate.score} source={subarea.intermediate.source} />
              <ChevronRight className="h-4 w-4 text-text-muted" />
              <ScoreWithSource score={subarea.final.score} source={subarea.final.source} />
            </div>
          </Panel>
          <Panel title={t("children.subareaGoals.parentRecommendation")}>
            {editing ? <Textarea rows={4} defaultValue={subarea.recommendation} /> : <button type="button" className="w-full text-left" onClick={() => setEditing(true)}>{subarea.recommendation}</button>}
          </Panel>
          <Panel title={t("children.subareaGoals.participants")}>{subarea.responsible.join(", ")} · {child.group.name}</Panel>
        </div>
      ) : null}
    </Modal>
  );
}

function ChildDocumentsModal({ child, open, onOpenChange }: { child: ChildProfile; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("children.profile.documents.allTitle")}
      description={child.fullName}
      size="lg"
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {t("common.actions.close")}
        </Button>
      }
    >
      <TableContainer>
        <Table>
          <TableHeader className="normal-case">
            <TableRow>
              <TableHead>{t("children.profile.documents.name")}</TableHead>
              <TableHead>{t("children.profile.documents.type")}</TableHead>
              <TableHead>{t("children.profile.documents.format")}</TableHead>
              <TableHead>{t("children.profile.documents.size")}</TableHead>
              <TableHead>{t("children.profile.documents.date")}</TableHead>
              <TableHead className="w-24 text-right">{t("employees.table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {child.documents.map((document, index) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.fileName}</TableCell>
                <TableCell>{index === 0 ? t("children.profile.documents.types.application") : index === 4 ? t("children.profile.documents.types.medical") : t("children.profile.documents.types.personal")}</TableCell>
                <TableCell><Badge variant="danger">PDF</Badge></TableCell>
                <TableCell>{["452 КБ", "1.2 МБ", "968 КБ", "786 КБ", "1.5 МБ"][index] ?? "640 КБ"}</TableCell>
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

function AIRecommendationsCard({ onOpen }: { onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("children.aiRecommendations.title")} icon={<Sparkles className="h-5 w-5" />} action onClick={onOpen}>
      <div className="space-y-3">
        <div className="rounded-input border border-info-bg bg-info-bg/60 p-3">
          <div className="text-sm font-semibold text-text-primary">{t("children.aiRecommendations.shortPattern")}</div>
          <p className="mt-1 text-sm text-text-secondary">{t("children.aiRecommendations.shortDescription")}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MetricPill label={t("children.aiRecommendations.confidence")} value="87%" tone="success" />
          <MetricPill label={t("children.aiRecommendations.status")} value={t("children.aiRecommendations.statusReview")} tone="warning" />
        </div>
      </div>
    </InfoCard>
  );
}

function AIRecommendationsDrawer({ child, open, onClose }: { child: ChildProfile; open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-overlay">
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col bg-surface shadow-modal">
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{t("children.aiRecommendations.drawerTitle")}</h2>
            <p className="mt-1 text-sm text-text-muted">{child.fullName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label={t("common.actions.close")}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 space-y-5 overflow-auto px-6 py-5">
          <Panel title={t("children.aiRecommendations.pattern")}>{t("children.aiRecommendations.patternText")}</Panel>
          <Panel title={t("children.aiRecommendations.events")}>
            <div className="space-y-3">
              {[
                t("children.aiRecommendations.event1"),
                t("children.aiRecommendations.event2"),
                t("children.aiRecommendations.event3"),
              ].map((event) => (
                <div key={event} className="flex gap-3 border-b border-border pb-3 last:border-b-0">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success-text" />
                  <span>{event}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title={t("children.aiRecommendations.sources")}>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{t("children.aiRecommendations.gamesSource")}</Badge>
              <Badge variant="purple">{t("children.aiRecommendations.teacherCommentsSource")}</Badge>
            </div>
          </Panel>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricPill label={t("children.aiRecommendations.confidence")} value="87%" tone="success" />
            <MetricPill label={t("children.aiRecommendations.generatedAt")} value="11.05.2026 01:45" tone="info" />
            <MetricPill label={t("children.aiRecommendations.status")} value={t("children.aiRecommendations.statusReview")} tone="warning" />
          </div>
        </div>
      </aside>
    </div>
  );
}

function ChildStatusSelect({ value, onChange }: { value: ChildStatus; onChange: (value: ChildStatus) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const statuses: ChildStatus[] = ["active", "paused", "expelled", "graduate"];

  return (
    <div className="relative">
      <button type="button" className="inline-flex" onClick={() => setOpen((current) => !current)}>
        <ChildStatusBadge status={value} />
      </button>
      {open ? (
        <div className="absolute left-0 z-20 mt-2 w-64 rounded-input border border-border bg-surface p-1 shadow-modal">
          {statuses.map((status) => (
            <button
              key={status}
              type="button"
              className="flex w-full items-center justify-between gap-3 rounded-[8px] px-3 py-2 text-left hover:bg-page"
              onClick={() => {
                onChange(status);
                setOpen(false);
              }}
            >
              <ChildStatusBadge status={status} />
              {status === value ? <CheckCircle2 className="h-4 w-4 text-success-text" /> : null}
            </button>
          ))}
        </div>
      ) : null}
      <span className="sr-only">{t("children.profile.status")}</span>
    </div>
  );
}

function ChildStatusBadge({ status }: { status: ChildStatus }) {
  const { t } = useI18n();
  const variant = status === "active" ? "success" : status === "paused" ? "warning" : status === "graduate" ? "info" : "danger";
  return <StatusBadge status={variant}>{t(`children.childStatus.${status}`)}</StatusBadge>;
}

function AttendanceStatusBadge({ status }: { status: ChildAttendanceStatus }) {
  const { t } = useI18n();
  return <StatusBadge status={status === "present" ? "success" : "danger"}>{t(`children.attendanceStatus.${status}`)}</StatusBadge>;
}

function ScoreWithSource({ score, source }: { score: NicuScore; source: DataSourceType }) {
  const { t } = useI18n();
  const scoreVariant = score === "n" ? "danger" : score === "i" ? "warning" : score === "ch" ? "success" : "info";
  return (
    <span className="inline-flex items-center gap-1">
      <StatusBadge status={scoreVariant}>{t(`children.nicu.${score}`)}</StatusBadge>
      <DataSourceIcon type={source as DataSourceIconType} label={t(`children.dataSource.${source}`)} />
    </span>
  );
}

function toCompactMetrics(child: ChildListRecord, t: (key: string) => string): DevelopmentCompactMetric[] {
  return child.developmentMetrics.map((metric) => ({
    area: metric.area,
    value: metric.value,
    label: t(`children.developmentAreasShort.${metric.area}`),
    tone: metricTones[metric.area],
  }));
}

function createChildProfile(childId: string): ChildProfile {
  const listRecord = mockChildren.find((child) => child.id === childId) ?? mockChildren[0];
  return {
    ...mockChildProfile,
    ...listRecord,
    photoInitials: listRecord.fullName
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join(""),
  };
}

function specialistRoleVariant(role: SpecialistRole) {
  if (role === "speechTherapist") return "info";
  if (role === "psychologist") return "purple";
  return "success";
}

function InfoCard({
  title,
  icon,
  children,
  action = false,
  actionSlot,
  onClick,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  action?: boolean;
  actionSlot?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Card
      className={onClick ? "cursor-pointer transition-shadow hover:shadow-modal" : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <CardTitle>{title}</CardTitle>
        </div>
        {actionSlot ?? (action ? <ChevronRight className="h-4 w-4 text-text-muted" /> : null)}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 text-sm sm:grid-cols-[150px_minmax(0,1fr)]">
      <div className="text-text-muted">{label}</div>
      <div className="font-medium text-text-primary">{value}</div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 text-sm font-medium text-text-primary">{value}</div>
    </div>
  );
}

function InfoPanel({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-input border border-border p-3">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 text-sm font-medium text-text-primary">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-input border border-border p-3">
      <div className="text-lg font-semibold text-text-primary">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}

function GameStat({ icon, label, value, tone }: { icon: ReactNode; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-input border border-border p-3">
      <div className="flex items-center gap-3">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-input", historyToneClass(tone))}>{icon}</span>
        <div>
          <div className="text-lg font-semibold text-text-primary">{value}</div>
          <div className="text-xs font-medium text-text-muted">{label}</div>
        </div>
      </div>
    </div>
  );
}

function MetricPill({ label, value, tone }: { label: string; value: string; tone: "success" | "warning" | "info" }) {
  const toneClass = {
    success: "bg-success-bg text-success-text border-success-bg",
    warning: "bg-warning-bg text-warning-text border-warning-bg",
    info: "bg-info-bg text-info-text border-info-bg",
  }[tone];
  return (
    <div className={cn("rounded-input border p-3", toneClass)}>
      <div className="text-xs font-medium opacity-80">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function historyToneClass(tone: string) {
  if (tone === "success") return "bg-success-bg text-success-text";
  if (tone === "warning") return "bg-warning-bg text-warning-text";
  if (tone === "purple") return "bg-purple-bg text-purple-text";
  return "bg-info-bg text-info-text";
}

function LinkButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <Button variant="ghost" className="justify-start px-0" onClick={onClick}>
      {children}
      <ChevronRight className="ml-1 h-4 w-4" />
    </Button>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-input border border-border p-4">
      <div className="mb-2 text-sm font-semibold text-text-primary">{title}</div>
      <div className="text-sm text-text-secondary">{children}</div>
    </div>
  );
}

function SimpleScoreTable({ rows, nameLabel }: { rows: Array<{ name: string; passedAt: string; score: number }>; nameLabel: string }) {
  const { t } = useI18n();
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{nameLabel}</TableHead>
            <TableHead>{t("children.gameHistory.passedAt")}</TableHead>
            <TableHead>{t("children.gameHistory.score")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.passedAt}</TableCell>
              <TableCell>
                <StatusBadge status={row.score >= 80 ? "success" : "warning"}>{row.score}%</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function HistoryCards({ items }: { items: Array<{ title: string; date: string; description: string }> }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title}>
          <CardContent>
            <div className="text-sm font-semibold text-text-primary">{item.title}</div>
            <div className="mt-1 text-xs text-text-muted">{item.date}</div>
            <p className="mt-3 text-sm text-text-secondary">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
