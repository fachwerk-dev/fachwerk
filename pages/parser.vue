<script setup>
import { parse as parseContent } from "@slidev/parser";
import { marked } from "marked";
import { twMerge } from "tailwind-merge";

function isImage(text) {
  const regex = /^<img [^>]+>$/i;
  return regex.test(text.trim());
}

const renderer = {
  paragraph(text) {
    if (text.startsWith("<img")) {
      return text + "\n";
    }
    return `<p>${text}</p>`;
  },
};
marked.use({ renderer });

const content = ref(`---
code: a
---

# Hello world

--

a

--

https://fachwerk.fra1.cdn.digitaloceanspaces.com/8848408db64211fb29b9241266186170.png

---

### And again
`);

const parse = async (content) => {
  const { slides: pages } = await parseContent(content);
  const pagesWithSections = pages.map((page) => {
    const sections = page.content.split(/\n--\n/g).map((section) => {
      const content = marked(convertImageUrlsToMarkdown(section));
      return {
        content,
        raw: section,
        type: isImage(content) ? "image" : "text",
      };
    });
    page.sections = sections;
    delete page.content;
    delete page.raw;
    return page;
  });
  return pagesWithSections;
};

const pageClass = (page) => {
  const baseClasses = "grid";
  const classes = {
    1: "grid",
    2: "grid grid-cols-2",
    3: "grid grid-cols-3",
    4: "grid grid-cols-4",
  };
  return {
    class: twMerge(baseClasses, classes[page.sections.length]),
  };
};

const sectionClass = (section) => {
  if (section.type === "image") {
    return "block object-cover w-full h-full";
  }
  return "p-4";
};

const addClasses = (pages) => {
  return pages.map((page) => {
    page.sections = page.sections.map((section) => ({
      ...section,
      class: sectionClass(section),
    }));
    return { ...page, class: pageClass(page) };
  });
};

const pages = computedAsync(async () => {
  const p = await parse(content.value);
  return addClasses(p);
});
</script>

<template>
  <div class="grid md:grid-cols-2 fixed inset-0">
    <textarea
      class="hidden md:block overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />
    <div class="font-mono whitespace-pre p-4 overflow-auto">
      <div class="grid"></div>
      {{ pages }}
    </div>
  </div>
</template>
