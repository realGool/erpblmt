import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  FileText,
  MapPin,
  Megaphone,
  MessageSquare,
  Paperclip,
  Phone,
  Plus,
  Send,
  Smartphone,
  Trash2,
  Users,
  WalletCards,
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
import { mockChildren } from "../../data/mockChildren";
import {
  mockParentProfile,
  mockParents,
  type ParentListRecord,
  type ParentPaymentStatus,
  type ParentProfile,
  type ParentRelation,
  type ParentStatus,
  type ParentTicket,
  type TicketStatus,
} from "../../data/mockParents";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

interface ParentsPageProps {
  onNavigate?: (key: SidebarNavigationKey) => void;
}

export function ParentsPage({ onNavigate }: ParentsPageProps) {
  const { t } = useI18n();
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [parentStatusFilter, setParentStatusFilter] = useState("all");
  const [ticketsFilter, setTicketsFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [ticket, setTicket] = useState<ParentTicket | null>(null);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [addParentOpen, setAddParentOpen] = useState(false);
  const [editParentOpen, setEditParentOpen] = useState(false);
  const [deleteParentOpen, setDeleteParentOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(false);

  const filteredParents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return mockParents
      .filter((parent) => {
        const matchesSearch =
          !query ||
          parent.fullName.toLocaleLowerCase().includes(query) ||
          parent.phone.toLocaleLowerCase().includes(query) ||
          parent.children.some((child) => child.fullName.toLocaleLowerCase().includes(query));
        const matchesGroup = groupFilter === "all" || parent.children.some((child) => child.groupName === groupFilter);
        const matchesBranch = branchFilter === "all" || parent.children.some((child) => child.branchName === branchFilter);
        const matchesPayment = paymentStatusFilter === "all" || parent.paymentStatus === paymentStatusFilter;
        const matchesParentStatus = parentStatusFilter === "all" || parent.parentStatus === parentStatusFilter;
        const matchesTickets =
          ticketsFilter === "all" ||
          (ticketsFilter === "withTickets" && parent.activeTickets > 0) ||
          (ticketsFilter === "withoutTickets" && parent.activeTickets === 0);
        return matchesSearch && matchesGroup && matchesBranch && matchesPayment && matchesParentStatus && matchesTickets;
      })
      .sort((first, second) => {
        if (sort === "name") return first.fullName.localeCompare(second.fullName, "ru");
        if (sort === "tickets") return second.activeTickets - first.activeTickets;
        const firstDate = first.addedAt.split(".").reverse().join("");
        const secondDate = second.addedAt.split(".").reverse().join("");
        return sort === "oldest" ? firstDate.localeCompare(secondDate) : secondDate.localeCompare(firstDate);
      });
  }, [branchFilter, groupFilter, parentStatusFilter, paymentStatusFilter, search, sort, ticketsFilter]);

  const selectedParent = selectedParentId ? createParentProfile(selectedParentId) : null;

  return (
    <AppShell activeNavigation="parents" onNavigate={onNavigate}>
      {selectedParent ? (
        <ParentProfileView
          parent={selectedParent}
          onBack={() => setSelectedParentId(null)}
          onTicketOpen={setTicket}
          onEditParent={() => setEditParentOpen(true)}
          onDeleteParent={() => setDeleteParentOpen(true)}
        />
      ) : (
        <ParentsListView
          parents={filteredParents}
          search={search}
          groupFilter={groupFilter}
          branchFilter={branchFilter}
          paymentStatusFilter={paymentStatusFilter}
          parentStatusFilter={parentStatusFilter}
          ticketsFilter={ticketsFilter}
          sort={sort}
          page={page}
          onSearchChange={setSearch}
          onGroupFilterChange={setGroupFilter}
          onBranchFilterChange={setBranchFilter}
          onPaymentStatusFilterChange={setPaymentStatusFilter}
          onParentStatusFilterChange={setParentStatusFilter}
          onTicketsFilterChange={setTicketsFilter}
          onSortChange={setSort}
          onPageChange={setPage}
          onAddParent={() => setAddParentOpen(true)}
          onCreateAnnouncement={() => setAnnouncementOpen(true)}
          onParentOpen={(parent) => setSelectedParentId(parent.id)}
        />
      )}

      <TicketModal ticket={ticket} parent={selectedParent ?? mockParentProfile} onOpenChange={(open) => !open && setTicket(null)} />
      <CreateTicketModal parent={selectedParent ?? mockParentProfile} open={createTicketOpen} onOpenChange={setCreateTicketOpen} />
      <AddParentModal open={addParentOpen} onOpenChange={setAddParentOpen} />
      <AddParentModal open={editParentOpen} onOpenChange={setEditParentOpen} parent={selectedParent ?? mockParentProfile} mode="edit" />
      <DeleteParentModal parent={selectedParent ?? mockParentProfile} open={deleteParentOpen} onOpenChange={setDeleteParentOpen} />
      <AnnouncementModal open={announcementOpen} onOpenChange={setAnnouncementOpen} />
    </AppShell>
  );
}

function ParentsListView({
  parents,
  search,
  groupFilter,
  branchFilter,
  paymentStatusFilter,
  parentStatusFilter,
  ticketsFilter,
  sort,
  page,
  onSearchChange,
  onGroupFilterChange,
  onBranchFilterChange,
  onPaymentStatusFilterChange,
  onParentStatusFilterChange,
  onTicketsFilterChange,
  onSortChange,
  onPageChange,
  onAddParent,
  onCreateAnnouncement,
  onParentOpen,
}: {
  parents: ParentListRecord[];
  search: string;
  groupFilter: string;
  branchFilter: string;
  paymentStatusFilter: string;
  parentStatusFilter: string;
  ticketsFilter: string;
  sort: string;
  page: number;
  onSearchChange: (value: string) => void;
  onGroupFilterChange: (value: string) => void;
  onBranchFilterChange: (value: string) => void;
  onPaymentStatusFilterChange: (value: string) => void;
  onParentStatusFilterChange: (value: string) => void;
  onTicketsFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAddParent: () => void;
  onCreateAnnouncement: () => void;
  onParentOpen: (parent: ParentListRecord) => void;
}) {
  const { t } = useI18n();
  const stats = createParentStats(mockParents);
  const groupOptions = createParentFilterOptions(
    mockParents.flatMap((parent) => parent.children.map((child) => child.groupName)),
    t("groups.filters.all"),
  );
  const branchOptions = createParentFilterOptions(
    mockParents.flatMap((parent) => parent.children.map((child) => child.branchName)),
    t("groups.filters.all"),
  );

  return (
    <PageContainer>
      <PageHeader
        title={t("parents.list.title")}
        description={t("parents.list.description")}
        breadcrumbs={[{ label: t("navigation.childrenParents"), href: "#" }, { label: t("navigation.parents") }]}
        actions={
          <>
            <Button variant="outline" leftIcon={<Megaphone className="h-4 w-4" />} onClick={onCreateAnnouncement}>
              {t("parents.actions.announcement")}
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onAddParent}>
              {t("parents.actions.addParent")}
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatTile label={t("parents.stats.total")} value={stats.total} />
          <StatTile label={t("parents.stats.active")} value={stats.active} tone="success" />
          <StatTile label={t("parents.stats.withDebt")} value={stats.withDebt} tone="warning" />
          <StatTile label={t("parents.stats.newTickets")} value={stats.newTickets} tone="info" />
        </div>

        <Card>
          <CardContent className="space-y-4">
            <TableToolbar
              search={
                <SearchField
                  aria-label={t("parents.list.search")}
                  placeholder={t("parents.list.search")}
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                />
              }
              filters={
                <>
                  <Select
                    label={t("parents.filters.group")}
                    value={groupFilter}
                    onChange={(event) => onGroupFilterChange(event.target.value)}
                    options={groupOptions}
                  />
                  <Select
                    label={t("parents.filters.branch")}
                    value={branchFilter}
                    onChange={(event) => onBranchFilterChange(event.target.value)}
                    options={branchOptions}
                  />
                  <Select
                    label={t("parents.list.table.paymentStatus")}
                    value={paymentStatusFilter}
                    onChange={(event) => onPaymentStatusFilterChange(event.target.value)}
                    options={[
                      { label: t("groups.filters.all"), value: "all" },
                      { label: t("parents.paymentStatus.paid"), value: "paid" },
                      { label: t("parents.paymentStatus.pending"), value: "pending" },
                      { label: t("parents.paymentStatus.overdue"), value: "overdue" },
                      { label: t("parents.paymentStatus.debt"), value: "debt" },
                    ]}
                  />
                  <Select
                    label={t("parents.list.table.parentStatus")}
                    value={parentStatusFilter}
                    onChange={(event) => onParentStatusFilterChange(event.target.value)}
                    options={[
                      { label: t("groups.filters.all"), value: "all" },
                      { label: t("parents.parentStatus.active"), value: "active" },
                      { label: t("parents.parentStatus.pending"), value: "pending" },
                      { label: t("parents.parentStatus.blocked"), value: "blocked" },
                      { label: t("parents.parentStatus.inactive"), value: "inactive" },
                    ]}
                  />
                  <Select
                    label={t("parents.list.table.activeTickets")}
                    value={ticketsFilter}
                    onChange={(event) => onTicketsFilterChange(event.target.value)}
                    options={[
                      { label: t("groups.filters.all"), value: "all" },
                      { label: t("parents.filters.withTickets"), value: "withTickets" },
                      { label: t("parents.filters.withoutTickets"), value: "withoutTickets" },
                    ]}
                  />
                </>
              }
              actions={
                <Select
                  className="w-full sm:w-56"
                  aria-label={t("parents.filters.sort")}
                  value={sort}
                  onChange={(event) => onSortChange(event.target.value)}
                  options={[
                    { label: t("parents.filters.newestFirst"), value: "newest" },
                    { label: t("parents.filters.oldestFirst"), value: "oldest" },
                    { label: t("parents.filters.byName"), value: "name" },
                    { label: t("parents.filters.byTickets"), value: "tickets" },
                  ]}
                />
              }
            />

            {parents.length ? (
              <>
                <TableContainer>
                  <Table className="min-w-[1320px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("parents.list.table.id")}</TableHead>
                        <TableHead>{t("parents.list.table.fullName")}</TableHead>
                        <TableHead>{t("parents.list.table.phone")}</TableHead>
                        <TableHead>{t("parents.list.table.children")}</TableHead>
                        <TableHead>{t("parents.list.table.group")}</TableHead>
                        <TableHead>{t("parents.list.table.branch")}</TableHead>
                        <TableHead>{t("parents.list.table.paymentStatus")}</TableHead>
                        <TableHead>{t("parents.list.table.activeTickets")}</TableHead>
                        <TableHead>{t("parents.list.table.parentStatus")}</TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parents.map((parent) => (
                        <TableRow key={parent.id} className="cursor-pointer" onClick={() => onParentOpen(parent)}>
                          <TableCell className="font-medium">{parent.id}</TableCell>
                          <TableCell className="font-medium">{parent.fullName}</TableCell>
                          <TableCell>{parent.phone}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {parent.children.map((child) => (
                                <button key={child.id} className="rounded-[6px] bg-primary-soft px-2 py-1 text-xs font-medium text-primary" onClick={(event) => event.stopPropagation()}>
                                  {child.fullName}
                                </button>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{uniqueParentChildValues(parent, "groupName").join(", ")}</TableCell>
                          <TableCell>{uniqueParentChildValues(parent, "branchName").join(", ")}</TableCell>
                          <TableCell>
                            <PaymentStatusBadge status={parent.paymentStatus} />
                          </TableCell>
                          <TableCell>
                            <Badge variant={parent.activeTickets > 0 ? "info" : "neutral"}>{parent.activeTickets}</Badge>
                          </TableCell>
                          <TableCell>
                            <ParentStatusBadge status={parent.parentStatus} />
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
                  <div className="text-sm font-medium text-text-secondary">{t("parents.list.total", { shown: parents.length, total: mockParents.length })}</div>
                  <Pagination page={page} pageCount={8} onPageChange={onPageChange} />
                </div>
              </>
            ) : (
              <EmptyState title={t("parents.list.emptyTitle")} description={t("parents.list.emptyDescription")} />
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function ParentProfileView({
  parent,
  onBack,
  onTicketOpen,
  onEditParent,
  onDeleteParent,
}: {
  parent: ParentProfile;
  onBack: () => void;
  onTicketOpen: (ticket: ParentTicket) => void;
  onEditParent: () => void;
  onDeleteParent: () => void;
}) {
  const { t } = useI18n();

  return (
    <PageContainer>
      <PageHeader
        title={parent.fullName}
        breadcrumbs={[
          { label: t("navigation.childrenParents"), href: "#" },
          { label: t("navigation.parents"), href: "#" },
          { label: t("parents.profile.breadcrumb") },
        ]}
        actions={
          <>
            <Button variant="outline" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={onBack}>
              {t("parents.actions.backToParents")}
            </Button>
            <Button leftIcon={<Edit className="h-4 w-4" />} onClick={onEditParent}>
              {t("common.actions.edit")}
            </Button>
            <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />} onClick={onDeleteParent}>
              {t("common.actions.delete")}
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <ParentSummaryCard parent={parent} />
        <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.72fr)_minmax(0,1.28fr)]">
          <MobileAccessCard parent={parent} />
          <RelatedChildrenCard parent={parent} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <PaymentsCard parent={parent} />
          <DocumentsCard parent={parent} />
        </div>
        <div>
          <TicketsCard parent={parent} onTicketOpen={onTicketOpen} />
        </div>
      </div>
    </PageContainer>
  );
}

function ParentSummaryCard({ parent }: { parent: ParentProfile }) {
  const { t } = useI18n();
  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-text-muted">
          <span>{t("parents.profile.addedAt")}: <span className="text-text-secondary">{parent.addedAt}</span></span>
          <span className="h-4 w-px bg-border" />
          <span>Кем добавлен: <span className="text-text-secondary">Дилфуза Каримова</span></span>
        </div>
        <div className="grid gap-6 xl:grid-cols-[180px_minmax(260px,0.9fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex items-start justify-center xl:justify-start">
            <Avatar size="lg" className="h-40 w-40 bg-info-bg text-4xl">
              <AvatarFallback>{parent.initials}</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-4 self-center">
            <h2 className="max-w-[560px] text-2xl font-semibold leading-tight text-text-primary">{parent.fullName}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{t(`parents.relations.${parent.relation}`)}</Badge>
              <ParentStatusBadge status={parent.parentStatus} />
            </div>
          </div>
          <div className="space-y-5 border-border xl:border-l xl:pl-6">
            <ProfileIconInfo icon={<FileText className="h-5 w-5" />} label={t("parents.profile.parentId")} value={parent.id} />
            <ProfileIconInfo icon={<Users className="h-5 w-5" />} label={t("parents.profile.relation")} value={t(`parents.relations.${parent.relation}`)} />
          </div>
          <div className="space-y-5 border-border xl:border-l xl:pl-6">
            <ProfileIconInfo icon={<Phone className="h-5 w-5" />} label={t("parents.profile.phone")} value={parent.phone} />
            <ProfileIconInfo icon={<Phone className="h-5 w-5" />} label={t("parents.profile.additionalPhone")} value={parent.additionalPhone || "—"} />
            <ProfileIconInfo icon={<BriefcaseBusiness className="h-5 w-5" />} label={t("parents.profile.workplace")} value={parent.workplace} />
          </div>
          <div className="space-y-5 border-border xl:border-l xl:pl-6">
            <ProfileIconInfo icon={<MapPin className="h-5 w-5" />} label={t("parents.profile.address")} value={parent.address} />
            <ProfileIconInfo icon={<CalendarDays className="h-5 w-5" />} label={t("parents.profile.addedAt")} value={parent.addedAt} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MobileAccessCard({ parent }: { parent: ParentProfile }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("parents.mobile.title")} icon={<Smartphone className="h-5 w-5" />}>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <span className="text-sm font-medium text-text-secondary">{t("parents.mobile.access")}</span>
          <span className={cn("relative h-6 w-11 rounded-full transition-colors", parent.telegramEnabled ? "bg-success-text" : "bg-border")}>
            <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-card transition-transform", parent.telegramEnabled ? "translate-x-5" : "translate-x-0.5")} />
          </span>
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <span className="text-text-secondary">{t("parents.tickets.status")}</span>
            <StatusBadge status={parent.telegramEnabled ? "success" : "neutral"}>{parent.telegramEnabled ? t("parents.mobile.active") : t("parents.mobile.inactive")}</StatusBadge>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-text-secondary">{t("parents.mobile.lastLogin")}</span>
            <span className="text-right font-medium text-text-primary">18 мая 2024, 20:15</span>
          </div>
        </div>
        <Button variant="outline">{t("parents.mobile.resetPassword")}</Button>
      </div>
    </InfoCard>
  );
}

function RelatedChildrenCard({ parent }: { parent: ParentProfile }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("parents.relatedChildren.titleCount", { count: parent.children.length })} icon={<Users className="h-5 w-5" />}>
      <div className="grid gap-4 xl:grid-cols-2">
        {parent.children.map((child) => (
          <div key={child.id} className="rounded-input border border-border p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 bg-info-bg text-lg">
                <AvatarFallback>{child.fullName.split(" ").map((part) => part[0]).slice(0, 2).join("")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-lg font-semibold text-text-primary">{child.fullName}</div>
                <div className="mt-1 text-sm text-text-muted">{child.age} · {t("parents.relatedChildren.groupWithAge", { group: child.groupName })}</div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoLine label={t("parents.relatedChildren.tariff")} value="Стандарт+" />
              <div>
                <div className="text-xs text-text-muted">{t("parents.relatedChildren.payment")}</div>
                <div className="mt-1">
                  <PaymentStatusBadge status={parent.paymentStatus} />
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" className="flex-1">{t("parents.relatedChildren.openProfile")}</Button>
              <Button variant="outline" className="flex-1">{t("parents.relatedChildren.paymentHistory")}</Button>
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}

function PaymentsCard({ parent }: { parent: ParentProfile }) {
  const { t } = useI18n();
  const totals = parent.payments.reduce(
    (acc, payment) => {
      acc.expected += moneyToNumber(payment.expected);
      acc.paid += moneyToNumber(payment.paid);
      acc.debt += moneyToNumber(payment.debt);
      return acc;
    },
    { expected: 0, paid: 0, debt: 0 },
  );

  return (
    <InfoCard title={t("parents.payments.title")} icon={<WalletCards className="h-5 w-5" />}>
      <div className="grid gap-3 md:grid-cols-3">
        <Metric label={t("parents.payments.expected")} value={`${totals.expected.toLocaleString("ru-RU")} ₸`} />
        <Metric label={t("parents.payments.paid")} value={`${totals.paid.toLocaleString("ru-RU")} ₸`} tone="success" />
        <Metric label={t("parents.payments.debt")} value={`${totals.debt.toLocaleString("ru-RU")} ₸`} tone={totals.debt > 0 ? "danger" : "success"} />
      </div>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("parents.payments.paymentId")}</TableHead>
              <TableHead>{t("parents.payments.child")}</TableHead>
              <TableHead>{t("parents.payments.period")}</TableHead>
              <TableHead>{t("parents.payments.status")}</TableHead>
              <TableHead>{t("parents.payments.lastPayment")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parent.payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.childName}</TableCell>
                <TableCell>{payment.period}</TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} />
                </TableCell>
                <TableCell>{payment.lastPayment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LinkButton>{t("parents.payments.goToPayments")}</LinkButton>
    </InfoCard>
  );
}

function TicketsCard({ parent, onTicketOpen }: { parent: ParentProfile; onTicketOpen: (ticket: ParentTicket) => void }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("parents.tickets.title")} icon={<MessageSquare className="h-5 w-5" />}>
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("parents.tickets.ticketId")}</TableHead>
              <TableHead>{t("parents.tickets.subject")}</TableHead>
              <TableHead>{t("parents.tickets.child")}</TableHead>
              <TableHead>{t("parents.tickets.createdAt")}</TableHead>
              <TableHead>{t("parents.tickets.responsible")}</TableHead>
              <TableHead>{t("parents.tickets.status")}</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {parent.tickets.map((ticket) => (
              <TableRow key={ticket.id} className="cursor-pointer" onClick={() => onTicketOpen(ticket)}>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.childName}</TableCell>
                <TableCell>{ticket.createdAt}</TableCell>
                <TableCell>{ticket.responsible}</TableCell>
                <TableCell>
                  <TicketStatusBadge status={ticket.status} />
                </TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LinkButton>{t("parents.tickets.all")}</LinkButton>
    </InfoCard>
  );
}

function DocumentsCard({ parent }: { parent: ParentProfile }) {
  const { t } = useI18n();
  return (
    <InfoCard title={t("parents.documents.title")} icon={<FileText className="h-5 w-5" />}>
      <div className="divide-y divide-border">
        {parent.documents.map((document) => (
          <div key={document.id} className="flex items-center gap-3 py-3 text-sm first:pt-0 last:pb-0">
            <FileText className="h-4 w-4 text-danger-text" />
            <span className="min-w-0 flex-1 truncate font-medium text-text-primary">{document.fileName}</span>
            <span className="text-xs text-text-muted">{document.date}</span>
            <Download className="h-4 w-4 text-text-muted" />
          </div>
        ))}
      </div>
    </InfoCard>
  );
}

function TicketModal({ ticket, parent, onOpenChange }: { ticket: ParentTicket | null; parent: ParentProfile; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<TicketStatus>(ticket?.status ?? "new");

  return (
    <Modal
      open={Boolean(ticket)}
      onOpenChange={onOpenChange}
      title={
        <span className="inline-flex flex-wrap items-center gap-3">
          {ticket?.id ?? t("parents.tickets.ticket")}
          {ticket ? <TicketStatusBadge status={status} /> : null}
        </span>
      }
      description={ticket?.subject}
      size="lg"
      footer={
        <ModalFooter
          right={
            <>
              <Button variant="danger">{t("parents.tickets.closeTicket")}</Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.close")}</Button>
            </>
          }
        />
      }
    >
      {ticket ? (
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2">
            <InfoBox label={t("parents.tickets.createdAt")} value={ticket.createdAt} />
            <InfoBox label={t("parents.tickets.child")} value={ticket.childName} />
            <InfoBox label={t("parents.tickets.subject")} value={ticket.subject} />
            <InfoBox label={t("parents.tickets.responsible")} value={ticket.responsible} />
          </div>
          <Panel title={t("parents.tickets.description")}>{ticket.description}</Panel>
          <Select
            label={t("parents.tickets.redirect")}
            value={status}
            onChange={(event) => setStatus(event.target.value as TicketStatus)}
            options={[
              { label: t("parents.ticketStatus.new"), value: "new" },
              { label: t("parents.ticketStatus.inProgress"), value: "inProgress" },
              { label: t("parents.ticketStatus.waitingParent"), value: "waitingParent" },
              { label: t("parents.ticketStatus.closed"), value: "closed" },
            ]}
          />
          <div className="space-y-3">
            <div className="text-sm font-semibold text-text-primary">{t("parents.tickets.thread")}</div>
            {ticket.messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[80%] rounded-input border p-3 shadow-card",
                  message.side === "right" ? "ml-auto border-primary bg-primary text-text-inverse" : "border-border bg-surface",
                )}
              >
                <div className={cn("text-xs", message.side === "right" ? "text-white/75" : "text-text-muted")}>{message.author} · {message.role} · {message.dateTime}</div>
                <div className={cn("mt-1 text-sm", message.side === "right" ? "text-text-inverse" : "text-text-primary")}>{message.text}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Textarea className="min-h-12 flex-1 resize-none" placeholder={t("parents.tickets.messagePlaceholder")} />
            <Button variant="outline" leftIcon={<Paperclip className="h-4 w-4" />}>{t("parents.tickets.attachmentShort")}</Button>
            <Button leftIcon={<Send className="h-4 w-4" />}>{t("parents.tickets.send")}</Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function CreateTicketModal({ parent, open, onOpenChange }: { parent: ParentProfile; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("parents.createTicket.title")}
      description={t("parents.createTicket.description")}
      footer={
        <ModalFooter
          right={
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.cancel")}</Button>
              <Button onClick={() => onOpenChange(false)}>{t("parents.createTicket.create")}</Button>
            </>
          }
        />
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input label={t("parents.createTicket.parent")} value={parent.fullName} readOnly />
        <Select label={t("parents.createTicket.child")} defaultValue={parent.children[0]?.id} options={parent.children.map((child) => ({ label: child.fullName, value: child.id }))} />
        <Input className="md:col-span-2" label={t("parents.createTicket.subject")} placeholder={t("parents.createTicket.subjectPlaceholder")} />
        <Textarea className="md:col-span-2" label={t("parents.createTicket.descriptionLabel")} placeholder={t("parents.createTicket.descriptionPlaceholder")} />
        <Button variant="outline" leftIcon={<Paperclip className="h-4 w-4" />}>{t("parents.createTicket.attachment")}</Button>
      </div>
    </Modal>
  );
}

function AddParentModal({
  open,
  onOpenChange,
  parent,
  mode = "create",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parent?: ParentProfile;
  mode?: "create" | "edit";
}) {
  const { t } = useI18n();
  const [role, setRole] = useState<string>(parent?.relation ?? "mother");
  const [selectedChildren, setSelectedChildren] = useState<string[]>(parent?.children.map((child) => child.id) ?? ["CH-000124"]);
  const [documents, setDocuments] = useState([{ id: "document-1" }]);

  const childOptions = mockChildren.slice(0, 10).map((child) => ({
    label: child.fullName,
    value: child.id,
    description: `${child.age} · ${child.teacher}`,
  }));
  const availableChildOptions = childOptions.filter((option) => !selectedChildren.includes(option.value));

  const addChild = (childId: string) => {
    setSelectedChildren((current) => (current.includes(childId) ? current : [...current, childId]));
  };

  const removeChild = (childId: string) => {
    setSelectedChildren((current) => current.filter((id) => id !== childId));
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "edit" ? t("parents.addParent.editTitle") : t("parents.addParent.title")}
      description={mode === "edit" ? t("parents.addParent.editDescription") : t("parents.addParent.description")}
      size="xl"
      footer={
        <ModalFooter
          right={
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.cancel")}</Button>
              <Button onClick={() => onOpenChange(false)}>{mode === "edit" ? t("common.actions.save") : t("parents.addParent.save")}</Button>
            </>
          }
        />
      }
    >
      <div className="space-y-5">
        <AvatarUpload
          label={t("parents.addParent.avatar")}
          actionLabel={t("common.actions.add")}
          fallback="Р"
          helperText={t("parents.addParent.avatarHint")}
          accept="image/png,image/jpeg,image/jpg,image/heic"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Input label={t("parents.addParent.fullName")} placeholder={t("parents.addParent.fullNamePlaceholder")} defaultValue={parent?.fullName} />
          <Input label={t("parents.addParent.phone")} placeholder="+998 90 000 00 00" defaultValue={parent?.phone} />
          <CrudSelect
            label={t("parents.addParent.role")}
            value={role}
            onValueChange={setRole}
            options={[
              { label: t("parents.addParent.roleOptions.father"), value: "father" },
              { label: t("parents.addParent.roleOptions.mother"), value: "mother" },
              { label: t("parents.addParent.roleOptions.aunt"), value: "aunt" },
              { label: t("parents.addParent.roleOptions.guardian"), value: "guardian" },
              { label: t("parents.addParent.roleOptions.brother"), value: "brother" },
            ]}
            addLabel={t("common.actions.addNew")}
            newItemLabel={t("common.labels.newValueName")}
            newItemPlaceholder={t("common.placeholders.enterName")}
            saveLabel={t("common.actions.save")}
            cancelLabel={t("common.actions.cancel")}
          />
          <Input label={t("parents.addParent.workplace")} placeholder={t("parents.addParent.workplacePlaceholder")} defaultValue={parent?.workplace} />
          <Input className="md:col-span-2" label={t("parents.addParent.address")} placeholder={t("parents.addParent.addressPlaceholder")} defaultValue={parent?.address} />
        </div>

        <Card>
          <CardContent className="space-y-3">
            <div>
              <h3 className="text-card-title text-text-primary">{t("parents.addParent.children")}</h3>
              <p className="text-sm text-text-muted">{t("parents.addParent.childrenHint")}</p>
            </div>
            <SearchableSelect
              placeholder={t("parents.addParent.childrenPlaceholder")}
              searchPlaceholder={t("parents.addParent.childrenSearch")}
              options={availableChildOptions}
              onChange={addChild}
            />
            <div className="flex flex-wrap gap-2">
              {selectedChildren.map((childId) => {
                const child = childOptions.find((option) => option.value === childId);
                if (!child) return null;
                return (
                  <Badge key={childId} variant="info" className="gap-2">
                    {child.label}
                    <button type="button" className="text-primary hover:text-primary-hover" onClick={() => removeChild(childId)}>
                      ×
                    </button>
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-card-title text-text-primary">{t("parents.addParent.documents")}</h3>
                <p className="text-sm text-text-muted">{t("parents.addParent.documentsHint")}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setDocuments((current) => [...current, { id: `document-${current.length + 1}` }])}
              >
                {t("parents.addParent.addDocument")}
              </Button>
            </div>
            <div className="space-y-3">
              {documents.map((document, index) => (
                <div key={document.id} className="grid gap-3 rounded-card border border-border bg-page p-3 md:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
                  <Input label={t("parents.addParent.documentName")} placeholder={t("parents.addParent.documentNamePlaceholder")} />
                  <FileUploadZone
                    label={t("parents.addParent.documentFile")}
                    description={t("parents.addParent.documentFileHint")}
                    className="p-4"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />
                  {documents.length > 1 ? (
                    <Button type="button" variant="ghost" className="justify-start md:col-span-2" onClick={() => setDocuments((current) => current.filter((item) => item.id !== document.id))}>
                      {t("common.actions.delete")} #{index + 1}
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
}

function DeleteParentModal({ parent, open, onOpenChange }: { parent: ParentProfile; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();
  const canDelete = parent.children.every((child) => child.childStatus === "graduate" || child.childStatus === "expelled");

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("parents.delete.title")}
      description={t("parents.delete.description")}
      footer={
        <ModalFooter
          right={
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.cancel")}</Button>
              <Button variant="danger" disabled={!canDelete} onClick={() => onOpenChange(false)}>{t("common.actions.delete")}</Button>
            </>
          }
        />
      }
    >
      <div className="space-y-4">
        <InfoBox label={t("parents.profile.fullName")} value={parent.fullName} />
        {canDelete ? (
          <div className="rounded-card border border-warning-bg bg-warning-bg p-4 text-sm leading-5 text-warning-text">
            {t("parents.delete.softDeleteHint")}
          </div>
        ) : (
          <div className="rounded-card border border-danger-bg bg-danger-bg p-4 text-sm leading-5 text-danger-text">
            {t("parents.delete.blockedActiveChild")}
          </div>
        )}
      </div>
    </Modal>
  );
}

function AnnouncementModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useI18n();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t("parents.announcement.title")}
      description={t("parents.announcement.description")}
      size="lg"
      footer={
        <ModalFooter
          left={<div className="max-w-md text-xs text-text-muted">{t("parents.announcement.cancelHint")}</div>}
          right={
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.actions.cancel")}</Button>
              <Button leftIcon={<Send className="h-4 w-4" />} onClick={() => onOpenChange(false)}>{t("parents.announcement.send")}</Button>
            </>
          }
        />
      }
    >
      <div className="space-y-4">
        <Input label={t("parents.announcement.heading")} placeholder={t("parents.announcement.headingPlaceholder")} />
        <Textarea label={t("parents.announcement.descriptionLabel")} placeholder={t("parents.announcement.descriptionPlaceholder")} rows={6} />
        <FileUploadZone
          label={t("parents.announcement.file")}
          description={t("parents.announcement.fileHint")}
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        />
        <div className="rounded-card border border-info-border bg-info-bg p-4 text-sm text-info-text">
          {t("parents.announcement.telegramHint")}
        </div>
      </div>
    </Modal>
  );
}

function ParentStatusBadge({ status }: { status: ParentStatus }) {
  const { t } = useI18n();
  const variant = status === "active" ? "success" : status === "pending" ? "warning" : status === "blocked" ? "danger" : "neutral";
  return <StatusBadge status={variant}>{t(`parents.parentStatus.${status}`)}</StatusBadge>;
}

function PaymentStatusBadge({ status }: { status: ParentPaymentStatus }) {
  const { t } = useI18n();
  const variant = status === "paid" ? "success" : status === "pending" ? "warning" : status === "overdue" || status === "debt" ? "danger" : "neutral";
  return <StatusBadge status={variant}>{t(`parents.paymentStatus.${status}`)}</StatusBadge>;
}

function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { t } = useI18n();
  const variant = status === "new" ? "info" : status === "inProgress" ? "warning" : status === "waitingParent" ? "purple" : "success";
  return <StatusBadge status={variant}>{t(`parents.ticketStatus.${status}`)}</StatusBadge>;
}

function StatTile({ label, value, tone = "info" }: { label: string; value: number; tone?: "info" | "success" | "warning" }) {
  const toneClass = tone === "success" ? "bg-success-bg text-success-text" : tone === "warning" ? "bg-warning-bg text-warning-text" : "bg-info-bg text-info-text";
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <span className={cn("grid h-12 w-12 place-items-center rounded-full", toneClass)}>
          <Users className="h-6 w-6" />
        </span>
        <div>
          <div className="text-sm text-text-secondary">{label}</div>
          <div className="text-2xl font-semibold text-text-primary">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
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

function ProfileIconInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-[190px_minmax(0,1fr)]">
      <div className="text-sm text-text-muted">{label}</div>
      <div className="text-sm font-semibold leading-6 text-text-primary">{value}</div>
    </div>
  );
}

function InfoPanel({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-input border border-border p-3">
      <div className="text-sm text-text-muted">{label}</div>
      <div className="mt-1.5 text-base font-semibold leading-6 text-text-primary">{value}</div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-input border border-border p-3">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 text-sm font-medium text-text-primary">{value}</div>
    </div>
  );
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "success" | "danger" }) {
  const color = tone === "success" ? "text-success-text" : tone === "danger" ? "text-danger-text" : "text-text-primary";
  return (
    <div className="rounded-input border border-border p-3">
      <div className="text-xs text-text-muted">{label}</div>
      <div className={cn("mt-1 text-lg font-semibold", color)}>{value}</div>
    </div>
  );
}

function LinkButton({ children }: { children: ReactNode }) {
  return (
    <Button variant="ghost" className="justify-start px-0">
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

function createParentProfile(parentId: string): ParentProfile {
  const record = mockParents.find((parent) => parent.id === parentId) ?? mockParents[0];
  return {
    ...mockParentProfile,
    ...record,
    initials: record.fullName
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join(""),
  };
}

function createParentStats(parents: ParentListRecord[]) {
  return {
    total: parents.length,
    active: parents.filter((parent) => parent.parentStatus === "active").length,
    withDebt: parents.filter((parent) => parent.paymentStatus === "debt" || parent.paymentStatus === "overdue").length,
    newTickets: parents.reduce((acc, parent) => acc + parent.activeTickets, 0),
  };
}

function createParentFilterOptions(values: string[], allLabel: string) {
  return [{ label: allLabel, value: "all" }, ...Array.from(new Set(values)).map((value) => ({ label: value, value }))];
}

function uniqueParentChildValues(parent: ParentListRecord, key: "groupName" | "branchName") {
  return Array.from(new Set(parent.children.map((child) => child[key])));
}

function moneyToNumber(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}
