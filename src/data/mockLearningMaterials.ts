import type { ProgramAgeCategory } from "./mockEducationalProgram";

export type LearningMaterialFormat = "PDF" | "PNG" | "PPTX" | "DOCX" | "SVG" | "XLSX" | "MP3";
export type LearningMaterialAudience = "teacher" | "parent" | "child";
export type LearningMaterialSource = "system" | "organization" | "teacher";

export interface LearningMaterial {
  id: string;
  title: string;
  type: string;
  ageCategory: ProgramAgeCategory;
  area: string;
  subarea: string;
  monthTheme: string;
  weekTheme: string;
  format: LearningMaterialFormat;
  audience: LearningMaterialAudience;
  source: LearningMaterialSource;
  folder: string;
  fileName: string;
  gameTitle?: string;
}

export const mockLearningMaterials: LearningMaterial[] = [
  { id: "mat-lib-001", title: "Методическая рекомендация: Мир вокруг нас", type: "Методическая рекомендация", ageCategory: "4-5", area: "Познавательное развитие", subarea: "Окружающий мир", monthTheme: "Мир вокруг нас", weekTheme: "Домашние животные", format: "PDF", audience: "teacher", source: "system", folder: "Материалы системы", fileName: "world_around_us.pdf" },
  { id: "mat-lib-002", title: "Рабочий лист: Счёт до 10", type: "Рабочий лист", ageCategory: "4-5", area: "Познавательное развитие", subarea: "Математические представления", monthTheme: "Мир вокруг нас", weekTheme: "Кто где живёт?", format: "PDF", audience: "child", source: "system", folder: "Материалы системы", fileName: "count_to_10.pdf", gameTitle: "Цифры и счёт" },
  { id: "mat-lib-003", title: "Карточки: Эмоции и настроение", type: "Карточки", ageCategory: "3-4", area: "Социально-эмоциональное развитие", subarea: "Эмоции", monthTheme: "Я и моя семья", weekTheme: "Эмоции", format: "PNG", audience: "teacher", source: "system", folder: "Материалы системы", fileName: "emotions_cards.png" },
  { id: "mat-lib-004", title: "Презентация: Времена года", type: "Презентация", ageCategory: "5-6", area: "Речь, общение, чтение и письмо", subarea: "Связная речь", monthTheme: "Природа вокруг нас", weekTheme: "Осень", format: "PPTX", audience: "teacher", source: "system", folder: "Материалы системы", fileName: "seasons.pptx" },
  { id: "mat-lib-005", title: "Инструкция: Работа в центре науки", type: "Инструкция", ageCategory: "5-6", area: "Физическое развитие и ЗОЖ", subarea: "Безопасность", monthTheme: "Безопасность", weekTheme: "Правила поведения", format: "DOCX", audience: "teacher", source: "system", folder: "Материалы системы", fileName: "science_center.docx" },
  { id: "mat-lib-006", title: "Материал для родителей: Развитие речи дома", type: "Материал для родителей", ageCategory: "4-5", area: "Речь, общение, чтение и письмо", subarea: "Активная речь", monthTheme: "Мир вокруг нас", weekTheme: "Домашние животные", format: "PDF", audience: "parent", source: "organization", folder: "Материалы организации", fileName: "speech_home.pdf" },
  { id: "mat-lib-007", title: "Плакат: Цвета и формы", type: "Плакат", ageCategory: "3-4", area: "Творческое развитие", subarea: "Изобразительная деятельность", monthTheme: "Цвета вокруг нас", weekTheme: "Формы и цвета", format: "SVG", audience: "child", source: "system", folder: "Материалы системы", fileName: "colors_shapes.svg" },
  { id: "mat-lib-008", title: "Шаблон наблюдения: Крупная моторика", type: "Шаблон", ageCategory: "4-5", area: "Физическое развитие и ЗОЖ", subarea: "Крупная моторика", monthTheme: "Здоровый образ жизни", weekTheme: "Подвижные игры", format: "XLSX", audience: "teacher", source: "organization", folder: "Рабочие материалы воспитателя", fileName: "gross_motor.xlsx" },
  { id: "mat-lib-009", title: "Материал к игре Bilimtoy: Найди пару", type: "Материал к игре Bilimtoy", ageCategory: "4-5", area: "Познавательное развитие", subarea: "Память и внимание", monthTheme: "Мир вокруг нас", weekTheme: "Домашние животные", format: "PDF", audience: "child", source: "system", folder: "Материалы системы", fileName: "find_pair.pdf", gameTitle: "Найди пару" },
  { id: "mat-lib-010", title: "Материал к игре Bilimtoy: Собери слово", type: "Материал к игре Bilimtoy", ageCategory: "5-6", area: "Речь, общение, чтение и письмо", subarea: "Фонематический слух", monthTheme: "Буквы и звуки", weekTheme: "Алфавит", format: "PDF", audience: "child", source: "system", folder: "Материалы системы", fileName: "build_word.pdf", gameTitle: "Собери слово" },
  { id: "mat-lib-011", title: "Карточки: Опиши предмет", type: "Карточки", ageCategory: "4-5", area: "Речь, общение, чтение и письмо", subarea: "Активная речь", monthTheme: "Я и моя семья", weekTheme: "Моя семья", format: "PDF", audience: "teacher", source: "system", folder: "Системная папка", fileName: "describe_object.pdf" },
  { id: "mat-lib-012", title: "Рабочий лист: Простые предложения", type: "Рабочий лист", ageCategory: "4-5", area: "Речь, общение, чтение и письмо", subarea: "Активная речь", monthTheme: "Я и моя семья", weekTheme: "Моя семья", format: "DOCX", audience: "child", source: "system", folder: "Системная папка", fileName: "simple_sentences.docx" },
  { id: "mat-lib-013", title: "Игра: Кто что делает?", type: "Игра", ageCategory: "4-5", area: "Речь, общение, чтение и письмо", subarea: "Активная речь", monthTheme: "Я и моя семья", weekTheme: "Моя семья", format: "PDF", audience: "child", source: "organization", folder: "Речевые упражнения", fileName: "who_does_what.pdf" },
  { id: "mat-lib-014", title: "Аудиозаписи: Чистоговорки", type: "Аудио", ageCategory: "4-5", area: "Речь, общение, чтение и письмо", subarea: "Активная речь", monthTheme: "Я и моя семья", weekTheme: "Моя семья", format: "MP3", audience: "teacher", source: "organization", folder: "Речевые упражнения", fileName: "tongue_twisters.mp3" },
];

export const indicatorMaterialContext = {
  area: "Речь, общение, чтение и письмо",
  subarea: "Активная речь",
  ageCategory: "4-5" as ProgramAgeCategory,
};

export const folderGroups = [
  {
    id: "system",
    title: "Системная папка",
    materials: mockLearningMaterials.filter((material) => material.folder === "Системная папка"),
  },
  {
    id: "organization",
    title: "Материалы организации",
    materials: mockLearningMaterials.filter((material) => material.folder === "Речевые упражнения"),
  },
  {
    id: "teacher",
    title: "Рабочие материалы воспитателя",
    materials: mockLearningMaterials.filter((material) => material.source === "teacher"),
  },
];
