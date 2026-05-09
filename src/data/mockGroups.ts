import type { NicuValue } from "../components/ui";

export type GroupStatus = "active" | "pending" | "closed";

export interface GroupDevelopment {
  physical: NicuValue;
  social: NicuValue;
  speech: NicuValue;
  cognitive: NicuValue;
  creative: NicuValue;
}

export interface GroupRecord {
  id: string;
  name: string;
  ageCategory: string;
  direction: string;
  teacher: string;
  childrenCount: number;
  status: GroupStatus;
  createdAt: string;
  description: string;
  learningProgram: string;
  branchName: string;
  room: string;
  development: GroupDevelopment;
}

export interface GroupTeacher {
  id: string;
  fullName: string;
  role: string;
  phone: string;
  initials: string;
}

export interface GroupAttendanceSummary {
  totalChildren: number;
  presentToday: number;
  absentToday: number;
}

export interface GroupLearningProgram {
  monthTheme: string;
  weekTheme: string;
  todayPlan: string;
  weekGames: string[];
}

export interface GroupFinanceSummary {
  income: string;
  expected: string;
  progress: number;
  paid: number;
  pending: number;
  overdue: number;
}

export interface GroupChatSummary {
  participants: number;
  newMessages: number;
  lastActivity: string;
}

export type ParentTicketStatus = "new" | "inProgress" | "resolved";

export interface ParentTicket {
  id: string;
  subject: string;
  parentName: string;
  sentAt: string;
  status: ParentTicketStatus;
}

export type AttendanceStatus = "present" | "absent";

export interface GroupChild {
  rowNumber: number;
  fullName: string;
  age: string;
  parentName: string;
  attendanceStatus: AttendanceStatus;
  development: GroupDevelopment;
}

export interface GroupDetail extends GroupRecord {
  teachers: GroupTeacher[];
  attendance: GroupAttendanceSummary;
  learning: GroupLearningProgram;
  finance: GroupFinanceSummary;
  chat: GroupChatSummary;
  tickets: ParentTicket[];
  children: GroupChild[];
  detailDevelopmentStats: Array<{ area: (typeof groupDevelopmentAreas)[number]; value: NicuValue }>;
}

export const groupDevelopmentAreas = ["physical", "social", "speech", "cognitive", "creative"] as const;

export const developmentStats: Array<{ area: (typeof groupDevelopmentAreas)[number]; value: NicuValue }> = [
  { area: "physical", value: { n: 10, i: 5, ch: 80, u: 5 } },
  { area: "social", value: { n: 5, i: 20, ch: 65, u: 10 } },
  { area: "speech", value: { n: 25, i: 60, ch: 5, u: 10 } },
  { area: "cognitive", value: { n: 3, i: 12, ch: 73, u: 12 } },
  { area: "creative", value: { n: 5, i: 50, ch: 0, u: 45 } },
];

export const mockGroups: GroupRecord[] = [
  {
    id: "GRP-01",
    name: "Жасмин",
    ageCategory: "Младшая",
    direction: "Общеразвивающая",
    teacher: "Саидова Н. А., Ибрагимова М. Д.",
    childrenCount: 24,
    status: "active",
    createdAt: "15.02.2026",
    description: "Общеразвивающая стандартная группа по Дастуру",
    learningProgram: "Дастур",
    branchName: "Bilimtoy Kids Yunusobod",
    room: "Кабинет 204",
    development: {
      physical: { n: 6, i: 17, ch: 46, u: 31 },
      social: { n: 7, i: 19, ch: 44, u: 30 },
      speech: { n: 8, i: 22, ch: 43, u: 27 },
      cognitive: { n: 6, i: 18, ch: 47, u: 29 },
      creative: { n: 9, i: 21, ch: 41, u: 29 },
    },
  },
  {
    id: "GRP-02",
    name: "Юлдуз",
    ageCategory: "Ясельная",
    direction: "Инклюзивная",
    teacher: "Хасанова Д. Р., Назарова С. К.",
    childrenCount: 18,
    status: "active",
    createdAt: "16.02.2026",
    description: "Инклюзивная группа раннего развития",
    learningProgram: "Дастур",
    branchName: "Bilimtoy Kids Chilonzor",
    room: "Кабинет 105",
    development: {
      physical: { n: 8, i: 20, ch: 45, u: 27 },
      social: { n: 9, i: 21, ch: 43, u: 27 },
      speech: { n: 11, i: 23, ch: 40, u: 26 },
      cognitive: { n: 8, i: 20, ch: 45, u: 27 },
      creative: { n: 10, i: 22, ch: 42, u: 26 },
    },
  },
  {
    id: "GRP-03",
    name: "Гулбахор",
    ageCategory: "Средняя",
    direction: "Комбинированная",
    teacher: "Курбанова Л. Т.",
    childrenCount: 26,
    status: "active",
    createdAt: "17.02.2026",
    description: "Комбинированная группа с расширенной программой",
    learningProgram: "Дастур",
    branchName: "Bilimtoy Kids Mirzo-Ulugbek",
    room: "Кабинет 302",
    development: {
      physical: { n: 7, i: 18, ch: 46, u: 29 },
      social: { n: 8, i: 20, ch: 45, u: 27 },
      speech: { n: 9, i: 21, ch: 43, u: 27 },
      cognitive: { n: 7, i: 19, ch: 47, u: 27 },
      creative: { n: 9, i: 20, ch: 43, u: 28 },
    },
  },
  {
    id: "GRP-04",
    name: "Шарк",
    ageCategory: "Старшая",
    direction: "Общеразвивающая",
    teacher: "Алимова Г. Б., Турсунова М. Ш.",
    childrenCount: 24,
    status: "active",
    createdAt: "18.02.2026",
    description: "Старшая общеразвивающая группа",
    learningProgram: "Дастур",
    branchName: "Bilimtoy Kids Sergeli",
    room: "Кабинет 211",
    development: {
      physical: { n: 6, i: 16, ch: 47, u: 31 },
      social: { n: 7, i: 18, ch: 46, u: 29 },
      speech: { n: 8, i: 20, ch: 44, u: 28 },
      cognitive: { n: 6, i: 17, ch: 48, u: 29 },
      creative: { n: 8, i: 19, ch: 44, u: 29 },
    },
  },
  {
    id: "GRP-05",
    name: "Зафар",
    ageCategory: "Подготовительная",
    direction: "Специализированная",
    teacher: "Мирзаева С. И.",
    childrenCount: 22,
    status: "pending",
    createdAt: "19.02.2026",
    description: "Подготовительная специализированная группа",
    learningProgram: "Дастур",
    branchName: "Bilimtoy Kids Yakkasaroy",
    room: "Кабинет 118",
    development: {
      physical: { n: 5, i: 15, ch: 50, u: 30 },
      social: { n: 6, i: 16, ch: 48, u: 30 },
      speech: { n: 7, i: 18, ch: 45, u: 30 },
      cognitive: { n: 5, i: 15, ch: 50, u: 30 },
      creative: { n: 7, i: 17, ch: 48, u: 28 },
    },
  },
  {
    id: "GRP-06",
    name: "Навбахор",
    ageCategory: "Средняя",
    direction: "Инклюзивная",
    teacher: "Юсупова Н. Ф., Каримова Д. А.",
    childrenCount: 20,
    status: "closed",
    createdAt: "20.02.2026",
    description: "Средняя инклюзивная группа",
    learningProgram: "Дастур",
    branchName: "Bilimtoy Kids Yunusobod",
    room: "Кабинет 207",
    development: {
      physical: { n: 9, i: 21, ch: 44, u: 26 },
      social: { n: 10, i: 22, ch: 42, u: 26 },
      speech: { n: 11, i: 23, ch: 41, u: 25 },
      cognitive: { n: 8, i: 20, ch: 44, u: 28 },
      creative: { n: 10, i: 21, ch: 46, u: 23 },
    },
  },
];

const jasmine = mockGroups[0];

export const mockGroupDetail: GroupDetail = {
  ...jasmine,
  teachers: [
    {
      id: "teacher-saidova",
      fullName: "Саидова Н. А.",
      role: "Воспитатель",
      phone: "+998 90 555 11 22",
      initials: "СН",
    },
    {
      id: "teacher-ibragimova",
      fullName: "Ибрагимова М. Д.",
      role: "Воспитатель",
      phone: "+998 90 555 11 23",
      initials: "ИМ",
    },
  ],
  attendance: {
    totalChildren: 24,
    presentToday: 18,
    absentToday: 6,
  },
  learning: {
    monthTheme: "Мир вокруг нас",
    weekTheme: "Домашние животные",
    todayPlan: "Наблюдение, беседа и игра по теме недели",
    weekGames: ["Кто где живёт?", "Найди пару", "Дом. животные", "Эмоции"],
  },
  finance: {
    income: "18 600 000 сум",
    expected: "24 000 000 сум",
    progress: 77.5,
    paid: 18,
    pending: 4,
    overdue: 2,
  },
  chat: {
    participants: 18,
    newMessages: 5,
    lastActivity: "10:45",
  },
  tickets: [
    {
      id: "#1257",
      subject: "Просьба предоставить фото с прогулки",
      parentName: "Маматова Д.",
      sentAt: "15.05.2026 10:30",
      status: "new",
    },
    {
      id: "#1256",
      subject: "Вопрос по питанию",
      parentName: "Рахимова А.",
      sentAt: "15.05.2026 09:12",
      status: "inProgress",
    },
    {
      id: "#1255",
      subject: "Уточнение по оплате",
      parentName: "Каримова С.",
      sentAt: "14.05.2026 16:45",
      status: "resolved",
    },
  ],
  children: [
    {
      rowNumber: 1,
      fullName: "Алиев Тимур",
      age: "4 года 2 мес.",
      parentName: "Алиева Рушана Ильдаровна",
      attendanceStatus: "present",
      development: jasmine.development,
    },
    {
      rowNumber: 2,
      fullName: "Иванова София",
      age: "4 года 5 мес.",
      parentName: "Иванова Ольга Сергеевна",
      attendanceStatus: "present",
      development: mockGroups[1].development,
    },
    {
      rowNumber: 3,
      fullName: "Петров Максим",
      age: "4 года 1 мес.",
      parentName: "Петров Алексей Сергеевич",
      attendanceStatus: "absent",
      development: mockGroups[2].development,
    },
    {
      rowNumber: 4,
      fullName: "Ким Амина",
      age: "4 года 3 мес.",
      parentName: "Ким Наталья Андреевна",
      attendanceStatus: "present",
      development: mockGroups[3].development,
    },
    {
      rowNumber: 5,
      fullName: "Юнусов Даниил",
      age: "4 года 0 мес.",
      parentName: "Юнусова Мадина Рустамовна",
      attendanceStatus: "present",
      development: mockGroups[4].development,
    },
    {
      rowNumber: 6,
      fullName: "Абдуллаева Малика",
      age: "4 года 6 мес.",
      parentName: "Абдуллаев Шохрух Бахтиёрович",
      attendanceStatus: "present",
      development: mockGroups[5].development,
    },
  ],
  detailDevelopmentStats: developmentStats,
};
