import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          soft: "var(--color-primary-soft)",
        },
        page: "var(--color-page)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        overlay: "var(--color-overlay)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        success: {
          text: "var(--color-success-text)",
          bg: "var(--color-success-bg)",
        },
        warning: {
          text: "var(--color-warning-text)",
          bg: "var(--color-warning-bg)",
        },
        danger: {
          text: "var(--color-danger-text)",
          bg: "var(--color-danger-bg)",
        },
        info: {
          text: "var(--color-info-text)",
          bg: "var(--color-info-bg)",
        },
        purple: {
          text: "var(--color-purple-text)",
          bg: "var(--color-purple-bg)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        base: ["var(--font-size-base)", { lineHeight: "var(--line-height-base)" }],
        "page-title": [
          "var(--font-size-page-title)",
          { lineHeight: "var(--line-height-page-title)", fontWeight: "700" },
        ],
        "card-title": [
          "var(--font-size-card-title)",
          { lineHeight: "var(--line-height-card-title)", fontWeight: "600" },
        ],
      },
      borderRadius: {
        button: "var(--radius-button)",
        input: "var(--radius-input)",
        card: "var(--radius-card)",
        modal: "var(--radius-modal)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        dropdown: "var(--shadow-dropdown)",
        modal: "var(--shadow-modal)",
      },
      spacing: {
        sidebar: "var(--size-sidebar-width)",
        header: "var(--size-header-height)",
        page: "var(--space-page-padding)",
      },
    },
  },
  plugins: [],
};

export default config;
