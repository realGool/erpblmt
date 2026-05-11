import type { DataSourceIconType } from "../components/ui";

export type ProgramAgeCategory = "3-4" | "4-5" | "5-6" | "6-7";
export type WeekStatus = "current" | "future" | "completed";

export interface ProgramGame {
  id: string;
  title: string;
  ageCategory: ProgramAgeCategory;
  skill: string;
  area: string;
  hasIndicators: boolean;
}

export interface ProgramIndicator {
  id: string;
  area: string;
  subarea: string;
  indicator: string;
  source: Extract<DataSourceIconType, "teacher" | "bilimtoy" | "combined">;
  games: string[];
}

export interface ProgramMaterial {
  id: string;
  title: string;
  type: string;
  audience: "teacher" | "parent" | "child";
  file: string;
}

export interface ProgramWeek {
  id: string;
  month: string;
  monthTheme: string;
  weekNumber: number;
  weekTheme: string;
  ageCategory: ProgramAgeCategory;
  period: string;
  status: WeekStatus;
  developmentAreas: string[];
  developmentCenters: string[];
  games: ProgramGame[];
  indicators: ProgramIndicator[];
  materials: ProgramMaterial[];
}

export const mockEducationalProgramSummary = {
  schoolYear: "2 сентября — 31 мая",
  summerPeriod: "1 июня — 31 августа",
  ageGroups: "3–4, 4–5, 5–6, 6–7",
  topicsWeeks: "12 тем / 48 недель",
};

export const materialTypeOptions = [
  "Методическая рекомендация",
  "Рабочий лист",
  "Карточки",
  "Инструкция",
  "Материал для родителей",
  "Презентация",
  "Плакат",
  "Шаблон",
  "Материал к игре Bilimtoy",
  "Другое",
];

const areas = {
  physical: "Физическое развитие и ЗОЖ",
  social: "Социально-эмоциональное развитие",
  speech: "Речь, общение, чтение и письмо",
  cognitive: "Познавательное развитие",
  creative: "Творческое развитие",
};

const centers = {
  construction: "Центр строительства и конструирования",
  drama: "Центр сюжетно-ролевых игр и драматизации",
  speech: "Центр языка и речи",
  nature: "Центр науки и природы",
  art: "Центр искусства",
};

export const mockProgramWeeks: ProgramWeek[] = [
  {
    id: "week-001",
    month: "Сентябрь",
    monthTheme: "Я и моя семья",
    weekNumber: 1,
    weekTheme: "Моя семья",
    ageCategory: "4-5",
    period: "02.09.2026 — 06.09.2026",
    status: "completed",
    developmentAreas: [areas.social, areas.speech, areas.cognitive],
    developmentCenters: [centers.drama, centers.speech, centers.art],
    games: [
      { id: "game-003", title: "Кто где живёт?", ageCategory: "4-5", skill: "Классификация", area: areas.cognitive, hasIndicators: true },
      { id: "game-001", title: "Собери семейный альбом", ageCategory: "4-5", skill: "Связная речь", area: areas.speech, hasIndicators: true },
    ],
    indicators: [
      { id: "ind-1", area: areas.speech, subarea: "Активная речь", indicator: "Рассказывает о членах семьи простыми предложениями", source: "combined", games: ["Собери семейный альбом"] },
      { id: "ind-2", area: areas.social, subarea: "Эмоции и отношения", indicator: "Называет близких людей и их роль", source: "teacher", games: [] },
      { id: "ind-3", area: areas.cognitive, subarea: "Классификация", indicator: "Группирует предметы по признаку принадлежности семье", source: "bilimtoy", games: ["Кто где живёт?"] },
    ],
    materials: [
      { id: "mat-1", title: "Занятие: Моя семья", type: "Методическая рекомендация", audience: "teacher", file: "family_lesson.pdf" },
      { id: "mat-2", title: "Рабочий лист «Члены семьи»", type: "Рабочий лист", audience: "child", file: "family_sheet.pdf" },
      { id: "mat-3", title: "Советы по семейному воспитанию", type: "Материал для родителей", audience: "parent", file: "family_parent.pdf" },
    ],
  },
  {
    id: "week-002",
    month: "Сентябрь",
    monthTheme: "Я и моя семья",
    weekNumber: 2,
    weekTheme: "Мой дом",
    ageCategory: "4-5",
    period: "09.09.2026 — 13.09.2026",
    status: "completed",
    developmentAreas: [areas.cognitive, areas.creative, areas.speech],
    developmentCenters: [centers.construction, centers.speech, centers.art],
    games: [
      { id: "game-008", title: "Уютный дом", ageCategory: "4-5", skill: "Визуальное восприятие", area: areas.cognitive, hasIndicators: true },
      { id: "game-007", title: "Наведём порядок", ageCategory: "4-5", skill: "Логика", area: areas.cognitive, hasIndicators: true },
    ],
    indicators: [
      { id: "ind-4", area: areas.cognitive, subarea: "Пространство", indicator: "Ориентируется в понятиях внутри / снаружи / рядом", source: "combined", games: ["Уютный дом"] },
      { id: "ind-5", area: areas.creative, subarea: "Конструирование", indicator: "Создаёт простую постройку по образцу", source: "teacher", games: [] },
    ],
    materials: [
      { id: "mat-4", title: "Презентация: Мой дом", type: "Презентация", audience: "teacher", file: "home.pptx" },
      { id: "mat-5", title: "Шаблон семейного герба", type: "Шаблон", audience: "child", file: "crest.png" },
    ],
  },
  {
    id: "week-003",
    month: "Сентябрь",
    monthTheme: "Я и моя семья",
    weekNumber: 3,
    weekTheme: "Профессии моей семьи",
    ageCategory: "4-5",
    period: "16.09.2026 — 20.09.2026",
    status: "completed",
    developmentAreas: [areas.cognitive, areas.speech, areas.social],
    developmentCenters: [centers.drama, centers.speech, centers.nature],
    games: [
      { id: "game-006", title: "Кем я буду?", ageCategory: "4-5", skill: "Сортировка и группировка", area: areas.cognitive, hasIndicators: true },
      { id: "game-004", title: "Профессии вокруг нас", ageCategory: "4-5", skill: "Словарь", area: areas.speech, hasIndicators: false },
    ],
    indicators: [
      { id: "ind-6", area: areas.speech, subarea: "Словарь", indicator: "Использует названия профессий в речи", source: "combined", games: ["Профессии вокруг нас"] },
      { id: "ind-7", area: areas.social, subarea: "Ролевая игра", indicator: "Принимает роль в сюжетно-ролевой игре", source: "teacher", games: [] },
    ],
    materials: [
      { id: "mat-6", title: "Карточки «Профессии»", type: "Карточки", audience: "teacher", file: "professions.pdf" },
      { id: "mat-7", title: "Плакат «Правила дома»", type: "Плакат", audience: "child", file: "rules.png" },
    ],
  },
  {
    id: "week-004",
    month: "Октябрь",
    monthTheme: "Осень",
    weekNumber: 1,
    weekTheme: "Признаки осени",
    ageCategory: "4-5",
    period: "01.10.2026 — 05.10.2026",
    status: "current",
    developmentAreas: [areas.cognitive, areas.speech, areas.creative],
    developmentCenters: [centers.nature, centers.speech, centers.art],
    games: [
      { id: "game-011", title: "Осенние изменения", ageCategory: "4-5", skill: "Последовательность", area: areas.cognitive, hasIndicators: true },
      { id: "game-002", title: "Подбери листочек", ageCategory: "4-5", skill: "Память и внимание", area: areas.cognitive, hasIndicators: true },
    ],
    indicators: [
      { id: "ind-8", area: areas.cognitive, subarea: "Природа", indicator: "Называет сезонные изменения в природе", source: "combined", games: ["Осенние изменения"] },
      { id: "ind-9", area: areas.speech, subarea: "Связная речь", indicator: "Описывает картинку по теме осени", source: "teacher", games: [] },
    ],
    materials: [
      { id: "mat-8", title: "Инструкция: Осенняя прогулка", type: "Инструкция", audience: "teacher", file: "autumn_walk.pdf" },
      { id: "mat-9", title: "Материал к игре: Подбери листочек", type: "Материал к игре Bilimtoy", audience: "child", file: "leaves_game.pdf" },
      { id: "mat-10", title: "Календарь семейных праздников", type: "Рабочий лист", audience: "parent", file: "calendar.pdf" },
    ],
  },
  {
    id: "week-005",
    month: "Ноябрь",
    monthTheme: "Домашние животные",
    weekNumber: 1,
    weekTheme: "Животные на ферме",
    ageCategory: "4-5",
    period: "04.11.2026 — 08.11.2026",
    status: "future",
    developmentAreas: [areas.cognitive, areas.speech, areas.physical],
    developmentCenters: [centers.nature, centers.speech, centers.drama],
    games: [
      { id: "game-003", title: "Кто что даёт?", ageCategory: "4-5", skill: "Классификация", area: areas.cognitive, hasIndicators: true },
      { id: "game-012", title: "Ферма: день животного", ageCategory: "4-5", skill: "Слуховое восприятие", area: areas.speech, hasIndicators: true },
    ],
    indicators: [
      { id: "ind-10", area: areas.cognitive, subarea: "Классификация", indicator: "Различает домашних животных и их детёнышей", source: "bilimtoy", games: ["Кто что даёт?"] },
      { id: "ind-11", area: areas.physical, subarea: "Крупная моторика", indicator: "Имитационно двигается по инструкции", source: "teacher", games: [] },
    ],
    materials: [
      { id: "mat-11", title: "Проект «Моя ферма»", type: "Методическая рекомендация", audience: "teacher", file: "farm_project.pdf" },
      { id: "mat-12", title: "Фотосчёт: День фермы", type: "Презентация", audience: "parent", file: "farm_day.pptx" },
    ],
  },
];
