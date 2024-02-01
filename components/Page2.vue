<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const props = defineProps<{ page: any; active: boolean }>();
const el = ref();

watch(
  () => props.active,
  () => {
    if (props.active) {
      el.value.scrollIntoView({ behavior: "smooth" });
    }
  }
);

const defaultClasses = `
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
  grid
  relative
`;

const gridClasses = {
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

const pageClass = computed(() =>
  twMerge(
    defaultClasses,
    gridClasses[(props.page.sections.length || 1) as keyof typeof gridClasses],
    props.page.frontmatter.class
  )
);
</script>

<template>
  <div :class="pageClass">
    <div ref="el" class="invisible absolute -top-32 left-0 right-0 h-32" />
    <slot />
  </div>
</template>
