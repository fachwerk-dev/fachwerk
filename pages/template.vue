<script setup>
const content = ref(`---
code: a
---

# Hello world

ahaa

--
code: 1
--

a

---

b
`);

const pageSeparator = /\r?\n---\r?\n/g;
const sectionSeparator = /\r?\n--\r?\n/g;

const parseContent = (content, separator) => {
  const a = content.replace(/^---/g, "").split(separator);
  let prev = null;
  let pages = [];
  a.forEach((c) => {
    if (prev?.includes(":")) {
      pages.push({
        frontmatter: prev,
        content: parseContent(c, sectionSeparator),
      });
    } else if (!c.includes(":")) {
      pages.push({ content: c });
    }
    prev = c;
  });
  //.map((page) => page.split(sectionSeparator));

  return pages;
};
const parsedContent = computed(() => {
  return parseContent(content.value, pageSeparator);
});
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />
    <div class="p-4 overflow-auto font-mono whitespace-pre-wrap">
      {{ parsedContent }}
    </div>
  </div>
</template>
