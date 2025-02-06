import type { Config } from "tailwindcss";

export default {
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
        'atkinson-hyperlegible': ['"Atkinson Hyperlegible"', 'sans-serif'],
        'comic-sans': ['"Comic Sans MS"', 'cursive'],
      },
    },
  },
  plugins: [],
} satisfies Config;
