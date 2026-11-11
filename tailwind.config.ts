import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        futuristic: ["var(--font-futuristic)", "sans-serif"],
        michroma: ["var(--font-michroma)", "sans-serif"],
        opensans: ["var(--font-opensans)", "sans-serif"],
        inter: ["var(--font-opensans)", "sans-serif"],
        sans: ["var(--font-opensans)", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
