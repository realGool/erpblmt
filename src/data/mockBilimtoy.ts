export type GameAgeCategory = "3-4" | "4-5" | "5-6" | "6-7";
export type GameThumbnailType = "letters" | "pairs" | "animals" | "numbers" | "shapes" | "sorting" | "logic" | "shadow" | "puzzle" | "maze" | "sequence" | "sound";
export type AlertStatus = "success" | "info" | "error" | "pending";
export type TimelineTone = "success" | "info" | "danger" | "warning";

export interface BilimtoyGame {
  id: string;
  order: number;
  title: string;
  ageCategory: GameAgeCategory;
  location: string;
  gameCategory: string;
  skill: string;
  description: string;
  relatedDasturAreas: string[];
  thumbnailType: GameThumbnailType;
}

export interface RealtimeAlert {
  id: string;
  type: string;
  description: string;
  time: string;
  status: AlertStatus;
}

export interface RealtimeTimelineEvent {
  id: string;
  time: string;
  event: string;
  tone: TimelineTone;
}

export interface RealtimeChildListItem {
  id: string;
  fullName: string;
  group: string;
  game: string;
  level: string;
  timeInGame: string;
  status: "online" | "paused" | "warning";
}

export const mockBilimtoyGames: BilimtoyGame[] = [
  {
    id: "game-001",
    order: 1,
    title: "Собери слово",
    ageCategory: "4-5",
    location: "Лесная поляна",
    gameCategory: "Развитие речи",
    skill: "Фонематический слух",
    description: "Ребёнок собирает слово из букв и тренирует распознавание звуков в слове.",
    relatedDasturAreas: ["Речь, общение, чтение и письмо", "Познавательное развитие"],
    thumbnailType: "letters",
  },
  {
    id: "game-002",
    order: 2,
    title: "Найди пару",
    ageCategory: "4-5",
    location: "Домашний двор",
    gameCategory: "Память и внимание",
    skill: "Зрительная память",
    description: "Игра развивает сопоставление объектов и удержание зрительного образа.",
    relatedDasturAreas: ["Познавательное развитие"],
    thumbnailType: "pairs",
  },
  {
    id: "game-003",
    order: 3,
    title: "Кто где живёт?",
    ageCategory: "4-5",
    location: "Лесная поляна",
    gameCategory: "Окружающий мир",
    skill: "Классификация",
    description: "Ребёнок связывает животных с их средой обитания и закрепляет классификацию.",
    relatedDasturAreas: ["Познавательное развитие", "Социально-эмоциональное развитие"],
    thumbnailType: "animals",
  },
  {
    id: "game-004",
    order: 4,
    title: "Цифры и счёт",
    ageCategory: "4-5",
    location: "Городская школа",
    gameCategory: "Математика",
    skill: "Счёт и количество",
    description: "Игра помогает ребёнку узнавать цифры и сопоставлять их с количеством.",
    relatedDasturAreas: ["Познавательное развитие"],
    thumbnailType: "numbers",
  },
  {
    id: "game-005",
    order: 5,
    title: "Формы и цвета",
    ageCategory: "4-5",
    location: "Игровая комната",
    gameCategory: "Математика",
    skill: "Распознавание форм и цветов",
    description: "Ребёнок различает базовые формы и цвета в игровой последовательности.",
    relatedDasturAreas: ["Познавательное развитие", "Творческое развитие"],
    thumbnailType: "shapes",
  },
  {
    id: "game-006",
    order: 6,
    title: "Сортировка предметов",
    ageCategory: "4-5",
    location: "Игровая комната",
    gameCategory: "Мышление",
    skill: "Сортировка и группировка",
    description: "Игра тренирует распределение предметов по признакам.",
    relatedDasturAreas: ["Познавательное развитие"],
    thumbnailType: "sorting",
  },
  {
    id: "game-007",
    order: 7,
    title: "Логические цепочки",
    ageCategory: "4-5",
    location: "Лесная поляна",
    gameCategory: "Мышление",
    skill: "Логическое мышление",
    description: "Ребёнок продолжает последовательность и объясняет закономерность.",
    relatedDasturAreas: ["Познавательное развитие"],
    thumbnailType: "logic",
  },
  {
    id: "game-008",
    order: 8,
    title: "Найди тень",
    ageCategory: "4-5",
    location: "Деревня",
    gameCategory: "Внимание",
    skill: "Визуальное восприятие",
    description: "Игра развивает зрительное сопоставление силуэтов и объектов.",
    relatedDasturAreas: ["Познавательное развитие"],
    thumbnailType: "shadow",
  },
  {
    id: "game-009",
    order: 9,
    title: "Собери пазл",
    ageCategory: "4-5",
    location: "Игровая комната",
    gameCategory: "Мышление",
    skill: "Целостное восприятие",
    description: "Ребёнок собирает изображение из частей и тренирует пространственное мышление.",
    relatedDasturAreas: ["Познавательное развитие", "Творческое развитие"],
    thumbnailType: "puzzle",
  },
  {
    id: "game-010",
    order: 10,
    title: "Помоги зайчику",
    ageCategory: "4-5",
    location: "Лесная поляна",
    gameCategory: "Мышление",
    skill: "Пространственное мышление",
    description: "Игра строит путь к цели и закрепляет причинно-следственные связи.",
    relatedDasturAreas: ["Познавательное развитие"],
    thumbnailType: "maze",
  },
  {
    id: "game-011",
    order: 11,
    title: "Что было сначала?",
    ageCategory: "4-5",
    location: "Городская школа",
    gameCategory: "Мышление",
    skill: "Понимание последовательности",
    description: "Ребёнок выстраивает события в правильном порядке.",
    relatedDasturAreas: ["Речь, общение, чтение и письмо", "Познавательное развитие"],
    thumbnailType: "sequence",
  },
  {
    id: "game-012",
    order: 12,
    title: "Угадай по звуку",
    ageCategory: "4-5",
    location: "Музыкальная поляна",
    gameCategory: "Развитие речи",
    skill: "Слуховое восприятие",
    description: "Игра развивает различение звуков и связывание звука с объектом.",
    relatedDasturAreas: ["Речь, общение, чтение и письмо"],
    thumbnailType: "sound",
  },
];

export const mockRealtimeChildren: RealtimeChildListItem[] = [
  { id: "CH-000126", fullName: "Алиев Тимур Русланович", group: "Солнышко", game: "Собери слово", level: "Уровень 2", timeInGame: "00:12:34", status: "online" },
  { id: "CH-000127", fullName: "Алимова Самира Бахтиёровна", group: "Звёздочки", game: "Найди пару", level: "Уровень 2", timeInGame: "00:08:12", status: "online" },
  { id: "CH-000128", fullName: "Бекмуродов Артём Ильясович", group: "Пчёлки", game: "Цифры и счёт", level: "Уровень 4", timeInGame: "00:16:45", status: "warning" },
  { id: "CH-000129", fullName: "Ганиева Малика Шухратовна", group: "Радуга", game: "Кто где живёт?", level: "Уровень 2", timeInGame: "00:06:27", status: "online" },
  { id: "CH-000130", fullName: "Джураева София Акмаловна", group: "Солнышко", game: "Формы и цвета", level: "Уровень 3", timeInGame: "00:10:18", status: "paused" },
  { id: "CH-000131", fullName: "Ибрагимов Амирхон Фарходович", group: "Звёздочки", game: "Логические цепочки", level: "Уровень 4", timeInGame: "00:14:01", status: "online" },
  { id: "CH-000132", fullName: "Каримова Айша Баходировна", group: "Пчёлки", game: "Собери слово", level: "Уровень 2", timeInGame: "00:09:36", status: "online" },
  { id: "CH-000133", fullName: "Ким Данияль Николаевич", group: "Радуга", game: "Найди пару", level: "Уровень 1", timeInGame: "00:05:54", status: "online" },
  { id: "CH-000134", fullName: "Курбанова Мадина Азизовна", group: "Солнышко", game: "Цифры и счёт", level: "Уровень 3", timeInGame: "00:11:08", status: "online" },
  { id: "CH-000135", fullName: "Мирзахмедов Сардорбек Бекзодович", group: "Звёздочки", game: "Кто где живёт?", level: "Уровень 2", timeInGame: "00:07:44", status: "online" },
];

export const mockRealtimeSession = {
  child: {
    fullName: "Алиев Тимур Русланович",
    age: "4 года 6 мес.",
    group: "Солнышко",
    ageCategory: "Средняя группа (4–5 лет)",
    direction: "Общеразвивающая",
    avatarInitials: "АТ",
  },
  currentSession: {
    status: "online",
    game: "Собери слово",
    level: "Уровень 2 / Этап 3",
    timeInGame: "00:12:34",
    progress: 68,
    task: "Собери слово «СОЛНЫШКО»",
    completedSteps: "9 / 13 шагов",
    startedAt: "22 мая 2026, 10:42:18",
    currentAction: "Выбор букв, составление слова",
    error: "Неверный порядок букв: «СОЛНЫШКО»",
    errorMoment: "Шаг 7 из 13 (сбор слова)",
  },
  liveMetrics: [
    { id: "attention", value: 82, tone: "info" as const },
    { id: "speed", value: 74, tone: "success" as const },
    { id: "activity", value: 89, tone: "purple" as const },
  ],
  alerts: [
    { id: "alert-1", type: "session_start", description: "Начало игровой сессии", time: "22.05.2026 10:42:18", status: "success" as const },
    { id: "alert-2", type: "task_complete", description: "Завершено задание «Собери слово»", time: "22.05.2026 10:44:05", status: "success" as const },
    { id: "alert-3", type: "level_up", description: "Переход на уровень 2", time: "22.05.2026 10:44:12", status: "info" as const },
    { id: "alert-4", type: "error_event", description: "Неверный порядок букв в слове", time: "22.05.2026 10:45:37", status: "error" as const },
    { id: "alert-5", type: "click_event", description: "Нажатие на букве «Ы»", time: "22.05.2026 10:45:39", status: "info" as const },
    { id: "alert-6", type: "reaction_time", description: "Время реакции: 1.32 сек.", time: "22.05.2026 10:45:52", status: "info" as const },
    { id: "alert-7", type: "attempt_count", description: "Количество попыток: 2", time: "22.05.2026 10:45:54", status: "info" as const },
    { id: "alert-8", type: "task_fail", description: "Задание не выполнено", time: "22.05.2026 10:46:10", status: "error" as const },
    { id: "alert-9", type: "session_end", description: "Завершение игровой сессии", time: "22.05.2026 10:54:52", status: "pending" as const },
  ],
  timeline: [
    { id: "event-1", time: "10:42:18", event: "Вход в игру «Собери слово»", tone: "success" as const },
    { id: "event-2", time: "10:42:24", event: "Выбор уровня: Уровень 2", tone: "success" as const },
    { id: "event-3", time: "10:42:28", event: "Показ задания: слово «СОЛНЫШКО»", tone: "success" as const },
    { id: "event-4", time: "10:42:35", event: "Выбор букв: С, О, Л, Н, Ы", tone: "success" as const },
    { id: "event-5", time: "10:43:20", event: "Выполнение задания: 6 из 13 шагов", tone: "info" as const },
    { id: "event-6", time: "10:44:12", event: "Переход на Уровень 2 / Этап 3", tone: "info" as const },
    { id: "event-7", time: "10:45:37", event: "Ошибка: неверный порядок букв", tone: "danger" as const },
    { id: "event-8", time: "10:46:02", event: "Пауза в игре (неактивность 22 сек.)", tone: "warning" as const },
    { id: "event-9", time: "10:46:25", event: "Повторная попытка: сбор слова", tone: "info" as const },
    { id: "event-10", time: "10:54:52", event: "Текущее действие: выбор следующих букв", tone: "success" as const },
  ],
};
