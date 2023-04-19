/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        spin: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        slideUpAndFade: {
          from: { opacity: 0, transform: "translateY(2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },

        slideRightAndFade: {
          from: { opacity: 0, transform: "translateX(-2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        slideDownAndFade: {
          from: { opacity: 0, transform: "translateY(-2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },

        slideLeftAndFade: {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
    textColor: {
      primary: "var(--color-text-primary)",
      secondary: "var(--color-text-secondary)",
      tertiary: "var(--color-text-tertiary)",
      icon: "var(--color-icon)",
      err: "var(--color-text-error)",
      inlineCode: "var(--color-text-inline-code)",
      placeholder: "var(--color-text-placeholder)",
      ...colors,
    },
    backgroundColor: {
      primary: "var(--color-bg-primary)",
      secondary: "var(--color-bg-secondary)",
      tertiary: "var(--color-bg-tertiary)",
      fade: "var(--color-bg-fade)",
      hover: "var(--color-bg-hover)",
      primaryBtn: "var(--color-bg-primary-btn)",
      primaryBtnHover: "var(--color-bg-primary-btn-hover)",
      elements: "var(--color-bg-secondary)",
      sidebar: "var(--color-app-sidebar)",
      code: "var(--color-bg-code)",
      err: "var(--color-bg-error)",
      kbd: "var(--color-bg-kbd)",
      kbdTooltip: "var(--color-bg-tooltip-kbd)",
      tooltip: "var(--color-bg-tooltip)",
      action: "var(--color-bg-action)",
      ...colors,
    },
    borderColor: {
      primary: "var(--color-border-primary)",
      selected: "var(--color-border-selected)",
      secondary: "var(--color-border-secondary)",
      error: "var(--color-border-error)",
      ...colors,
    },
    animation: {
      spin: "spin 10s linear infinite",
      spinFast: "spin 1s linear infinite",
      slideUpAndFade: "slideUpAndFade 100ms ease-in-out",
      slideRightAndFade: "slideRightAndFade 100ms ease-in-out",
      slideDownAndFade: "slideDownAndFade 100ms ease-in-out",
      slideLeftAndFade: "slideLeftAndFade 100ms ease-in-out",
    },
  },
};
