export const designTokens = {
  colors: {
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    primarySoft: "#EFF6FF",
    page: "#F8FAFC",
    surface: "#FFFFFF",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textMuted: "#6B7280",
    border: "#E5E7EB",
    overlay: "rgba(17, 24, 39, 0.45)",
    status: {
      success: { text: "#16A34A", bg: "#DCFCE7" },
      warning: { text: "#D97706", bg: "#FEF3C7" },
      danger: { text: "#DC2626", bg: "#FEE2E2" },
      info: { text: "#2563EB", bg: "#DBEAFE" },
      purple: { text: "#7C3AED", bg: "#EDE9FE" },
    },
  },
  typography: {
    fontFamily: "Inter",
    base: { size: "14px", lineHeight: "20px", weight: 400 },
    pageTitle: { size: "28px", lineHeight: "36px", weight: 700 },
    cardTitle: { size: "18px", lineHeight: "28px", weight: 600 },
  },
  layout: {
    sidebarWidth: "240px",
    headerHeight: "64px",
    pagePadding: "24px",
  },
  radius: {
    button: "8px",
    input: "8px",
    card: "12px",
    modal: "16px",
  },
  shadow: {
    card: "0 1px 2px rgba(15, 23, 42, 0.04)",
    dropdown: "0 8px 24px rgba(15, 23, 42, 0.10)",
    modal: "0 20px 40px rgba(15, 23, 42, 0.18)",
  },
} as const;

export type DesignTokens = typeof designTokens;
