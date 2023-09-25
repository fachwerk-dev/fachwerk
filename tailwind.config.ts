import type { Config } from "tailwindcss";
import Typography from "@tailwindcss/typography";

export default <Partial<Config>>{
  theme: { extend: { fontFamily: { sans: ["IBM Plex Sans", "sans-serif"] } } },
  plugins: [Typography],
};
