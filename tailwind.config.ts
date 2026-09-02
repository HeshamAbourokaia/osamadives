import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        abyss: "#0a1f2e",
        reef: "#0d9488",
        "sun-glint": "#f5d28a",
        sand: "#e8dfd0",
        bone: "#f5f5f0",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        "label-wide": "0.22em",
      },
      maxWidth: {
        editorial: "68rem",
      },
    },
  },
  plugins: [],
};
export default config;
