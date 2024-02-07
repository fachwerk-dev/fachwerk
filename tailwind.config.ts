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
        xxs: getTypography(12),
        xs: getTypography(13),
        "3xl": getTypography(26),
      },
    },
  },
  plugins: [Typography, Container],
};
