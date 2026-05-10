export type CalendarEventCategory = "education" | "meeting" | "task" | "admin" | "holiday" | "communication";
export type CalendarTaskStatus = "inProgress" | "review" | "done";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  day: number;
  timeFrom: string;
  timeTo: string;
  group: string;
  responsibleName: string;
  responsibleRole: string;
  isDayOff: boolean;
  repeatsYearly: boolean;
  category: CalendarEventCategory;
  kanbanTaskId: string;
}

export interface CalendarTask {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: CalendarTaskStatus;
}

export interface UpcomingCalendarEvent {
  id: string;
  dateLabel: string;
  title: string;
  category: CalendarEventCategory;
}

export interface CalendarMonthDay {
  day: number;
  muted?: boolean;
  weekend?: boolean;
  selected?: boolean;
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: "event-development-check",
    title: "Проверка карты развития",
    description: "Методист проверяет заполнение карты развития по текущему циклу наблюдения.",
    day: 22,
    timeFrom: "10:00",
    timeTo: "11:30",
    group: "Группа «Солнышко»",
    responsibleName: "Иванова Анна Сергеевна",
    responsibleRole: "Воспитатель",
    isDayOff: false,
    repeatsYearly: false,
    category: "task",
    kanbanTaskId: "#1258",
  },
  {
    id: "event-bilimtoy-class",
    title: "Занятие Bilimtoy",
    description: "Плановое групповое занятие с образовательными играми Bilimtoy.",
    day: 22,
    timeFrom: "15:00",
    timeTo: "16:00",
    group: "Группа «Звёздочка»",
    responsibleName: "Петрова Мария Ивановна",
    responsibleRole: "Психолог",
    isDayOff: false,
    repeatsYearly: false,
    category: "education",
    kanbanTaskId: "#1260",
  },
  {
    id: "event-children-day",
    title: "День защиты детей",
    description: "Праздничное мероприятие для детей всех групп с играми, конкурсами, музыкальной программой и вручением подарков.",
    day: 25,
    timeFrom: "09:00",
    timeTo: "13:00",
    group: "Все группы",
    responsibleName: "Мария Иванова",
    responsibleRole: "Воспитатель",
    isDayOff: false,
    repeatsYearly: true,
    category: "holiday",
    kanbanTaskId: "#1258",
  },
  {
    id: "event-parent-meeting",
    title: "Родительское собрание",
    description: "Собрание родителей по итогам месяца и плану мероприятий на июнь.",
    day: 27,
    timeFrom: "17:00",
    timeTo: "18:00",
    group: "Группа «Радуга»",
    responsibleName: "Каримова Саида Алиевна",
    responsibleRole: "Руководитель",
    isDayOff: false,
    repeatsYearly: false,
    category: "meeting",
    kanbanTaskId: "#1264",
  },
  {
    id: "event-inventory",
    title: "Инвентаризация ресурсов",
    description: "Проверка списка ресурсов и подготовка заявки на закупки.",
    day: 21,
    timeFrom: "12:00",
    timeTo: "13:00",
    group: "Администрация",
    responsibleName: "Турсунова Шахзода Бахромовна",
    responsibleRole: "Администратор",
    isDayOff: false,
    repeatsYearly: false,
    category: "admin",
    kanbanTaskId: "#1265",
  },
];

export const calendarTasks: CalendarTask[] = [
  {
    id: "task-attendance-report",
    title: "Подготовить отчёт по посещаемости за май",
    assignee: "Саида Каримова",
    dueDate: "23.05.2026",
    status: "inProgress",
  },
  {
    id: "task-june-plan",
    title: "Обновить план работы на июнь",
    assignee: "Мария Петрова",
    dueDate: "25.05.2026",
    status: "review",
  },
  {
    id: "task-parent-tickets",
    title: "Ответить на обращения родителей",
    assignee: "Анна Иванова",
    dueDate: "22.05.2026",
    status: "done",
  },
];

export const upcomingCalendarEvents: UpcomingCalendarEvent[] = [
  { id: "upcoming-children-day", dateLabel: "25 мая", title: "Праздник: День защиты детей", category: "holiday" },
  { id: "upcoming-parent-meeting", dateLabel: "27 мая", title: "Родительское собрание (Группа «Радуга»)", category: "meeting" },
  { id: "upcoming-inventory", dateLabel: "1 июня", title: "Инвентаризация ресурсов", category: "admin" },
];

export const calendarMonthDays: CalendarMonthDay[] = [
  { day: 27, muted: true },
  { day: 28, muted: true },
  { day: 29, muted: true },
  { day: 30, muted: true },
  { day: 1 },
  { day: 2, weekend: true },
  { day: 3, weekend: true },
  { day: 4 },
  { day: 5 },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9, weekend: true },
  { day: 10, weekend: true },
  { day: 11 },
  { day: 12 },
  { day: 13 },
  { day: 14 },
  { day: 15 },
  { day: 16, weekend: true },
  { day: 17, weekend: true },
  { day: 18 },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22, selected: true },
  { day: 23, weekend: true },
  { day: 24, weekend: true },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30, weekend: true },
  { day: 31, weekend: true },
];
