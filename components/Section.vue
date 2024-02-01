<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const { section } = defineProps<{ section: any }>();

const defaultClasses = `prose`;
const sectionClass = computed(() =>
  twMerge(defaultClasses, section.type !== "image" ? "p-8" : "")
);
</script>
<template>
  <div :class="sectionClass">
    <Compiler :source="section.content" />
  </div>
</template>
