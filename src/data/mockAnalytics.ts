import type { NicuValue } from "../components/ui";

export type DasturRowType = "area" | "subarea" | "indicator";
export type DasturSource = "manual" | "bilimtoy" | "combined" | "none";

export interface DasturAnalysisRow {
  id: string;
  type: DasturRowType;
  title: string;
  area: string;
  subarea?: string;
  nicu: NicuValue;
  filledPercent: number;
  source: DasturSource;
}

export interface DasturIndicatorDetail {
  id: string;
  title: string;
  area: string;
  subarea: string;
  ageGroup: string;
  branches: Array<{
    name: string;
    nicu: NicuValue;
  }>;
  sources: {
    manual: number;
    bilimtoy: number;
  };
}

export type DasturAreaKey = "physical" | "social" | "speech" | "cognitive" | "creative";

export interface ComparisonBranchRecord {
  id: string;
  name: string;
  childrenCount: number;
  ageGroups: string;
  areas: Record<DasturAreaKey, NicuValue>;
}

export interface ComparisonGroupRecord {
  id: string;
  name: string;
  branchId: string;
  branchName: string;
  ageGroup: string;
  childrenCount: number;
  completionPercent: number;
  areas: Record<DasturAreaKey, number>;
}

export interface ComparisonChildRecord {
  id: string;
  fullName: string;
  groupName: string;
  age: string;
  completionPercent: number;
  areas: Record<DasturAreaKey, number>;
}

export const analyticsBranches = [
  { label: "Все филиалы", value: "all" },
  { label: "Bilimtoy Kids Yunusobod", value: "yunusobod" },
  { label: "Bilimtoy Kids Chilonzor", value: "chilonzor" },
  { label: "Bilimtoy Kids Mirzo-Ulugbek", value: "mirzo-ulugbek" },
];

export const dasturAgeGroups = [
  { label: "3–4 года", value: "3-4" },
  { label: "4–5 лет", value: "4-5" },
  { label: "5–6 лет", value: "5-6" },
  { label: "6–7 лет", value: "6-7" },
];

export const comparisonPeriods = [
  { label: "Текущий цикл", value: "current" },
  { label: "Март 2026", value: "2026-03" },
  { label: "Апрель 2026", value: "2026-04" },
  { label: "Май 2026", value: "2026-05" },
];

export const dasturAreaKeys: DasturAreaKey[] = ["physical", "social", "speech", "cognitive", "creative"];

export const dasturSummaryStats = {
  indicators: 128,
  filledPercent: 87,
  manualSourcePercent: 68,
  bilimtoySourcePercent: 32,
};

export const dasturAnalysisRows: DasturAnalysisRow[] = [
  {
    id: "physical",
    type: "area",
    title: "Физическое развитие и ЗОЖ",
    area: "Физическое развитие и ЗОЖ",
    nicu: { n: 12, i: 24, ch: 48, u: 16 },
    filledPercent: 84,
    source: "none",
  },
  {
    id: "gross-motor",
    type: "subarea",
    title: "Крупная моторика",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Крупная моторика",
    nicu: { n: 8, i: 20, ch: 52, u: 20 },
    filledPercent: 91,
    source: "none",
  },
  {
    id: "walk-balance",
    type: "indicator",
    title: "Сохраняет равновесие во время ходьбы по верёвке",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Крупная моторика",
    nicu: { n: 11, i: 22, ch: 50, u: 17 },
    filledPercent: 94,
    source: "combined",
  },
  {
    id: "walk-toes",
    type: "indicator",
    title: "Ходит на носочках, пятках, на внешней стороне стопы",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Крупная моторика",
    nicu: { n: 5, i: 18, ch: 54, u: 23 },
    filledPercent: 88,
    source: "manual",
  },
  {
    id: "run-knees",
    type: "indicator",
    title: "Бегает, высоко поднимая колени",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Крупная моторика",
    nicu: { n: 9, i: 21, ch: 51, u: 19 },
    filledPercent: 86,
    source: "bilimtoy",
  },
  {
    id: "fine-motor",
    type: "subarea",
    title: "Мелкая моторика",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Мелкая моторика",
    nicu: { n: 10, i: 23, ch: 49, u: 18 },
    filledPercent: 82,
    source: "none",
  },
  {
    id: "draw-lines",
    type: "indicator",
    title: "Проводит прямые и волнистые линии по образцу",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Мелкая моторика",
    nicu: { n: 13, i: 25, ch: 47, u: 15 },
    filledPercent: 80,
    source: "manual",
  },
  {
    id: "sensor-motor",
    type: "subarea",
    title: "Сенсомоторика",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Сенсомоторика",
    nicu: { n: 14, i: 26, ch: 45, u: 15 },
    filledPercent: 79,
    source: "none",
  },
  {
    id: "social",
    type: "area",
    title: "Социально-эмоциональное развитие",
    area: "Социально-эмоциональное развитие",
    nicu: { n: 9, i: 21, ch: 50, u: 20 },
    filledPercent: 86,
    source: "none",
  },
  {
    id: "communication",
    type: "area",
    title: "Речь, общение, чтение и письмо",
    area: "Речь, общение, чтение и письмо",
    nicu: { n: 15, i: 27, ch: 43, u: 15 },
    filledPercent: 81,
    source: "none",
  },
  {
    id: "cognitive",
    type: "area",
    title: "Познавательное развитие",
    area: "Познавательное развитие",
    nicu: { n: 7, i: 18, ch: 55, u: 20 },
    filledPercent: 89,
    source: "none",
  },
  {
    id: "creative",
    type: "area",
    title: "Творческое развитие",
    area: "Творческое развитие",
    nicu: { n: 11, i: 24, ch: 46, u: 19 },
    filledPercent: 83,
    source: "none",
  },
];

export const dasturIndicatorDetails: Record<string, DasturIndicatorDetail> = {
  "walk-balance": {
    id: "walk-balance",
    title: "Сохраняет равновесие во время ходьбы по верёвке",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Крупная моторика",
    ageGroup: "5–6 лет",
    branches: [
      { name: "Bilimtoy Kids Yunusobod", nicu: { n: 3, i: 15, ch: 56, u: 26 } },
      { name: "Bilimtoy Kids Chilonzor", nicu: { n: 4, i: 17, ch: 54, u: 25 } },
      { name: "Bilimtoy Kids Mirzo-Ulugbek", nicu: { n: 9, i: 24, ch: 50, u: 17 } },
    ],
    sources: { manual: 68, bilimtoy: 32 },
  },
  "walk-toes": {
    id: "walk-toes",
    title: "Ходит на носочках, пятках, на внешней стороне стопы",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Крупная моторика",
    ageGroup: "5–6 лет",
    branches: [
      { name: "Bilimtoy Kids Yunusobod", nicu: { n: 4, i: 15, ch: 55, u: 26 } },
      { name: "Bilimtoy Kids Chilonzor", nicu: { n: 5, i: 18, ch: 54, u: 23 } },
      { name: "Bilimtoy Kids Mirzo-Ulugbek", nicu: { n: 7, i: 21, ch: 51, u: 21 } },
    ],
    sources: { manual: 100, bilimtoy: 0 },
  },
  "run-knees": {
    id: "run-knees",
    title: "Бегает, высоко поднимая колени",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Крупная моторика",
    ageGroup: "5–6 лет",
    branches: [
      { name: "Bilimtoy Kids Yunusobod", nicu: { n: 6, i: 18, ch: 53, u: 23 } },
      { name: "Bilimtoy Kids Chilonzor", nicu: { n: 9, i: 21, ch: 51, u: 19 } },
      { name: "Bilimtoy Kids Mirzo-Ulugbek", nicu: { n: 11, i: 24, ch: 48, u: 17 } },
    ],
    sources: { manual: 0, bilimtoy: 100 },
  },
  "draw-lines": {
    id: "draw-lines",
    title: "Проводит прямые и волнистые линии по образцу",
    area: "Физическое развитие и ЗОЖ",
    subarea: "Мелкая моторика",
    ageGroup: "5–6 лет",
    branches: [
      { name: "Bilimtoy Kids Yunusobod", nicu: { n: 10, i: 22, ch: 50, u: 18 } },
      { name: "Bilimtoy Kids Chilonzor", nicu: { n: 13, i: 25, ch: 47, u: 15 } },
      { name: "Bilimtoy Kids Mirzo-Ulugbek", nicu: { n: 15, i: 27, ch: 44, u: 14 } },
    ],
    sources: { manual: 100, bilimtoy: 0 },
  },
};

export const comparisonBranches: ComparisonBranchRecord[] = [
  {
    id: "yunusobod",
    name: "Bilimtoy Kids Yunusobod",
    childrenCount: 148,
    ageGroups: "3–7 лет",
    areas: {
      physical: { n: 6, i: 17, ch: 51, u: 26 },
      social: { n: 7, i: 18, ch: 49, u: 26 },
      speech: { n: 9, i: 22, ch: 46, u: 23 },
      cognitive: { n: 5, i: 16, ch: 53, u: 26 },
      creative: { n: 8, i: 20, ch: 48, u: 24 },
    },
  },
  {
    id: "chilonzor",
    name: "Bilimtoy Kids Chilonzor",
    childrenCount: 132,
    ageGroups: "3–7 лет",
    areas: {
      physical: { n: 8, i: 20, ch: 49, u: 23 },
      social: { n: 9, i: 21, ch: 47, u: 23 },
      speech: { n: 12, i: 25, ch: 43, u: 20 },
      cognitive: { n: 7, i: 18, ch: 51, u: 24 },
      creative: { n: 10, i: 22, ch: 46, u: 22 },
    },
  },
  {
    id: "mirzo-ulugbek",
    name: "Bilimtoy Kids Mirzo-Ulugbek",
    childrenCount: 121,
    ageGroups: "4–7 лет",
    areas: {
      physical: { n: 5, i: 16, ch: 52, u: 27 },
      social: { n: 6, i: 17, ch: 51, u: 26 },
      speech: { n: 8, i: 20, ch: 48, u: 24 },
      cognitive: { n: 4, i: 15, ch: 54, u: 27 },
      creative: { n: 7, i: 19, ch: 49, u: 25 },
    },
  },
];

export const comparisonGroups: ComparisonGroupRecord[] = [
  {
    id: "jasmine",
    name: "Жасмин",
    branchId: "yunusobod",
    branchName: "Bilimtoy Kids Yunusobod",
    ageGroup: "5–6 лет",
    childrenCount: 24,
    completionPercent: 91,
    areas: { physical: 77, social: 75, speech: 70, cognitive: 79, creative: 73 },
  },
  {
    id: "yulduz",
    name: "Юлдуз",
    branchId: "yunusobod",
    branchName: "Bilimtoy Kids Yunusobod",
    ageGroup: "4–5 лет",
    childrenCount: 22,
    completionPercent: 87,
    areas: { physical: 73, social: 71, speech: 68, cognitive: 75, creative: 70 },
  },
  {
    id: "gulbahor",
    name: "Гулбахор",
    branchId: "chilonzor",
    branchName: "Bilimtoy Kids Chilonzor",
    ageGroup: "5–6 лет",
    childrenCount: 26,
    completionPercent: 84,
    areas: { physical: 72, social: 70, speech: 63, cognitive: 75, creative: 68 },
  },
  {
    id: "shark",
    name: "Шарк",
    branchId: "mirzo-ulugbek",
    branchName: "Bilimtoy Kids Mirzo-Ulugbek",
    ageGroup: "6–7 лет",
    childrenCount: 24,
    completionPercent: 90,
    areas: { physical: 79, social: 77, speech: 72, cognitive: 81, creative: 74 },
  },
];

export const comparisonChildren: ComparisonChildRecord[] = [
  {
    id: "child-1",
    fullName: "Каримов Азиз",
    groupName: "Жасмин",
    age: "5 лет",
    completionPercent: 94,
    areas: { physical: 82, social: 78, speech: 74, cognitive: 84, creative: 76 },
  },
  {
    id: "child-2",
    fullName: "Рахимова Мадина",
    groupName: "Жасмин",
    age: "5 лет",
    completionPercent: 92,
    areas: { physical: 76, social: 81, speech: 79, cognitive: 80, creative: 83 },
  },
  {
    id: "child-3",
    fullName: "Турсунов Бехруз",
    groupName: "Юлдуз",
    age: "4 года",
    completionPercent: 86,
    areas: { physical: 71, social: 68, speech: 62, cognitive: 73, creative: 69 },
  },
  {
    id: "child-4",
    fullName: "Саидова Дилноза",
    groupName: "Шарк",
    age: "6 лет",
    completionPercent: 90,
    areas: { physical: 80, social: 76, speech: 73, cognitive: 82, creative: 78 },
  },
];
