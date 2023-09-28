<script setup>
const client = useStrapiClient();
const { data: files, refresh } = useAsyncData(
  "file",
  async () => await client("/upload/files")
);
const showImages = ref(false);
const content = ref(`
# Fachwerk images demo

Just lay back and enjoy
`);
const onFileClick = (file) => {
  content.value = `${content.value}\n\n${file.formats.large.url}?name=${file.name}`;
  showImages.value = false;
};
const markdownContent = computed(() => compileMarkdown(content.value));

const { files: uploadableFiles, open, onChange } = useFileDialog();

onChange(async () => {
  const formData = new FormData();
  [...uploadableFiles.value].forEach((uploadableFile) =>
    formData.append("files", uploadableFile)
  );
  await client(`/upload`, {
    method: "POST",
    body: formData,
  });
  refresh();
});
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <div class="relative">
      <textarea
        class="absolute inset-0 overflow-auto bg-none bg-gray-800 text-gray-200 font-mono p-5 outline-none"
        v-model="content"
      ></textarea>
      <div
        v-if="showImages"
        class="overflow-auto p-6 absolute top-0 right-0 bottom-0 bg-gray-800/90 w-[25vw] translate-x-[25vw] flex flex-col gap-6"
      >
        <Button class="md:w-full" type="button" @click="open">
          Upload files
        </Button>
        <button v-for="file in files" @click="onFileClick(file)">
          <img :src="file.formats.large.url" />
        </button>
      </div>
    </div>
    <div class="p-6 prose" v-html="markdownContent"></div>
  </div>
  <button @click="showImages = !showImages" class="fixed bottom-5 left-5">
    <IconImage class="text-gray-200 hover:text-gray-300 w-5 h-5" />
  </button>
</template>
