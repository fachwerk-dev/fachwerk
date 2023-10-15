<script setup>
import { default as dompurify } from "dompurify";
const { sanitize } = dompurify;
const content = ref(`
<input :class="{data.a}" />
<input v-model="data.b" />
<input @click="go" />
<input v-on:click="go" />
`);

function preSanitize(content) {
  const regex = /\s:([a-zA-Z-_\.:]+)="/gm;
  const subst = ` data-v-bind:$1="`;
  const regex2 = /\s@([a-zA-Z-_\.:]+)="/gm;
  const subst2 = ` data-v-on:$1="`;
  const regex3 = /\sv-([a-zA-Z-_\.:]+)/gm;
  const subst3 = ` data-v-$1`;
  return content
    .replace(regex, subst)
    .replace(regex2, subst2)
    .replace(regex3, subst3);
}

const postSanitize = (content) => {
  return content.replace(/data-v-/g, "v-");
};
</script>

<template>
  <div class="grid grid-cols-2 fixed inset-0">
    <textarea
      class="overflow-auto bg-gray-800 text-gray-200 font-mono p-5 outline-none"
      v-model="content"
    />
    <div class="font-mono whitespace-pre p-4">
      {{ postSanitize(sanitize(preSanitize(content))) }}
    </div>
  </div>
</template>
