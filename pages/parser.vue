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
      return text;
    }
    return `<p>${text}</p>`;
  },
};
marked.use({ renderer });

const content = ref(
  `---
code: a
---

# Hello world

Split the columns with **--** or **-**. Give feedback which works best.

--

https://fachwerk.fra1.cdn.digitaloceanspaces.com/8848408db64211fb29b9241266186170.png

---

# Another example

--

Here we split the column into 3:

--

https://fachwerk.fra1.cdn.digitaloceanspaces.com/8848408db64211fb29b9241266186170.png

---

# Another example 

Here are text and image without splitting

https://fachwerk.fra1.cdn.digitaloceanspaces.com/8848408db64211fb29b9241266186170.png

And below are 4 images:

---

https://fachwerk.fra1.cdn.digitaloceanspaces.com/8848408db64211fb29b9241266186170.png

--

https://fachwerk.fra1.cdn.digitaloceanspaces.com/8848408db64211fb29b9241266186170.png

--

https://fachwerk.fra1.cdn.digitaloceanspaces.com/8848408db64211fb29b9241266186170.png

--

https://fachwerk.fra1.cdn.digitaloceanspaces.com/8848408db64211fb29b9241266186170.png


`
);

const parse = async (content) => {
  const { slides: pages } = await parseContent(content);
  const pagesWithSections = pages.map((page) => {
    const sections = page.content.split(/\n--?\n/g).map((section) => {
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
  const baseClasses =
    "grid prose max-w-none prose-p:mt-0 prose-img:object-cover last:prose-img:m-0 prose-img:w-full prose-img:aspect-square first:prose-headings:m-0 first:prose-headings:mb-2 border-b-2 border-gray-200";
  const classes = {
    1: "",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 grid-rows-2",
    5: "grid-cols-5",
    6: "grid-cols-3 grid-rows-3",
  };
  return twMerge(baseClasses, classes[page.sections.length]);
};

const sectionClass = (section) => {
  if (section.type === "image") {
    return "";
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
    <div class="overflow-auto">
      <div v-for="page in pages" :class="page.class">
        <div
          v-for="section in page.sections"
          :class="section.class"
          v-html="section.content"
        />
      </div>
      <div class="font-mono whitespace-pre-wrap text-gray-400 p-4">
        {{ pages }}
      </div>
    </div>
  </div>
</template>
