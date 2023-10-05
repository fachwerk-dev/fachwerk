<script setup>
const range = (length) => Array.from({ length }).map((_, i) => i + 1);
const g = (value) => `"g${value}"`;
const fr = (value) => `1fr`;
const auto = (value) => `auto`;
const count = ref(3);
const maxAreas = range(100);
const areas = computed(() => maxAreas.slice(0, count.value));
const templates = computed(() => {
  return [
    {
      title: "Default",
      cols: "1fr",
      rows: areas.value.map(auto).join(" "),
      areas: areas.value.map(g).join(" "),
    },
    {
      title: "1/2 left, others right in row",
      cols: "1fr 1fr",
      areas:
        areas.value.length > 1
          ? areas.value
              .slice(0, areas.value.length - 1)
              .map((a) => `"g1 g${a + 1}"`)
              .join(" ")
          : "g1",
    },
    {
      title: "1/3 left, others right in row",
      cols: "1fr 2fr",
      areas:
        areas.value.length > 1
          ? areas.value
              .slice(0, areas.value.length - 1)
              .map((a) => `"g1 g${a + 1}"`)
              .join(" ")
          : "g1",
    },
  ];
});
const activeTemplate = ref(1);
</script>
<template>
  <div class="grid grid-cols-[1fr_3fr]">
    <div class="p-4 flex flex-col gap-3">
      Number of colums: {{ count }}
      <input type="range" v-model="count" min="1" max="10" />
      <div
        class="cursor-pointer hover:opacity-70 underline underline-offset-2"
        v-for="(t, i) in templates"
        @click="activeTemplate = i"
      >
        {{ t.title }}
      </div>
      <pre class="whitespace-pre-wrap">{{ templates[activeTemplate] }}</pre>
    </div>
    <div
      class="p-4 grid gap-4 h-screen"
      :style="{
        gridTemplateAreas: templates[activeTemplate].areas,
        gridTemplateColumns: templates[activeTemplate].cols,
        gridTemplateRows: templates[activeTemplate].rows,
      }"
    >
      <div
        v-for="a in areas"
        contenteditable
        class="p-4 bg-gray-300"
        :style="{
          gridArea: 'g' + a,
        }"
      >
        g{{ a }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.test {
  grid-template-areas: "g1 g1 g2 g3";
}
</style>
