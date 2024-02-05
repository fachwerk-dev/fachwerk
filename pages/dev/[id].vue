<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import IconLeft from "~icons/ri/arrow-left-line";
import IconEdit from "~icons/ri/quill-pen-line";
import IconPresent from "~icons/ri/slideshow-3-line";
import IconImage from "~icons/ri/image-line";
import "katex/dist/katex.min.css";

const route = useRoute();
const { findOne, update } = useStrapi();
const user = useStrapiUser();

const id = route.params.id as string;
const isEdit = route.query.edit === null;
console.log(isEdit);

const { data: doc } = await useAsyncData("document-" + id, () =>
  findOne("documents", id, {
    populate: ["user"],
  }).then((res) => parseStrapi(res))
);

// On page load we populate the editor contents with data in Strapi

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

const onEditorClick = useEditor(activePage, pages, editor);

useTailwind();

const edit = ref(isEdit);

const pagesClass = computed(() => {
  const baseClasses = "overflow-y-auto h-full";
  const editClasses = ["snap-y", ""];
  return twMerge(baseClasses, editClasses[Number(edit.value)]);
});

const navClass = computed(() => {
  const baseClasses = "";
  const editClasses = ["", "w-1/2"];
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
</script>

<template>
  <div class="grid-cols-2 fixed inset-0" :class="edit ? 'md:grid' : ''">
    <textarea
      ref="editor"
      class="hidden w-full h-auto outline-none font-mono pl-12 pr-10 pt-8 bg-gray-800 text-white overflow-y-auto"
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
  <div
    class="fixed bottom-0 left-0 px-3 flex flex-col gap-4 justify-end pb-4 h-36 opacity-25"
  >
    <IconPresent
      v-if="edit"
      class="size-6 cursor-pointer text-gray-500"
      @click="edit = !edit"
    />
    <IconEdit
      v-else
      class="size-6 cursor-pointer text-gray-500"
      @click="edit = !edit"
    />
  </div>
  <NuxtLink to="/dev/home" class="block fixed top-0 left-0 p-3 opacity-25">
    <IconLeft class="size-6 text-gray-500" />
  </NuxtLink>
  <div
    v-if="edit"
    class="fixed top-0 right-0 bottom-0 bg-gray-800/95 w-[25vw] -translate-x-[25vw] p-6"
  >
    <Images />
  </div>
</template>
