/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // red: "#E30613",
        // green: "#33DE64",
        // blue: "#33ADDE",
        // yellow: "#FBEA17",
        // orange: "#FBAC17",
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
