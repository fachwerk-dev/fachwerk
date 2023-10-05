<script setup>
const content = ref(`---
code: a
---

# Hello world

ahaa

--
code: 1
code2: 2
--

a

---

b
`);

const pageSeparator = /\r?\n---\r?\n/g;
const sectionSeparator = /\r?\n--\r?\n/g;

const parseSection = (content) => {
  const a = content.replace(/^--/g, "").split(sectionSeparator);
  let prev = null;
  let pages = [];
  a.forEach((c) => {
    if (prev?.includes(":")) {
      pages.push({
        frontmatter: prev,
        content: c,
      });
    } else if (!c.includes(":")) {
      pages.push({ content: c });
    }
    prev = c;
  });
  return pages;
};

const cleanup = (content) =>
  content?.replace(/---?\s*[\s\S]*?:[\s\S]*?---?/g, "");

const parseContent = (content) => {
  const a = content.replace(/^---/g, "").split(pageSeparator);
  let prev = null;
  let pages = [];
  a.forEach((c) => {
    if (cleanup(prev)?.includes(":")) {
      pages.push({
        frontmatter: prev,
        content: c,
      });
    } else if (!c.includes(":")) {
      pages.push({ content: c });
    }
    prev = c;
  });
  return pages;
};

/*
const splitContent = (content) => {
  let c = [];
  const a = content
    .replace(/^---/g, "")
    .split(pageSeparator)
    .forEach((page) => {
      const sections = page.split(sectionSeparator);
      if (sections.length > 1) {
        sections.forEach((section) => c.push({ level: 2, content: section }));
      } else {
        c.push({ level: 1, content: sections[0] });
      }
    });
  return c;
};

const parseContent = (splitContent) => {
  let prev = null;
  let pages = [];
  splitContent.forEach((c) => {
    if (prev?.content.includes(":")) {
      pages.push({ ...c, frontmatter: prev.content });
    } else if (!c?.content.includes(":")) {
      pages.push(c);
    }
    prev = c;
  });
  return pages;
};
*/

const parsedContent = computed(() => {
  return parseContent(content.value);
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
