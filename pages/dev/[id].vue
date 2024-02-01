<script setup lang="ts">
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
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <div class="relative">
      <textarea
        ref="editor"
        class="w-full md:absolute inset-0 block h-[40vh] md:h-auto outline-none font-mono p-6 bg-gray-800 text-white overflow-y-auto"
        v-model="content"
        @click="onEditorClick"
      />
    </div>
    <div class="overflow-y-auto h-full">
      <Page2
        v-for="(page, i) in pages"
        :page="page"
        :active="i === activePage"
      />
    </div>
  </div>
  <div
    class="fixed right-0 bottom-0 bg-white/80 w-1/6 border-l p-4 font-mono whitespace-pre"
  >
    {{ { id, activePage } }}
  </div>
</template>
