import type { ChildAttendanceStatus, ChildStatus, DevelopmentMetric } from "./mockChildren";

export type ParentStatus = "active" | "inactive" | "pending" | "blocked";
export type ParentPaymentStatus = "paid" | "pending" | "overdue" | "debt";
export type ParentRelation = "mother" | "father" | "grandmother" | "grandfather" | "guardian";
export type TicketStatus = "new" | "inProgress" | "waitingParent" | "closed";

export interface ParentLinkedChild {
  id: string;
  fullName: string;
  age: string;
  groupName: string;
  branchName: string;
  childStatus: ChildStatus;
  attendanceStatus: ChildAttendanceStatus;
  developmentMetrics: DevelopmentMetric[];
}

export interface ParentListRecord {
  id: string;
  fullName: string;
  phone: string;
  additionalPhone: string;
  email: string;
  relation: ParentRelation;
  children: ParentLinkedChild[];
  groupBranch: string;
  paymentStatus: ParentPaymentStatus;
  activeTickets: number;
  parentStatus: ParentStatus;
  addedAt: string;
  telegramEnabled: boolean;
  notificationStatus: "enabled" | "disabled";
}

export interface ParentPayment {
  id: string;
  childName: string;
  period: string;
  expected: string;
  paid: string;
  debt: string;
  status: ParentPaymentStatus;
  lastPayment: string;
}

export interface ParentTicket {
  id: string;
  subject: string;
  childName: string;
  createdAt: string;
  responsible: string;
  status: TicketStatus;
  description: string;
  messages: Array<{ author: string; role: string; dateTime: string; text: string; side?: "right" }>;
}

export interface ParentAnnouncement {
  id: string;
  title: string;
  dateTime: string;
  channel: string;
}

export interface ParentDocument {
  id: string;
  fileName: string;
  date: string;
}

export interface ParentActivity {
  id: string;
  dateTime: string;
  title: string;
  description: string;
}

export interface ParentProfile extends ParentListRecord {
  initials: string;
  workplace: string;
  address: string;
  payments: ParentPayment[];
  tickets: ParentTicket[];
  announcements: ParentAnnouncement[];
  documents: ParentDocument[];
  activity: ParentActivity[];
}

const childMetrics: DevelopmentMetric[] = [
  { area: "physical", value: 86 },
  { area: "social", value: 72 },
  { area: "speech", value: 74 },
  { area: "cognitive", value: 80 },
  { area: "creative", value: 88 },
];

const linkedChildren: ParentLinkedChild[] = [
  {
    id: "CH-000124",
    fullName: "Абдрахманов Алихан Ерланович",
    age: "4 года 2 мес.",
    groupName: "Солнышко",
    branchName: "Bilimtoy Kids Yunusobod",
    childStatus: "active",
    attendanceStatus: "present",
    developmentMetrics: childMetrics,
  },
  {
    id: "CH-000125",
    fullName: "Иванова Алина Сергеевна",
    age: "5 лет 1 мес.",
    groupName: "Звёздочки",
    branchName: "Bilimtoy Kids Yunusobod",
    childStatus: "active",
    attendanceStatus: "present",
    developmentMetrics: [
      { area: "physical", value: 92 },
      { area: "social", value: 81 },
      { area: "speech", value: 83 },
      { area: "cognitive", value: 86 },
      { area: "creative", value: 90 },
    ],
  },
];

export const mockParents: ParentListRecord[] = [
  {
    id: "PR-000487",
    fullName: "Иванова Светлана Сергеевна",
    phone: "+7 701 345 67 89",
    additionalPhone: "+7 700 222 33 44",
    email: "s.ivanova@example.com",
    relation: "mother",
    children: linkedChildren,
    groupBranch: "Солнышко / Bilimtoy Kids Yunusobod",
    paymentStatus: "paid",
    activeTickets: 2,
    parentStatus: "active",
    addedAt: "15.01.2024",
    telegramEnabled: true,
    notificationStatus: "enabled",
  },
  {
    id: "PR-000488",
    fullName: "Петров Александр Николаевич",
    phone: "+998 91 234-56-78",
    additionalPhone: "",
    email: "petrov@example.com",
    relation: "father",
    children: [linkedChildren[0]],
    groupBranch: "Солнышко / Bilimtoy Kids Yunusobod",
    paymentStatus: "pending",
    activeTickets: 1,
    parentStatus: "active",
    addedAt: "18.02.2024",
    telegramEnabled: true,
    notificationStatus: "enabled",
  },
  {
    id: "PR-000489",
    fullName: "Ходжаева Дилфуза Бахтиёровна",
    phone: "+998 93 345-67-89",
    additionalPhone: "",
    email: "d.hodjaeva@example.com",
    relation: "mother",
    children: [linkedChildren[1]],
    groupBranch: "Звёздочки / Bilimtoy Kids Chilonzor",
    paymentStatus: "debt",
    activeTickets: 3,
    parentStatus: "pending",
    addedAt: "03.03.2024",
    telegramEnabled: false,
    notificationStatus: "disabled",
  },
  {
    id: "PR-000490",
    fullName: "Ким Сергей Викторович",
    phone: "+998 94 456-78-90",
    additionalPhone: "",
    email: "kim@example.com",
    relation: "father",
    children: [linkedChildren[1]],
    groupBranch: "Звёздочки / Bilimtoy Kids Chilonzor",
    paymentStatus: "overdue",
    activeTickets: 0,
    parentStatus: "blocked",
    addedAt: "07.03.2024",
    telegramEnabled: true,
    notificationStatus: "enabled",
  },
];

export const mockParentProfile: ParentProfile = {
  ...mockParents[0],
  initials: "ИС",
  workplace: "ТОО «Bright Future», менеджер по персоналу",
  address: "Республика Казахстан, г. Алматы, мкр. Самал-2, д. 48, кв. 15",
  payments: [
    { id: "PAY-000789", childName: "Абдрахманов Алихан", period: "01.05.2026 – 31.05.2026", expected: "120 000 ₸", paid: "120 000 ₸", debt: "0 ₸", status: "paid", lastPayment: "18.05.2026" },
    { id: "PAY-000712", childName: "Абдрахманов Алихан", period: "01.04.2026 – 30.04.2026", expected: "120 000 ₸", paid: "120 000 ₸", debt: "0 ₸", status: "paid", lastPayment: "18.04.2026" },
    { id: "PAY-000531", childName: "Иванова Алина", period: "01.05.2026 – 31.05.2026", expected: "150 000 ₸", paid: "90 000 ₸", debt: "60 000 ₸", status: "debt", lastPayment: "10.05.2026" },
  ],
  tickets: [
    {
      id: "TCK-000321",
      subject: "Вопрос по питанию ребёнка",
      childName: "Абдрахманов Алихан",
      createdAt: "18.05.2026 10:27",
      responsible: "Мария Кузнецова",
      status: "inProgress",
      description: "У ребёнка пищевая аллергия. Хотела уточнить состав меню и возможность замены молочных блюд.",
      messages: [
        { author: "Иванова Светлана", role: "Родитель", dateTime: "18.05.2026 10:27", text: "Здравствуйте! Хотела уточнить меню на эту неделю." },
        { author: "Мария Кузнецова", role: "Администратор", dateTime: "18.05.2026 10:42", text: "Добрый день! Передала вопрос ответственному сотруднику.", side: "right" },
      ],
    },
    {
      id: "TCK-000287",
      subject: "Запрос справки о посещении",
      childName: "Иванова Алина",
      createdAt: "12.05.2026 09:18",
      responsible: "Саидова Н. А.",
      status: "closed",
      description: "Нужна справка о посещении за апрель.",
      messages: [{ author: "Иванова Светлана", role: "Родитель", dateTime: "12.05.2026 09:18", text: "Добрый день, нужна справка о посещении." }],
    },
    {
      id: "TCK-000254",
      subject: "Вопрос о занятиях по английскому",
      childName: "Абдрахманов Алихан",
      createdAt: "02.05.2026 16:44",
      responsible: "Ибрагимова М. Д.",
      status: "waitingParent",
      description: "Хотела уточнить расписание занятий по английскому.",
      messages: [{ author: "Ибрагимова М. Д.", role: "Воспитатель", dateTime: "02.05.2026 17:10", text: "Отправили расписание, ожидаем подтверждение.", side: "right" }],
    },
  ],
  announcements: [
    { id: "ann-1", title: "Родительское собрание в пятницу", dateTime: "Сегодня, 11:20", channel: "Telegram" },
    { id: "ann-2", title: "Экскурсия в парк", dateTime: "Вчера, 18:30", channel: "Telegram" },
  ],
  documents: [
    { id: "doc-1", fileName: "Договор с родителем.pdf", date: "15.01.2024" },
    { id: "doc-2", fileName: "Заявление на обработку данных.pdf", date: "15.01.2024" },
    { id: "doc-3", fileName: "Копия паспорта.pdf", date: "15.01.2024" },
  ],
  activity: [
    { id: "act-1", dateTime: "15.01.2024 09:10", title: "Создан родитель", description: "Профиль добавлен администратором" },
    { id: "act-2", dateTime: "15.01.2024 09:20", title: "Добавлен ребёнок", description: "Абдрахманов Алихан привязан к родителю" },
    { id: "act-3", dateTime: "18.05.2026 10:27", title: "Отправлено обращение", description: "Вопрос по питанию ребёнка" },
    { id: "act-4", dateTime: "18.05.2026 14:32", title: "Оплата зафиксирована", description: "Поступила оплата за май" },
  ],
};
