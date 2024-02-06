<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import "katex/dist/katex.min.css";

useTailwind();

const route = useRoute();
const { findOne, update } = useStrapi();
const user = useStrapiUser();

const edit = ref(false);
const images = ref(false);

const id = route.params.id as string;
if (route.query.edit === null) {
  edit.value = true;
  await navigateTo(`/dev/${id}`);
}

const { data: doc } = await useAsyncData("document-" + id, () =>
  findOne("documents", id, {
    populate: ["user"],
  }).then((res) => parseStrapi(res))
);

const content = ref(doc.value.content);
const pages = ref<any[]>([]);
const editor = ref();
const activePage = ref(0);
const { focused } = useFocus(editor, { initialValue: false });

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

const { onEditorClick, row } = useEditor(activePage, pages, editor);

const pagesClass = computed(() => {
  const baseClasses = "overflow-y-auto h-full";
  const editClasses = ["snap-y", ""];
  return twMerge(baseClasses, editClasses[Number(edit.value)]);
});

const next = () => {
  if (activePage.value < pages.value.length - 1) {
    activePage.value++;
  }
};
const prev = () => {
  if (activePage.value > 0) {
    activePage.value--;
  }
};

const { ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Space, Shift } =
  useMagicKeys();
watch([ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Space, Shift], () => {
  if (!focused.value) {
    if (ArrowLeft.value || ArrowUp.value) {
      prev();
    }
    if (ArrowRight.value || ArrowDown.value) {
      next();
    }
    if (Space.value) {
      if (Shift.value) {
        prev();
      } else {
        next();
      }
    }
  }
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
    <div :class="pagesClass">
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
