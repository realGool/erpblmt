export type TariffType = "state" | "commercial";
export type TariffStatus = "active" | "archived";
export type TariffPeriod = "month" | "year";
export type PaymentStatus = "paid" | "pending" | "overdue";
export type PaymentMethod = "cash" | "card" | "bank";

export interface Tariff {
  id: string;
  name: string;
  type: TariffType;
  status: TariffStatus;
  price: number;
  period: TariffPeriod;
  conditions: string;
  createdAt: string;
  createdBy: string;
}

export interface Payment {
  id: string;
  childName: string;
  parentName: string;
  group: string;
  branch: string;
  tariffName: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  invoiceNumber: string;
  period: string;
  dueDate: string;
  paidAt?: string;
  comment: string;
}

export const financeBranches = [
  { label: "Детский сад №12 «Болажон»", value: "bolajon" },
  { label: "Bilimtoy Kids Yunusobod", value: "yunusobod" },
  { label: "Bilimtoy Kids Chilonzor", value: "chilonzor" },
];

export const tariffs: Tariff[] = [
  {
    id: "tariff-001",
    name: "Стандарт",
    type: "state",
    status: "active",
    price: 850000,
    period: "month",
    conditions: "Стандартное пребывание в рабочие дни.",
    createdAt: "05.01.2024",
    createdBy: "Исломов Б.",
  },
  {
    id: "tariff-002",
    name: "Гос. льготный",
    type: "state",
    status: "active",
    price: 425000,
    period: "month",
    conditions: "Для льготных категорий, скидка 50%.",
    createdAt: "12.02.2024",
    createdBy: "Исломов Б.",
  },
  {
    id: "tariff-003",
    name: "Полный день",
    type: "commercial",
    status: "active",
    price: 2400000,
    period: "month",
    conditions: "Пребывание с 7:30 до 18:30, питание 4 раза в день.",
    createdAt: "28.02.2024",
    createdBy: "Исломов Б.",
  },
  {
    id: "tariff-004",
    name: "Кратковременное пребывание",
    type: "commercial",
    status: "active",
    price: 1200000,
    period: "month",
    conditions: "Пребывание до 4 часов в день.",
    createdAt: "15.03.2024",
    createdBy: "Исломов Б.",
  },
  {
    id: "tariff-005",
    name: "Подготовительная группа",
    type: "commercial",
    status: "active",
    price: 2000000,
    period: "year",
    conditions: "Подготовка к школе, дополнительные занятия включены.",
    createdAt: "10.04.2024",
    createdBy: "Исломов Б.",
  },
  {
    id: "tariff-006",
    name: "Индивидуальный льготный",
    type: "state",
    status: "archived",
    price: 300000,
    period: "year",
    conditions: "Для отдельных льготных категорий, архивный.",
    createdAt: "20.05.2023",
    createdBy: "Исломов Б.",
  },
];

export const payments: Payment[] = [
  {
    id: "PAY-2026-001",
    childName: "Алихан Рахимов",
    parentName: "Рахимова Дилноза",
    group: "Жасмин",
    branch: "Детский сад №12 «Болажон»",
    tariffName: "Стандарт",
    amount: 850000,
    paidAmount: 850000,
    status: "paid",
    method: "card",
    invoiceNumber: "INV-2026-0512",
    period: "Май 2026",
    dueDate: "10.05.2026",
    paidAt: "08.05.2026",
    comment: "Оплата за май проведена полностью.",
  },
  {
    id: "PAY-2026-002",
    childName: "София Мирзаева",
    parentName: "Мирзаев Акмал",
    group: "Радуга",
    branch: "Детский сад №12 «Болажон»",
    tariffName: "Полный день",
    amount: 2400000,
    paidAmount: 1200000,
    status: "pending",
    method: "bank",
    invoiceNumber: "INV-2026-0513",
    period: "Май 2026",
    dueDate: "12.05.2026",
    comment: "Частичная оплата, остаток ожидается до конца недели.",
  },
  {
    id: "PAY-2026-003",
    childName: "Амир Саидов",
    parentName: "Саидова Малика",
    group: "Жасмин",
    branch: "Bilimtoy Kids Yunusobod",
    tariffName: "Гос. льготный",
    amount: 425000,
    paidAmount: 425000,
    status: "paid",
    method: "cash",
    invoiceNumber: "INV-2026-0514",
    period: "Май 2026",
    dueDate: "10.05.2026",
    paidAt: "09.05.2026",
    comment: "Льготный тариф подтверждён.",
  },
  {
    id: "PAY-2026-004",
    childName: "Данияр Каримов",
    parentName: "Каримова Саида",
    group: "Юлдуз",
    branch: "Bilimtoy Kids Chilonzor",
    tariffName: "Кратковременное пребывание",
    amount: 1200000,
    paidAmount: 0,
    status: "overdue",
    method: "bank",
    invoiceNumber: "INV-2026-0515",
    period: "Май 2026",
    dueDate: "05.05.2026",
    comment: "Просрочена оплата за текущий месяц.",
  },
  {
    id: "PAY-2026-005",
    childName: "Тимур Абдуллаев",
    parentName: "Абдуллаев Бахтиёр",
    group: "Солнышко",
    branch: "Детский сад №12 «Болажон»",
    tariffName: "Подготовительная группа",
    amount: 2000000,
    paidAmount: 2000000,
    status: "paid",
    method: "card",
    invoiceNumber: "INV-2026-0516",
    period: "Май 2026",
    dueDate: "10.05.2026",
    paidAt: "07.05.2026",
    comment: "Оплата принята через карту.",
  },
  {
    id: "PAY-2026-006",
    childName: "Аделя Бобоева",
    parentName: "Бобоев Шухрат",
    group: "Звёздочки",
    branch: "Bilimtoy Kids Yunusobod",
    tariffName: "Полный день",
    amount: 2400000,
    paidAmount: 1800000,
    status: "pending",
    method: "bank",
    invoiceNumber: "INV-2026-0517",
    period: "Май 2026",
    dueDate: "15.05.2026",
    comment: "Ожидается доплата 600 000 сум.",
  },
  {
    id: "PAY-2026-007",
    childName: "Мадина Юсупова",
    parentName: "Юсупова Нигина",
    group: "Радуга",
    branch: "Bilimtoy Kids Chilonzor",
    tariffName: "Стандарт",
    amount: 850000,
    paidAmount: 250000,
    status: "overdue",
    method: "card",
    invoiceNumber: "INV-2026-0518",
    period: "Май 2026",
    dueDate: "06.05.2026",
    comment: "Просрочена доплата по стандартному тарифу.",
  },
  {
    id: "PAY-2026-008",
    childName: "Бекзод Хамидов",
    parentName: "Хамидов Рустам",
    group: "Солнышко",
    branch: "Детский сад №12 «Болажон»",
    tariffName: "Полный день",
    amount: 2400000,
    paidAmount: 900000,
    status: "overdue",
    method: "bank",
    invoiceNumber: "INV-2026-0519",
    period: "Май 2026",
    dueDate: "04.05.2026",
    comment: "Требуется погасить остаток по тарифу полного дня.",
  },
];
