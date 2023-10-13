<script setup>
const content = ref(`# Hello world

--

![b](https://images.unsplash.com/photo-1632405664545-f9049b609ac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80)

---

# Some more
`);
import { parse as parseSlides } from "@slidev/parser";
import { parse as parseMarkdown, marked } from "marked";

const processSlide = (slide) => {
  const sections = slide.content.split(/\r?\n--\r?\n/g);
  return sections.map((s, i) => {
    const markdown = parseMarkdown(s);
    const tokens = marked.lexer(s).filter((t) => t.type !== "space");
    const isImage = tokens[0].tokens[0].type === "image";
    const markup = `<div style="grid-area: g${i + 1}">${markdown}</div>`;
    const imageMarkup = `<img style="grid-area: g${i + 1}" src="${
      tokens[0].tokens[0].href
    } />`;
    return { tokens, markup, isImage, href: tokens[0].tokens[0].href };
  });
};

const markdown = computed(() => compileMarkdown(content.value));
const slides = computedAsync(async () => {
  const parsedSlides = await parseSlides(content.value);
  return parsedSlides.slides.map(processSlide);
});
</script>

<template>
  <div class="grid grid-cols-3 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    ></textarea>
    <div class="p-4 overflow-auto font-mono whitespace-pre-wrap bg-gray-300">
      {{ slides }}
    </div>
    <div class="overflow-auto">
      <div
        v-for="slide in slides"
        class="border border-red-500 grid grid-cols-2"
      >
        <div
          v-for="col in slide"
          class="border border-blue-500 prose relative overflow-hidden bg-gray-300"
        >
          <img
            v-if="col.isImage"
            :src="col.href"
            class="block absolute inset-0 h-full w-full"
          />
          <!-- <pre>{{ col.href }}</pre> -->
          <div v-else v-html="col.markup" class="p-4" />
          <!-- <pre>{{ col.tokens }}</pre> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* p,
img {
  margin: 0 !important;
}
p {
  position: relative;
}
img {
  display: block;
  object-fit: cover;
  position: absolute;
  inset: 0;
} */
</style>
