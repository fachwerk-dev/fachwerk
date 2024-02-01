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

const edit = ref(false);
</script>

<template>
  <div class="grid-cols-2 fixed inset-0" :class="edit ? 'md:grid' : ''">
    <textarea
      ref="editor"
      class="hidden w-full h-auto outline-none font-mono p-6 bg-gray-800 text-white overflow-y-auto"
      :class="edit ? 'md:block' : ''"
      v-model="content"
      @click="onEditorClick"
    />
    <div class="overflow-y-auto h-full">
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
    {{ { id, activePage } }}
  </div>
</template>
