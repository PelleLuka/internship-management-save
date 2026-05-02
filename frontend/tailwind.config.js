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
        danger: {
          DEFAULT: "var(--color-danger)",
          light: "var(--color-danger-light)",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
      },
    },
  },
  plugins: [],
};
