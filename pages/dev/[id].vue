<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import IconLeft from "~icons/ri/arrow-left-line";
import IconEdit from "~icons/ri/quill-pen-line";

const route = useRoute();
const { findOne, update } = useStrapi();
const user = useStrapiUser();

const id = route.params.id as string;

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

const edit = ref(false);

const pagesClass = computed(() => {
  const baseClasses = "overflow-y-auto h-full snap-y";
  const editClasses = ["snap-y", ""];
  return twMerge(baseClasses, editClasses[Number(edit.value)]);
});

const navClass = computed(() => {
  const baseClasses =
    "fixed bottom-0 left-0 px-4 flex flex-col gap-4 justify-end pb-4 text-gray-400 h-36";
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

const { ArrowUp, ArrowRight, ArrowDown, ArrowLeft } = useMagicKeys();
watch([ArrowUp, ArrowRight, ArrowDown, ArrowLeft], () => {
  if (!focused.value) {
    if (ArrowLeft.value || ArrowUp.value) {
      prev();
    }
    if (ArrowRight.value || ArrowDown.value) {
      next();
    }
  }
});
</script>

<template>
  <div class="grid-cols-2 fixed inset-0" :class="edit ? 'md:grid' : ''">
    <textarea
      ref="editor"
      class="hidden w-full h-auto outline-none font-mono pl-14 pr-10 pt-8 bg-gray-800 text-white overflow-y-auto"
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
      />
    </div>
  </div>
  <div
    class="fixed right-0 bottom-0 bg-white/80 w-1/6 border-l p-4 font-mono whitespace-pre"
  >
    <button class="block border" @click="edit = !edit">{{ edit }}</button>
    <button class="block border" @click="prev">&larr;</button>
    <button class="block border" @click="next">&rarr;</button>
    {{ { id, activePage } }}
  </div>
  <div :class="navClass">
    <IconEdit class="size-6 cursor-pointer" @click="edit = !edit" />
    <NuxtLink to="/home" class="block">
      <IconLeft class="size-6" />
    </NuxtLink>
  </div>
</template>
