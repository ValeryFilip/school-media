/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#F2F2F2",
        dim: "#8A8A8A",
        line: "#262626",
        acid: "#CCFF00",
        fuchsia2: "#FF2E88",
        coal: "#141414",
        paperWarm: "#E8E6DF",
        // Светлая «молочная» тема академии/SEO (a- = academy)
        amilk: "#F7F2E4",
        apaper: "#EFE9DA",
        apaper2: "#E6DFCC",
        aink: "#1A1410",
        ainkSoft: "#2E2620",
        adim: "#8A7F70",
        aline: "#C9BFAC",
        alineSoft: "#D8CFBC",
        rust: "#B23A14",
        rustDark: "#7A2308",
        inkBlue: "#1A3556",
        ochre: "#C9882B",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
        serif: ['"Source Serif 4"', "Georgia", "serif"],
      },
    },
  },
};
