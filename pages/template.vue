<script setup>
const content = ref(`# Hello world

--

a

---

b
`);
const parsedContent = computed(() => {
  return content.value;
});
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />
    <div class="p-4 overflow-auto font-mono whitespace-pre-wrap">
      {{ parsedContent }}
    </div>
  </div>
</template>
