import { useMemo, useState } from "react";
import { Fragment } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeftRight,
  Baby,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Flag,
  Gamepad2,
  History,
  Info,
  Lock,
  MessageSquare,
  Paperclip,
  PencilLine,
  Plus,
  Send,
  Smile,
  User,
  UserMinus,
  UserPlus,
  UserRound,
  Users,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  EmptyState,
  FilterBar,
  Input,
  Modal,
  MessageComposer,
  ModalFooter,
  NicuDistributionCard,
  Pagination,
  SearchField,
  SearchableSelect,
  Select,
  StackedNicuBar,
  StatsCard,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "../../components/ui";
import {
  developmentStats,
  groupDevelopmentAreas,
  mockGroupDetail,
  mockGroups,
  type GroupDetail,
  type GroupRecord,
  type GroupStatus,
  type ParentTicket,
  type ParentTicketStatus,
} from "../../data/mockGroups";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

interface GroupsPageProps {
  onNavigate?: (key: SidebarNavigationKey) => void;
}

const allValue = "all";
type GroupModal = "addChild" | "chat" | "ticket" | "ticketsList" | "attendance" | "history" | null;

export function GroupsPage({ onNavigate }: GroupsPageProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [childSearch, setChildSearch] = useState("");
  const [ageCategory, setAgeCategory] = useState(allValue);
  const [direction, setDirection] = useState(allValue);
  const [status, setStatus] = useState(allValue);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<GroupModal>(null);
  const [activeTicketId, setActiveTicketId] = useState("#1256");
  const [placeholderTitle, setPlaceholderTitle] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  const filteredGroups = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return mockGroups
      .filter((group) => {
        const matchesSearch =
          !normalizedSearch ||
          group.name.toLocaleLowerCase().includes(normalizedSearch) ||
          group.teacher.toLocaleLowerCase().includes(normalizedSearch);
        const matchesAge = ageCategory === allValue || group.ageCategory === ageCategory;
        const matchesDirection = direction === allValue || group.direction === direction;
        const matchesStatus = status === allValue || group.status === status;
        return matchesSearch && matchesAge && matchesDirection && matchesStatus;
      })
      .sort((first, second) => {
        if (sort === "name") return first.name.localeCompare(second.name, "ru");
        if (sort === "children") return second.childrenCount - first.childrenCount;
        const firstDate = first.createdAt.split(".").reverse().join("");
        const secondDate = second.createdAt.split(".").reverse().join("");
        return sort === "oldest" ? firstDate.localeCompare(secondDate) : secondDate.localeCompare(firstDate);
      });
  }, [ageCategory, direction, search, sort, status]);

  const activeGroup = useMemo(() => {
    const base = mockGroups.find((group) => group.id === activeGroupId);
    return base ? createGroupDetail(base) : null;
  }, [activeGroupId]);

  const summary = useMemo(() => createSummary(mockGroups), []);
  const nicuLabels = {
    n: t("groups.nicu.n"),
    i: t("groups.nicu.i"),
    ch: t("groups.nicu.ch"),
    u: t("groups.nicu.u"),
  };

  const openPlaceholder = (title: string) => setPlaceholderTitle(title);

  return (
    <AppShell activeNavigation="groups" onNavigate={onNavigate}>
      {comparisonOpen ? (
        <GroupsComparisonView
          groups={filteredGroups}
          nicuLabels={nicuLabels}
          search={search}
          ageCategory={ageCategory}
          direction={direction}
          status={status}
          sort={sort}
          onSearchChange={setSearch}
          onAgeCategoryChange={setAgeCategory}
          onDirectionChange={setDirection}
          onStatusChange={setStatus}
          onSortChange={setSort}
          onBack={() => setComparisonOpen(false)}
        />
      ) : activeGroup ? (
        <GroupDetailView
          group={activeGroup}
          nicuLabels={nicuLabels}
          childSearch={childSearch}
          selectedChild={selectedChild}
          onChildSearchChange={setChildSearch}
          onChildSelect={setSelectedChild}
          onBack={() => {
            setActiveGroupId(null);
            setChildSearch("");
            setSelectedChild(null);
          }}
          onPlaceholder={openPlaceholder}
          onComparisonOpen={() => setComparisonOpen(true)}
          onAddChildOpen={() => setActiveModal("addChild")}
          onChatOpen={() => setActiveModal("chat")}
          onTicketOpen={(ticketId) => {
            setActiveTicketId(ticketId);
            setActiveModal("ticket");
          }}
          onAttendanceOpen={() => setActiveModal("attendance")}
          onHistoryOpen={() => setActiveModal("history")}
          onEditOpen={() => setEditOpen(true)}
          onTicketsListOpen={() => setActiveModal("ticketsList")}
        />
      ) : (
        <GroupsListView
          search={search}
          ageCategory={ageCategory}
          direction={direction}
          status={status}
          sort={sort}
          page={page}
          groups={filteredGroups}
          summary={summary}
          nicuLabels={nicuLabels}
          onSearchChange={setSearch}
          onAgeCategoryChange={setAgeCategory}
          onDirectionChange={setDirection}
          onStatusChange={setStatus}
          onSortChange={setSort}
          onPageChange={setPage}
          onGroupOpen={(group) => setActiveGroupId(group.id)}
          onCreateOpen={() => setCreateOpen(true)}
          onComparisonOpen={() => setComparisonOpen(true)}
        />
      )}

      <Modal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Создать группу"
        description="Создание новой группы"
        size="lg"
        footer={<CreateGroupFooter onClose={() => setCreateOpen(false)} />}
      >
        <CreateGroupModalContent />
      </Modal>

      <Modal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Редактировать группу"
        description={activeGroup ? `Группа «${activeGroup.name}»` : "Изменение данных группы"}
        size="lg"
        footer={<EditGroupFooter onClose={() => setEditOpen(false)} />}
      >
        <CreateGroupModalContent mode="edit" />
      </Modal>

      <Modal
        open={activeModal === "addChild"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Добавить ребенка в группу"
        description="Выберите детей, которых нужно прикрепить к группе"
        size="xl"
        footer={<AddChildFooter onClose={() => setActiveModal(null)} />}
      >
        <AddChildModalContent />
      </Modal>

      <Modal
        open={activeModal === "chat"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title={activeGroup ? `Групповой чат — группа «${activeGroup.name}»` : "Групповой чат"}
        description="Воспитатель + активные родители группы"
        size="xl"
      >
        <GroupChatModalContent groupName={activeGroup?.name ?? "Жасмин"} />
      </Modal>

      <Modal
        open={activeModal === "ticket"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title={
          <span className="inline-flex flex-wrap items-center gap-3">
            Обращение {activeTicketId}
            <StatusBadge status="warning">В обработке</StatusBadge>
          </span>
        }
        size="xl"
        footer={<TicketFooter onClose={() => setActiveModal(null)} />}
      >
        <TicketModalContent ticketId={activeTicketId} />
      </Modal>

      <Modal
        open={activeModal === "ticketsList"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Все обращения родителей"
        description={activeGroup ? `Группа «${activeGroup.name}»` : undefined}
        size="lg"
      >
        <TicketsListModalContent
          group={activeGroup ?? createGroupDetail(mockGroups[0])}
          onTicketOpen={(ticketId) => {
            setActiveTicketId(ticketId);
            setActiveModal("ticket");
          }}
        />
      </Modal>

      <Modal
        open={activeModal === "attendance"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="Табель посещаемости"
        description={activeGroup ? `Группа «${activeGroup.name}»` : "Группа"}
        size="xl"
        footer={<AttendanceFooter onClose={() => setActiveModal(null)} />}
      >
        <AttendanceModalContent groupName={activeGroup?.name ?? "Жасмин"} />
      </Modal>

      <Modal
        open={activeModal === "history"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        title="История группы"
        description={activeGroup ? `Группа «${activeGroup.name}»` : "Группа"}
        size="xl"
      >
        <GroupHistoryModalContent />
      </Modal>

      <Modal
        open={Boolean(placeholderTitle)}
        onOpenChange={(open) => !open && setPlaceholderTitle(null)}
        title={placeholderTitle ?? t("groups.placeholder.title")}
        description={t("groups.placeholder.description")}
        footer={
          <Button variant="outline" onClick={() => setPlaceholderTitle(null)}>
            {t("common.actions.close")}
          </Button>
        }
      >
        <EmptyState title={t("groups.placeholder.emptyTitle")} description={t("groups.placeholder.emptyDescription")} />
      </Modal>
    </AppShell>
  );
}

interface GroupsListViewProps {
  search: string;
  ageCategory: string;
  direction: string;
  status: string;
  sort: string;
  page: number;
  groups: GroupRecord[];
  summary: ReturnType<typeof createSummary>;
  nicuLabels: { n: string; i: string; ch: string; u: string };
  onSearchChange: (value: string) => void;
  onAgeCategoryChange: (value: string) => void;
  onDirectionChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onGroupOpen: (group: GroupRecord) => void;
  onCreateOpen: () => void;
  onComparisonOpen: () => void;
}

function GroupsListView({
  search,
  ageCategory,
  direction,
  status,
  sort,
  page,
  groups,
  summary,
  nicuLabels,
  onSearchChange,
  onAgeCategoryChange,
  onDirectionChange,
  onStatusChange,
  onSortChange,
  onPageChange,
  onGroupOpen,
  onCreateOpen,
  onComparisonOpen,
}: GroupsListViewProps) {
  const { t } = useI18n();

  return (
    <PageContainer>
      <PageHeader
        title={t("groups.page.title")}
        description={t("groups.page.description")}
        breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.groups") }]}
        actions={<Button onClick={onCreateOpen}>{t("groups.actions.createGroup")}</Button>}
      />

      <div className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <StatsCard title={t("groups.stats.totalGroups")} value={summary.totalGroups} icon={<Users className="h-6 w-6" />} onClick={() => undefined} />
            <StatsCard title={t("groups.stats.totalChildren")} value={summary.totalChildren} icon={<Baby className="h-6 w-6" />} onClick={() => undefined} />
            <StatsCard title={t("groups.stats.activeGroups")} value={summary.activeGroups} icon={<UserRoundCheck className="h-6 w-6" />} onClick={() => undefined} />
          </div>
          <NicuDistributionCard
            title={t("groups.stats.averageDevelopment")}
            description={t("groups.stats.currentObservationCycle")}
            items={developmentStats}
            labels={nicuLabels}
            areaLabel={(area) => t(`groups.developmentAreas.${area}`)}
            onClick={onComparisonOpen}
          />
        </div>

        <Card>
          <CardContent className="space-y-4">
            <FilterBar
              left={
                <>
                  <SearchField
                    className="w-full sm:w-[360px]"
                    aria-label={t("groups.filters.search")}
                    placeholder={t("groups.filters.search")}
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                  />
                  <Select
                    className="w-full sm:w-56"
                    aria-label={t("groups.filters.sort")}
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value)}
                    options={[
                      { label: t("groups.filters.newestFirst"), value: "newest" },
                      { label: t("groups.filters.oldestFirst"), value: "oldest" },
                      { label: t("groups.filters.byName"), value: "name" },
                      { label: t("groups.filters.byChildren"), value: "children" },
                    ]}
                  />
                </>
              }
              right={
                <>
                  <Select
                    className="w-full"
                    label={t("groups.filters.ageCategory")}
                    value={ageCategory}
                    onChange={(event) => onAgeCategoryChange(event.target.value)}
                    options={createOptions(mockGroups.map((group) => group.ageCategory), t("groups.filters.all"))}
                  />
                  <Select
                    className="w-full"
                    label={t("groups.filters.direction")}
                    value={direction}
                    onChange={(event) => onDirectionChange(event.target.value)}
                    options={createOptions(mockGroups.map((group) => group.direction), t("groups.filters.all"))}
                  />
                  <Select
                    className="w-full"
                    label={t("groups.filters.status")}
                    value={status}
                    onChange={(event) => onStatusChange(event.target.value)}
                    options={[
                      { label: t("groups.filters.all"), value: allValue },
                      { label: t("groups.status.active"), value: "active" },
                      { label: t("groups.status.pending"), value: "pending" },
                      { label: t("groups.status.closed"), value: "closed" },
                    ]}
                  />
                </>
              }
            />

            {groups.length ? (
              <>
                <TableContainer>
                  <Table className="min-w-[1680px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("groups.table.id")}</TableHead>
                        <TableHead>{t("groups.table.name")}</TableHead>
                        <TableHead>{t("groups.table.ageCategory")}</TableHead>
                        <TableHead>{t("groups.table.direction")}</TableHead>
                        <TableHead>{t("groups.table.teacher")}</TableHead>
                        <TableHead>{t("groups.table.childrenCount")}</TableHead>
                        {groupDevelopmentAreas.map((area) => (
                          <TableHead key={area}>{t(`groups.developmentAreas.${area}`)}</TableHead>
                        ))}
                        <TableHead>{t("groups.table.status")}</TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups.map((group) => (
                        <TableRow key={group.id} className="cursor-pointer" onClick={() => onGroupOpen(group)}>
                          <TableCell className="font-medium">{group.id}</TableCell>
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell>{group.ageCategory}</TableCell>
                          <TableCell>{group.direction}</TableCell>
                          <TableCell className="max-w-[180px] whitespace-normal">{group.teacher}</TableCell>
                          <TableCell>{group.childrenCount}</TableCell>
                          {groupDevelopmentAreas.map((area) => (
                            <TableCell key={area}>
                              <StackedNicuBar value={group.development[area]} labels={nicuLabels} compact />
                            </TableCell>
                          ))}
                          <TableCell>
                            <StatusBadge status={groupStatusVariant(group.status)}>{t(`groups.status.${group.status}`)}</StatusBadge>
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
                  <div className="text-sm font-medium text-text-secondary">{t("groups.page.totalGroups", { count: groups.length })}</div>
                  <Pagination page={page} pageCount={3} onPageChange={onPageChange} />
                </div>
              </>
            ) : (
              <EmptyState title={t("groups.empty.title")} description={t("groups.empty.description")} />
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

function GroupsComparisonView({
  groups,
  nicuLabels,
  search,
  ageCategory,
  direction,
  status,
  sort,
  onSearchChange,
  onAgeCategoryChange,
  onDirectionChange,
  onStatusChange,
  onSortChange,
  onBack,
}: {
  groups: GroupRecord[];
  nicuLabels: { n: string; i: string; ch: string; u: string };
  search: string;
  ageCategory: string;
  direction: string;
  status: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onAgeCategoryChange: (value: string) => void;
  onDirectionChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onBack: () => void;
}) {
  const { t } = useI18n();

  return (
    <PageContainer>
      <PageHeader
        title={t("groups.comparison.title")}
        description={t("groups.comparison.description")}
        breadcrumbs={[
          { label: t("navigation.home"), href: "#" },
          { label: t("navigation.groups"), href: "#" },
          { label: t("groups.comparison.title") },
        ]}
        actions={
          <Button variant="outline" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={onBack}>
            {t("groups.actions.backToGroups")}
          </Button>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardContent>
            <FilterBar
              left={
                <>
                  <SearchField
                    className="w-full sm:w-[360px]"
                    aria-label={t("groups.filters.search")}
                    placeholder={t("groups.filters.search")}
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                  />
                  <Select
                    className="w-full sm:w-56"
                    aria-label={t("groups.filters.sort")}
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value)}
                    options={[
                      { label: t("groups.filters.newestFirst"), value: "newest" },
                      { label: t("groups.filters.oldestFirst"), value: "oldest" },
                      { label: t("groups.filters.byName"), value: "name" },
                      { label: t("groups.filters.byChildren"), value: "children" },
                    ]}
                  />
                </>
              }
              right={
                <>
                  <Select
                    className="w-full"
                    label={t("groups.filters.ageCategory")}
                    value={ageCategory}
                    onChange={(event) => onAgeCategoryChange(event.target.value)}
                    options={createOptions(mockGroups.map((group) => group.ageCategory), t("groups.filters.all"))}
                  />
                  <Select
                    className="w-full"
                    label={t("groups.filters.direction")}
                    value={direction}
                    onChange={(event) => onDirectionChange(event.target.value)}
                    options={createOptions(mockGroups.map((group) => group.direction), t("groups.filters.all"))}
                  />
                  <Select
                    className="w-full"
                    label={t("groups.filters.status")}
                    value={status}
                    onChange={(event) => onStatusChange(event.target.value)}
                    options={[
                      { label: t("groups.filters.all"), value: allValue },
                      { label: t("groups.status.active"), value: "active" },
                      { label: t("groups.status.pending"), value: "pending" },
                      { label: t("groups.status.closed"), value: "closed" },
                    ]}
                  />
                </>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("groups.comparison.tableTitle")}</CardTitle>
            <CardDescription>{t("groups.comparison.tableDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <TableContainer>
              <Table className="min-w-[1280px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("groups.table.id")}</TableHead>
                    <TableHead>{t("groups.table.name")}</TableHead>
                    <TableHead>{t("groups.table.ageCategory")}</TableHead>
                    <TableHead>{t("groups.table.childrenCount")}</TableHead>
                    {groupDevelopmentAreas.map((area) => (
                      <TableHead key={area}>{t(`groups.developmentAreas.${area}`)}</TableHead>
                    ))}
                    <TableHead>{t("groups.comparison.risk")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => {
                    const risk = groupDevelopmentAreas.reduce((sum, area) => sum + group.development[area].n, 0);
                    return (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium">{group.id}</TableCell>
                        <TableCell className="font-semibold text-text-primary">{group.name}</TableCell>
                        <TableCell>{group.ageCategory}</TableCell>
                        <TableCell>{group.childrenCount}</TableCell>
                        {groupDevelopmentAreas.map((area) => (
                          <TableCell key={area}>
                            <StackedNicuBar value={group.development[area]} labels={nicuLabels} compact className="min-w-[180px]" />
                          </TableCell>
                        ))}
                        <TableCell>
                          <StatusBadge status={risk > 45 ? "danger" : risk > 35 ? "warning" : "success"}>
                            {risk > 45 ? t("groups.comparison.highRisk") : risk > 35 ? t("groups.comparison.mediumRisk") : t("groups.comparison.lowRisk")}
                          </StatusBadge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

interface GroupDetailViewProps {
  group: GroupDetail;
  nicuLabels: { n: string; i: string; ch: string; u: string };
  childSearch: string;
  selectedChild: number | null;
  onChildSearchChange: (value: string) => void;
  onChildSelect: (rowNumber: number) => void;
  onBack: () => void;
  onPlaceholder: (title: string) => void;
  onComparisonOpen: () => void;
  onAddChildOpen: () => void;
  onChatOpen: () => void;
  onTicketOpen: (ticketId: string) => void;
  onAttendanceOpen: () => void;
  onHistoryOpen: () => void;
  onEditOpen: () => void;
  onTicketsListOpen: () => void;
}

function GroupDetailView({
  group,
  nicuLabels,
  childSearch,
  selectedChild,
  onChildSearchChange,
  onChildSelect,
  onBack,
  onPlaceholder,
  onComparisonOpen,
  onAddChildOpen,
  onChatOpen,
  onTicketOpen,
  onAttendanceOpen,
  onHistoryOpen,
  onEditOpen,
  onTicketsListOpen,
}: GroupDetailViewProps) {
  const { t } = useI18n();
  const filteredChildren = group.children.filter((child) => {
    const query = childSearch.trim().toLocaleLowerCase();
    return !query || child.fullName.toLocaleLowerCase().includes(query) || child.parentName.toLocaleLowerCase().includes(query);
  });

  return (
    <PageContainer>
      <PageHeader
        title={t("groups.detail.title", { name: group.name })}
        description={group.description}
        breadcrumbs={[
          { label: t("navigation.home"), href: "#" },
          { label: t("navigation.groups"), href: "#" },
          { label: t("groups.detail.reading") },
        ]}
        actions={
          <>
            <Button variant="outline" leftIcon={<ChevronLeft className="h-4 w-4" />} onClick={onBack}>
              {t("groups.actions.backToGroups")}
            </Button>
            <Button variant="outline" leftIcon={<History className="h-4 w-4" />} onClick={onHistoryOpen}>
              {t("groups.history.title")}
            </Button>
            <Button variant="outline" leftIcon={<PencilLine className="h-4 w-4" />} onClick={onEditOpen}>
              Редактировать
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-page-title text-text-primary">{group.name}</h2>
                  <Badge variant="neutral">{group.id}</Badge>
                  <StatusBadge status={groupStatusVariant(group.status)}>{t(`groups.status.${group.status}`)}</StatusBadge>
                </div>
                <p className="text-sm text-text-muted">{t("groups.detail.createdAt", { date: group.createdAt })}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">{group.ageCategory}</Badge>
                <Badge variant="purple">{group.direction}</Badge>
              </div>
            </div>

            <div className="grid gap-4 border-t border-border pt-5 xl:grid-cols-3">
              <InfoLine label={t("groups.detail.labels.direction")} value={group.description} />
              <div className="xl:border-x xl:border-border xl:px-6">
                <div className="text-xs text-text-muted">{t("groups.teachers.title")}</div>
                <div className="mt-2 space-y-1">
                  {group.teachers.map((teacher) => (
                    <div key={teacher.id} className="text-sm font-medium text-text-primary">
                      {teacher.fullName} <span className="font-normal text-text-secondary">— {teacher.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
              <InfoLine label={t("groups.detail.labels.ageCategory")} value={group.ageCategory} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-4">
          <AttendanceCard group={group} onOpen={onAttendanceOpen} />
          <LearningCard group={group} onOpen={() => onPlaceholder(t("groups.learning.open"))} />
          <BilimtoyGamesCard group={group} onOpen={() => onPlaceholder(t("groups.games.open"))} />
          <FinanceCard group={group} onOpen={() => onPlaceholder(t("groups.finance.open"))} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr_1.75fr]">
          <NicuDistributionCard
            title={t("groups.stats.averageDevelopment")}
            description={t("groups.stats.currentObservationCycleShort")}
            items={group.detailDevelopmentStats}
            labels={nicuLabels}
            areaLabel={(area) => t(`groups.developmentAreas.${area}`)}
            onClick={onComparisonOpen}
          />
          <GroupChatCard group={group} onOpen={onChatOpen} />
          <TicketsCard group={group} onTicketOpen={onTicketOpen} onOpenAllTickets={onTicketsListOpen} compact />
        </div>

        <ChildrenTable
          group={group}
          nicuLabels={nicuLabels}
          children={filteredChildren}
          search={childSearch}
          selectedChild={selectedChild}
          onSearchChange={onChildSearchChange}
          onChildSelect={onChildSelect}
          onAddChild={onAddChildOpen}
        />

        <ComparisonDevelopmentMap group={group} nicuLabels={nicuLabels} onExport={() => onPlaceholder(t("groups.children.exportComparison"))} />
      </div>
    </PageContainer>
  );
}

function CreateGroupModalContent({ mode = "create" }: { mode?: "create" | "edit" }) {
  const [teacher, setTeacher] = useState("saidova");
  const teacherOptions = [
    {
      label: "Саидова Нилуфар Анваровна",
      value: "saidova",
      description: "+998 90 555 11 22",
      avatar: <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-danger-bg text-xs font-semibold text-danger-text">СН</span>,
    },
    {
      label: "Ибрагимова Мадина Джамшидовна",
      value: "ibragimova",
      description: "+998 90 555 11 23",
      avatar: <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">ИМ</span>,
    },
    {
      label: "Петрова Мария Ивановна",
      value: "petrova",
      description: "+998 91 234 56 78",
      avatar: <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-bg text-xs font-semibold text-purple-text">ПМ</span>,
    },
  ];

  return (
    <div className="space-y-7">
      <div className="grid gap-6 lg:grid-cols-2">
        <Input label="Название группы *" placeholder="Введите название группы" defaultValue={mode === "edit" ? "Жасмин" : undefined} />
        <Select
          label="Статус группы *"
          defaultValue="active"
          options={[
            { label: "●  Активен", value: "active" },
            { label: "В ожидании", value: "pending" },
            { label: "Закрыт", value: "closed" },
          ]}
        />
        <div className="space-y-2">
          <Select
            label="Возрастная категория группы *"
            defaultValue={mode === "edit" ? "3-4" : ""}
            placeholder="Выберите возрастную категорию"
            options={[
              { label: "1,5-3 года", value: "1.5-3" },
              { label: "3-4 года", value: "3-4" },
              { label: "4-5 лет", value: "4-5" },
              { label: "6-6 дней", value: "6-6" },
            ]}
          />
          <p className="text-xs leading-5 text-text-muted">
            Связано с модулем «Программа обучения». Выбор возрастной категории подтянет программу обучения и создаст карту развития детей группы.
          </p>
        </div>
        <Select
          label="Направленность группы *"
          defaultValue={mode === "edit" ? "general" : ""}
          placeholder="Выберите направленность группы"
          options={[
            { label: "Общеразвивающая", value: "general" },
            { label: "Инклюзивная", value: "inclusive" },
            { label: "Комбинированная", value: "combined" },
            { label: "Специализированная", value: "specialized" },
          ]}
        />
        <div className="space-y-2">
          <SearchableSelect
            label="Воспитатель группы *"
            value={teacher}
            onChange={setTeacher}
            placeholder="Выберите воспитателя"
            searchPlaceholder="Поиск сотрудника"
            options={teacherOptions}
            helperText="Поиск сотрудника из модуля «Сотрудники»."
          />
        </div>
        <Input label="Номер телефона воспитателя группы" value="+998 90 555 11 22" disabled helperText="Заполняется автоматически после выбора воспитателя. Недоступно для редактирования." />
      </div>
      <Select
        label="Программа обучения *"
        defaultValue="world"
        options={[
          { label: "Мир вокруг нас (младшая группа)", value: "world" },
          { label: "Домашние животные", value: "pets" },
          { label: "Подготовка к школе", value: "school" },
        ]}
        helperText="Программа выбирается автоматически в соответствии с возрастной категорией."
      />
    </div>
  );
}

function CreateGroupFooter({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Button variant="outline" onClick={onClose}>
        Отмена
      </Button>
      <Button onClick={onClose}>Создать</Button>
    </>
  );
}

function EditGroupFooter({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Button variant="outline" onClick={onClose}>
        Отмена
      </Button>
      <Button onClick={onClose}>Сохранить</Button>
    </>
  );
}

const childCandidates = [
  { id: "00021", name: "Тлеуберди Амина", age: "4 года 2 мес.", group: "Группа «Ромашка»", moved: true, checked: true },
  { id: "00022", name: "Ибраева Дамир", age: "3 года 8 мес.", group: "Не распределен", moved: false, checked: false },
  { id: "00023", name: "Кенжебекова София", age: "5 лет 1 мес.", group: "Группа «Солнышко»", moved: true, checked: true },
  { id: "00024", name: "Нургалиев Арсен", age: "4 года 10 мес.", group: "Не распределен", moved: false, checked: true },
  { id: "00025", name: "Сайдулаева Малика", age: "3 года 3 мес.", group: "Группа «Звёздочка»", moved: true, checked: false },
  { id: "00026", name: "Ахметов Тимур", age: "2 года 11 мес.", group: "Не распределен", moved: false, checked: false },
  { id: "00027", name: "Берикбай Айлана", age: "4 года 6 мес.", group: "Группа «Радуга»", moved: true, checked: false },
  { id: "00028", name: "Мухтаров Данияр", age: "5 лет 0 мес.", group: "Не распределен", moved: false, checked: false },
  { id: "00029", name: "Оспанов Нурислам", age: "3 года 5 мес.", group: "Группа «Ромашка»", moved: true, checked: false },
  { id: "00030", name: "Токтарова Айлин", age: "4 года 1 мес.", group: "Не распределен", moved: false, checked: false },
];

function AddChildModalContent() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-input border border-info-bg bg-primary-soft/40 px-4 py-3 text-sm font-medium text-primary">
        <Info className="h-5 w-5 shrink-0" />
        Можно добавить детей из другой группы — система отметит это как перемещение.
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <SearchField className="lg:flex-1" placeholder="Поиск по ФИО ребенка или порядковому номеру" />
        <Select className="lg:w-48" defaultValue="" placeholder="Возраст" options={[{ label: "3-4 года", value: "3-4" }, { label: "4-5 лет", value: "4-5" }]} />
        <div className="flex h-10 items-center justify-center rounded-input border border-border bg-page px-5 text-sm font-semibold text-text-primary">
          Выбрано: <span className="ml-1 text-primary">3</span>
        </div>
      </div>
      <TableContainer>
        <Table className="min-w-[920px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Порядковый номер</TableHead>
              <TableHead>ФИО</TableHead>
              <TableHead>Возраст</TableHead>
              <TableHead>Текущая группа</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {childCandidates.map((child) => (
              <TableRow key={child.id}>
                <TableCell>
                  <Checkbox defaultChecked={child.checked} aria-label={`Выбрать ${child.name}`} />
                </TableCell>
                <TableCell className="font-medium">{child.id}</TableCell>
                <TableCell className="font-semibold text-text-primary">{child.name}</TableCell>
                <TableCell>{child.age}</TableCell>
                <TableCell>
                  <span>{child.group}</span>
                  {child.moved ? (
                    <Badge variant="info" className="ml-3">
                      из другой группы
                    </Badge>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        <Info className="h-4 w-4 text-primary" />
        Добавление выполнит прикрепление детей к текущей группе.
      </div>
    </div>
  );
}

function AddChildFooter({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Button variant="outline" onClick={onClose}>
        Отмена
      </Button>
      <Button onClick={onClose}>Добавить</Button>
    </>
  );
}

const participants = [
  ["МИ", "Мария Иванова", "Воспитатель"],
  ["АИ", "Анна Иванова", "мама Тимура"],
  ["РА", "Руслан Алиев", "папа Тимура Алиева"],
  ["ОП", "Оксана Петрова", "мама Софии"],
  ["ДС", "Дмитрий Соколов", "папа Артёма"],
  ["ЕК", "Елена Ким", "мама Полины"],
] as const;

function GroupChatModalContent({ groupName }: { groupName: string }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-end gap-5">
          <h3 className="text-xl font-semibold text-text-primary">{groupName}</h3>
          <span className="text-sm font-medium text-text-muted">18 участников</span>
        </div>
        <SearchField className="w-full lg:w-72" placeholder="Поиск по сообщениям или участникам" />
      </div>
      <div className="grid overflow-hidden rounded-card border border-border bg-surface shadow-card lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-page/40 p-4 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-semibold text-text-primary">Участники</div>
            <div className="text-sm text-text-muted">18</div>
          </div>
          <div className="space-y-2">
            {participants.map(([initials, name, role], index) => (
              <div key={name} className={cn("flex items-center gap-3 rounded-input p-2.5", index === 0 && "border border-purple-bg bg-purple-bg/30")}>
                <InitialsAvatar initials={initials} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text-primary">{name}</div>
                  <div className="truncate text-xs text-text-muted">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
        <section className="flex min-h-[540px] flex-col bg-gradient-to-b from-page/40 to-surface">
          <div className="flex-1 space-y-4 overflow-auto p-5">
            <ChatBubble initials="АИ" author="Анна Иванова" meta="20.05.2024, 09:18" text="Спасибо за напоминание! А во сколько нужно быть в саду?" />
            <ChatBubble right initials="МИ" author="Мария Иванова" role="Воспитатель" meta="20.05.2024, 09:20" text="Пожалуйста! Сбор в группе до 8:45, выезд в 9:00." />
            <ChatBubble initials="ОП" author="Оксана Петрова" role="мама Софии" meta="20.05.2024, 11:03" text="Дети очень ждут поездку! :)" />
            <ChatBubble right initials="МИ" author="Мария Иванова" role="Воспитатель" meta="20.05.2024, 11:15" text="Памятка для родителей_Экскурсия.pdf · PDF · 1.2 МБ" attachment />
            <ChatBubble initials="РА" author="Руслан Алиев" role="папа Тимура Алиева" meta="20.05.2024, 11:17" text="Спасибо, Руслан! Полезный документ, прикреплю к чату." />
            <ChatBubble right initials="МИ" author="Мария Иванова" role="Воспитатель" meta="20.05.2024, 11:22" text="Можно узнать, будет ли после экскурсии обед в саду?" />
          </div>
          <div className="border-t border-border bg-surface p-4">
            <MessageComposer
              className="[&_textarea]:min-h-10"
              placeholder="Написать сообщение в общий чат..."
              attachmentLabel="Файл"
              sendLabel="Отправить"
              helperText={<span className="block w-full text-center">Сообщение увидят все участники группы</span>}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function TicketModalContent({ ticketId }: { ticketId: string }) {
  return (
    <div className="space-y-5">
      <div className="grid rounded-input border border-border lg:grid-cols-2">
        <div className="space-y-5 border-b border-border p-5 lg:border-b-0 lg:border-r">
          <TicketInfo icon={<FileText />} label="Номер тикета" value={ticketId} />
          <TicketInfo icon={<CalendarDays />} label="Дата создания" value="20.05.2024, 10:24" />
          <TicketInfo icon={<User />} label="Родитель / ФИО" value="Анна Иванова" link />
          <TicketInfo icon={<UserRound />} label="Привязка к ребенку / ФИО" value="Иванов Тимур" link />
          <TicketInfo icon={<Info />} label="Тема" value="Вопрос по питанию" />
          <div className="flex items-start justify-between gap-4 text-sm">
            <div className="flex min-w-0 items-center gap-2 text-text-muted">
              <MessageSquare className="h-4 w-4" />
              Описание
            </div>
            <p className="max-w-[58%] text-right leading-5 text-text-primary">Здравствуйте! У Тимура есть пищевая аллергия на молочные продукты. Хотела уточнить, чем его кормят в детском саду и можно ли заменить молочные блюда.</p>
          </div>
        </div>
        <div className="space-y-5 p-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-text-secondary">
              <Clock3 className="h-4 w-4" />
              Статус
            </div>
            <div className="grid grid-cols-4 overflow-hidden rounded-input border border-border text-center text-xs font-medium">
              {["Новый", "В обработке", "Ожидает ответа родителя", "Закрыт"].map((item) => (
                <button key={item} className={cn("min-h-10 border-r border-border px-2 last:border-r-0", item === "В обработке" && "bg-warning-bg text-warning-text")}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <TicketInfo icon={<UserRound />} label="Ответственный сотрудник" value="Мария Сергеевна Кузнецова" />
          <Select defaultValue="" placeholder="Направить другому сотруднику" options={[{ label: "Саидова Н. А.", value: "saidova" }, { label: "Ибрагимова М. Д.", value: "ibragimova" }]} />
          <TicketInfo icon={<CalendarDays />} label="Дата закрытия" value="Будет заполнено после закрытия" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-semibold text-text-primary">
          <MessageSquare className="h-5 w-5 text-primary" />
          Переписка
        </div>
        <div className="max-h-[360px] space-y-3 overflow-auto rounded-input border border-border bg-page/30 p-4">
          <ChatBubble initials="АИ" author="Анна Иванова" role="Родитель" meta="20.05.2024, 10:24" text="Здравствуйте! У Тимура есть пищевая аллергия на молочные продукты. Хотела уточнить, чем его кормят в детском саду и можно ли заменить молочные блюда." />
          <ChatBubble right initials="МК" author="Мария Кузнецова" role="Сотрудник" meta="20.05.2024, 10:32" text="Добрый день, Анна! Спасибо, что сообщили. Уточните, пожалуйста, какие именно молочные продукты под запретом." />
          <ChatBubble initials="АИ" author="Анна Иванова" role="Родитель" meta="20.05.2024, 10:38" text="Аллергия на молоко и творог. Сыр можно в небольшом количестве. Спасибо!" />
          <ChatBubble right initials="МК" author="Мария Кузнецова" role="Сотрудник" meta="20.05.2024, 10:45" text="Принято, спасибо за уточнение. Мы скорректируем рацион и исключим молоко и творог." />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="relative flex-1">
            <Textarea className="min-h-12 resize-none pr-12" placeholder="Написать сообщение..." />
            <Smile className="absolute bottom-4 right-4 h-4 w-4 text-text-muted" />
          </div>
          <Button variant="outline" leftIcon={<Paperclip className="h-4 w-4" />}>
            Файл
          </Button>
          <Button leftIcon={<Send className="h-4 w-4" />}>Отправить</Button>
        </div>
      </div>
    </div>
  );
}

function TicketFooter({ onClose }: { onClose: () => void }) {
  return (
    <ModalFooter
      right={
        <>
          <Button variant="danger" leftIcon={<Lock className="h-4 w-4" />}>Закрыть тикет</Button>
          <Button variant="outline" onClick={onClose}>Отмена</Button>
        </>
      }
    />
  );
}

const attendanceDays = [
  { day: "20", weekDay: "Пн" },
  { day: "21", weekDay: "Вт" },
  { day: "22", weekDay: "Ср" },
  { day: "23", weekDay: "Чт" },
  { day: "24", weekDay: "Пт" },
  { day: "25", weekDay: "Сб" },
] as const;

const attendanceRows = [
  { id: 1, initials: "АТ", name: "Абдуллаев Тимур Ильхомович", marks: ["+", "+", "", "+", "-", ""], comments: ["", "", "", "", "Болеет", ""] },
  { id: 2, initials: "ИМ", name: "Иванова Мария Сергеевна", marks: ["+", "+", "+", "", "+", "+"], comments: ["", "", "", "", "", ""] },
  { id: 3, initials: "КА", name: "Каримов Амир Бахтиёрович", marks: ["-", "", "-", "-", "", "-"], comments: ["По заявлению", "", "", "", "", ""] },
  { id: 4, initials: "МС", name: "Мирзоева София Дилшодовна", marks: ["+", "+", "+", "+", "", "+"], comments: ["", "", "", "", "Семейные обстоятельства", ""] },
  { id: 5, initials: "НД", name: "Назаров Даврон Фарходович", marks: ["+", "", "+", "+", "+", "-"], comments: ["", "", "", "", "", "Болеет"] },
  { id: 6, initials: "ЮА", name: "Юсупова Амина Рустамовна", marks: ["+", "+", "", "-", "+", "+"], comments: ["", "", "", "Опоздание утром", "", ""] },
] as const;

function AttendanceModalContent({ groupName }: { groupName: string }) {
  const monthNames = ["Март", "Апрель", "Май", "Июнь", "Июль", "Август"];
  const [monthIndex, setMonthIndex] = useState(2);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{ rowId: number; dayIndex: number } | null>(null);
  const [marks, setMarks] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    attendanceRows.forEach((row) => row.marks.forEach((mark, index) => (initial[`${row.id}-${index}`] = mark)));
    return initial;
  });
  const [comments, setComments] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    attendanceRows.forEach((row) => row.comments.forEach((comment, index) => (initial[`${row.id}-${index}`] = comment)));
    return initial;
  });

  const updateComment = (key: string, value: string) => {
    const words = value.trim().split(/\s+/).filter(Boolean);
    const limitedValue = words.length > 50 ? words.slice(0, 50).join(" ") : value;
    setComments((current) => ({ ...current, [key]: limitedValue }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="icon" aria-label="Предыдущий месяц" onClick={() => setMonthIndex((current) => Math.max(0, current - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" leftIcon={<CalendarDays className="h-4 w-4" />} rightIcon={<ChevronRight className="h-4 w-4 rotate-90" />}>
            {monthNames[monthIndex]} 2026
          </Button>
          <Button variant="outline" size="icon" aria-label="Следующий месяц" onClick={() => setMonthIndex((current) => Math.min(monthNames.length - 1, current + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <StatusBadge status="info">Сегодня: 10.05.2026</StatusBadge>
          <div className="relative">
            <Button
              variant="outline"
              leftIcon={<CalendarDays className="h-4 w-4" />}
              rightIcon={<ChevronRight className="h-4 w-4 rotate-90" />}
              onClick={() => setDatePickerOpen((open) => !open)}
            >
              Выбрать дату
            </Button>
            {datePickerOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-card border border-border bg-surface p-4 shadow-modal">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-text-primary">{monthNames[monthIndex]} 2026</span>
                  <span className="text-xs text-text-muted">Учебные недели</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-muted">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, index) => {
                    const date = index - 2;
                    const active = date === 20 || date === 10;
                    return (
                      <button
                        key={index}
                        className={cn(
                          "h-8 rounded-input text-sm font-medium text-text-secondary hover:bg-primary-soft hover:text-primary",
                          date < 1 || date > 31 ? "opacity-0" : "",
                          active && "bg-primary text-text-inverse hover:bg-primary",
                        )}
                        onClick={() => setDatePickerOpen(false)}
                      >
                        {date > 0 && date <= 31 ? date : ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AttendanceSummaryCard icon={<Users className="h-6 w-6" />} iconClassName="bg-purple-bg/40 text-purple-text" label="Всего детей" value="22" />
        <AttendanceSummaryCard icon={<Smile className="h-6 w-6" />} iconClassName="bg-success-bg text-success-text" label="Присутствуют сегодня" value="18" valueClassName="text-success-text" />
        <AttendanceSummaryCard icon={<UserMinus className="h-6 w-6" />} iconClassName="bg-danger-bg text-danger-text" label="Отсутствуют сегодня" value="4" valueClassName="text-danger-text" />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <SearchField className="lg:flex-1" placeholder="Поиск по ФИО ребенка" />
        <Select
          className="lg:w-64"
          label=""
          defaultValue="all"
          options={[
            { label: "Статус посещаемости: Все", value: "all" },
            { label: "Присутствуют", value: "present" },
            { label: "Отсутствуют", value: "absent" },
          ]}
        />
      </div>

      <TableContainer>
        <Table className="min-w-[1680px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">№</TableHead>
              <TableHead className="min-w-[260px]">ФИО ребенка</TableHead>
              {attendanceDays.map((day) => (
                <Fragment key={`${day.day}-${day.weekDay}`}>
                  <TableHead key={`${day.day}-${day.weekDay}`} className="w-20 text-center">
                    <div className="font-semibold text-text-primary">{day.day}</div>
                    <div className="text-xs font-medium text-text-muted">{day.weekDay}</div>
                  </TableHead>
                  <TableHead key={`${day.day}-${day.weekDay}-comment`} className="min-w-[210px]">Комментарий</TableHead>
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <InitialsAvatar initials={row.initials} />
                    <div className="max-w-[220px] whitespace-normal font-semibold text-text-primary">{row.name}</div>
                  </div>
                </TableCell>
                {attendanceDays.map((day, index) => {
                  const key = `${row.id}-${index}`;
                  const mark = marks[key];
                  return (
                    <Fragment key={`${row.id}-${day.day}`}>
                      <TableCell key={key} className="relative text-center">
                        <button
                          type="button"
                          className={cn(
                            "h-9 w-9 rounded-input text-xl font-semibold hover:bg-primary-soft",
                            mark === "+" && "text-success-text",
                            mark === "-" && "text-danger-text",
                            !mark && "border border-dashed border-border text-text-muted",
                          )}
                          onClick={() => setActiveCell({ rowId: row.id, dayIndex: index })}
                        >
                          {mark || ""}
                        </button>
                        {activeCell?.rowId === row.id && activeCell.dayIndex === index ? (
                          <div className="absolute left-1/2 top-12 z-20 w-40 -translate-x-1/2 rounded-input border border-border bg-surface p-1 shadow-modal">
                            {[
                              ["+", "Присутствует"],
                              ["-", "Отсутствует"],
                            ].map(([value, label]) => (
                              <button
                                key={value}
                                type="button"
                                className="block w-full rounded-[8px] px-3 py-2 text-left text-sm hover:bg-page"
                                onClick={() => {
                                  setMarks((current) => ({ ...current, [key]: value }));
                                  setActiveCell(null);
                                }}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell key={`${key}-comment`}>
                        <Textarea
                          className="min-h-9 w-[200px] resize-none text-xs transition-all focus:w-[420px]"
                          value={comments[key] ?? ""}
                          placeholder="Причина"
                          onChange={(event) => updateComment(key, event.target.value)}
                        />
                      </TableCell>
                    </Fragment>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Показать по:</span>
            <Select className="w-24" defaultValue="10" options={[{ label: "10", value: "10" }, { label: "20", value: "20" }]} />
          </div>
          <div className="text-sm font-medium text-text-secondary">1–6 из 22</div>
        </div>
        <Pagination page={1} pageCount={3} onPageChange={() => undefined} />
      </div>
    </div>
  );
}

function AttendanceSummaryCard({
  icon,
  iconClassName,
  label,
  value,
  valueClassName,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div className={cn("flex h-14 w-14 items-center justify-center rounded-full", iconClassName)}>{icon}</div>
        <div>
          <div className="text-sm text-text-secondary">{label}</div>
          <div className={cn("mt-1 text-2xl font-semibold text-text-primary", valueClassName)}>{value}</div>
        </div>
      </div>
    </div>
  );
}

function AttendanceFooter({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Button variant="outline" onClick={onClose}>Отмена</Button>
      <Button leftIcon={<Download className="h-4 w-4" />}>Сохранить</Button>
    </>
  );
}

const historyFilters = [
  { icon: <ArrowLeftRight className="h-4 w-4" />, label: "Перемещение детей", tone: "info" as const },
  { icon: <Users className="h-4 w-4" />, label: "Перемещение воспитателей", tone: "purple" as const },
  { icon: <Flag className="h-4 w-4" />, label: "Изменение статуса группы", tone: "warning" as const },
  { icon: <UserPlus className="h-4 w-4" />, label: "Добавление ребенка", tone: "success" as const },
  { icon: <UserMinus className="h-4 w-4" />, label: "Открепление ребенка", tone: "danger" as const },
] as const;

const historyRows = [
  {
    event: "Добавление ребенка",
    subject: "Ребенок: Алиев Тимур",
    author: "Саида Каримова",
    role: "Администратор",
    date: "20.05.2024",
    time: "09:12",
    from: "Не состоял в группе",
    to: "Группа «Солнышко»",
    fromTone: "neutral" as const,
    toTone: "success" as const,
    comment: "Переведен после подтверждения документов",
    icon: <UserPlus className="h-5 w-5" />,
    accent: "text-success-text",
  },
  {
    event: "Открепление ребенка",
    subject: "Ребенок: Ким Амина",
    author: "Мария Иванова",
    role: "Воспитатель",
    date: "18.05.2024",
    time: "16:45",
    from: "Группа «Солнышко»",
    to: "Без группы",
    fromTone: "success" as const,
    toTone: "danger" as const,
    comment: "Открепление по заявлению родителя",
    icon: <UserMinus className="h-5 w-5" />,
    accent: "text-danger-text",
  },
  {
    event: "Перемещение ребенка",
    subject: "Ребенок: Петров Максим",
    author: "Саида Каримова",
    role: "Администратор",
    date: "15.05.2024",
    time: "11:30",
    from: "Группа «Радуга»",
    to: "Группа «Солнышко»",
    fromTone: "info" as const,
    toTone: "success" as const,
    comment: "Ротация по возрастной категории",
    icon: <ArrowLeftRight className="h-5 w-5" />,
    accent: "text-info-text",
  },
  {
    event: "Перемещение воспитателя",
    subject: "Сотрудник: Анна Петрова",
    author: "Саида Каримова",
    role: "Администратор",
    date: "12.05.2024",
    time: "08:50",
    from: "Группа «Звёздочки»",
    to: "Группа «Солнышко»",
    fromTone: "purple" as const,
    toTone: "success" as const,
    comment: "Назначен вторым воспитателем",
    icon: <Users className="h-5 w-5" />,
    accent: "text-purple-text",
  },
  {
    event: "Изменение статуса группы",
    subject: "",
    author: "Саида Каримова",
    role: "Администратор",
    date: "02.05.2024",
    time: "10:05",
    from: "В ожидании",
    to: "Активна",
    fromTone: "warning" as const,
    toTone: "success" as const,
    comment: "Группа укомплектована и открыта",
    icon: <Flag className="h-5 w-5" />,
    accent: "text-warning-text",
  },
] as const;

function GroupHistoryModalContent() {
  return (
    <div className="space-y-5">
      <div className="rounded-card border border-border bg-surface p-5 shadow-card">
        <div className="grid gap-4 xl:grid-cols-4">
          <SearchField label="Поиск" placeholder="Поиск по комментарию, ребенку или сотруднику" />
          <Select label="Тип события" defaultValue="all" options={[{ label: "Все типы", value: "all" }]} />
          <Select label="Кто внес изменение" defaultValue="all" options={[{ label: "Все сотрудники", value: "all" }]} />
          <Button variant="outline" className="mt-auto justify-start" leftIcon={<CalendarDays className="h-4 w-4" />}>
            01.05.2024 — 20.05.2024
          </Button>
        </div>
        <div className="mt-5">
          <div className="mb-3 text-sm font-medium text-text-secondary">Быстрые фильтры по типам событий</div>
          <div className="flex flex-wrap gap-2">
            {historyFilters.map((filter) => (
              <Button key={filter.label} variant="outline" leftIcon={filter.icon}>
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card>
          <CardHeader>
            <CardTitle>История изменений</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TableContainer>
              <Table className="min-w-[980px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Событие</TableHead>
                    <TableHead>Кто внес изменение</TableHead>
                    <TableHead>Дата / Время</TableHead>
                    <TableHead>Изменение</TableHead>
                    <TableHead>Комментарий сотрудника</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyRows.map((row) => (
                    <TableRow key={`${row.event}-${row.date}-${row.time}`}>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <span className={cn("mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-page", row.accent)}>{row.icon}</span>
                          <div>
                            <div className="font-semibold text-text-primary">{row.event}</div>
                            {row.subject ? <div className="mt-1 text-sm text-text-secondary">{row.subject}</div> : null}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <InitialsAvatar initials="СК" />
                          <div>
                            <div className="font-semibold text-text-primary">{row.author}</div>
                            <div className="text-sm text-text-secondary">{row.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-text-primary">{row.date}</div>
                        <div className="text-sm text-text-secondary">{row.time}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={row.fromTone}>{row.from}</Badge>
                          <ChevronRight className="h-4 w-4 text-text-muted" />
                          <Badge variant={row.toTone}>{row.to}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start justify-between gap-3">
                          <span className="max-w-[240px] text-sm text-text-primary">{row.comment}</span>
                          <ChevronRight className="h-4 w-4 rotate-90 text-text-muted" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm font-medium text-text-secondary">Показано 1–5 из 27 событий</div>
              <div className="flex items-center gap-3">
                <Pagination page={1} pageCount={6} onPageChange={() => undefined} />
                <Select className="w-40" defaultValue="10" options={[{ label: "10 на странице", value: "10" }, { label: "20 на странице", value: "20" }]} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Сводка изменений</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <HistorySummaryItem icon={<FileText className="h-5 w-5 text-info-text" />} iconClassName="bg-info-bg" label="Всего событий" value="27" />
            <HistorySummaryItem icon={<UserPlus className="h-5 w-5 text-success-text" />} iconClassName="bg-success-bg" label="Добавлено детей" value="5" />
            <HistorySummaryItem icon={<UserMinus className="h-5 w-5 text-danger-text" />} iconClassName="bg-danger-bg" label="Откреплено детей" value="2" />
            <HistorySummaryItem icon={<Users className="h-5 w-5 text-purple-text" />} iconClassName="bg-purple-bg" label="Перемещений воспитателей" value="3" />
            <HistorySummaryItem icon={<Flag className="h-5 w-5 text-warning-text" />} iconClassName="bg-warning-bg" label="Изменений статуса группы" value="1" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HistorySummaryItem({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-input border border-border px-3 py-3">
      <div className="flex items-center gap-3">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", iconClassName)}>{icon}</span>
        <span className="text-sm font-medium text-text-secondary">{label}</span>
      </div>
      <span className="text-2xl font-semibold text-text-primary">{value}</span>
    </div>
  );
}

function TicketInfo({ icon, label, value, link }: { icon: ReactNode; label: string; value: string; link?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <div className="flex min-w-0 items-center gap-2 text-text-muted">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        {label}
      </div>
      <div className={cn("max-w-[58%] text-right font-medium", link ? "text-primary" : "text-text-primary")}>{value}</div>
    </div>
  );
}

function ChatBubble({
  initials,
  author,
  role,
  meta,
  text,
  right,
  attachment,
}: {
  initials: string;
  author: string;
  role?: string;
  meta: string;
  text: string;
  right?: boolean;
  attachment?: boolean;
}) {
  return (
    <div className={cn("flex items-start gap-3", right && "justify-end")}>
      {!right ? <InitialsAvatar initials={initials} /> : null}
      <div
        className={cn(
          "max-w-[620px] rounded-input border px-4 py-3 text-sm shadow-card",
          right ? "border-primary bg-primary text-text-inverse" : "border-border bg-surface text-text-primary",
        )}
      >
        <div className={cn("mb-1 flex flex-wrap items-center gap-2 text-xs", right ? "text-white/75" : "text-text-muted")}>
          <span className={cn("font-semibold", right ? "text-text-inverse" : "text-text-primary")}>{author}</span>
          {role ? <span className={right ? "text-white/85" : "text-primary"}>{role}</span> : null}
          <span className="ml-auto">{meta}</span>
        </div>
        <div
          className={cn(
            "leading-5",
            attachment &&
              cn(
                "flex items-center gap-3 rounded-input border p-3 font-semibold",
                right ? "border-white/25 bg-white/10" : "border-border bg-surface",
              ),
          )}
        >
          {attachment ? <FileText className={cn("h-7 w-7", right ? "text-text-inverse" : "text-danger-text")} /> : null}
          {text}
          {attachment ? <Download className={cn("ml-auto h-5 w-5", right ? "text-text-inverse" : "text-primary")} /> : null}
        </div>
      </div>
      {right ? <InitialsAvatar initials={initials} /> : null}
    </div>
  );
}

function InitialsAvatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary",
        size === "sm" ? "h-9 w-9 text-xs ring-2 ring-surface" : "h-10 w-10 text-sm",
      )}
    >
      {initials}
      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success-text" />
    </span>
  );
}

function AttendanceCard({ group, onOpen }: { group: GroupDetail; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <DashboardCard title={t("groups.attendance.title")} icon={<Clock3 className="h-5 w-5" />} onAction={onOpen}>
      <div className="grid grid-cols-3 gap-2">
        <Metric label={t("groups.attendance.totalChildren")} value={group.attendance.totalChildren} />
        <Metric label={t("groups.attendance.presentToday")} value={group.attendance.presentToday} />
        <Metric label={t("groups.attendance.absentToday")} value={group.attendance.absentToday} tone="warning" />
      </div>
    </DashboardCard>
  );
}

function LearningCard({ group, onOpen }: { group: GroupDetail; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <DashboardCard title={t("groups.learning.title")} icon={<BookOpen className="h-5 w-5" />} onAction={onOpen}>
      <div className="space-y-3 text-sm">
        <InfoLine label={t("groups.learning.monthTheme")} value={group.learning.monthTheme} />
        <InfoLine label={t("groups.learning.weekTheme")} value={group.learning.weekTheme} />
        <InfoLine label={t("groups.learning.todayPlan")} value={group.learning.todayPlan} />
        <div className="flex flex-wrap gap-2">
          {group.learning.weekGames.map((game) => (
            <Badge key={game} variant="info">
              {game}
            </Badge>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

function BilimtoyGamesCard({ group, onOpen }: { group: GroupDetail; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <DashboardCard title={t("groups.games.title")} icon={<Gamepad2 className="h-5 w-5" />} onAction={onOpen}>
      <div className="space-y-3">
        <InfoLine label={t("groups.games.currentMonth")} value={t("groups.games.currentMonthValue")} />
        <div className="flex flex-wrap gap-2">
          {group.learning.weekGames.map((game, index) => (
            <Badge key={game} variant={["info", "purple", "success", "warning", "danger"][index % 5] as "info" | "purple" | "success" | "warning" | "danger"}>
              {game}
            </Badge>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}

function FinanceCard({ group, onOpen }: { group: GroupDetail; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <DashboardCard title={t("groups.finance.title")} icon={<WalletCards className="h-5 w-5" />} onAction={onOpen}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Metric label={t("groups.finance.income")} value={group.finance.income} tone="success" />
          <Metric label={t("groups.finance.expected")} value={group.finance.expected} />
        </div>
        <div>
          <div className="h-2 overflow-hidden rounded-full bg-page">
            <div className="h-full rounded-full bg-success-text" style={{ width: `${group.finance.progress}%` }} />
          </div>
          <div className="mt-1 text-right text-xs font-medium text-text-secondary">{group.finance.progress}%</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Metric label={t("groups.finance.paid")} value={group.finance.paid} tone="success" />
          <Metric label={t("groups.finance.pending")} value={group.finance.pending} tone="warning" />
          <Metric label={t("groups.finance.overdue")} value={group.finance.overdue} tone="danger" />
        </div>
      </div>
    </DashboardCard>
  );
}

function GroupChatCard({ group, onOpen }: { group: GroupDetail; onOpen: () => void }) {
  const { t } = useI18n();
  return (
    <DashboardCard title={t("groups.chat.title")} icon={<MessageSquare className="h-5 w-5" />} onAction={onOpen}>
      <div className="space-y-4">
        <p className="text-sm leading-5 text-text-secondary">Общий чат группы «{group.name}»</p>
        <div className="flex items-center justify-between gap-4">
          <ChatAvatarStack total={group.chat.participants} />
          <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-[10px] bg-primary px-3 text-base font-semibold text-text-inverse shadow-card">
            {group.chat.newMessages}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-text-muted">
          <span className="font-medium">Последнее сообщение</span>
          <span>{group.chat.lastActivity}</span>
        </div>
        <div className="rounded-input bg-page px-4 py-3 text-xs font-medium leading-5 text-text-secondary">
          Напоминаем, что завтра у детей тематическое занятие по животным. Просьба принести картинки или игрушки.
        </div>
      </div>
    </DashboardCard>
  );
}

function ChatAvatarStack({ total }: { total: number }) {
  const visible = participants.slice(0, 3);
  const extra = Math.max(total - visible.length, 0);

  return (
    <div className="flex items-center">
      {visible.map(([initials, name]) => (
        <span key={name} className="-ml-2 first:ml-0">
          <InitialsAvatar initials={initials} size="sm" />
        </span>
      ))}
      {extra ? (
        <span className="-ml-2 inline-flex h-9 min-w-9 items-center justify-center rounded-full border-2 border-surface bg-page px-2 text-xs font-semibold text-text-secondary">
          +{extra}
        </span>
      ) : null}
    </div>
  );
}

function TicketsCard({
  group,
  onTicketOpen,
  onOpenAllTickets,
  compact = false,
}: {
  group: GroupDetail;
  onTicketOpen: (ticketId: string) => void;
  onOpenAllTickets?: () => void;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const tickets = createParentTickets(group);
  const visibleTickets = compact ? tickets.slice(0, 4) : tickets;
  const showAllButton = tickets.length >= 5 && onOpenAllTickets;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{t("groups.tickets.title")}</CardTitle>
          {!compact ? <CardDescription>{t("groups.tickets.description")}</CardDescription> : null}
        </div>
        {showAllButton ? (
          <Button variant="ghost" onClick={onOpenAllTickets}>
            {t("groups.tickets.allTickets")}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {compact ? (
          <div className="space-y-2">
            {visibleTickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className="grid w-full grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 rounded-input border border-border px-3 py-2 text-left transition-colors hover:bg-page"
                onClick={() => onTicketOpen(ticket.id)}
              >
                <span className="text-xs font-semibold text-text-primary">{ticket.id}</span>
                <span className="min-w-0">
                  <span className="block max-w-[170px] whitespace-normal break-words text-xs font-medium leading-4 text-text-primary">
                    {ticket.subject}
                  </span>
                  <span className="mt-1 block truncate text-[11px] text-text-muted">
                    {ticket.parentName} · {ticket.sentAt}
                  </span>
                </span>
                <StatusBadge status={ticketStatusVariant(ticket.status)} className="min-h-6 px-2 py-0.5 text-[11px]">
                  {t(`groups.ticketStatus.${ticket.status}`)}
                </StatusBadge>
              </button>
            ))}
          </div>
        ) : (
          <TicketsTable tickets={visibleTickets} onTicketOpen={onTicketOpen} />
        )}
      </CardContent>
    </Card>
  );
}

function TicketsListModalContent({ group, onTicketOpen }: { group: GroupDetail; onTicketOpen: (ticketId: string) => void }) {
  return <TicketsTable tickets={createParentTickets(group)} onTicketOpen={onTicketOpen} />;
}

function TicketsTable({ tickets, onTicketOpen }: { tickets: ParentTicket[]; onTicketOpen: (ticketId: string) => void }) {
  const { t } = useI18n();

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("groups.tickets.ticketId")}</TableHead>
            <TableHead>{t("groups.tickets.subject")}</TableHead>
            <TableHead>{t("groups.tickets.parent")}</TableHead>
            <TableHead>{t("groups.tickets.sentAt")}</TableHead>
            <TableHead>{t("groups.tickets.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="cursor-pointer" onClick={() => onTicketOpen(ticket.id)}>
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell className="max-w-[220px] whitespace-normal break-words leading-5">{ticket.subject}</TableCell>
              <TableCell>{ticket.parentName}</TableCell>
              <TableCell>{ticket.sentAt}</TableCell>
              <TableCell>
                <StatusBadge status={ticketStatusVariant(ticket.status)}>{t(`groups.ticketStatus.${ticket.status}`)}</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function createParentTickets(group: GroupDetail): ParentTicket[] {
  return [
    ...group.tickets,
    {
      id: "#1258",
      subject: "Вопрос по форме",
      parentName: "Алиева Р.",
      sentAt: "16.05.2026 08:40",
      status: "new",
    },
    {
      id: "#1259",
      subject: "Просьба перенести встречу",
      parentName: "Иванова О.",
      sentAt: "16.05.2026 11:15",
      status: "inProgress",
    },
  ];
}

function ChildrenTable({
  group,
  nicuLabels,
  children,
  search,
  selectedChild,
  onSearchChange,
  onChildSelect,
  onAddChild,
}: {
  group: GroupDetail;
  nicuLabels: { n: string; i: string; ch: string; u: string };
  children: GroupDetail["children"];
  search: string;
  selectedChild: number | null;
  onSearchChange: (value: string) => void;
  onChildSelect: (rowNumber: number) => void;
  onAddChild: () => void;
}) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <CardTitle>{t("groups.children.title")}</CardTitle>
            <CardDescription>{t("groups.children.description")}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={onAddChild}>
              {t("groups.children.addChild")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchField
          className="w-full sm:w-[360px]"
          aria-label={t("groups.children.search")}
          placeholder={t("groups.children.search")}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {children.length ? (
          <>
            <TableContainer>
              <Table className="min-w-[1380px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("groups.children.rowNumber")}</TableHead>
                    <TableHead>{t("groups.children.fullName")}</TableHead>
                    <TableHead>{t("groups.children.age")}</TableHead>
                    <TableHead>{t("groups.children.developmentSummary")}</TableHead>
                    <TableHead>{t("groups.children.attendanceStatus")}</TableHead>
                    <TableHead>{t("groups.children.parent")}</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {children.map((child) => (
                    <TableRow
                      key={child.rowNumber}
                      className={cn("cursor-pointer", selectedChild === child.rowNumber && "bg-primary-soft/60")}
                      onClick={() => onChildSelect(child.rowNumber)}
                    >
                      <TableCell className="font-medium">{child.rowNumber}</TableCell>
                      <TableCell>{child.fullName}</TableCell>
                      <TableCell>{child.age}</TableCell>
                      <TableCell>
                        <div className="grid min-w-[700px] grid-cols-5 gap-2">
                          {groupDevelopmentAreas.map((area) => (
                            <StackedNicuBar key={area} value={child.development[area]} labels={nicuLabels} compact className="min-w-0" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={child.attendanceStatus === "present" ? "success" : "warning"}>
                          {t(`groups.attendanceStatus.${child.attendanceStatus}`)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{child.parentName}</TableCell>
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
            <div className="text-sm font-medium text-text-secondary">
              {t("groups.children.total", { shown: children.length, total: group.children.length })}
            </div>
          </>
        ) : (
          <EmptyState title={t("groups.children.emptyTitle")} description={t("groups.children.emptyDescription")} />
        )}
      </CardContent>
    </Card>
  );
}

function ComparisonDevelopmentMap({
  group,
  nicuLabels,
  onExport,
}: {
  group: GroupDetail;
  nicuLabels: { n: string; i: string; ch: string; u: string };
  onExport: () => void;
}) {
  const { t } = useI18n();
  const visibleChildren = group.children.slice(0, 8);
  const results = createComparisonRows(group);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <CardTitle>{t("groups.children.comparisonMap")}</CardTitle>
          <CardDescription>{t("groups.children.comparisonDescription")}</CardDescription>
        </div>
        <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={onExport}>
          {t("groups.children.exportComparison")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <FilterBar
          left={
            <SearchField
              className="w-full sm:w-[360px]"
              aria-label={t("groups.children.comparisonSearch")}
              placeholder={t("groups.children.comparisonSearch")}
            />
          }
          right={
            <>
              <Select
                className="w-48"
                label={t("groups.children.comparisonArea")}
                defaultValue={allValue}
                options={[{ label: t("groups.filters.all"), value: allValue }, ...groupDevelopmentAreas.map((area) => ({ label: t(`groups.developmentAreas.${area}`), value: area }))]}
              />
              <Select
                className="w-56"
                label={t("groups.children.comparisonSubarea")}
                defaultValue="grossMotor"
                options={[{ label: t("groups.children.grossMotor"), value: "grossMotor" }]}
              />
              <Select
                className="w-44"
                label={t("groups.children.observationPeriod")}
                defaultValue="primary"
                options={[{ label: t("groups.children.primaryPeriod"), value: "primary" }]}
              />
            </>
          }
        />

        <div className="flex flex-wrap gap-2 rounded-input border border-border bg-page/60 px-3 py-2 text-xs font-medium text-text-secondary">
          <Badge variant="info">{t("groups.children.groupFilter")}: {group.name}</Badge>
          <Badge variant="info">{t("groups.filters.ageCategory")}: {group.ageCategory}</Badge>
        </div>

        <TableContainer>
          <Table className="min-w-[1500px]">
            <TableHeader>
              <TableRow>
                <TableHead>{t("groups.children.rowNumber")}</TableHead>
                <TableHead>{t("groups.children.section")}</TableHead>
                <TableHead>{t("groups.children.subarea")}</TableHead>
                <TableHead>{t("groups.children.expectedResult")}</TableHead>
                {visibleChildren.map((child) => (
                  <TableHead key={child.rowNumber}>{shortChildName(child.fullName)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((row, index) => (
                <TableRow key={row.result}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="max-w-[180px] whitespace-normal">{t(`groups.developmentAreas.${row.area}`)}</TableCell>
                  <TableCell>{t("groups.children.grossMotor")}</TableCell>
                  <TableCell className="max-w-[260px] whitespace-normal font-medium text-text-primary">{row.result}</TableCell>
                  {visibleChildren.map((child, childIndex) => {
                    const nicuKey = comparisonNicuKeys[(index + childIndex) % comparisonNicuKeys.length];
                    return (
                      <TableCell key={child.rowNumber}>
                        <NicuCell value={nicuKey} label={nicuLabels[nicuKey]} periodLabel={t("groups.children.primaryShort")} />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="text-center text-xs font-medium text-text-muted">{t("groups.children.comparisonHint")}</div>
      </CardContent>
    </Card>
  );
}

const comparisonNicuKeys = ["n", "i", "ch", "u", "i", "ch", "u"] as const;

function NicuCell({ value, label, periodLabel }: { value: (typeof comparisonNicuKeys)[number]; label: string; periodLabel: string }) {
  const variant = {
    n: "danger",
    i: "warning",
    ch: "info",
    u: "success",
  }[value] as "danger" | "warning" | "info" | "success";

  return (
    <Badge variant={variant} className="h-8 w-full justify-center">
      {label} ({periodLabel})
    </Badge>
  );
}

function shortChildName(fullName: string) {
  const [lastName, firstName] = fullName.split(" ");
  return `${lastName} ${firstName?.[0] ?? ""}.`;
}

function createComparisonRows(group: GroupDetail) {
  const rows = [
    "ходит разными способами (прямо, свободно, в заданном направлении)",
    "может перестроиться в колонну, круг",
    "бегает, сохраняя равновесие",
    "лазает по спортивной лестнице вверх и вниз",
    "прыгает на двух ногах на месте",
    "прыгает с продвижением вперед",
    "проползает под дугой",
    "перешагивает через препятствия высотой 10-15 см",
    "ходит по гимнастической скамейке (прямо)",
    "ловит мяч двумя руками",
  ];

  return rows.map((result, index) => ({ area: groupDevelopmentAreas[index % groupDevelopmentAreas.length], result }));
}

function DashboardCard({
  title,
  icon,
  onAction,
  children,
}: {
  title: string;
  icon: ReactNode;
  onAction: () => void;
  children: ReactNode;
}) {
  return (
    <Card
      className="h-full cursor-pointer transition-shadow hover:shadow-modal"
      role="button"
      tabIndex={0}
      onClick={onAction}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onAction();
        }
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">{icon}</span>
          <CardTitle>{title}</CardTitle>
        </div>
        <ChevronRight className="h-4 w-4 text-text-muted" />
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Metric({ label, value, tone = "neutral" }: { label: string; value: string | number; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) {
  const toneClass = {
    neutral: "text-text-primary",
    success: "text-success-text",
    warning: "text-warning-text",
    danger: "text-danger-text",
    info: "text-info-text",
  }[tone];

  return (
    <div className="min-w-0 rounded-input border border-border p-3">
      <div className="text-xs leading-4 text-text-muted break-words">{label}</div>
      <div className={cn("mt-1 text-lg font-semibold", toneClass)}>{value}</div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-text-muted">{label}</div>
      <div className="mt-1 font-medium text-text-primary">{value}</div>
    </div>
  );
}

function createGroupDetail(group: GroupRecord): GroupDetail {
  return {
    ...mockGroupDetail,
    ...group,
    detailDevelopmentStats: groupDevelopmentAreas.map((area) => ({ area, value: group.development[area] })),
  };
}

function createOptions(values: string[], allLabel: string) {
  const uniqueValues = Array.from(new Set(values));
  return [{ label: allLabel, value: allValue }, ...uniqueValues.map((value) => ({ label: value, value }))];
}

function groupStatusVariant(status: GroupStatus) {
  if (status === "active") return "success";
  if (status === "pending") return "warning";
  return "neutral";
}

function ticketStatusVariant(status: ParentTicketStatus) {
  if (status === "new") return "info";
  if (status === "inProgress") return "warning";
  return "success";
}

function createSummary(groups: GroupRecord[]) {
  const totals = groups.reduce(
    (acc, group) => {
      acc.totalChildren += group.childrenCount;
      if (group.status === "active") acc.activeGroups += 1;
      return acc;
    },
    { totalChildren: 0, activeGroups: 0 },
  );

  return {
    totalGroups: groups.length,
    totalChildren: totals.totalChildren,
    activeGroups: totals.activeGroups,
  };
}
