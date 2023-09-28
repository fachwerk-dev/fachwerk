<script setup lang="ts">
declare global {
  interface Window {
    tailwind: any;
  }
}

import { parse as parseSlides } from "@slidev/parser";

import IconLeft from "~icons/ri/arrow-left-line";

import config from "../tailwind.config";

useScriptTag("https://cdn.tailwindcss.com", () => {
  window.tailwind.config = config;
});

const route = useRoute();
const { findOne, update } = useStrapi();
const user = useStrapiUser();

const row = ref(-1);
const activePage = ref(0);
const textarea = ref();
const { focused } = useFocus(textarea, { initialValue: false });

const modes = [
  resolveComponent("IconMode0"),
  resolveComponent("IconMode1"),
  resolveComponent("IconMode2"),
  resolveComponent("IconMode3"),
];
const mode = ref(0);

const id = route.params.id as string;

const { data: doc } = await useAsyncData("document-" + id, () =>
  findOne("documents", id, {
    populate: ["user"],
  }).then((res) => parseStrapi(res))
);
onMounted(() => {
  if (!doc.value.content) {
    focused.value = true;
  }
});

const content = ref(doc.value.content);

const defaultClass = "p-5 prose max-w-none";

const pages = ref([]);
watchDebounced(
  content,
  async (c) => {
    try {
      const parsedPages = await parseSlides(c);
      pages.value = parsedPages.slides.map((page) => {
        const parsedContent = compileMarkdown(page.content);
        return {
          ...page,
          parsedContent: `<div class="${defaultClass} ${page.frontmatter.class}">${parsedContent}</div>`,
        };
      });
    } catch (e) {
      console.log(e);
    }
  },
  { immediate: true, debounce: 100 }
);

watchDebounced(
  content,
  async (c) => {
    try {
      if (user) {
        await update("documents", id, { content: content.value });
      }
    } catch (e) {
      console.log(e);
    }
  },
  { debounce: 3000 }
);
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

const { ArrowLeft, ArrowRight } = useMagicKeys();
watch([ArrowLeft, ArrowRight], () => {
  if (!focused.value) {
    if (ArrowLeft.value) {
      prev();
    }
    if (ArrowRight.value) {
      next();
    }
  }
});

on("prev", prev);
on("next", next);

// Image upload

const client = useStrapiClient();
const { data: files, refresh } = useAsyncData(
  "file",
  async () => await client("/upload/files")
);
const showImages = ref(false);

const { files: uploadFiles = [], open, onChange: onUpload } = useFileDialog();

onUpload(async () => {
  const formData = new FormData();
  [...(uploadFiles.value || [])].forEach((uploadFile) =>
    formData.append("files", uploadFile)
  );
  await client(`/upload`, {
    method: "POST",
    body: formData,
  });
  refresh();
});

const onFileClick = (file: any) => {
  focused.value = true;
  let lines = content.value.split(/\r?\n/);
  const newLine = `\n${file.formats?.large?.url}?name=${file.name.replace(
    /\s+/g,
    "+"
  )}`;
  lines.splice(row.value >= 0 ? row.value : lines.length, 0, newLine);
  content.value = lines.join("\n");
};
</script>

<template>
  <div
    class="inset-0 fixed md:grid"
    :class="
      [0, 1].includes(mode)
        ? 'md:grid-cols-[auto_1fr_1fr]'
        : 'md:grid-cols-[auto_1fr]'
    "
  >
    <div
      class="py-5 px-4 border-gray-700 flex md:flex-col gap-8 transition"
      :class="
        [
          'bg-gray-800 text-gray-500/70 border-r',
          'bg-gray-800 text-gray-500/70 border-r',
          'bg-transparent text-gray-500/70 md:fixed md:top-0 md:left-0 md:bottom-0 z-50',
          'bg-transparent text-gray-500/70 md:fixed md:top-0 md:left-0 md:bottom-0 z-50',
        ][mode]
      "
    >
      <NuxtLink to="/home" class="block">
        <IconLeft class="w-6 h-6 hover:text-gray-300 transition-all" />
      </NuxtLink>
      <div class="flex md:flex-col gap-3">
        <button v-for="(m, i) in modes" @click="mode = i">
          <component
            :is="m"
            class="w-6 h-6"
            :class="{ 'opacity-70': mode !== i }"
          />
        </button>
      </div>
      <button @click="showImages = !showImages" class="fixed bottom-5 left-5">
        <IconImage class="text-gray-500 hover:text-gray-300 w-6 h-6" />
      </button>
    </div>
    <div class="relative">
      <textarea
        v-show="[0, 1].includes(mode)"
        ref="textarea"
        class="absolute inset-0 block h-[40vh] md:h-auto outline-none font-mono p-6 bg-gray-800 text-white overflow-y-auto"
        v-model="content"
        @click="onTextarea"
      />
      <div
        :class="showImages ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        class="transition overflow-auto p-6 absolute top-0 right-0 bottom-0 bg-gray-800/90 w-[25vw] translate-x-[25vw] flex flex-col gap-6 z-10"
      >
        <Button class="md:w-full" type="button" @click="open">
          Upload files
        </Button>
        <div class="grid grid-cols-2 gap-4">
          <button
            v-for="file in [...files].reverse()"
            @click="onFileClick(file)"
          >
            <img
              :src="file.formats?.large?.url"
              class="aspect-square object-cover"
            />
          </button>
        </div>
      </div>
    </div>
    <div class="overflow-y-auto h-full relative">
      <Page
        v-for="(page, i) in pages"
        :active="i === activePage"
        :hide="[1, 3].includes(mode)"
      >
        <ClientOnly>
          <Compiler
            :source="page.parsedContent"
            :class="
              [
                'text-[110%] md:text-[100%] p-8',
                'text-[120%] p-12 min-h-screen',
                'text-[110%] md:text-[130%] p-8 md:py-16 md:px-64 w-screen',
                'text-[120%] md:text-[160%] p-10 md:px-32 md:py-24 w-screen min-h-screen',
              ][mode]
            "
          />
        </ClientOnly>
      </Page>
      <div
        @click="prev"
        class="fixed top-16 md:top-0 left-0 md:left-16 bottom-0 w-12"
      ></div>
      <div
        @click="next"
        class="fixed top-16 md:top-0 right-0 bottom-0 w-12"
      ></div>
    </div>
  </div>
</template>

<style>
.prose p:not(:has(img)) {
  max-width: 60ch;
}
</style>
