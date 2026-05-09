export type OrganizationForm = "mchj" | "ntm" | "yatt" | "ok";
export type OwnershipType = "private" | "state" | "publicPrivate" | "family";
export type OrganizationType = "generalType" | "combinedType" | "inclusiveType" | "specializedType";
export type OwnerRole = "director" | "owner";
export type Gender = "female" | "male";

export interface OrganizationStats {
  children: number;
  groups: number;
  employees: number;
  finance: string;
}

export interface OrganizationRecord {
  id: string;
  rowNumber: string;
  organizationForm: OrganizationForm;
  legalName: string;
  shortName: string;
  organizationType: OrganizationType;
  ownership: OwnershipType;
  createdAt: string;
  taxId: string;
  registrationNumber: string;
  licenseFile: string;
  cityDistrict: string;
  street: string;
  coordinates: string;
  phone: string;
  managementPhone: string;
  ownerDirectorName: string;
  bankAccount: string;
  ownerRole: OwnerRole;
  birthDate: string;
  gender: Gender;
  additionalPhone: string;
  email: string;
  passportPinfl: string;
  password: string;
  stats: OrganizationStats;
}

export interface BranchRecord extends OrganizationRecord {
  childrenCount: number;
  teachersCount: number;
  dependenciesCount: number;
}

export const mainOrganization: OrganizationRecord = {
  id: "org-main",
  rowNumber: "10000",
  organizationForm: "mchj",
  legalName: "Bilimtoy Kids Preschool",
  shortName: "Bilimtoy Kids",
  organizationType: "combinedType",
  ownership: "private",
  createdAt: "15.02.2026",
  taxId: "309 456 781",
  registrationNumber: "0001742",
  licenseFile: "license_001.pdf",
  cityDistrict: "Ташкент",
  street: "ул. Паркент, 118",
  coordinates: "41.3111, 69.2797",
  phone: "+998 71 200 45 67",
  managementPhone: "+998 90 555 12 34",
  ownerDirectorName: "Дилфуза Каримова",
  bankAccount: "2020 8000 9012 3456 7890",
  ownerRole: "director",
  birthDate: "14.08.1987",
  gender: "female",
  additionalPhone: "+998 97 555 12 34",
  email: "d.karimova@bilimtoy.uz",
  passportPinfl: "AA 1234567 / 30214876543210",
  password: "••••••••••••••••",
  stats: {
    children: 486,
    groups: 24,
    employees: 68,
    finance: "148 600 000 сум",
  },
};

export const initialBranches: BranchRecord[] = [
  {
    ...mainOrganization,
    id: "branch-yunusobod",
    rowNumber: "10031",
    legalName: "Bilimtoy Kids Yunusobod",
    shortName: "Bilimtoy Kids Yunusobod",
    organizationType: "generalType",
    registrationNumber: "0001743",
    street: "ул. Амира Темура, 45",
    coordinates: "41.3662, 69.2871",
    phone: "+998 71 200 45 68",
    managementPhone: "+998 90 555 12 34",
    licenseFile: "license_branch_001.pdf",
    childrenCount: 132,
    teachersCount: 14,
    dependenciesCount: 0,
    stats: {
      children: 132,
      groups: 6,
      employees: 18,
      finance: "42 400 000 сум",
    },
  },
  {
    ...mainOrganization,
    id: "branch-chilonzor",
    rowNumber: "10032",
    legalName: "Bilimtoy Kids Chilonzor",
    shortName: "Bilimtoy Kids Chilonzor",
    registrationNumber: "0001744",
    street: "ул. Чиланзар, 27",
    cityDistrict: "Ташкент, Чиланзарский р-н",
    coordinates: "41.2856, 69.2034",
    managementPhone: "+998 90 555 13 23",
    childrenCount: 118,
    teachersCount: 12,
    dependenciesCount: 23,
    stats: {
      children: 118,
      groups: 5,
      employees: 16,
      finance: "36 800 000 сум",
    },
  },
  {
    ...mainOrganization,
    id: "branch-mirzo-ulugbek",
    rowNumber: "10033",
    legalName: "Bilimtoy Kids Mirzo-Ulugbek",
    shortName: "Bilimtoy Kids Mirzo-Ulugbek",
    organizationType: "inclusiveType",
    registrationNumber: "0001745",
    street: "ул. Буюк Ипак Йули, 96",
    cityDistrict: "Ташкент, Мирзо-Улугбекский р-н",
    coordinates: "41.3261, 69.3348",
    managementPhone: "+998 90 555 14 45",
    childrenCount: 94,
    teachersCount: 11,
    dependenciesCount: 14,
    stats: {
      children: 94,
      groups: 4,
      employees: 13,
      finance: "29 100 000 сум",
    },
  },
  {
    ...mainOrganization,
    id: "branch-sergeli",
    rowNumber: "10034",
    legalName: "Bilimtoy Kids Sergeli",
    shortName: "Bilimtoy Kids Sergeli",
    organizationType: "generalType",
    registrationNumber: "0001746",
    street: "ул. Янги Сергели, 12",
    cityDistrict: "Ташкент, Сергелийский р-н",
    coordinates: "41.2264, 69.2181",
    managementPhone: "+998 90 555 15 67",
    childrenCount: 76,
    teachersCount: 8,
    dependenciesCount: 0,
    stats: {
      children: 76,
      groups: 4,
      employees: 10,
      finance: "24 200 000 сум",
    },
  },
  {
    ...mainOrganization,
    id: "branch-yakkasaroy",
    rowNumber: "10035",
    legalName: "Bilimtoy Kids Yakkasaroy",
    shortName: "Bilimtoy Kids Yakkasaroy",
    registrationNumber: "0001747",
    street: "ул. Шота Руставели, 88",
    cityDistrict: "Ташкент, Яккасарайский р-н",
    coordinates: "41.2912, 69.2556",
    managementPhone: "+998 90 555 16 89",
    childrenCount: 66,
    teachersCount: 7,
    dependenciesCount: 9,
    stats: {
      children: 66,
      groups: 5,
      employees: 11,
      finance: "16 100 000 сум",
    },
  },
];
