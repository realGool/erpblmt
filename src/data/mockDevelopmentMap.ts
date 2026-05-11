import type { DataSourceIconType, NicuValue } from "../components/ui";

export type NicuScore = "n" | "i" | "ch" | "u";
export type ObservationCycle = "primary" | "intermediate" | "final";
export type MapStatus = "actual" | "needsReview" | "empty";
export type DevelopmentTrend = "improved" | "same" | "attention";
export type RecommendationStatus = "new" | "sent" | "read";

export interface DevelopmentMapChild {
  id: string;
  fullName: string;
  age: string;
  group: string;
  parent: string;
  currentCycle: ObservationCycle;
  summary: NicuValue;
  needsReviewCount: number;
  source: Extract<DataSourceIconType, "teacher" | "bilimtoy" | "combined">;
  updatedAt: string;
  status: MapStatus;
}

export interface DevelopmentIndicator {
  id: string;
  subarea: string;
  indicator: string;
  description: string;
  scoreAuto: NicuScore;
  scoreManual: NicuScore;
  scoreFinal: NicuScore;
  source: Extract<DataSourceIconType, "teacher" | "bilimtoy" | "combined">;
  needsReview: boolean;
  updatedAt: string;
  author: string;
  comments: string[];
  relatedGames: string[];
  parentRecommendation: string;
}

export interface DevelopmentAreaDetail {
  id: string;
  title: string;
  summary: NicuValue;
  filledIndicators: number;
  reviewCount: number;
  source: Extract<DataSourceIconType, "teacher" | "bilimtoy" | "combined">;
  indicators: DevelopmentIndicator[];
}

export interface DevelopmentMapDetail {
  child: DevelopmentMapChild & {
    branch: string;
    teacher: string;
    bilimtoyCode: string;
  };
  areas: DevelopmentAreaDetail[];
  dynamics: Array<{
    area: string;
    primary: NicuValue;
    intermediate: NicuValue;
    final: NicuValue;
    trend: DevelopmentTrend;
  }>;
  relatedGames: Array<{
    id: string;
    title: string;
    area: string;
    subarea: string;
    skill: string;
    sessionsCount: number;
    lastSession: string;
    impact: string;
  }>;
  recommendations: Array<{
    id: string;
    area: string;
    recommendation: string;
    source: string;
    date: string;
    status: RecommendationStatus;
  }>;
}

export const mockDevelopmentMapChildren: DevelopmentMapChild[] = [
  { id: "CH-000124", fullName: "Абдрахманов Алихан Ерланович", age: "4 года 3 мес.", group: "Солнышко", parent: "Абдрахманова Айгерим", currentCycle: "intermediate", summary: { n: 8, i: 17, ch: 45, u: 30 }, needsReviewCount: 3, source: "combined", updatedAt: "31.05.2025, 10:25", status: "needsReview" },
  { id: "CH-000125", fullName: "Бекмурзаев Тимур Арманович", age: "4 года 7 мес.", group: "Мой дом", parent: "Бекмурзаева Алия", currentCycle: "intermediate", summary: { n: 12, i: 20, ch: 42, u: 26 }, needsReviewCount: 5, source: "bilimtoy", updatedAt: "30.05.2025, 16:40", status: "needsReview" },
  { id: "CH-000126", fullName: "Воробьёва София Игоревна", age: "4 года 5 мес.", group: "Профессии моей семьи", parent: "Воробьёв Игорь", currentCycle: "primary", summary: { n: 5, i: 14, ch: 50, u: 31 }, needsReviewCount: 0, source: "teacher", updatedAt: "29.05.2025, 09:15", status: "actual" },
  { id: "CH-000127", fullName: "Галимов Арсен Маратович", age: "4 года 9 мес.", group: "Семейные традиции", parent: "Галимова Лилия", currentCycle: "intermediate", summary: { n: 18, i: 30, ch: 32, u: 20 }, needsReviewCount: 2, source: "combined", updatedAt: "27.05.2025, 14:50", status: "empty" },
  { id: "CH-000128", fullName: "Джалилова Малика Эльдаровна", age: "4 года 2 мес.", group: "Осень", parent: "Джалилов Эльдар", currentCycle: "final", summary: { n: 4, i: 8, ch: 48, u: 40 }, needsReviewCount: 0, source: "combined", updatedAt: "28.05.2025, 11:20", status: "actual" },
];

const indicators: DevelopmentIndicator[] = [
  { id: "ind-1", subarea: "Крупная моторика", indicator: "Ходит на носочках, пятках и сохраняет равновесие", description: "Ожидаемый результат по крупной моторике для текущего цикла наблюдения.", scoreAuto: "i", scoreManual: "ch", scoreFinal: "ch", source: "combined", needsReview: false, updatedAt: "31.05.2025", author: "Иванова О. С.", comments: ["Уверенно выполняет после показа"], relatedGames: ["Помоги зайчику"], parentRecommendation: "Больше игр на баланс и координацию во время прогулки." },
  { id: "ind-2", subarea: "Крупная моторика", indicator: "Сохраняет равновесие во время ходьбы по верёвке", description: "Показывает устойчивость корпуса и контроль шага.", scoreAuto: "n", scoreManual: "i", scoreFinal: "i", source: "bilimtoy", needsReview: true, updatedAt: "30.05.2025", author: "Петрова Н. А.", comments: ["Требуется подтверждение педагога"], relatedGames: ["Логические цепочки"], parentRecommendation: "Добавить упражнения на равновесие в игровой форме." },
  { id: "ind-3", subarea: "Активная речь", indicator: "Описывает предметы и действия простыми предложениями", description: "Оценивается связная речь и словарь в бытовой ситуации.", scoreAuto: "i", scoreManual: "ch", scoreFinal: "ch", source: "combined", needsReview: false, updatedAt: "29.05.2025", author: "Сидорова Е. В.", comments: ["Есть положительная динамика"], relatedGames: ["Собери слово"], parentRecommendation: "Читать короткие истории и просить пересказать 2–3 предложения." },
  { id: "ind-4", subarea: "Математические представления", indicator: "Считает предметы до 5", description: "Понимает количество и соотносит число с предметами.", scoreAuto: "ch", scoreManual: "ch", scoreFinal: "u", source: "combined", needsReview: false, updatedAt: "31.05.2025", author: "Иванова О. С.", comments: ["Стабильно считает до 5"], relatedGames: ["Цифры и счёт"], parentRecommendation: "Закреплять счёт в бытовых ситуациях." },
  { id: "ind-5", subarea: "Изобразительная деятельность", indicator: "Подбирает цвета и создаёт простые композиции", description: "Оценивается самостоятельный выбор цвета и композиции.", scoreAuto: "i", scoreManual: "i", scoreFinal: "i", source: "teacher", needsReview: false, updatedAt: "28.05.2025", author: "Ким О. Ю.", comments: ["Иногда требуется подсказка"], relatedGames: ["Формы и цвета"], parentRecommendation: "Предлагать рисование по свободной теме." },
];

export const mockDevelopmentMapDetail: DevelopmentMapDetail = {
  child: {
    ...mockDevelopmentMapChildren[0],
    branch: "Детский сад №12 «Болашақ»",
    teacher: "Иванова Ольга Сергеевна",
    bilimtoyCode: "X7K2-9Y4L",
  },
  areas: [
    { id: "physical", title: "Физическое развитие и формирование здорового образа жизни", summary: { n: 8, i: 17, ch: 45, u: 30 }, filledIndicators: 24, reviewCount: 1, source: "combined", indicators: indicators.slice(0, 2) },
    { id: "social", title: "Социально-эмоциональное развитие", summary: { n: 6, i: 18, ch: 46, u: 30 }, filledIndicators: 22, reviewCount: 0, source: "teacher", indicators: [indicators[1], indicators[2]] },
    { id: "speech", title: "Речь, общение, чтение и письмо", summary: { n: 7, i: 20, ch: 43, u: 30 }, filledIndicators: 26, reviewCount: 1, source: "combined", indicators: [indicators[2], indicators[3]] },
    { id: "cognitive", title: "Познавательное развитие", summary: { n: 5, i: 14, ch: 50, u: 31 }, filledIndicators: 28, reviewCount: 1, source: "bilimtoy", indicators: [indicators[3], indicators[0]] },
    { id: "creative", title: "Творческое развитие", summary: { n: 9, i: 21, ch: 40, u: 30 }, filledIndicators: 18, reviewCount: 0, source: "teacher", indicators: [indicators[4], indicators[2]] },
  ],
  dynamics: [
    { area: "Физическое развитие", primary: { n: 20, i: 25, ch: 35, u: 20 }, intermediate: { n: 12, i: 20, ch: 43, u: 25 }, final: { n: 8, i: 17, ch: 45, u: 30 }, trend: "improved" },
    { area: "Социально-эмоциональное развитие", primary: { n: 12, i: 28, ch: 40, u: 20 }, intermediate: { n: 8, i: 22, ch: 45, u: 25 }, final: { n: 6, i: 18, ch: 46, u: 30 }, trend: "improved" },
    { area: "Речь, общение, чтение и письмо", primary: { n: 14, i: 30, ch: 36, u: 20 }, intermediate: { n: 9, i: 22, ch: 42, u: 27 }, final: { n: 7, i: 20, ch: 43, u: 30 }, trend: "same" },
    { area: "Познавательное развитие", primary: { n: 18, i: 25, ch: 38, u: 19 }, intermediate: { n: 9, i: 18, ch: 46, u: 27 }, final: { n: 5, i: 14, ch: 50, u: 31 }, trend: "improved" },
    { area: "Творческое развитие", primary: { n: 12, i: 24, ch: 44, u: 20 }, intermediate: { n: 11, i: 24, ch: 41, u: 24 }, final: { n: 9, i: 21, ch: 40, u: 30 }, trend: "attention" },
  ],
  relatedGames: [
    { id: "game-001", title: "Собери слово", area: "Речь, общение, чтение и письмо", subarea: "Активная речь", skill: "Фонематический слух", sessionsCount: 12, lastSession: "31.05.2025", impact: "+12%" },
    { id: "game-004", title: "Цифры и счёт", area: "Познавательное развитие", subarea: "Математические представления", skill: "Счёт", sessionsCount: 8, lastSession: "29.05.2025", impact: "+9%" },
    { id: "game-005", title: "Формы и цвета", area: "Творческое развитие", subarea: "Изобразительная деятельность", skill: "Цвета", sessionsCount: 6, lastSession: "28.05.2025", impact: "+5%" },
  ],
  recommendations: [
    { id: "rec-1", area: "Речь", recommendation: "Читать короткие истории и просить ребёнка пересказать 2–3 предложения.", source: "Логопед", date: "31.05.2025", status: "new" },
    { id: "rec-2", area: "Физическое развитие", recommendation: "Добавить игры на баланс и координацию во время прогулки.", source: "Воспитатель", date: "30.05.2025", status: "sent" },
    { id: "rec-3", area: "Познавательное развитие", recommendation: "Закреплять счёт до 5 в бытовых ситуациях.", source: "Bilimtoy", date: "29.05.2025", status: "read" },
  ],
};
