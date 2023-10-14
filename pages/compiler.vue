<script setup>
const content = ref(`
# Hello world

<div class="grid"</div>
`);
const pages = computed(() => content.value.split(/\n---\n/g));
const onErrors = (e) => console.log("EE", errors);
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />
    <div>
      <div class="prose p-4 border-b-2" v-for="page in pages">
        <Compiler @errors="onErrors" :source="compileMarkdown(page)" />
      </div>
    </div>
  </div>
</template>
