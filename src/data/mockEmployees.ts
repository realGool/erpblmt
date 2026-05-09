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

export const employeeTabs = [
  { id: "employees", label: "Сотрудники" },
  { id: "payroll", label: "Фонд оплаты труда" },
  { id: "calendar", label: "Календарь" },
  { id: "roles", label: "Роли" },
] as const;

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

