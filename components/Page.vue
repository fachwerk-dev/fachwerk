<script setup lang="ts">
import { twMerge } from "tailwind-merge";

const props = defineProps<{ page: any; active: boolean; edit: boolean }>();
const topElement = ref();

// TODO Import this
const isMd = useMediaQuery("(min-width: 768px)");

watch(
  () => props.active,
  () => {
    if (props.active && isMd.value) {
      topElement.value.scrollIntoView({ behavior: "smooth" });
    }
  }
);

const defaultClasses = `
  grid
  max-w-none
  prose
  prose-sm
  @2xl:prose-base
  @3xl:prose-lg
  @4xl:prose-xl
  @5xl:prose-2xl
  @6xl:prose-3xl
  prose-headings:tracking-[-0.025em]
  prose-headings:text-balance
  prose-headings:first:mt-0
  prose-headings:mt-[0.75em]
  prose-headings:mb-[0.5em]
  prose-headings:leading-[1em]
  prose-p:mt-0
  prose-a:break-all
  prose-pre:text-[1em]
  prose-pre:whitespace-pre-wrap
  md:prose-pre:whitespace-pre
  prose-code:text-[0.8em]
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
`;

const gridClasses = {
  1: "",
  2: "sm:grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-4 grid-rows-3",
  7: "grid-cols-7",
  8: "grid-cols-4 grid-rows-4",
  9: "grid-cols-3 grid-rows-3",
  10: "grid-cols-2 grid-rows-5",
};

const editClasses = ["min-h-screen", "aspect-video"];

const pageClass = computed(() =>
  twMerge(
    defaultClasses,
    gridClasses[(props.page.sections.length || 1) as keyof typeof gridClasses],
    editClasses[Number(props.edit)],
    props.page.frontmatter.class
  )
);
const emit = defineEmits(["activated"]);
const centerElement = ref(null);

useIntersectionObserver(
  centerElement,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      emit("activated");
    }
  },
  { threshold: 0.5 }
);
</script>

<template>
  <div class="relative">
    <div :class="pageClass" ref="centerElement">
      <Section
        v-for="section in page.sections"
        :section="section"
        :edit="edit"
      />
    </div>
    <div
      ref="topElement"
      class="invisible absolute left-0 right-0 top-0 h-32"
    />
  </div>
</template>
