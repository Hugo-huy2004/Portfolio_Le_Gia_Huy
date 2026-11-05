/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: { foreground: "hsl(var(--muted-foreground))" },
        border: "hsl(var(--border))",
      },
      boxShadow: {
        card: "0 1px 3px 0 hsl(var(--shadow)/0.08), 0 4px 16px -2px hsl(var(--shadow)/0.06)",
      },
    },
  },
};
