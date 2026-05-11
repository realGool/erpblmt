export interface ResourceBranch {
  id: string;
  name: string;
  address: string;
  objectsCount: number;
  totalValue: number;
}

export type InventoryCategory = "toys" | "books" | "stationery" | "dishes" | "furniture";

export interface InventoryObject {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  lastInventoryDate: string;
  author: string;
}

export interface InventoryHistoryRecord {
  id: number;
  date: string;
  before: number;
  after: number;
  author: string;
}

export type FoodStockStatus = "normal" | "low" | "expiring" | "archived";
export type ProductBatchStatus = "active" | "used" | "expired" | "writtenOff";

export interface FoodProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  nearestExpiry: string;
  averagePrice: number;
  status: FoodStockStatus;
  suppliers: string[];
}

export interface ProductBatch {
  id: string;
  productName: string;
  supplier: string;
  receivedAt: string;
  receivedQuantity: number;
  currentQuantity: number;
  unitPrice: number;
  expiryDate: string;
  status: ProductBatchStatus;
  author: string;
}

export interface WriteOffRecord {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  supplier: string;
  reason: ProductBatchStatus;
  author: string;
}

export type PurchaseStatus = "draft" | "approved" | "inProgress" | "overdue" | "done" | "cancelled";

export interface PurchaseRequest {
  id: string;
  title: string;
  branch: string;
  supplier: string;
  category: string;
  itemsCount: number;
  totalValue: number;
  dueDate: string;
  status: PurchaseStatus;
  author: string;
}

export interface Supplier {
  id: string;
  contactName: string;
  company: string;
  taxId: string;
  phone: string;
  address: string;
  categories: string[];
  addedAt: string;
  author: string;
}

export interface SupplierGood {
  id: number;
  supplierId: string;
  name: string;
  category: string;
  price: number;
  unit: string;
}

export const resourceBranches: ResourceBranch[] = [
  {
    id: "branch-astana",
    name: "Bilimtoy Astana (Центральный филиал)",
    address: "010000, г. Астана, ул. Достык, 13, район Есиль",
    objectsCount: 724,
    totalValue: 1245680450,
  },
  {
    id: "branch-almaty",
    name: "Bilimtoy Almaty",
    address: "г. Алматы, мкр. Алатау, ул. Бауыржана, 45",
    objectsCount: 612,
    totalValue: 985420000,
  },
  {
    id: "branch-saryarka",
    name: "Bilimtoy Saryarka",
    address: "г. Астана, ул. Сарыарка, 31",
    objectsCount: 538,
    totalValue: 748360000,
  },
  {
    id: "branch-nurly-zhol",
    name: "Bilimtoy Nurly Zhol",
    address: "г. Астана, пр. Туран, 55/1",
    objectsCount: 487,
    totalValue: 621250000,
  },
  {
    id: "branch-chilonzor",
    name: "Bilimtoy Kids Chilonzor",
    address: "г. Ташкент, Чиланзарский район, 12 квартал",
    objectsCount: 452,
    totalValue: 518900000,
  },
];

export const inventoryObjects: InventoryObject[] = [
  {
    id: "INV-000724",
    name: "Планшет обучающий",
    category: "toys",
    quantity: 12,
    unit: "шт",
    unitPrice: 60000,
    lastInventoryDate: "24.04.2026",
    author: "Сагындыкова А.",
  },
  {
    id: "INV-000723",
    name: "Набор кубиков",
    category: "toys",
    quantity: 18,
    unit: "комплект",
    unitPrice: 9000,
    lastInventoryDate: "18.04.2026",
    author: "Куанышбаева Г.",
  },
  {
    id: "INV-000722",
    name: "Книга «Мир вокруг нас»",
    category: "books",
    quantity: 45,
    unit: "шт",
    unitPrice: 2500,
    lastInventoryDate: "15.04.2026",
    author: "Ибраева М.",
  },
  {
    id: "INV-000721",
    name: "Цветные карандаши",
    category: "stationery",
    quantity: 30,
    unit: "пачка",
    unitPrice: 1500,
    lastInventoryDate: "12.04.2026",
    author: "Сагындыкова А.",
  },
  {
    id: "INV-000720",
    name: "Рабочие тетради",
    category: "stationery",
    quantity: 60,
    unit: "шт",
    unitPrice: 900,
    lastInventoryDate: "10.04.2026",
    author: "Куанышбаева Г.",
  },
  {
    id: "INV-000719",
    name: "Детская посуда",
    category: "dishes",
    quantity: 20,
    unit: "комплект",
    unitPrice: 4000,
    lastInventoryDate: "08.04.2026",
    author: "Ибраева М.",
  },
  {
    id: "INV-000718",
    name: "Развивающий пазл",
    category: "toys",
    quantity: 25,
    unit: "шт",
    unitPrice: 2500,
    lastInventoryDate: "05.04.2026",
    author: "Сагындыкова А.",
  },
  {
    id: "INV-000717",
    name: "Конструктор",
    category: "toys",
    quantity: 15,
    unit: "комплект",
    unitPrice: 9000,
    lastInventoryDate: "03.04.2026",
    author: "Куанышбаева Г.",
  },
  {
    id: "INV-000716",
    name: "Настольная игра",
    category: "toys",
    quantity: 10,
    unit: "шт",
    unitPrice: 4000,
    lastInventoryDate: "01.04.2026",
    author: "Ибраева М.",
  },
  {
    id: "INV-000715",
    name: "Методические карточки",
    category: "stationery",
    quantity: 35,
    unit: "короб",
    unitPrice: 1500,
    lastInventoryDate: "28.03.2026",
    author: "Сагындыкова А.",
  },
];

export const inventoryHistory: InventoryHistoryRecord[] = [
  { id: 1, date: "24.04.2026 14:32", before: 10, after: 12, author: "Сагындыкова А." },
  { id: 2, date: "18.04.2026 10:15", before: 8, after: 10, author: "Куанышбаева Г." },
  { id: 3, date: "15.04.2026 16:45", before: 10, after: 12, author: "Ибраева М." },
  { id: 4, date: "12.04.2026 11:20", before: 12, after: 11, author: "Сагындыкова А." },
  { id: 5, date: "10.04.2026 09:05", before: 13, after: 12, author: "Куанышбаева Г." },
  { id: 6, date: "08.04.2026 15:30", before: 12, after: 13, author: "Ибраева М." },
  { id: 7, date: "01.04.2026 12:10", before: 11, after: 12, author: "Сагындыкова А." },
];

export const foodProducts: FoodProduct[] = [
  { id: "PRD-0001", name: "Молоко 2,5%", category: "Молочные продукты", unit: "л", currentStock: 120, minimumStock: 50, nearestExpiry: "25.05.2026", averagePrice: 8500, status: "normal", suppliers: ["TOO Fresh Foods KZ", "Milk House", "Dairy Group"] },
  { id: "PRD-0002", name: "Яблоки", category: "Фрукты", unit: "кг", currentStock: 35, minimumStock: 20, nearestExpiry: "19.05.2026", averagePrice: 6500, status: "low", suppliers: ["ИП Алма-Фрут"] },
  { id: "PRD-0003", name: "Картофель", category: "Овощи", unit: "кг", currentStock: 8, minimumStock: 30, nearestExpiry: "—", averagePrice: 4200, status: "low", suppliers: ["TOO Agro Line"] },
  { id: "PRD-0004", name: "Рис длиннозерный", category: "Крупы", unit: "кг", currentStock: 42, minimumStock: 20, nearestExpiry: "12.11.2026", averagePrice: 3720, status: "normal", suppliers: ["TOO Agro Line"] },
  { id: "PRD-0005", name: "Гречка", category: "Крупы", unit: "кг", currentStock: 15, minimumStock: 15, nearestExpiry: "30.08.2026", averagePrice: 9000, status: "expiring", suppliers: ["TOO Agro Line"] },
  { id: "PRD-0006", name: "Куриное филе", category: "Мясо и птица", unit: "кг", currentStock: 18, minimumStock: 10, nearestExpiry: "16.05.2026", averagePrice: 32000, status: "expiring", suppliers: ["TOO Meat & More"] },
  { id: "PRD-0007", name: "Морковь", category: "Овощи", unit: "кг", currentStock: 12, minimumStock: 15, nearestExpiry: "26.05.2026", averagePrice: 3800, status: "low", suppliers: ["TOO Agro Line"] },
  { id: "PRD-0008", name: "Творог 5%", category: "Молочные продукты", unit: "кг", currentStock: 22, minimumStock: 10, nearestExpiry: "21.05.2026", averagePrice: 14500, status: "expiring", suppliers: ["Milk House"] },
  { id: "PRD-0009", name: "Бананы", category: "Фрукты", unit: "кг", currentStock: 28, minimumStock: 15, nearestExpiry: "14.05.2026", averagePrice: 18000, status: "expiring", suppliers: ["ИП Tropical Fruits"] },
  { id: "PRD-0010", name: "Сахар-песок", category: "Бакалея", unit: "кг", currentStock: 60, minimumStock: 20, nearestExpiry: "01.01.2027", averagePrice: 11000, status: "normal", suppliers: ["TOO Agro Line"] },
];

export const productBatches: ProductBatch[] = [
  { id: "BAT-2025-0001", productName: "Молоко 2,5%", supplier: "TOO Fresh Foods KZ", receivedAt: "20.05.2026", receivedQuantity: 120, currentQuantity: 120, unitPrice: 8500, expiryDate: "25.05.2026", status: "active", author: "Алия Нурланова" },
  { id: "BAT-2025-0002", productName: "Молоко 2,5%", supplier: "Milk House", receivedAt: "18.05.2026", receivedQuantity: 100, currentQuantity: 40, unitPrice: 8400, expiryDate: "23.05.2026", status: "active", author: "Алия Нурланова" },
  { id: "BAT-2025-0003", productName: "Молоко 2,5%", supplier: "Dairy Group", receivedAt: "15.05.2026", receivedQuantity: 150, currentQuantity: 0, unitPrice: 8300, expiryDate: "22.05.2026", status: "used", author: "Айгерим Тулегенова" },
  { id: "BAT-2025-0004", productName: "Молоко 2,5%", supplier: "TOO Fresh Foods KZ", receivedAt: "12.05.2026", receivedQuantity: 120, currentQuantity: 0, unitPrice: 8200, expiryDate: "19.05.2026", status: "used", author: "Айгерим Тулегенова" },
  { id: "BAT-2025-0005", productName: "Молоко 2,5%", supplier: "Milk House", receivedAt: "10.05.2026", receivedQuantity: 80, currentQuantity: 0, unitPrice: 8300, expiryDate: "17.05.2026", status: "expired", author: "Нурлан Бекетов" },
  { id: "BAT-2025-0006", productName: "Молоко 2,5%", supplier: "Dairy Group", receivedAt: "07.05.2026", receivedQuantity: 100, currentQuantity: 0, unitPrice: 8200, expiryDate: "14.05.2026", status: "writtenOff", author: "Жанар Сулейменова" },
];

export const writeOffHistory: WriteOffRecord[] = [
  { id: "WO-001", date: "25.05.2026", productName: "Молоко 2,5%", quantity: 20, unit: "л", expiryDate: "24.05.2026", supplier: "Milk House", reason: "active", author: "Алия Нурланова" },
  { id: "WO-002", date: "23.05.2026", productName: "Молоко 2,5%", quantity: 15, unit: "л", expiryDate: "23.05.2026", supplier: "TOO Fresh Foods KZ", reason: "used", author: "Нурлан Бекетов" },
  { id: "WO-003", date: "20.05.2026", productName: "Молоко 2,5%", quantity: 30, unit: "л", expiryDate: "20.05.2026", supplier: "Dairy Group", reason: "expired", author: "Айгерим Тулегенова" },
  { id: "WO-004", date: "17.05.2026", productName: "Молоко 2,5%", quantity: 10, unit: "л", expiryDate: "17.05.2026", supplier: "Milk House", reason: "used", author: "Жанар Сулейменова" },
  { id: "WO-005", date: "15.05.2026", productName: "Молоко 2,5%", quantity: 8, unit: "л", expiryDate: "15.05.2026", supplier: "TOO Fresh Foods KZ", reason: "writtenOff", author: "Алия Нурланова" },
];

export const purchaseRequests: PurchaseRequest[] = [
  { id: "PO-00124", title: "Закупка продуктов на неделю", branch: "Bilimtoy Astana", supplier: "TOO Fresh Foods KZ", category: "Продукты питания", itemsCount: 12, totalValue: 2486000, dueDate: "25.05.2026", status: "inProgress", author: "Алия Нурланова" },
  { id: "PO-00123", title: "Канцелярия для старших групп", branch: "Bilimtoy Kids Chilonzor", supplier: "Office Market", category: "Канцелярия", itemsCount: 8, totalValue: 640000, dueDate: "27.05.2026", status: "approved", author: "Ибраева М." },
  { id: "PO-00122", title: "Обновление игрушек", branch: "Bilimtoy Saryarka", supplier: "Toy Land", category: "Игрушки", itemsCount: 6, totalValue: 920000, dueDate: "20.05.2026", status: "overdue", author: "Куанышбаева Г." },
  { id: "PO-00121", title: "Бытовая химия", branch: "Bilimtoy Almaty", supplier: "Clean Service", category: "Бытовая химия", itemsCount: 5, totalValue: 380000, dueDate: "18.05.2026", status: "done", author: "Сагындыкова А." },
];

export const suppliers: Supplier[] = [
  { id: "SUP-001", contactName: "Алишер Каримов", company: "TOO Fresh Foods KZ", taxId: "302145678901", phone: "+7 701 555 10 20", address: "г. Астана, ул. Кабанбай батыра, 21", categories: ["Продукты питания"], addedAt: "12.03.2026", author: "Алия Нурланова" },
  { id: "SUP-002", contactName: "Марина Петрова", company: "Milk House", taxId: "408965123456", phone: "+7 702 444 11 22", address: "г. Алматы, ул. Абая, 77", categories: ["Продукты питания"], addedAt: "18.03.2026", author: "Нурлан Бекетов" },
  { id: "SUP-003", contactName: "Сергей Иванов", company: "Office Market", taxId: "501245678912", phone: "+7 705 333 44 55", address: "г. Ташкент, ул. Навои, 15", categories: ["Канцелярия"], addedAt: "22.03.2026", author: "Ибраева М." },
  { id: "SUP-004", contactName: "Динара Ахметова", company: "Toy Land", taxId: "602345789123", phone: "+7 707 222 33 44", address: "г. Астана, ул. Сарыарка, 90", categories: ["Игрушки", "Электроника"], addedAt: "25.03.2026", author: "Куанышбаева Г." },
];

export const supplierGoods: SupplierGood[] = [
  { id: 1, supplierId: "SUP-001", name: "Молоко 2,5%", category: "Продукты питания", price: 8500, unit: "л" },
  { id: 2, supplierId: "SUP-001", name: "Рис длиннозерный", category: "Продукты питания", price: 3720, unit: "кг" },
  { id: 3, supplierId: "SUP-002", name: "Творог 5%", category: "Продукты питания", price: 14500, unit: "кг" },
  { id: 4, supplierId: "SUP-003", name: "Цветные карандаши", category: "Канцелярия", price: 1500, unit: "пачка" },
  { id: 5, supplierId: "SUP-004", name: "Развивающий пазл", category: "Игрушки", price: 2500, unit: "шт" },
];
