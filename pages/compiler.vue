<script setup>
import { default as dompurify } from "dompurify";
const { sanitize } = dompurify;
import config from "../tailwind.config";

const content = ref(`

https://google.com

--

2

---

<input type="range" v-model="data.a" />

---

data: {{ data }}
`);
const pages = computed(() =>
  content.value.split(/\n---\n/g).map((page) => page.split(/\n--\n/g))
);

useScriptTag("https://cdn.tailwindcss.com", () => {
  window.tailwind.config = config;
});

const cols = (count) => {
  const c = {
    1: "",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };
  return c[count];
};
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />
    <div>
      <div
        class="p-4 border-b-2 grid"
        :class="cols(page.length)"
        v-for="page in pages"
      >
        <div class="prose p-2 border-2" v-for="section in page">
          <Compiler :source="compileMarkdown(section)" />
        </div>
      </div>
    </div>
  </div>
</template>
