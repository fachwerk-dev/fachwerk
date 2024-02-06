import type { Config } from "tailwindcss";
import Typography from "@tailwindcss/typography";
import Container from "@tailwindcss/container-queries";
export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        serif: ["IBM Plex Serif", "serif"],
      },
    },
  },
  plugins: [Typography, Container],
};
