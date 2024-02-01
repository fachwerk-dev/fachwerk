<script setup lang="ts">
const route = useRoute();
const { findOne } = useStrapi();
import { parse as parseSlides } from "@slidev/parser";

const id = route.params.id as string;

const { data: doc } = await useAsyncData("document-" + id, () =>
  findOne("documents", id, {
    populate: ["user"],
  }).then((res) => parseStrapi(res))
);

// On page load we populate the editor contents with data in Strapi

const content = ref(doc.value.content);

const pages = ref<any[]>([]);

watchDebounced(
  content,
  async (c) => {
    const parsedPages = await parseSlides(c);
    pages.value = parsedPages.slides.map((page) => {
      const sections = page.content
        .split(/\r?\n--\r?\n/g)
        .map(compileMarkdown)
        .map((content) => ({
          content,
          type: "text", // add isImage
        }));
      return {
        ...page,
        sections,
      };
    });
  },
  { immediate: true, debounce: 100 }
);

const row = ref(-1);
const activePage = ref(0);
const textarea = ref();

const onTextarea = () => {
  row.value =
    textarea.value.value
      .substr(0, textarea.value.selectionStart)
      .split(/\r?\n|\r/).length - 1;
  const index = pages.value?.findIndex(
    (d) => d.start <= row.value && d.end >= row.value
  );
  activePage.value = index > -1 ? index : 0;
};
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <div class="relative">
      <textarea
        ref="textarea"
        class="w-full md:absolute inset-0 block h-[40vh] md:h-auto outline-none font-mono p-6 bg-gray-800 text-white overflow-y-auto"
        v-model="content"
        @click="onTextarea"
      />
    </div>
    <div class="overflow-y-auto h-full">
      <Page v-for="(page, i) in pages" :active="i === activePage">
        <div
          v-for="section in page.sections"
          class="text-xl leading-10 p-8 prose"
        >
          <Compiler :source="section.content" />
        </div>
      </Page>
    </div>
  </div>
  <div
    class="fixed top-0 right-0 bottom-0 bg-white/80 w-1/6 border-l p-4 font-mono whitespace-pre"
  >
    {{ { id, row, activePage } }}
  </div>
</template>
