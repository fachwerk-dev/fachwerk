import type { Config } from "tailwindcss";
import Typography from "@tailwindcss/typography";
import Container from "@tailwindcss/container-queries";
import { getTypography } from "./typography";

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        serif: ["IBM Plex Serif", "serif"],
      },
      typography: {
        "3xl": getTypography(30),
      },
    },
  },
  plugins: [Typography, Container],
};
