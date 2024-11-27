module.exports = {
  content: ["./app/javascript/**/*.tsx"],
  theme: {
    extend: {
      animation: {
        "home-title-shimmer": "home-title-shimmer 5s ease-in-out",
      },
      keyframes: {
        "home-title-shimmer": {
          "0%": { color: "#9ca3af", opacity: "0" },
          "0%, 100%": { transform: "scale(1)" },
          "10%": { color: "#d1d5db", transform: "scale(1.1)" },
          // "50%": { color: "red" },
          "50%": { color: "#d1d5db", transform: "scale(1.1)", opacity: "1" },
          "90%": { color: "#d1d5db", transform: "scale(1.1)", opacity: "1" },
        },
      },
    },
  },
};
