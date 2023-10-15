<script setup>
import { default as dompurify } from "dompurify";
const { sanitize } = dompurify;
import config from "../tailwind.config";

const content = ref(`
<input type="range" v-model="data.a" />

---

data: {{ data }}
`);
const pages = computed(() => content.value.split(/\n---\n/g));

useScriptTag("https://cdn.tailwindcss.com", () => {
  window.tailwind.config = config;
});
function preSanitize(content) {
  const regex = /\s:([a-zA-Z-_\.:]+)="/gm;
  const subst = ` data-v-bind:$1="`;
  const regex2 = /\s@([a-zA-Z-_\.:]+)="/gm;
  const subst2 = ` data-v-on:$1="`;
  const regex3 = /\sv-([a-zA-Z-_\.:]+)/gm;
  const subst3 = ` data-v-$1`;
  return content
    .replace(regex, subst)
    .replace(regex2, subst2)
    .replace(regex3, subst3);
}

const postSanitize = (content) => {
  return content.replace(/data-v-/g, "v-");
};
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />
    <div>
      <div class="prose p-4 border-b-2" v-for="page in pages">
        <Compiler
          :source="compileMarkdown(postSanitize(sanitize(preSanitize(page))))"
        />
      </div>
    </div>
  </div>
</template>
