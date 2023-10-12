<script setup>
import { parse as parseContent } from "@slidev/parser";
import { marked } from "marked";

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
        type: isImage(content),
      };
    });
    page.content = sections;
    delete page.raw;
    return page;
  });
  return pagesWithSections;
};
const parsedContent = computedAsync(async () => await parse(content.value));
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />
    <div class="font-mono whitespace-pre p-4 overflow-auto">
      {{ parsedContent }}
    </div>
  </div>
</template>
