<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import "katex/dist/katex.min.css";

useTailwind();

const route = useRoute();
const { findOne, update } = useStrapi();
const user = useStrapiUser();

const edit = ref(false);
const images = ref(false);

const isMd = useMediaQuery("(min-width: 768px)");
watch(isMd, (newIsMd) => {
  if (!newIsMd) {
    edit.value = false;
  }
});

const id = route.params.id as string;
if (route.query.edit === null) {
  edit.value = true;
  await navigateTo(`/${id}`);
}

const { data: doc } = await useAsyncData("document-" + id, () =>
  findOne("documents", id, {
    populate: ["user"],
  }).then((res) => parseStrapi(res))
);

const content = ref(doc.value.content);
const pages = ref<any[]>([]);
const editor = ref();
const { focused } = useFocus(editor, { initialValue: false });
onMounted(() => {
  if (!content.value) {
    focused.value = true;
  }
});

watchDebounced(
  content,
  async (newContent) => {
    pages.value = await parseContent(newContent);
  },
  { immediate: true, debounce: 100 }
);

watchDebounced(
  content,
  async (c) => {
    if (user) {
      await update("documents", id, { content: content.value });
    }
  },
  { debounce: 3000 }
);

const pagesEl = ref();
const { activePage } = useNav(pages, pagesEl, focused);
const { onEditorClick, row } = useEditor(activePage, pages, editor);

const pagesClass = computed(() => {
  const baseClasses = "overflow-y-auto h-full";
  const editClasses = ["snap-y", ""];
  return twMerge(baseClasses, editClasses[Number(edit.value)]);
});

const onPaste = (url: string) => {
  focused.value = true;
  let lines = content.value.split(/\r?\n/);
  lines.splice(row.value >= 0 ? row.value : lines.length, 0, `\n${url}\n`);
  content.value = lines.join("\n");
  images.value = false;
};
</script>

<template>
  <div class="grid-cols-2 fixed inset-0" :class="edit ? 'md:grid' : ''">
    <textarea
      ref="editor"
      class="hidden w-full h-auto outline-none font-mono pl-16 pr-10 pt-6 bg-gray-800 text-white overflow-y-auto"
      :class="edit ? 'md:block' : ''"
      v-model="content"
      @click="onEditorClick"
    />
    <div :class="pagesClass" ref="pagesEl">
      <Page
        v-for="(page, i) in pages"
        :page="page"
        :active="i === activePage"
        :edit="edit"
        @activated="!edit ? (activePage = i) : null"
      />
    </div>
  </div>
  <Nav class="fixed top-0 left-0" v-model:edit="edit" v-model:images="images" />
  <div
    v-if="edit && images"
    class="fixed top-0 right-0 bottom-0 bg-gray-800/95 w-[25vw] -translate-x-[25vw] p-6"
  >
    <Images @paste="onPaste" />
  </div>
</template>

<style>
.katex-display > .katex {
  white-space: normal;
}
.katex-display > .base {
  margin: 0.25em 0;
}
.katex-display {
  margin: 0.5em 0;
}
</style>
