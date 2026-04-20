/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        back: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          lowest: "var(--surface-lowest)",
          low: "var(--surface-low)",
          DEFAULT: "var(--surface)",
          high: "var(--surface-high)",
          highest: "var(--surface-highest)",
          variant: "var(--surface-variant)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          container: "var(--primary-container)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          container: "var(--secondary-container)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          container: "var(--tertiary-container)",
        },
        error: {
          DEFAULT: "var(--error)",
          container: "var(--error-container)",
        },
        on: {
          surface: "var(--on-surface)",
          "surface-variant": "var(--on-surface-variant)",
          primary: "var(--on-primary)",
          "primary-container": "var(--on-primary-container)",
        },
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
      },
      borderRadius: {
        none: "0",
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
