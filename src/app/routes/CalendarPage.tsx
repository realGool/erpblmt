import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  MapPin,
  MoreVertical,
  Plus,
  Sun,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { AppShell, PageContainer, PageHeader } from "../../components/layout";
import type { SidebarNavigationKey } from "../../components/layout/Sidebar";
import {
  Badge,
  Button,
  Card,
  CardContent,
  FilterBar,
  Input,
  Modal,
  SearchField,
  Select,
  StatusBadge,
  Textarea,
} from "../../components/ui";
import {
  calendarEvents,
  calendarMonthDays,
  upcomingCalendarEvents,
  type CalendarEvent,
  type CalendarEventCategory,
} from "../../data/mockCalendar";
import { kanbanTasks as kanbanBoardTasks, type KanbanColumnId, type KanbanTask } from "../../data/mockKanban";
import { useI18n } from "../../i18n";
import { cn } from "../../lib/cn";
import { ReadTaskModal } from "./KanbanPage";

interface CalendarPageProps {
  onNavigate?: (key: SidebarNavigationKey) => void;
}

const categoryClasses: Record<CalendarEventCategory, { dot: string; surface: string; text: string; badge: "info" | "purple" | "success" | "warning" | "danger" }> = {
  education: { dot: "bg-primary", surface: "bg-primary-soft", text: "text-primary", badge: "info" },
  meeting: { dot: "bg-purple-text", surface: "bg-purple-bg/55", text: "text-purple-text", badge: "purple" },
  task: { dot: "bg-success-text", surface: "bg-success-bg/65", text: "text-success-text", badge: "success" },
  admin: { dot: "bg-warning-text", surface: "bg-warning-bg/65", text: "text-warning-text", badge: "warning" },
  holiday: { dot: "bg-danger-text", surface: "bg-danger-bg/70", text: "text-danger-text", badge: "danger" },
  communication: { dot: "bg-info-text", surface: "bg-info-bg/60", text: "text-info-text", badge: "info" },
};

const kanbanTaskStatusVariant: Record<KanbanColumnId, "info" | "warning" | "purple" | "success"> = {
  new: "info",
  inProgress: "warning",
  review: "warning",
  done: "success",
};

export function CalendarPage({ onNavigate }: CalendarPageProps) {
  const { t } = useI18n();
  const [selectedDay, setSelectedDay] = useState(22);
  const [viewMode, setViewMode] = useState("month");
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [readEvent, setReadEvent] = useState<CalendarEvent | null>(null);
  const [readKanbanTask, setReadKanbanTask] = useState<KanbanTask | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return calendarEvents.filter((event) => {
      const matchesSearch =
        !normalizedSearch ||
        event.title.toLocaleLowerCase().includes(normalizedSearch) ||
        event.description.toLocaleLowerCase().includes(normalizedSearch);
      const matchesEvent = eventFilter === "all" || event.category === eventFilter;
      const matchesEmployee = employeeFilter === "all" || event.responsibleName.toLocaleLowerCase().includes(employeeFilter);
      const matchesGroup = groupFilter === "all" || event.group.toLocaleLowerCase().includes(groupFilter);
      return matchesSearch && matchesEvent && matchesEmployee && matchesGroup;
    });
  }, [employeeFilter, eventFilter, groupFilter, search]);

  const eventsByDay = useMemo(() => {
    return filteredEvents.reduce<Record<number, CalendarEvent[]>>((acc, event) => {
      acc[event.day] = [...(acc[event.day] ?? []), event];
      return acc;
    }, {});
  }, [filteredEvents]);

  const selectedEvents = eventsByDay[selectedDay] ?? [];

  return (
    <AppShell activeNavigation="employeeCalendar" onNavigate={onNavigate}>
      <PageContainer>
        <PageHeader
          title={t("calendar.page.title")}
          description={t("calendar.page.description")}
          breadcrumbs={[{ label: t("navigation.home"), href: "#" }, { label: t("navigation.calendar") }]}
          actions={
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
              {t("calendar.actions.addEvent")}
            </Button>
          }
        />

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <Card>
              <CardContent>
                <FilterBar
                  left={
                    <>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="icon" aria-label={t("common.actions.previous")}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" aria-label={t("common.actions.next")}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" rightIcon={<CalendarDays className="h-4 w-4" />}>
                          {t("calendar.month.current")}
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {["month", "week", "list"].map((mode) => (
                          <Button
                            key={mode}
                            variant={viewMode === mode ? "primary" : "outline"}
                            onClick={() => setViewMode(mode)}
                          >
                            {t(`calendar.view.${mode}`)}
                          </Button>
                        ))}
                      </div>
                      <SearchField
                        className="min-w-72 flex-1"
                        aria-label={t("calendar.filters.search")}
                        placeholder={t("calendar.filters.search")}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                    </>
                  }
                  right={
                    <>
                  <Select
                    label={t("calendar.filters.allEvents")}
                    value={eventFilter}
                    onChange={(event) => setEventFilter(event.target.value)}
                    options={[
                      { label: t("calendar.filters.allEvents"), value: "all" },
                      { label: t("calendar.categories.education"), value: "education" },
                      { label: t("calendar.categories.task"), value: "task" },
                      { label: t("calendar.categories.holiday"), value: "holiday" },
                    ]}
                  />
                  <Select
                    label={t("calendar.filters.allEmployees")}
                    value={employeeFilter}
                    onChange={(event) => setEmployeeFilter(event.target.value)}
                    options={[
                      { label: t("calendar.filters.allEmployees"), value: "all" },
                      { label: "Иванова Анна Сергеевна", value: "иванова" },
                      { label: "Петрова Мария Ивановна", value: "петрова" },
                    ]}
                  />
                  <Select
                    label={t("calendar.filters.allGroups")}
                    value={groupFilter}
                    onChange={(event) => setGroupFilter(event.target.value)}
                    options={[
                      { label: t("calendar.filters.allGroups"), value: "all" },
                      { label: "Группа «Солнышко»", value: "солнышко" },
                      { label: "Группа «Радуга»", value: "радуга" },
                    ]}
                  />
                    </>
                  }
                />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
              <CalendarMetric icon={<CalendarDays className="h-6 w-6" />} value="45" label={t("calendar.stats.events")} tone="info" />
              <CalendarMetric icon={<CheckSquare className="h-6 w-6" />} value="32" label={t("calendar.stats.tasks")} tone="success" />
              <CalendarMetric icon={<Sun className="h-6 w-6" />} value="10" label={t("calendar.stats.daysOff")} tone="warning" />
              <CalendarMetric icon={<Bell className="h-6 w-6" />} value="6" label={t("calendar.stats.alerts")} tone="danger" />
            </div>

            <Card>
              <CardContent className="space-y-4">
                {viewMode === "month" ? (
                  <MonthCalendarGrid eventsByDay={eventsByDay} selectedDay={selectedDay} onDaySelect={setSelectedDay} onEventOpen={setReadEvent} />
                ) : null}
                {viewMode === "week" ? <WeekCalendarView events={filteredEvents} onEventOpen={setReadEvent} /> : null}
                {viewMode === "list" ? <ListCalendarView events={filteredEvents} onEventOpen={setReadEvent} /> : null}
                <p className="text-xs text-text-muted">{t("calendar.hints.dayClick")}</p>
              </CardContent>
            </Card>
          </div>

          <CalendarSidePanel
            selectedDay={selectedDay}
            events={selectedEvents}
            kanbanTasks={kanbanBoardTasks.slice(0, 3)}
            onEventOpen={setReadEvent}
            onKanbanTaskOpen={setReadKanbanTask}
            onClose={() => setSelectedDay(0)}
          />
        </div>

        <ReadEventModal event={readEvent} onClose={() => setReadEvent(null)} />
        <ReadTaskModal task={readKanbanTask} onClose={() => setReadKanbanTask(null)} />
        <AddEventModal open={addOpen} onClose={() => setAddOpen(false)} />
      </PageContainer>
    </AppShell>
  );
}

function CalendarMetric({
  icon,
  value,
  label,
  tone,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  tone: "info" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    info: "bg-info-bg text-info-text",
    success: "bg-success-bg text-success-text",
    warning: "bg-warning-bg text-warning-text",
    danger: "bg-danger-bg text-danger-text",
  }[tone];

  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-input", toneClass)}>{icon}</div>
        <div>
          <div className="text-2xl font-semibold text-text-primary">{value}</div>
          <div className="text-sm text-text-secondary">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function MonthCalendarGrid({
  eventsByDay,
  selectedDay,
  onDaySelect,
  onEventOpen,
}: {
  eventsByDay: Record<number, CalendarEvent[]>;
  selectedDay: number;
  onDaySelect: (day: number) => void;
  onEventOpen: (event: CalendarEvent) => void;
}) {
  const { t } = useI18n();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[860px]">
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-text-secondary">
          {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
            <div key={day} className={cn("pb-3", (day === "sat" || day === "sun") && "text-danger-text")}>
              {t(`calendar.weekdays.${day}`)}
            </div>
          ))}
        </div>

        <div className="grid overflow-hidden rounded-input border border-border md:grid-cols-7">
          {calendarMonthDays.map((day, index) => (
            <button
              key={`${day.day}-${index}`}
              type="button"
              className={cn(
                "min-h-[116px] border-b border-r border-border bg-surface p-3 text-left transition-colors hover:bg-page",
                "last:border-r-0 [&:nth-child(7n)]:border-r-0",
                day.weekend && "bg-danger-bg/15",
                day.selected && "ring-2 ring-inset ring-primary",
              )}
              onClick={() => onDaySelect(day.day)}
            >
              <div
                className={cn(
                  "mb-3 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-sm font-semibold",
                  day.muted ? "text-text-muted" : day.weekend ? "text-danger-text" : "text-text-primary",
                  selectedDay === day.day && "bg-primary text-text-inverse",
                )}
              >
                {day.day}
              </div>
              <div className="space-y-1.5">
                {(eventsByDay[day.day] ?? []).slice(0, 2).map((event) => (
                  <CalendarEventPill key={event.id} event={event} onClick={() => onEventOpen(event)} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeekCalendarView({ events, onEventOpen }: { events: CalendarEvent[]; onEventOpen: (event: CalendarEvent) => void }) {
  const { t } = useI18n();
  const weekDays = [18, 19, 20, 21, 22, 23, 24];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[820px] rounded-input border border-border">
        <div className="grid grid-cols-7 border-b border-border bg-page/50">
          {weekDays.map((day, index) => {
            const weekdayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
            return (
              <div key={day} className={cn("border-r border-border p-3 last:border-r-0", day === 22 && "bg-primary-soft")}>
                <div className="text-xs font-semibold text-text-muted">{t(`calendar.weekdays.${weekdayKeys[index]}`)}</div>
                <div className={cn("mt-1 text-lg font-semibold text-text-primary", day === 22 && "text-primary")}>{day}</div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7">
          {weekDays.map((day) => (
            <div key={day} className={cn("min-h-[360px] border-r border-border p-3 last:border-r-0", day === 22 && "bg-primary-soft/30")}>
              <div className="space-y-2">
                {events.filter((event) => event.day === day).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className={cn("w-full rounded-input p-3 text-left shadow-card transition-colors hover:opacity-90", categoryClasses[event.category].surface)}
                    onClick={() => onEventOpen(event)}
                  >
                    <div className={cn("text-xs font-semibold", categoryClasses[event.category].text)}>{event.timeFrom} – {event.timeTo}</div>
                    <div className="mt-1 text-sm font-semibold text-text-primary">{event.title}</div>
                    <div className="mt-1 text-xs text-text-secondary">{event.group}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListCalendarView({ events, onEventOpen }: { events: CalendarEvent[]; onEventOpen: (event: CalendarEvent) => void }) {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      {events
        .slice()
        .sort((a, b) => a.day - b.day)
        .map((event) => (
          <button
            key={event.id}
            type="button"
            className="grid w-full gap-4 rounded-card border border-border bg-surface p-4 text-left shadow-card transition-colors hover:bg-page md:grid-cols-[88px_minmax(0,1fr)_180px]"
            onClick={() => onEventOpen(event)}
          >
            <div>
              <div className={cn("text-lg font-semibold", categoryClasses[event.category].text)}>{event.day}</div>
              <div className="text-xs font-medium text-text-muted">{t("calendar.month.current")}</div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", categoryClasses[event.category].dot)} />
                <div className="font-semibold text-text-primary">{event.title}</div>
                <Badge variant={categoryClasses[event.category].badge}>{t(`calendar.categories.${event.category}`)}</Badge>
              </div>
              <div className="mt-2 text-sm text-text-secondary">{event.description}</div>
            </div>
            <div className="space-y-2 text-sm font-medium text-text-secondary">
              <EventMeta icon={<Clock3 className="h-4 w-4" />} text={`${event.timeFrom} – ${event.timeTo}`} />
              <EventMeta icon={<UserRound className="h-4 w-4" />} text={event.responsibleName} />
            </div>
          </button>
        ))}
    </div>
  );
}

function CalendarEventPill({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const styles = categoryClasses[event.category];

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn("rounded-[6px] px-2 py-1 text-xs font-semibold", styles.surface, styles.text)}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onClick();
      }}
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === "Enter") onClick();
      }}
    >
      <span className={cn("mr-1 inline-block h-2 w-2 rounded-full", styles.dot)} />
      {event.title}
    </div>
  );
}

function CalendarSidePanel({
  selectedDay,
  events,
  kanbanTasks,
  onEventOpen,
  onKanbanTaskOpen,
  onClose,
}: {
  selectedDay: number;
  events: CalendarEvent[];
  kanbanTasks: KanbanTask[];
  onEventOpen: (event: CalendarEvent) => void;
  onKanbanTaskOpen: (task: KanbanTask) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();

  return (
    <Card className="h-fit">
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-card-title text-text-primary">{t("calendar.side.title", { day: selectedDay || 22 })}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
              {t("calendar.side.events")} <Badge variant="purple">{events.length || 2}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label={t("common.actions.close")} onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {(events.length ? events : calendarEvents.slice(0, 2)).map((event) => (
            <button
              key={event.id}
              type="button"
              className="w-full rounded-card border border-border bg-surface p-4 text-left shadow-card transition-colors hover:bg-page"
              onClick={() => onEventOpen(event)}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <span className={cn("h-2.5 w-2.5 rounded-full", categoryClasses[event.category].dot)} />
                  {event.title}
                </div>
                <MoreVertical className="h-4 w-4 text-text-muted" />
              </div>
              <EventMeta icon={<Clock3 className="h-4 w-4" />} text={`${event.timeFrom} – ${event.timeTo}`} />
              <EventMeta icon={<MapPin className="h-4 w-4" />} text={event.group} />
              <EventMeta icon={<UserRound className="h-4 w-4" />} text={event.responsibleName} />
            </button>
          ))}
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
            {t("calendar.side.kanbanTasks")} <Badge variant="purple">{kanbanTasks.length}</Badge>
          </div>
          <div className="space-y-3">
            {kanbanTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                className="w-full rounded-card border border-border bg-surface p-4 text-left shadow-card transition-colors hover:bg-page"
                onClick={() => onKanbanTaskOpen(task)}
              >
                <div className="flex items-start gap-3">
                  <CheckSquare className={cn("mt-0.5 h-4 w-4", kanbanTaskStatusVariant[task.status] === "success" ? "text-success-text" : "text-primary")} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-text-primary">{task.title}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={kanbanTaskStatusVariant[task.status]}>{t(`kanban.columns.${task.status}`)}</StatusBadge>
                      <span className="text-xs text-text-muted">{task.assignee}</span>
                    </div>
                    <div className="mt-2 text-xs text-text-muted">{t("calendar.side.deadline", { date: task.dueDate })}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
            {t("calendar.side.upcoming")} <Badge variant="purple">{upcomingCalendarEvents.length}</Badge>
          </div>
          <div className="space-y-2 rounded-card border border-border p-3">
            {upcomingCalendarEvents.map((event) => (
              <div key={event.id} className="grid grid-cols-[70px_minmax(0,1fr)] gap-3 border-b border-border py-2 last:border-b-0">
                <div className={cn("text-sm font-semibold", categoryClasses[event.category].text)}>{event.dateLabel}</div>
                <div className="text-sm font-medium text-text-primary">{event.title}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventMeta({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-xs font-medium text-text-secondary">
      {icon}
      {text}
    </div>
  );
}

function ReadEventModal({ event, onClose }: { event: CalendarEvent | null; onClose: () => void }) {
  const { t } = useI18n();

  return (
    <Modal
      open={Boolean(event)}
      onOpenChange={(open) => !open && onClose()}
      title={event?.title ?? t("calendar.read.title")}
      size="lg"
    >
      {event ? (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-card border border-border bg-page/45 p-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-3">
              <Badge variant={categoryClasses[event.category].badge}>{t(`calendar.categories.${event.category}`)}</Badge>
              <p className="max-w-3xl text-sm leading-6 text-text-secondary">{event.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" aria-label={t("common.actions.edit")}>
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button variant="danger" size="icon" aria-label={t("common.actions.delete")}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReadSummaryTile icon={<CalendarDays className="h-5 w-5" />} label={t("calendar.form.date")} value={`01.05.2026`} />
            <ReadSummaryTile icon={<Clock3 className="h-5 w-5" />} label={t("calendar.read.time")} value={`${event.timeFrom} – ${event.timeTo}`} />
            <ReadSummaryTile icon={<MapPin className="h-5 w-5" />} label={t("calendar.form.group")} value={event.group} />
            <ReadSummaryTile icon={<UserRound className="h-5 w-5" />} label={t("calendar.form.responsible")} value={event.responsibleName} />
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="divide-y divide-border rounded-card border border-border">
              <ReadRow label={t("calendar.form.title")} value={event.title} />
              <ReadRow label={t("common.labels.description")} value={event.description} multiline />
              <ReadRow label={t("calendar.form.dayOff")} value={event.isDayOff ? t("common.options.yes") : t("common.options.no")} />
              <ReadRow label={t("calendar.form.yearlyRepeat")} value={event.repeatsYearly ? t("common.options.yes") : t("common.options.no")} />
              <ReadRow
                label={t("calendar.form.kanbanLink")}
                value={
                  <div className="flex flex-col gap-3 rounded-input border border-purple-bg bg-purple-bg/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-medium text-text-primary">{t("calendar.read.kanbanCreated")}</div>
                    <Badge variant="purple">{t("calendar.read.taskNumber", { number: event.kanbanTaskId })}</Badge>
                  </div>
                }
              />
            </div>

            <div className="h-fit rounded-card border border-border p-4">
              <div className="text-sm font-semibold text-text-primary">{t("calendar.read.responsibleCard")}</div>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                  {event.responsibleName.split(" ").slice(0, 2).map((part) => part[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-text-primary">{event.responsibleName}</div>
                  <div className="text-sm text-text-muted">{event.responsibleRole}</div>
                </div>
              </div>
              <div className="mt-4 rounded-input border border-border bg-page p-3 text-xs font-medium text-text-secondary">
                {t("calendar.read.responsibleHint")}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function AddEventModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState<CalendarEventCategory>("holiday");
  const [responsible, setResponsible] = useState("Иванова Анна Сергеевна");
  const [dayOff, setDayOff] = useState("yes");
  const [yearly, setYearly] = useState("yes");

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
      title={t("calendar.add.title")}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t("common.actions.cancel")}
          </Button>
          <Button onClick={onClose}>{t("common.actions.save")}</Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <ModalSection title={t("calendar.add.sections.main")} description={t("calendar.add.sections.mainDescription")}>
            <Input
              label={t("calendar.form.title")}
              placeholder={t("calendar.form.titlePlaceholder")}
              value={eventTitle}
              onChange={(event) => setEventTitle(event.target.value)}
            />
            <Select
              label={t("calendar.form.category")}
              value={eventCategory}
              onChange={(event) => setEventCategory(event.target.value as CalendarEventCategory)}
              options={[
                { label: t("calendar.categories.education"), value: "education" },
                { label: t("calendar.categories.meeting"), value: "meeting" },
                { label: t("calendar.categories.task"), value: "task" },
                { label: t("calendar.categories.admin"), value: "admin" },
                { label: t("calendar.categories.holiday"), value: "holiday" },
              ]}
            />
            <Textarea label={t("common.labels.description")} placeholder={t("calendar.form.descriptionPlaceholder")} className="min-h-24" />
          </ModalSection>

          <ModalSection title={t("calendar.add.sections.schedule")} description={t("calendar.add.sections.scheduleDescription")}>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <Input label={t("calendar.form.from")} type="datetime-local" />
              <div className="hidden pt-6 text-text-muted sm:block">–</div>
              <Input label={t("calendar.form.to")} type="datetime-local" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SegmentedField label={t("calendar.form.dayOff")} value={dayOff} onChange={setDayOff} />
              <SegmentedField label={t("calendar.form.yearlyRepeat")} value={yearly} onChange={setYearly} />
            </div>
          </ModalSection>

          <ModalSection title={t("calendar.add.sections.ownership")} description={t("calendar.add.sections.ownershipDescription")}>
            <Select
              label={t("calendar.form.group")}
              defaultValue="all"
              options={[
                { label: t("calendar.filters.allGroups"), value: "all" },
                { label: "Группа «Солнышко»", value: "sun" },
                { label: "Группа «Радуга»", value: "rainbow" },
              ]}
            />
            <Select
              label={t("calendar.form.responsible")}
              value={responsible}
              onChange={(event) => setResponsible(event.target.value)}
              options={[
                { label: "Иванова Анна Сергеевна", value: "Иванова Анна Сергеевна" },
                { label: "Петрова Мария Ивановна", value: "Петрова Мария Ивановна" },
                { label: "Каримова Саида Алиевна", value: "Каримова Саида Алиевна" },
              ]}
            />
          </ModalSection>
        </div>

        <aside className="space-y-4">
          <div className="rounded-card border border-purple-bg bg-purple-bg/30 p-4">
            <div className="flex items-start gap-3">
              <CheckSquare className="mt-0.5 h-5 w-5 text-purple-text" />
              <div>
                <div className="text-sm font-semibold text-text-primary">{t("calendar.add.kanbanTitle")}</div>
                <p className="mt-2 text-xs leading-5 text-text-secondary">{t("calendar.add.responsibleHint")}</p>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-border p-4">
            <div className="text-sm font-semibold text-text-primary">{t("calendar.form.responsible")}</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {responsible.split(" ").slice(0, 2).map((part) => part[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-text-primary">{responsible}</div>
                <div className="text-xs text-text-muted">{t("calendar.add.assigneeRole")}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

function ModalSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-card border border-border p-4">
      <div className="mb-4">
        <div className="text-sm font-semibold text-text-primary">{title}</div>
        <div className="mt-1 text-xs leading-5 text-text-muted">{description}</div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ReadSummaryTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-card border border-border p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-text-primary">{value}</div>
    </div>
  );
}

function SegmentedField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const { t } = useI18n();

  return (
    <div>
      <div className="mb-2 text-sm font-medium text-text-secondary">{label}</div>
      <div className="grid grid-cols-2 overflow-hidden rounded-input border border-border">
        {["yes", "no"].map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              "h-10 border-r border-border text-sm font-semibold last:border-r-0",
              value === option ? "bg-primary-soft text-primary ring-1 ring-inset ring-primary" : "bg-surface text-text-secondary hover:bg-page",
            )}
            onClick={() => onChange(option)}
          >
            {t(`common.options.${option}`)}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReadRow({ label, value, multiline = false }: { label: string; value: ReactNode; multiline?: boolean }) {
  return (
    <div className={cn("grid gap-3 p-4 sm:grid-cols-[230px_minmax(0,1fr)]", multiline && "sm:items-start")}>
      <div className="text-sm font-medium text-text-secondary">{label}</div>
      <div className="text-sm font-medium leading-6 text-text-primary">{value}</div>
    </div>
  );
}

function ReadBox({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-text-secondary">{label}</div>
      <div className="flex h-11 items-center gap-2 rounded-input border border-border bg-surface px-3 text-sm font-medium text-text-primary shadow-card">
        <span className="text-primary">{icon}</span>
        {value}
      </div>
    </div>
  );
}
