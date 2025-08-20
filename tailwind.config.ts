import type { Config } from "tailwindcss";

export default {
  // You can omit content in v4, but this is fine too:
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // IMPORTANT: safelist MUST be an array if you use it
  // safelist: ["shadow-nb-sm","shadow-nb-md","shadow-nb-lg","shadow-nb-xl"],

  theme: {
    extend: {
      colors: {
        "nb-red":    "var(--nb-red)",
        "nb-amber":  "var(--nb-amber)",
        "nb-yellow": "var(--nb-yellow)",
        "nb-lilac":  "var(--nb-lilac)",
        "nb-pink":   "var(--nb-pink)",
        "nb-green":  "var(--nb-green)",
        "nb-teal":   "var(--nb-teal)",
        "nb-cyan":   "var(--nb-cyan)",
        "nb-bg":     "var(--nb-bg)",
        "nb-ink":    "var(--nb-ink)",
        "nb-border": "var(--nb-border)",
      },
      borderWidth: {
        3: "3px",
        4: "4px",
      },
      boxShadow: {
        "nb-sm": "2px 2px 0 var(--nb-border)",
        "nb-md": "4px 4px 0 var(--nb-border)",
        "nb-lg": "6px 6px 0 var(--nb-border)",
        "nb-xl": "8px 8px 0 var(--nb-border)",
      },
    },
  },
  plugins: [],
} satisfies Config;
