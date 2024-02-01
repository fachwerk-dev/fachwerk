declare global {
  interface Window {
    tailwind: any;
  }
}

import config from "../tailwind.config";

export function useTailwind() {
  useScriptTag("https://cdn.tailwindcss.com", () => {
    window.tailwind.config = config;
  });
}
