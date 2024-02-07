<script setup lang="ts">
const w = ref(50);

const classes = `
bg-gray-200 
p-[2em]
h-screen
prose
max-w-none
prose-headings:tracking-[-0.025em]
prose-headings:text-balance
prose-headings:first:mt-0
prose-headings:mt-[0.75em]
prose-headings:mb-[0.5em]
prose-headings:leading-[1em]
prose-xxs
@lg:prose-xs
@xl:prose-sm
@2xl:prose-base
@3xl:prose-lg
@4xl:prose-xl
@5xl:prose-2xl
@6xl:prose-3xl
`;
</script>

<template>
  <div class="@container" :style="{ width: w + '%' }">
    <div :class="classes">
      <h1>Hello h1. Resize me. And do many more things, please</h1>
      <h2>Hello h2. Resize me. And do many more things, please</h2>
      <h3>Hello h3. Resize me. And do many more things, please</h3>
      <h4>Hello h4. Resize me. And do many more things, please</h4>
      <p>
        See the power of a container queries and prose classes. See the power of
        a container queries and prose classes.See the power of a container
        queries and prose classes.
      </p>
    </div>
  </div>
  <div class="p-8 fixed top-0 right-0">
    <input type="range" v-model="w" min="0" max="100" class="block" />
    <div class="mb-8">Width: {{ w }}%</div>
  </div>
</template>
