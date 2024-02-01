<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const props = defineProps<{ section: any; edit: boolean }>();

const sectionClass = computed(() => {
  const typeClass = {
    text: props.edit ? "p-12" : "p-8 md:p-20",
    image: "",
  };
  return twMerge(typeClass[props.section.type as keyof typeof typeClass]);
});
</script>
<template>
  <div :class="sectionClass">
    <Compiler :source="section.content" />
  </div>
</template>
