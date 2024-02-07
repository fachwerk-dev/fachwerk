<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const props = defineProps<{ section: any; edit: boolean }>();

const sectionClass = computed(() => {
  const typeClass = {
    text: "p-[2em]",
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
