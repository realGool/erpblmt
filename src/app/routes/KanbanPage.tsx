import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Flag,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Trash2,
  Timer,
  UserRound,
  Users,
} from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Modal,
  Select,
  StatusBadge,
  Textarea,
} from "../../components/ui";
import { kanbanColumns, kanbanTasks, type KanbanColumnId, type KanbanPriority, type KanbanTask, type KanbanTaskType } from "../../data/mockKanban";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";

interface KanbanPageProps {
  onNavigate?: (key: SidebarNavigationKey) => void;
}

const typeVariant: Record<KanbanTaskType, "info" | "success" | "warning" | "purple"> = {
  education: "purple",
  organization: "info",
  parents: "warning",
  observation: "success",
};

const priorityVariant: Record<KanbanPriority, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const columnSurface: Record<KanbanColumnId, string> = {
  new: "bg-page",
  inProgress: "bg-warning-bg/25",
  review: "bg-purple-bg/25",
  done: "bg-success-bg/25",
};

const typeDotClass: Record<KanbanTaskType, string> = {
  education: "bg-purple-text",
  organization: "bg-info-text",
  parents: "bg-warning-text",
  observation: "bg-success-text",
};

const priorityFlagClass: Record<KanbanPriority, string> = {
  low: "text-success-text",
  medium: "text-warning-text",
  high: "text-danger-text",
};

export function KanbanPage({ onNavigate }: KanbanPageProps) {
  const { t } = useI18n();
  const [tasks, setTasks] = useState(kanbanTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLocaleLowerCase().includes(query) ||
        task.assignee.toLocaleLowerCase().includes(query) ||
        task.group.toLocaleLowerCase().includes(query) ||
        task.child.toLocaleLowerCase().includes(query);
      const matchesType = typeFilter === "all" || task.type === typeFilter;
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesType && matchesPriority;
    });
  }, [priorityFilter, search, tasks, typeFilter]);

  const moveTask = (status: KanbanColumnId) => {
    if (!draggedTaskId) return;
    setTasks((current) => current.map((task) => (task.id === draggedTaskId ? { ...task, status } : task)));
    setDraggedTaskId(null);
  };

  return (
    <AppShell activeNavigation="kanban" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title={t("kanban.page.title")}
          description={t("kanban.page.description")}
          breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.kanban") }]}
          actions={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
              {t("kanban.actions.createTask")}
            </Button>
          }
        />

        <div className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-4 md:grid-cols-3">
              <KanbanMetric icon={<CheckCircle2 className="h-6 w-6" />} title={t("kanban.stats.done")} value="128" helper={t("kanban.stats.last30Days")} tone="success" />
              <KanbanMetric icon={<Clock3 className="h-6 w-6" />} title={t("kanban.stats.averageTime")} value="2 д 6 ч" helper={t("kanban.stats.average")} tone="info" />
              <KanbanMetric icon={<AlertCircle className="h-6 w-6" />} title={t("kanban.stats.overdue")} value="23" helper={t("kanban.stats.urgentToday")} tone="danger" />
            </div>
            <Card>
              <CardContent>
                <div className="text-sm font-semibold text-text-primary">{t("kanban.stats.byType")}</div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="h-24 w-24 rounded-full" style={{ background: "conic-gradient(var(--color-primary) 0 42%, var(--color-success-text) 42% 70%, var(--color-warning-text) 70% 88%, var(--color-purple-text) 88% 100%)" }} />
                  <div className="space-y-2 text-xs font-medium text-text-secondary">
                    {(["education", "organization", "parents", "observation"] as KanbanTaskType[]).map((type, index) => (
                      <div key={type} className="flex items-center justify-between gap-4">
                        <span>{t(`kanban.types.${type}`)}</span>
                        <span className="font-semibold text-text-primary">{[42, 28, 18, 12][index]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="space-y-4">
              <div className="grid gap-3 xl:grid-cols-[minmax(280px,1fr)_repeat(5,minmax(150px,auto))]">
                <Input
                  placeholder={t("kanban.filters.search")}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
                <Select
                  value="all"
                  onChange={() => undefined}
                  options={[{ label: t("kanban.filters.responsible"), value: "all" }, { label: "Айжан Т.", value: "aizhan" }]}
                />
                <Select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  options={[{ label: t("kanban.filters.type"), value: "all" }, ...(["education", "organization", "parents", "observation"] as KanbanTaskType[]).map((type) => ({ label: t(`kanban.types.${type}`), value: type }))]}
                />
                <Select value="all" onChange={() => undefined} options={[{ label: t("kanban.filters.group"), value: "all" }, { label: "Жасмин", value: "jasmine" }]} />
                <Select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} options={[{ label: t("kanban.filters.priority"), value: "all" }, ...(["low", "medium", "high"] as KanbanPriority[]).map((priority) => ({ label: t(`kanban.priority.${priority}`), value: priority }))]} />
                <Button variant="outline" leftIcon={<SlidersHorizontal className="h-4 w-4" />}>{t("kanban.actions.reset")}</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" leftIcon={<Users className="h-4 w-4" />}>{t("kanban.filters.allEmployees")}</Button>
                <Button variant="outline" leftIcon={<UserRound className="h-4 w-4" />}>{t("kanban.filters.myTasks")}</Button>
                <span className="flex items-center text-sm text-text-muted">{t("kanban.page.adminHint")}</span>
              </div>
            </CardContent>
          </Card>

          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[1180px] gap-4 xl:grid-cols-4">
              {kanbanColumns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  id={column.id}
                  total={column.count}
                  tasks={filteredTasks.filter((task) => task.status === column.id)}
                  onDropTask={moveTask}
                  onDragStart={setDraggedTaskId}
                  onTaskOpen={setActiveTask}
                />
              ))}
            </div>
          </div>
        </div>

        <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
        <ReadTaskModal task={activeTask} onClose={() => setActiveTask(null)} />
      </PageContainer>
    </AppShell>
  );
}

function KanbanMetric({ icon, title, value, helper, tone }: { icon: ReactNode; title: string; value: string; helper: string; tone: "success" | "info" | "danger" }) {
  const toneClass = {
    success: "bg-success-bg text-success-text",
    info: "bg-info-bg text-info-text",
    danger: "bg-danger-bg text-danger-text",
  }[tone];

  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", toneClass)}>{icon}</div>
        <div>
          <div className="text-sm font-semibold text-text-primary">{title}</div>
          <div className="mt-2 text-3xl font-semibold text-text-primary">{value}</div>
          <div className="mt-3 text-xs text-text-muted">{helper}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanColumn({
  id,
  total,
  tasks,
  onDropTask,
  onDragStart,
  onTaskOpen,
}: {
  id: KanbanColumnId;
  total: number;
  tasks: KanbanTask[];
  onDropTask: (status: KanbanColumnId) => void;
  onDragStart: (taskId: string) => void;
  onTaskOpen: (task: KanbanTask) => void;
}) {
  const { t } = useI18n();

  return (
    <section
      className={cn("min-h-[620px] rounded-card border border-border p-3", columnSurface[id])}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDropTask(id)}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-text-primary">{t(`kanban.columns.${id}`)}</h3>
          <Badge variant={id === "done" ? "success" : id === "review" ? "purple" : id === "inProgress" ? "warning" : "info"}>{total}</Badge>
        </div>
        <MoreHorizontal className="h-4 w-4 text-text-muted" />
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} onOpen={onTaskOpen} />
        ))}
      </div>
      <button type="button" className="mt-3 px-2 text-sm font-medium text-primary">
        {t("kanban.actions.moreTasks", { count: Math.max(total - tasks.length, 0) })}
      </button>
    </section>
  );
}

function TaskCard({ task, onDragStart, onOpen }: { task: KanbanTask; onDragStart: (taskId: string) => void; onOpen: (task: KanbanTask) => void }) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      draggable
      onDragStart={() => onDragStart(task.id)}
      onClick={() => onOpen(task)}
      className="w-full rounded-card border border-border bg-surface p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-dropdown"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-semibold leading-5 text-text-primary">{task.title}</h4>
        {task.status === "done" ? <CheckCircle2 className="h-4 w-4 text-success-text" /> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant={typeVariant[task.type]}>{t(`kanban.types.${task.type}`)}</Badge>
        <Badge variant={priorityVariant[task.priority]}>{t(`kanban.priority.${task.priority}`)}</Badge>
      </div>
      <div className="mt-3 space-y-2 text-xs font-medium text-text-secondary">
        <TaskMeta icon={<Users className="h-4 w-4" />} text={`${t("kanban.fields.group")}: ${task.group}`} />
        <TaskMeta icon={<UserRound className="h-4 w-4" />} text={`${t("kanban.fields.child")}: ${task.child}`} />
        <TaskMeta icon={<CalendarDays className="h-4 w-4 text-danger-text" />} text={task.completedAt ? `${t("kanban.fields.completed")}: ${task.completedAt}` : task.dueDate} />
      </div>
      {task.timeInStatus ? (
        <div className="mt-3 inline-flex items-center gap-1 rounded-[6px] bg-warning-bg px-2 py-1 text-xs font-semibold text-warning-text">
          <Timer className="h-3.5 w-3.5" />
          {t("kanban.fields.inWork", { time: task.timeInStatus })}
        </div>
      ) : null}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">
            {task.assignee.split(" ").map((part) => part[0]).join("")}
          </div>
          <span className="text-xs font-medium text-text-secondary">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
          <span className="inline-flex items-center gap-1"><MessageCircle className="h-4 w-4" />{task.comments}</span>
          <span>{t("kanban.fields.logs")}</span>
        </div>
      </div>
    </button>
  );
}

function TaskMeta({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function CreateTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [taskType, setTaskType] = useState<KanbanTaskType>("education");
  const [priority, setPriority] = useState<KanbanPriority>("high");

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={t("kanban.create.title")}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{t("common.actions.cancel")}</Button>
          <Button onClick={onClose}>{t("kanban.actions.createTask")}</Button>
        </>
      }
    >
      <div className="space-y-5">
        <Input label={t("kanban.fields.title")} placeholder={t("kanban.create.titlePlaceholder")} />
        <div>
          <Textarea label={t("common.labels.description")} placeholder={t("kanban.create.descriptionPlaceholder")} className="min-h-32" maxLength={1000} />
          <div className="mt-1 text-right text-xs text-text-muted">0 / 1000</div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TaskTypeSelect value={taskType} onChange={setTaskType} />
          <Select label={t("kanban.fields.assignee")} defaultValue="aizhan" options={[{ label: "Айжан Тулегенова", value: "aizhan" }, { label: "Гульнар К.", value: "gulnar" }]} />
          <Select label={t("kanban.fields.group")} defaultValue="jasmine" options={[{ label: "Жасмин", value: "jasmine" }, { label: "Солнышко", value: "sun" }]} />
          <Select label={t("kanban.fields.child")} defaultValue="alihan" options={[{ label: "Алихан Р.", value: "alihan" }, { label: "Не привязан", value: "none" }]} />
          <Input label={t("kanban.fields.deadline")} type="date" />
          <PrioritySelect value={priority} onChange={setPriority} />
        </div>
      </div>
    </Modal>
  );
}

export function ReadTaskModal({ task, onClose }: { task: KanbanTask | null; onClose: () => void }) {
  const { t } = useI18n();

  return (
    <Modal
      open={Boolean(task)}
      onOpenChange={(open) => !open && onClose()}
      title={task?.title ?? t("kanban.read.title")}
      description={t("kanban.read.subtitle")}
      size="lg"
    >
      {task ? (
        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="icon" aria-label={t("common.actions.edit")}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="danger" size="icon" aria-label={t("common.actions.delete")}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 rounded-card border border-border bg-page/35 p-4 md:grid-cols-3">
            <ReadChip icon={<BookOpen className="h-5 w-5" />} label={t("kanban.fields.type")} value={t(`kanban.types.${task.type}`)} variant={typeVariant[task.type]} />
            <ReadChip icon={<Flag className={cn("h-5 w-5", priorityFlagClass[task.priority])} />} label={t("kanban.fields.priority")} value={t(`kanban.priority.${task.priority}`)} variant={priorityVariant[task.priority]} />
            <ReadChip icon={<Timer className="h-5 w-5" />} label={t("kanban.fields.status")} value={t(`kanban.columns.${task.status}`)} variant={task.status === "done" ? "success" : task.status === "review" ? "purple" : "warning"} />
          </div>

          <Card>
            <CardContent>
              <div className="text-sm font-semibold text-text-primary">{t("common.labels.description")}</div>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{task.description}</p>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-3">
                <ReadLine label={t("kanban.fields.assignee")} value={task.assignee} />
                <ReadLine label={t("kanban.fields.group")} value={task.group} />
                <ReadLine label={t("kanban.fields.child")} value={task.child} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3">
                <ReadLine label={t("kanban.fields.deadline")} value={task.dueDate} />
                <ReadLine label={t("kanban.fields.time")} value={task.timeInStatus ?? "1 д 4 ч"} />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
                {t("kanban.read.comments")} <Badge variant="info">{task.comments}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  {task.assignee.split(" ").map((part) => part[0]).join("")}
                </div>
                <Input placeholder={t("kanban.read.commentPlaceholder")} />
                <Button variant="outline" size="icon" aria-label={t("kanban.read.attach")}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="icon" aria-label={t("kanban.read.sendComment")}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 divide-y divide-border rounded-input border border-border">
                {[
                  ["Марина Л.", "16 мая 2026 в 10:23", "Не забудьте добавить карточки с новыми словами по теме."],
                  [task.assignee, "16 мая 2026 в 11:05", "Хорошо, добавлю. Также подготовлю новую дидактическую игру."],
                  ["Алия С.", "16 мая 2026 в 11:47", "Отлично! Если потребуется помощь с распечаткой, обращайтесь."],
                ].map(([author, date, comment]) => (
                  <div key={`${author}-${date}`} className="p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-text-primary">{author}</span>
                      <span className="text-xs text-text-muted">· {date}</span>
                    </div>
                    <p className="mt-1 text-text-secondary">{comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
                {t("kanban.fields.logs")} <Badge variant="info">{task.logs}</Badge>
              </div>
              <div className="space-y-3">
                {[
                  t("kanban.read.logCreated"),
                  t("kanban.read.logAssigned", { name: task.assignee }),
                  t("kanban.read.logMoved", { status: t(`kanban.columns.${task.status}`) }),
                  t("kanban.read.logComment"),
                ].map((log, index) => (
                  <div key={log} className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-bg text-purple-text">
                      {index === 0 ? <Plus className="h-4 w-4" /> : index === 1 ? <UserRound className="h-4 w-4" /> : index === 2 ? <Timer className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
                    </div>
                    <span className="font-medium text-text-secondary">{log}</span>
                    <span className="text-xs text-text-muted">16 мая 2026 в 09:{12 + index * 3}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </Modal>
  );
}

function ReadChip({ icon, label, value, variant }: { icon: ReactNode; label: string; value: string; variant: "info" | "success" | "warning" | "danger" | "purple" }) {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4 md:last:border-r-0">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-page text-primary">{icon}</div>
      <div>
        <div className="text-xs font-medium text-text-muted">{label}</div>
        <StatusBadge status={variant} className="mt-1">{value}</StatusBadge>
      </div>
    </div>
  );
}

function ReadLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm font-semibold text-text-primary">{value}</span>
    </div>
  );
}

function TaskTypeSelect({ value, onChange }: { value: KanbanTaskType; onChange: (value: KanbanTaskType) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const options: KanbanTaskType[] = ["education", "organization", "parents", "observation"];

  return (
    <RichSelectShell
      label={t("kanban.fields.type")}
      open={open}
      onOpenChange={setOpen}
      valueNode={
        <>
          <span className={cn("h-2.5 w-2.5 rounded-full", typeDotClass[value])} />
          {t(`kanban.types.${value}`)}
        </>
      }
    >
      {options.map((type) => (
        <button
          key={type}
          type="button"
          className={cn("flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-page", value === type && "bg-primary-soft text-primary")}
          onClick={() => {
            onChange(type);
            setOpen(false);
          }}
        >
          <span className={cn("h-2.5 w-2.5 rounded-full", typeDotClass[type])} />
          {t(`kanban.types.${type}`)}
        </button>
      ))}
    </RichSelectShell>
  );
}

function PrioritySelect({ value, onChange }: { value: KanbanPriority; onChange: (value: KanbanPriority) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const options: KanbanPriority[] = ["low", "medium", "high"];

  return (
    <RichSelectShell
      label={t("kanban.fields.priority")}
      open={open}
      onOpenChange={setOpen}
      valueNode={
        <>
          <Flag className={cn("h-4 w-4", priorityFlagClass[value])} />
          {t(`kanban.priority.${value}`)}
        </>
      }
    >
      {options.map((priority) => (
        <button
          key={priority}
          type="button"
          className={cn("flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium text-text-primary hover:bg-page", value === priority && "bg-primary-soft text-primary")}
          onClick={() => {
            onChange(priority);
            setOpen(false);
          }}
        >
          <Flag className={cn("h-4 w-4", priorityFlagClass[priority])} />
          {t(`kanban.priority.${priority}`)}
        </button>
      ))}
    </RichSelectShell>
  );
}

function RichSelectShell({
  label,
  open,
  onOpenChange,
  valueNode,
  children,
}: {
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  valueNode: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-text-secondary">{label}</label>
      <button
        type="button"
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-input border border-border bg-surface px-3 text-sm font-medium text-text-primary shadow-sm transition",
          "hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-soft",
        )}
        onClick={() => onOpenChange(!open)}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">{valueNode}</span>
        <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-input border border-border bg-surface shadow-dropdown">
          {children}
        </div>
      ) : null}
    </div>
  );
}
