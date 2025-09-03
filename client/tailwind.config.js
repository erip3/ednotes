export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#242424",
        "bg-card": "#474747",
        "bg-header": "#1b1b1b",
        "bg-sidebar": "#1e1e1e",
        "border-sidebar": "#474747",
        text: "#ebebeb",
        accent: {
          DEFAULT: "#00da2465",
          dark: "#009a18",
        },
        selected: "#51ff00",
        link: {
          DEFAULT: "#eaffee",
          hover: "#b0e6b8",
        },
        shadow: {
          DEFAULT: "#aaaaaa",
          hover: "#24be0560",
        },
        icon: "#ffffff",
      },
    },
  },
  plugins: [],
};
