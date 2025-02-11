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
      animation: {
        'background': 'background 30s ease infinite',
      },
      keyframes: {
        'background': {
          '0%, 100%': {
            'background-color': '#fca5a5', 
          },
          '12.5%': {
            'background-color': '#ffd1dc',  
          },
          '25%': {
            'background-color': '#fdba74',  
          },
          '37.5%': {
            'background-color': '#fffacd',  
          },
          '50%': {
            'background-color': '#bef264',
          },
          '62.5%': {
            'background-color': '#88d8c0',  
          },
          '75%': {
            'background-color': '#93c5fd', 
          },
          '87.5%': {
            'background-color': '#e6e6fa',  
          }
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

