<script setup lang="ts">
declare global {
  interface Window {
    tailwind: any;
  }
}

import { parse as parseSlides } from "@slidev/parser";
import { twMerge } from "tailwind-merge";
import { on } from "../lib/events";

import IconLeft from "~icons/ri/arrow-left-line";

import config from "../tailwind.config";

useScriptTag("https://cdn.tailwindcss.com", () => {
  window.tailwind.config = config;
});
import "katex/dist/katex.min.css";

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

const defaultClass = `
  max-w-none
  prose
  prose-p:mt-0
  prose-code:text-[90%]
  prose-code:bg-gray-800
  prose-code:rounded
  prose-code:px-1
  prose-code:py-px
  prose-code:font-normal
  prose-code:text-gray-200
  prose-code:before:content-none
  prose-code:after:content-none
  prose-img:object-cover
  last:prose-img:m-0
  prose-img:w-full
  prose-img:h-full
  first:prose-headings:m-0
  first:prose-headings:mb-2
`;

function isImage(text: string) {
  const regex = /^<img [^>]+>$/i;
  return regex.test(text.trim());
}

const pages = ref([]);
watchDebounced(
  content,
  async (c) => {
    try {
      const parsedPages = await parseSlides(c);
      pages.value = parsedPages.slides.map((page) => {
        const sections = page.content
          .split(/\r?\n--\r?\n/g)
          .map(compileMarkdown)
          .map((content) => ({
            content,
            type: isImage(content) ? "image" : "text",
          }));
        return {
          ...page,
          sections,
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

const uploadTitles = ["Add images", "Uploading..."];
const uploadStatus = ref(0);

onUpload(async () => {
  uploadStatus.value = 1;
  const formData = new FormData();
  [...(uploadFiles.value || [])].forEach((uploadFile) =>
    formData.append("files", uploadFile)
  );
  const uploaded = await client(`/upload`, {
    method: "POST",
    body: formData,
  });
  refresh();
  uploadStatus.value = 0;
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
  showImages.value = false;
};

const modeClasses = [
  "text-[110%] md:text-[100%]",
  "text-[75%] aspect-video",
  "text-[110%] md:text-[130%] w-screen",
  "text-[120%] md:text-[160%] w-screen min-h-screen",
];

const sectionClasses = ["p-8", "p-12", "p-20", "p-20"];

const modeClass = computed(() => modeClasses[mode.value]);
const sectionClass = computed(() => sectionClasses[mode.value]);

const pageClass = (length: number) => {
  const baseClasses = "grid";
  const classes = {
    1: "",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-4 grid-rows-3",
    7: "grid-cols-7",
    8: "grid-cols-4 grid-rows-4",
    9: "grid-cols-3 grid-rows-3",
    10: "grid-cols-2 grid-rows-5",
  };
  return twMerge(baseClasses, classes[length]);
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
            :class="{ 'opacity-50': mode !== i }"
          />
        </button>
      </div>
      <button
        @click="showImages = !showImages"
        class="hidden md:block fixed bottom-5 left-5"
      >
        <IconImage class="text-gray-500 hover:text-gray-300 w-6 h-6" />
      </button>
    </div>
    <div class="relative z-10">
      <textarea
        v-show="[0, 1].includes(mode)"
        ref="textarea"
        class="w-full md:absolute inset-0 block h-[40vh] md:h-auto outline-none font-mono p-6 bg-gray-800 text-white overflow-y-auto"
        v-model="content"
        @click="onTextarea"
      />
      <div
        :class="showImages ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        class="hidden md:flex transition overflow-auto p-6 absolute top-0 right-0 bottom-0 bg-gray-800/90 w-[25vw] translate-x-[25vw] flex-col gap-6"
      >
        <Button class="md:w-full" type="button" @click="open">
          {{ uploadTitles[uploadStatus] }}
        </Button>
        <div class="grid grid-cols-2 gap-4">
          <button
            v-for="file in [...(files || [])].reverse()"
            @click="onFileClick(file)"
          >
            <img
              :src="file.formats?.large?.url"
              class="aspect-square object-cover rounded hover:ring-4 ring-gray-300"
            />
          </button>
        </div>
      </div>
    </div>
    <div class="overflow-y-auto h-full">
      <Page
        v-for="(page, i) in pages"
        :active="i === activePage"
        :hide="[1, 3].includes(mode)"
      >
        <div
          :class="
            twMerge(
              defaultClass,
              modeClass,
              page.frontmatter.class,
              pageClass(page.sections.length)
            )
          "
        >
          <div
            v-for="section in page.sections"
            :class="section.type === 'image' ? '' : sectionClass"
          >
            <Compiler :source="section.content" />
          </div>
        </div>
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
