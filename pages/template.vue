<script setup>
const content = ref(`---
code: a
---

# Hello world

ahaa

--
code: 1
code2: 2
--

## Hello again

---

### And again
`);
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
