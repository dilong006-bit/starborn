/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 우주 다크 테마 팔레트
        cosmos: {
          950: "#05060f", // 가장 깊은 배경
          900: "#0a0e24",
          800: "#121634",
          700: "#1c2350",
          accent: "#7c6cff", // 성운 보라
          glow: "#a8b5ff",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "cosmos-radial":
          "radial-gradient(circle at 30% 20%, #1c2350 0%, #0a0e24 45%, #05060f 100%)",
      },
    },
  },
  plugins: [],
};
