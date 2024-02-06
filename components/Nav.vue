<script setup lang="ts">
import IconLeft from "~icons/ri/arrow-left-line";
import IconEdit from "~icons/ri/quill-pen-line";
import IconImage from "~icons/ri/image-line";

const edit = defineModel("edit");
const images = defineModel("images");
</script>
<template>
  <div class="flex flex-col justify-between gap-4 p-2 md:p-4 h-full">
    <NuxtLink to="/">
      <IconLeft class="size-6 text-gray-500" />
    </NuxtLink>
    <div class="hidden md:flex flex-col gap-4">
      <IconImage
        v-if="edit"
        :class="images ? 'text-yellow-500' : 'text-gray-500'"
        class="size-6 cursor-pointer"
        @click="images = !images"
      />
      <IconEdit
        class="size-6 cursor-pointer"
        :class="edit ? 'text-yellow-500' : 'text-gray-500'"
        @click="edit = !edit"
      />
    </div>
  </div>
</template>
