<script setup>
const content = ref(`# Hello world`);
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />
    <div class="font-mono whitespace-pre p-4">
      {{ content }}
    </div>
  </div>
</template>
