import type { NicuValue } from "../components/ui";

export type ChildStatus = "active" | "paused" | "expelled" | "graduate";
export type ChildAttendanceStatus = "present" | "absent";
export type DevelopmentAreaKey = "physical" | "social" | "speech" | "cognitive" | "creative";
export type NicuScore = "n" | "i" | "ch" | "u";
export type DataSourceType = "teacher" | "bilimtoy" | "combined" | "needsReview" | "confirmed";
export type SpecialistRole = "speechTherapist" | "psychologist" | "methodist";

export interface DevelopmentMetric {
  area: DevelopmentAreaKey;
  value: number;
}

export interface ChildListRecord {
  id: string;
  fullName: string;
  age: string;
  birthDate: string;
  teacher: string;
  parentName: string;
  attendanceStatus: ChildAttendanceStatus;
  attendanceDate: string;
  childStatus: ChildStatus;
  developmentMetrics: DevelopmentMetric[];
}

export interface RelatedAdult {
  id: string;
  fullName: string;
  relation: "mother" | "father" | "grandmother";
  phone: string;
  initials: string;
}

export interface ChildTeacher {
  id: string;
  fullName: string;
  phone: string;
}

export interface ChildDocument {
  id: string;
  fileName: string;
  date: string;
}

export interface BilimtoyMetric {
  id: string;
  labelKey: string;
  value: number;
  tone: "success" | "warning" | "danger";
}

export interface GameHistoryTopic {
  name: string;
  passedAt: string;
  score: number;
}

export interface GameHistoryGame {
  name: string;
  passedAt: string;
  score: number;
}

export interface GameHistoryCard {
  title: string;
  date: string;
  description: string;
}

export interface GameHistory {
  topicsCount: number;
  gamesCount: number;
  achievementsCount: number;
  certificatesCount: number;
  topics: GameHistoryTopic[];
  games: GameHistoryGame[];
  achievements: GameHistoryCard[];
  certificates: GameHistoryCard[];
}

export interface SpecialistComment {
  id: string;
  specialistName: string;
  role: SpecialistRole;
  dateTime: string;
  text: string;
  initials: string;
}

export interface DevelopmentCycleScore {
  score: NicuScore;
  source: DataSourceType;
}

export interface DevelopmentSubarea {
  id: string;
  area: DevelopmentAreaKey;
  name: string;
  primary: DevelopmentCycleScore;
  primaryGoal: string;
  intermediate: DevelopmentCycleScore;
  intermediateGoal: string;
  final: DevelopmentCycleScore;
  comment: string;
  recommendation: string;
  responsible: string[];
}

export interface DevelopmentJournalArea {
  area: DevelopmentAreaKey;
  subareas: DevelopmentSubarea[];
}

export interface DevelopmentDynamicsRow {
  area: DevelopmentAreaKey;
  observation1: number;
  observation2: number;
  observation3: number;
  dynamics: number;
}

export interface ChildProfile extends ChildListRecord {
  photoInitials: string;
  address: string;
  branchName: string;
  rowNumber: string;
  addedAt: string;
  bilimtoyCode: string;
  relatives: RelatedAdult[];
  group: {
    name: string;
    ageCategory: string;
    direction: string;
    teachers: ChildTeacher[];
  };
  tariff: {
    name: string;
    type: string;
    monthlyPrice: string;
    paymentStatus: "paid" | "pending";
  };
  documents: ChildDocument[];
  medical: {
    allergies: string;
    diseases: string;
    psychology: string;
  };
  bilimtoyMetrics: BilimtoyMetric[];
  gameHistory: GameHistory;
  specialistComments: SpecialistComment[];
  developmentJournal: DevelopmentJournalArea[];
  developmentDynamics: DevelopmentDynamicsRow[];
}

export const developmentAreas: DevelopmentAreaKey[] = ["physical", "social", "speech", "cognitive", "creative"];

const baseMetrics: DevelopmentMetric[] = [
  { area: "physical", value: 86 },
  { area: "social", value: 72 },
  { area: "speech", value: 74 },
  { area: "cognitive", value: 80 },
  { area: "creative", value: 88 },
];

export const mockChildren: ChildListRecord[] = [
  {
    id: "CH-000124",
    fullName: "Абдрахманов Алихан Ерланович",
    age: "4 года 2 мес.",
    birthDate: "18.02.2021",
    teacher: "Ким Н.А.",
    parentName: "Абдрахманова Айгерим Сериковна",
    attendanceStatus: "present",
    attendanceDate: "20.05.2026",
    childStatus: "active",
    developmentMetrics: baseMetrics,
  },
  {
    id: "CH-000125",
    fullName: "Адилжанова Аружан Мадиевна",
    age: "5 лет 1 мес.",
    birthDate: "02.04.2020",
    teacher: "Иванова О.С.",
    parentName: "Алимжанов Мади Бакитович",
    attendanceStatus: "present",
    attendanceDate: "20.05.2026",
    childStatus: "active",
    developmentMetrics: [
      { area: "physical", value: 92 },
      { area: "social", value: 81 },
      { area: "speech", value: 83 },
      { area: "cognitive", value: 86 },
      { area: "creative", value: 90 },
    ],
  },
  {
    id: "CH-000126",
    fullName: "Алиев Тимур Русланович",
    age: "4 года 0 мес.",
    birthDate: "20.05.2022",
    teacher: "Петров А.С.",
    parentName: "Алиева Рушана Ильдаровна",
    attendanceStatus: "present",
    attendanceDate: "20.05.2026",
    childStatus: "active",
    developmentMetrics: [
      { area: "physical", value: 68 },
      { area: "social", value: 54 },
      { area: "speech", value: 60 },
      { area: "cognitive", value: 58 },
      { area: "creative", value: 70 },
    ],
  },
  {
    id: "CH-000127",
    fullName: "Бекбаева Медина Армахановна",
    age: "3 года 8 мес.",
    birthDate: "12.09.2022",
    teacher: "Ким Н.А.",
    parentName: "Бекбаев Арман Салтанатович",
    attendanceStatus: "absent",
    attendanceDate: "19.05.2026",
    childStatus: "paused",
    developmentMetrics: [
      { area: "physical", value: 75 },
      { area: "social", value: 62 },
      { area: "speech", value: 64 },
      { area: "cognitive", value: 70 },
      { area: "creative", value: 76 },
    ],
  },
  {
    id: "CH-000128",
    fullName: "Байсинов Данияр Еркебуланович",
    age: "6 лет 3 мес.",
    birthDate: "10.01.2020",
    teacher: "Иванова О.С.",
    parentName: "Байсинова Жанар Еркебулановна",
    attendanceStatus: "present",
    attendanceDate: "20.05.2026",
    childStatus: "graduate",
    developmentMetrics: [
      { area: "physical", value: 90 },
      { area: "social", value: 78 },
      { area: "speech", value: 85 },
      { area: "cognitive", value: 82 },
      { area: "creative", value: 89 },
    ],
  },
  {
    id: "CH-000129",
    fullName: "Габдуллина Амира Тимуровна",
    age: "4 года 6 мес.",
    birthDate: "08.11.2021",
    teacher: "Петров А.С.",
    parentName: "Габдуллин Тимур Рафаэлевич",
    attendanceStatus: "absent",
    attendanceDate: "18.05.2026",
    childStatus: "paused",
    developmentMetrics: [
      { area: "physical", value: 63 },
      { area: "social", value: 50 },
      { area: "speech", value: 55 },
      { area: "cognitive", value: 57 },
      { area: "creative", value: 64 },
    ],
  },
  {
    id: "CH-000130",
    fullName: "Досжанов Султан Маратович",
    age: "5 лет 5 мес.",
    birthDate: "03.12.2020",
    teacher: "Ким Н.А.",
    parentName: "Досжанова Алия Маратовна",
    attendanceStatus: "present",
    attendanceDate: "20.05.2026",
    childStatus: "active",
    developmentMetrics: [
      { area: "physical", value: 95 },
      { area: "social", value: 86 },
      { area: "speech", value: 90 },
      { area: "cognitive", value: 93 },
      { area: "creative", value: 96 },
    ],
  },
  {
    id: "CH-000131",
    fullName: "Ермекова Айлин Болатовна",
    age: "3 года 2 мес.",
    birthDate: "11.03.2023",
    teacher: "Иванова О.С.",
    parentName: "Ермеков Болат Кайратович",
    attendanceStatus: "absent",
    attendanceDate: "19.05.2026",
    childStatus: "expelled",
    developmentMetrics: [
      { area: "physical", value: 58 },
      { area: "social", value: 46 },
      { area: "speech", value: 50 },
      { area: "cognitive", value: 52 },
      { area: "creative", value: 59 },
    ],
  },
  {
    id: "CH-000132",
    fullName: "Жумагалиев Рафаэль Артурович",
    age: "6 лет 0 мес.",
    birthDate: "06.05.2020",
    teacher: "Петров А.С.",
    parentName: "Жумагалиева Динара Артуровна",
    attendanceStatus: "present",
    attendanceDate: "20.05.2026",
    childStatus: "graduate",
    developmentMetrics: [
      { area: "physical", value: 76 },
      { area: "social", value: 80 },
      { area: "speech", value: 87 },
      { area: "cognitive", value: 85 },
      { area: "creative", value: 78 },
    ],
  },
  {
    id: "CH-000133",
    fullName: "Исмаилова София Амировна",
    age: "4 года 9 мес.",
    birthDate: "19.08.2021",
    teacher: "Ким Н.А.",
    parentName: "Исмаилов Эльдар Камилович",
    attendanceStatus: "present",
    attendanceDate: "20.05.2026",
    childStatus: "active",
    developmentMetrics: [
      { area: "physical", value: 70 },
      { area: "social", value: 61 },
      { area: "speech", value: 66 },
      { area: "cognitive", value: 69 },
      { area: "creative", value: 74 },
    ],
  },
];

const journalSubareas: DevelopmentSubarea[] = [
  {
    id: "speech-active",
    area: "speech",
    name: "Активная речь",
    primary: { score: "i", source: "teacher" },
    primaryGoal: "3 / 5",
    intermediate: { score: "ch", source: "combined" },
    intermediateGoal: "4 / 5",
    final: { score: "u", source: "confirmed" },
    comment:
      "Ребёнок активно вступает в контакт со взрослыми и детьми, проявляет интерес к общению. Словарный запас достаточный для бытового общения.",
    recommendation: "Чаще обсуждайте прошедший день и просите ребёнка пересказывать короткие истории.",
    responsible: ["Иванова О.С.", "Петрова Н.А."],
  },
  {
    id: "speech-phonemic",
    area: "speech",
    name: "Фонематический слух",
    primary: { score: "i", source: "bilimtoy" },
    primaryGoal: "2 / 5",
    intermediate: { score: "ch", source: "needsReview" },
    intermediateGoal: "3 / 5",
    final: { score: "ch", source: "combined" },
    comment: "Распознаёт большинство звуков, но иногда путает близкие фонемы.",
    recommendation: "Используйте игры на различение звуков в словах.",
    responsible: ["Петрова Н.А.", "Иванова О.С."],
  },
  {
    id: "speech-reading",
    area: "speech",
    name: "Чтение и письмо",
    primary: { score: "n", source: "teacher" },
    primaryGoal: "1 / 5",
    intermediate: { score: "i", source: "teacher" },
    intermediateGoal: "2 / 5",
    final: { score: "ch", source: "combined" },
    comment: "Проявляет интерес к буквам, узнаёт знакомые слова.",
    recommendation: "Продолжать занятия с карточками и короткими словами.",
    responsible: ["Иванова О.С."],
  },
];

export const mockChildProfile: ChildProfile = {
  ...mockChildren[0],
  photoInitials: "АА",
  address: "Республика Казахстан, г. Алматы, мкр. Самал-2, д. 45, кв. 12",
  branchName: "Детский сад №12 «Болашақ»",
  rowNumber: "000124",
  addedAt: "20.05.2026",
  bilimtoyCode: "X7K2-9Y4L",
  relatives: [
    {
      id: "rel-mother",
      fullName: "Абдрахманова Айгерим Сериковна",
      relation: "mother",
      phone: "+7 777 123 45 67",
      initials: "А",
    },
    {
      id: "rel-father",
      fullName: "Абдрахманов Ерлан Маратович",
      relation: "father",
      phone: "+7 777 987 65 43",
      initials: "А",
    },
    {
      id: "rel-grandmother",
      fullName: "Серикова Гульнар Талгатовна",
      relation: "grandmother",
      phone: "+7 702 555 12 22",
      initials: "С",
    },
  ],
  group: {
    name: "Солнышко",
    ageCategory: "Средняя группа (4–5 лет)",
    direction: "Общеразвивающая",
    teachers: [
      { id: "teacher-kim", fullName: "Ким Н.А.", phone: "+7 701 345 67 89" },
      { id: "teacher-ivanova", fullName: "Иванова О.С.", phone: "+7 700 234 56 78" },
    ],
  },
  tariff: {
    name: "Стандартный",
    type: "Ежемесячный",
    monthlyPrice: "120 000 ₸",
    paymentStatus: "paid",
  },
  documents: [
    { id: "doc-1", fileName: "Заявление на прием.pdf", date: "20.05.2026" },
    { id: "doc-2", fileName: "Свидетельство о рождении.pdf", date: "18.02.2021" },
    { id: "doc-3", fileName: "Паспорт родителя.pdf", date: "20.05.2026" },
    { id: "doc-4", fileName: "Справка о месте жительства.pdf", date: "19.05.2026" },
    { id: "doc-5", fileName: "Медицинская карта.pdf", date: "20.05.2026" },
  ],
  medical: {
    allergies: "Аллергия на пыльцу берёзы, молочный белок",
    diseases: "Частые ОРВИ, хронический тонзиллит в ремиссии",
    psychology: "Спокойный, внимательный, легко адаптируется",
  },
  bilimtoyMetrics: [
    { id: "task-time", labelKey: "children.profile.bilimtoyMetrics.taskTime", value: 78, tone: "success" },
    { id: "attempts", labelKey: "children.profile.bilimtoyMetrics.attempts", value: 64, tone: "warning" },
    { id: "errors", labelKey: "children.profile.bilimtoyMetrics.errors", value: 42, tone: "danger" },
  ],
  gameHistory: {
    topicsCount: 36,
    gamesCount: 128,
    achievementsCount: 15,
    certificatesCount: 4,
    topics: [
      { name: "Алфавит", passedAt: "12.05.2026", score: 82 },
      { name: "Цифры и счёт", passedAt: "19.05.2026", score: 90 },
      { name: "Формы и цвета", passedAt: "26.05.2026", score: 74 },
      { name: "Домашние животные", passedAt: "02.06.2026", score: 88 },
    ],
    games: [
      { name: "Собери слово", passedAt: "11.05.2026", score: 86 },
      { name: "Счёт до 10", passedAt: "18.05.2026", score: 92 },
      { name: "Найди форму", passedAt: "26.05.2026", score: 72 },
      { name: "Кто где живёт?", passedAt: "01.06.2026", score: 87 },
    ],
    achievements: [
      { title: "Быстрый мыслитель", date: "23.05.2026", description: "За быстрое и правильное решение задач" },
      { title: "Знаток букв", date: "20.05.2026", description: "За отличные знания алфавита" },
      { title: "Мастер логики", date: "28.05.2026", description: "За решение логических головоломок" },
    ],
    certificates: [
      { title: "Сертификат по теме Алфавит", date: "12.05.2026", description: "Успешное прохождение темы «Алфавит»" },
      { title: "Сертификат по математике", date: "19.05.2026", description: "Успешное прохождение темы «Цифры и счёт»" },
      { title: "Сертификат по животным", date: "02.06.2026", description: "Успешное прохождение темы «Домашние животные»" },
    ],
  },
  specialistComments: [
    {
      id: "comment-1",
      specialistName: "Петрова Анна Викторовна",
      role: "speechTherapist",
      dateTime: "20.05.2026 10:30",
      initials: "ПА",
      text:
        "Речевое развитие соответствует возрастной норме. Словарный запас активно расширяется, строит простые и сложные предложения.",
    },
    {
      id: "comment-2",
      specialistName: "Иванова Светлана Сергеевна",
      role: "psychologist",
      dateTime: "19.05.2026 15:45",
      initials: "ИС",
      text:
        "Алихан хорошо адаптировался в группе, проявляет интерес к совместным играм. Уровень внимания соответствует возрасту.",
    },
    {
      id: "comment-3",
      specialistName: "Ким Ольга Юрьевна",
      role: "methodist",
      dateTime: "18.05.2026 11:20",
      initials: "КО",
      text: "Занятия посещает с интересом, активно участвует в обсуждениях. Продолжать работу над формированием звукового анализа слов.",
    },
  ],
  developmentJournal: [
    {
      area: "physical",
      subareas: [
        {
          ...journalSubareas[0],
          id: "physical-motor",
          area: "physical",
          name: "Крупная моторика",
          comment: "Уверенно выполняет основные движения, сохраняет равновесие.",
        },
      ],
    },
    {
      area: "social",
      subareas: [
        {
          ...journalSubareas[1],
          id: "social-adaptation",
          area: "social",
          name: "Эмоциональная адаптация",
          comment: "Вступает в контакт со сверстниками, умеет просить помощь.",
        },
      ],
    },
    {
      area: "speech",
      subareas: journalSubareas,
    },
    {
      area: "cognitive",
      subareas: [
        {
          ...journalSubareas[2],
          id: "cognitive-logic",
          area: "cognitive",
          name: "Логическое мышление",
          comment: "Сортирует предметы по форме и цвету, находит простые закономерности.",
        },
      ],
    },
    {
      area: "creative",
      subareas: [
        {
          ...journalSubareas[0],
          id: "creative-expression",
          area: "creative",
          name: "Творческое самовыражение",
          comment: "Активно использует цвет и форму в рисунках.",
        },
      ],
    },
  ],
  developmentDynamics: [
    { area: "physical", observation1: 60, observation2: 70, observation3: 78, dynamics: 18 },
    { area: "social", observation1: 65, observation2: 72, observation3: 80, dynamics: 15 },
    { area: "speech", observation1: 58, observation2: 68, observation3: 75, dynamics: 17 },
    { area: "cognitive", observation1: 62, observation2: 70, observation3: 78, dynamics: 16 },
    { area: "creative", observation1: 54, observation2: 64, observation3: 72, dynamics: 18 },
  ],
};
