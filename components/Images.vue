<script setup lang="ts">
const client = useStrapiClient();
const { data: files, refresh } = useAsyncData(
  "files",
  async () => await client("/upload/files")
);

const {
  files: uploadFiles = [],
  open,
  onChange: onUpload,
} = useFileDialog() as any;

const uploadTitles = ["Add images", "Uploading..."];
const uploadStatus = ref(0);

onUpload(async () => {
  uploadStatus.value = 1;
  const formData = new FormData();
  [...(uploadFiles.value || [])].forEach((uploadFile) =>
    formData.append("files", uploadFile)
  );
  await client(`/upload`, {
    method: "POST",
    body: formData,
  }).catch((e) => console.log(e));
  refresh();
  uploadStatus.value = 0;
});

const emit = defineEmits(["paste"]);

const onFileClick = (file: any) => {
  const url = `${file.formats?.large?.url}?name=${file.name.replace(
    /\s+/g,
    "+"
  )}`;
  emit("paste", url);
};
</script>

<template>
  <div class="h-full flex flex-col gap-4">
    <Button class="md:w-full" type="button" @click="open">
      {{ uploadTitles[uploadStatus] }}
    </Button>
    <div class="grid grid-cols-2 gap-5 overflow-y-auto item p-1">
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
</template>
