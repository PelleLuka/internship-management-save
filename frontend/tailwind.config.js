/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: { xl: "1380px" },
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
          border: "var(--color-primary-border)",
        },
        surface: "var(--color-surface)",
        "app-bg": "var(--color-bg)",
        border: "var(--color-border)",
        danger: {
          DEFAULT: "var(--color-danger)",
          light: "var(--color-danger-light)",
        },
        sidebar: {
          DEFAULT: "var(--color-sidebar-bg)",
          hover: "var(--color-sidebar-hover)",
        },
        "text-base": "var(--color-text-primary)",
        "text-muted": "var(--color-text-secondary)",
        "text-subtle": "var(--color-text-tertiary)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
    },
  },
  plugins: [],
};
