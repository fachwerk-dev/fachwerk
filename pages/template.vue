<script setup>
import { parse } from "marked";
const content = ref(`---
code: a
---

# Hello world

ahaa

--
code: 1
code2: 2
--

## Hello again

---

### And again
`);

const pageSeparator = /\r?\n---\r?\n/g;
const sectionSeparator = /\r?\n--\r?\n/g;
const yamlSeparator = /--\s*[\s\S]*?:[\s\S]*?--/g;

const parseSection = (content) => {
  const a = content.split(sectionSeparator);
  let prev = null;
  let pages = [];
  a.forEach((c) => {
    pages.push({ frontmatter: prev?.includes(":") ? prev : null, content: c });
    prev = c;
  });
  return pages.filter((p) => !p.content.includes(":"));
};

const parseContent = (content) => {
  const a = content.replace(/^---/g, "").split(pageSeparator);
  let prev = null;
  let pages = [];
  a.forEach((c) => {
    if (prev?.replace(yamlSeparator, "").includes(":")) {
      pages.push({
        frontmatter: prev.includes(":") ? prev : null,
        content: parseSection(c),
      });
    } else {
      pages.push({ content: parseSection(c) });
    }
    prev = c;
  });
  return pages.filter((p) => p.content.length > 0);
};

const parsedContent = computed(() => {
  return parseContent(content.value);
});
</script>

<template>
  <div class="grid grid-cols-3 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />

    <div class="flex flex-col gap-4 p-4">
      <div
        class="p-4 flex flex-col gap-4 bg-gray-100"
        v-for="page in parsedContent"
      >
        <div
          v-if="page.frontmatter"
          class="font-mono text-sm whitespace-pre mb-2"
        >
          {{ page.frontmatter }}
        </div>
        <div class="border p-4 bg-gray-200" v-for="section in page.content">
          <div class="font-mono text-sm whitespace-pre mb-2">
            {{ section.frontmatter }}
          </div>
          <div class="prose" v-html="parse(section.content)" />
        </div>
      </div>
    </div>
    <div class="p-4 overflow-auto font-mono text-sm whitespace-pre-wrap">
      {{ parsedContent }}
    </div>
  </div>
</template>
