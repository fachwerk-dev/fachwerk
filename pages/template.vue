<script setup>
const content = ref(`# Hello world`);
import { parse as parseSlides } from "@slidev/parser";

const markdownContent = computed(() => compileMarkdown(content.value));
const ast = computedAsync(async () => parseSlides(content.value));
</script>

<template>
  <div class="grid grid-cols-3 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    ></textarea>
    <div class="p-4 overflow-auto font-mono whitespace-pre-wrap bg-gray-300">
      {{ ast }}
    </div>
    <div class="p-4 overflow-auto font-mono whitespace-pre-wrap">
      {{ ast }}
    </div>
  </div>
</template>
