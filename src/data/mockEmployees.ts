export interface EmployeeRecord {
  id: number;
  passport: string;
  fullName: string;
  position: string;
  systemRole: string;
  age: number;
  phone: string;
  branch: string;
  contractNumber: string;
  salary: string;
}

export interface PayrollRecord {
  id: number;
  fullName: string;
  position: string;
  contractNumber: string;
  organizationBranch: string;
  currentSalary: number;
  lastPayment: number;
  paymentDate: string;
}

export type PayrollPaymentType = "salary" | "advance" | "bonus";

export interface PayrollSalaryHistory {
  id: string;
  date: string;
  type: PayrollPaymentType;
  beforeAmount: number | null;
  afterAmount: number;
  author: string;
}

export interface PayrollPayment {
  id: string;
  date: string;
  amount: number;
  type: PayrollPaymentType;
  responsible: string;
}

export interface PayrollOperation {
  id: string;
  title: string;
  meta: string;
  type: "salaryChanged" | "paymentAdded" | "bonusAdded";
}

export type RoleModuleId =
  | "organizations"
  | "groups"
  | "employees"
  | "kanban"
  | "childrenParents"
  | "bilimtoy"
  | "resources"
  | "finance"
  | "analytics"
  | "notifications"
  | "profile"
  | "dictionaries";

export interface RolePermission {
  moduleId: RoleModuleId;
  read: boolean;
  write: boolean;
  full: boolean;
}

export interface RoleUser {
  id: string;
  fullName: string;
  position: string;
  initials: string;
}

export interface EmployeeRole {
  id: number;
  name: string;
  userCount: number;
  permissions: RolePermission[];
  users: RoleUser[];
}

export const mockEmployees: EmployeeRecord[] = [
  { id: 1, passport: "AB 1234567", fullName: "Иванова Анна Сергеевна", position: "Воспитатель", systemRole: "Воспитатель", age: 29, phone: "+998 90 123-45-67", branch: "Солнышко", contractNumber: "KT-2024-0012", salary: "7 500 000 сум" },
  { id: 2, passport: "AC 7654321", fullName: "Петрова Мария Ивановна", position: "Психолог", systemRole: "Психолог", age: 32, phone: "+998 91 234-56-78", branch: "Звёздочка", contractNumber: "KT-2023-0045", salary: "8 000 000 сум" },
  { id: 3, passport: "AD 1122334", fullName: "Ким Алина Викторовна", position: "Младший воспитатель", systemRole: "Младший воспитатель", age: 27, phone: "+998 93 345-67-89", branch: "Солнышко", contractNumber: "KT-2024-0015", salary: "4 200 000 сум" },
  { id: 4, passport: "AE 9988776", fullName: "Умарова Дилором Рустамовна", position: "Музыкальный руководитель", systemRole: "Специалист", age: 31, phone: "+998 90 456-78-90", branch: "Радуга", contractNumber: "KT-2023-0038", salary: "6 500 000 сум" },
  { id: 5, passport: "AF 5544332", fullName: "Абдуллаева Бехзода Ильхомович", position: "Инструктор по физкультуре", systemRole: "Специалист", age: 28, phone: "+998 94 567-89-01", branch: "Звёздочка", contractNumber: "KT-2024-0008", salary: "6 000 000 сум" },
  { id: 6, passport: "AG 6677889", fullName: "Сиддова Гульнора Акрамовна", position: "Повар", systemRole: "Технический персонал", age: 45, phone: "+998 93 678-90-12", branch: "Радуга", contractNumber: "KT-2022-0021", salary: "4 800 000 сум" },
  { id: 7, passport: "AH 2233445", fullName: "Ходжаев Фарход Бахтиёрович", position: "Охранник", systemRole: "Технический персонал", age: 40, phone: "+998 90 789-01-23", branch: "Солнышко", contractNumber: "KT-2023-0066", salary: "3 800 000 сум" },
  { id: 8, passport: "AI 5566778", fullName: "Турсунова Шахзода Бахромовна", position: "Делопроизводитель", systemRole: "Администратор", age: 33, phone: "+998 95 890-12-34", branch: "Умнички", contractNumber: "KT-2023-0029", salary: "5 200 000 сум" },
  { id: 9, passport: "AJ 8899001", fullName: "Каримова Саида Алиовна", position: "Заведующий", systemRole: "Администратор", age: 38, phone: "+998 71 234-56-70", branch: "Умнички", contractNumber: "KT-2021-0003", salary: "10 000 000 сум" },
  { id: 10, passport: "AK 3344556", fullName: "Назарова Лола Эркиновна", position: "Медсестра", systemRole: "Медицинский работник", age: 36, phone: "+998 90 901-23-45", branch: "Радуга", contractNumber: "KT-2023-0051", salary: "5 000 000 сум" },
];

export const mockPayrollRecords: PayrollRecord[] = [
  {
    id: 1,
    fullName: "Иванова Анна Сергеевна",
    position: "Воспитатель",
    contractNumber: "KT-2024-0012",
    organizationBranch: "ДОО «Bilimtoy» / Главный филиал",
    currentSalary: 7500000,
    lastPayment: 7500000,
    paymentDate: "08.05.2026",
  },
  {
    id: 2,
    fullName: "Петрова Мария Ивановна",
    position: "Психолог",
    contractNumber: "KT-2023-0045",
    organizationBranch: "ДОО «Bilimtoy» / Филиал Чиланзар",
    currentSalary: 8000000,
    lastPayment: 8000000,
    paymentDate: "08.05.2026",
  },
  {
    id: 3,
    fullName: "Ким Алина Викторовна",
    position: "Младший воспитатель",
    contractNumber: "KT-2024-0015",
    organizationBranch: "ДОО «Bilimtoy» / Филиал Юнусабад",
    currentSalary: 4200000,
    lastPayment: 4200000,
    paymentDate: "07.05.2026",
  },
  {
    id: 4,
    fullName: "Умарова Дилором Рустамовна",
    position: "Музыкальный руководитель",
    contractNumber: "KT-2023-0038",
    organizationBranch: "ДОО «Bilimtoy» / Филиал Мирзо-Улугбек",
    currentSalary: 6500000,
    lastPayment: 6500000,
    paymentDate: "07.05.2026",
  },
  {
    id: 5,
    fullName: "Абдуллаева Бехзода Ильхомович",
    position: "Инструктор по физкультуре",
    contractNumber: "KT-2024-0008",
    organizationBranch: "ДОО «Bilimtoy» / Филиал Сергели",
    currentSalary: 6000000,
    lastPayment: 6000000,
    paymentDate: "08.05.2026",
  },
  {
    id: 6,
    fullName: "Сиддова Гульнора Акрамовна",
    position: "Повар",
    contractNumber: "KT-2022-0021",
    organizationBranch: "ДОО «Bilimtoy» / Филиал Яшнабад",
    currentSalary: 4800000,
    lastPayment: 4800000,
    paymentDate: "07.05.2026",
  },
  {
    id: 7,
    fullName: "Халилова Фариха Бахтиёровна",
    position: "Охранник",
    contractNumber: "KT-2023-0066",
    organizationBranch: "ДОО «Bilimtoy» / Филиал Бектемир",
    currentSalary: 3800000,
    lastPayment: 3800000,
    paymentDate: "08.05.2026",
  },
  {
    id: 8,
    fullName: "Турсунова Шахзода Бахромовна",
    position: "Администратор",
    contractNumber: "KT-2023-0029",
    organizationBranch: "ДОО «Bilimtoy» / Главный филиал",
    currentSalary: 5200000,
    lastPayment: 5200000,
    paymentDate: "08.05.2026",
  },
  {
    id: 9,
    fullName: "Каримова Сания Алиевна",
    position: "Заведующий",
    contractNumber: "KT-2021-0003",
    organizationBranch: "ДОО «Bilimtoy» / Филиал Юнусабад",
    currentSalary: 10000000,
    lastPayment: 10000000,
    paymentDate: "07.05.2026",
  },
  {
    id: 10,
    fullName: "Назарова Лола Эркиновна",
    position: "Медсестра",
    contractNumber: "KT-2023-0051",
    organizationBranch: "ДОО «Bilimtoy» / Филиал Чиланзар",
    currentSalary: 5000000,
    lastPayment: 5000000,
    paymentDate: "08.05.2026",
  },
];

export const payrollSalaryHistory: PayrollSalaryHistory[] = [
  { id: "salary-001", date: "01.04.2026", type: "salary", beforeAmount: 6000000, afterAmount: 6500000, author: "Администратор" },
  { id: "salary-002", date: "01.11.2025", type: "salary", beforeAmount: 5500000, afterAmount: 6000000, author: "Администратор" },
  { id: "salary-003", date: "01.05.2025", type: "salary", beforeAmount: 5000000, afterAmount: 5500000, author: "Администратор" },
  { id: "salary-004", date: "01.10.2024", type: "salary", beforeAmount: 4500000, afterAmount: 5000000, author: "Администратор" },
  { id: "salary-005", date: "15.02.2024", type: "salary", beforeAmount: null, afterAmount: 4500000, author: "Администратор" },
];

export const payrollPayments: PayrollPayment[] = [
  { id: "payment-001", date: "30.04.2026", amount: 6500000, type: "salary", responsible: "Администратор" },
  { id: "payment-002", date: "15.04.2026", amount: 3000000, type: "advance", responsible: "Администратор" },
  { id: "payment-003", date: "31.03.2026", amount: 6500000, type: "salary", responsible: "Администратор" },
  { id: "payment-004", date: "15.03.2026", amount: 3000000, type: "advance", responsible: "Администратор" },
  { id: "payment-005", date: "28.02.2026", amount: 6500000, type: "salary", responsible: "Администратор" },
  { id: "payment-006", date: "15.02.2026", amount: 3000000, type: "advance", responsible: "Администратор" },
  { id: "payment-007", date: "31.01.2026", amount: 6500000, type: "salary", responsible: "Администратор" },
  { id: "payment-008", date: "25.01.2026", amount: 700000, type: "bonus", responsible: "Администратор" },
  { id: "payment-009", date: "15.01.2026", amount: 3000000, type: "advance", responsible: "Администратор" },
  { id: "payment-010", date: "31.12.2025", amount: 6000000, type: "salary", responsible: "Администратор" },
];

export const payrollOperations: PayrollOperation[] = [
  { id: "operation-001", title: "Оклад изменён", meta: "01.04.2026 10:15 · Администратор", type: "salaryChanged" },
  { id: "operation-002", title: "Добавлена выплата", meta: "30.04.2026 09:30 · Администратор", type: "paymentAdded" },
  { id: "operation-003", title: "Начислен бонус", meta: "25.01.2026 14:20 · Администратор", type: "bonusAdded" },
  { id: "operation-004", title: "Добавлена выплата", meta: "15.04.2026 09:10 · Администратор", type: "paymentAdded" },
  { id: "operation-005", title: "Оклад изменён", meta: "01.11.2025 11:45 · Администратор", type: "salaryChanged" },
];

export const roleModuleIds: RoleModuleId[] = [
  "organizations",
  "groups",
  "employees",
  "kanban",
  "childrenParents",
  "bilimtoy",
  "resources",
  "finance",
  "analytics",
  "notifications",
  "profile",
  "dictionaries",
];

const educatorPermissions: RolePermission[] = roleModuleIds.map((moduleId) => ({
  moduleId,
  read: true,
  write: ["kanban", "childrenParents", "profile"].includes(moduleId),
  full: false,
}));

export const employeeRoles: EmployeeRole[] = [
  {
    id: 1,
    name: "Администратор ДОО",
    userCount: 1,
    permissions: roleModuleIds.map((moduleId) => ({ moduleId, read: true, write: true, full: true })),
    users: [{ id: "role-user-001", fullName: "Айжан Сериковна Касымова", position: "Администратор", initials: "АК" }],
  },
  {
    id: 2,
    name: "Воспитатель",
    userCount: 14,
    permissions: educatorPermissions,
    users: [
      { id: "role-user-002", fullName: "Касымова Айжан Сериковна", position: "Воспитатель", initials: "КА" },
      { id: "role-user-003", fullName: "Тулегенова Мадина Ерлановна", position: "Воспитатель", initials: "ТМ" },
      { id: "role-user-004", fullName: "Ибраимов Нурлан Арманович", position: "Воспитатель", initials: "ИН" },
      { id: "role-user-005", fullName: "Мусина Динара Саятовна", position: "Воспитатель", initials: "МД" },
    ],
  },
  {
    id: 3,
    name: "Логопед",
    userCount: 7,
    permissions: roleModuleIds.map((moduleId) => ({ moduleId, read: ["groups", "childrenParents", "profile"].includes(moduleId), write: moduleId === "childrenParents", full: false })),
    users: [{ id: "role-user-006", fullName: "Назарова Лола Эркиновна", position: "Логопед", initials: "НЛ" }],
  },
  {
    id: 4,
    name: "Психолог",
    userCount: 2,
    permissions: educatorPermissions,
    users: [{ id: "role-user-007", fullName: "Петрова Мария Ивановна", position: "Психолог", initials: "ПМ" }],
  },
  { id: 5, name: "Методист", userCount: 3, permissions: educatorPermissions, users: [] },
  { id: 6, name: "Родитель", userCount: 145, permissions: roleModuleIds.map((moduleId) => ({ moduleId, read: ["childrenParents", "profile"].includes(moduleId), write: moduleId === "profile", full: false })), users: [] },
  { id: 7, name: "Медсестра", userCount: 2, permissions: educatorPermissions, users: [] },
  { id: 8, name: "Бухгалтер", userCount: 2, permissions: roleModuleIds.map((moduleId) => ({ moduleId, read: ["finance", "employees", "profile"].includes(moduleId), write: moduleId === "finance", full: moduleId === "finance" })), users: [] },
  { id: 9, name: "HR менеджер", userCount: 1, permissions: roleModuleIds.map((moduleId) => ({ moduleId, read: ["employees", "profile"].includes(moduleId), write: moduleId === "employees", full: moduleId === "employees" })), users: [] },
  { id: 10, name: "Оператор чата", userCount: 4, permissions: roleModuleIds.map((moduleId) => ({ moduleId, read: ["notifications", "profile"].includes(moduleId), write: moduleId === "notifications", full: false })), users: [] },
];
