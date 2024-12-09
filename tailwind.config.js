module.exports = {
  content: ["./app/javascript/**/*.tsx"],
  theme: {
    extend: {
      animation: {
        "home-title-shimmer": "home-title-shimmer 5s ease-in-out",
        "order-chat-slide-up": "order-chat-slide-up 0.5s ease-in-out",
        "order-chat-slide-down": "order-chat-slide-down 0.5s ease-in-out",
        "order-chat-admin-open-md": "order-chat-admin-open-md 0.5s ease-in-out",
        "order-chat-admin-close-md":
          "order-chat-admin-close-md 0.5s ease-in-out",
        "order-chat-admin-open": "order-chat-admin-open 0.5s ease-in-out",
        "order-chat-admin-close": "order-chat-admin-close 0.5s ease-in-out",
      },
      keyframes: {
        "home-title-shimmer": {
          "0%": { color: "#9ca3af", opacity: "0" },
          "0%, 100%": { transform: "scale(1)" },
          "10%": { color: "#d1d5db", transform: "scale(1.1)" },
          "50%": { color: "#d1d5db", transform: "scale(1.1)", opacity: "1" },
          "90%": { color: "#d1d5db", transform: "scale(1.1)", opacity: "1" },
        },
        "order-chat-slide-up": {
          "0%": { maxHeight: 0 },
          "100%": { maxHeight: "auto" },
        },
        "order-chat-slide-down": {
          "0%": { maxHeight: "550px" },
          "100%": { maxHeight: 0 },
        },
        "order-chat-admin-open-md": {
          "0%": {
            transform: "translate(0)",
            top: "0",
            left: "240px",
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        "order-chat-admin-close-md": {
          "0%": {
            opacity: 1,
            left: "240px",
            top: 0,
          },
          "100%": {
            opacity: 0,
          },
        },
        "order-chat-admin-open": {
          "0%": {
            opacity: 0,
            maxHeight: 0,
          },
          "100%": {
            opacity: 1,
            maxHeight: "550px",
          },
        },
        "order-chat-admin-close": {
          "0%": {
            opacity: 1,
            maxHeight: "550px",
          },
          "100%": {
            opacity: 0,
            maxHeight: 0,
          },
        },
      },
      transitionProperty: {
        height: "height",
      },
    },
  },
};
