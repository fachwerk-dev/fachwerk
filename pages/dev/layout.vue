<script setup>
const range = (length) => Array.from({ length }).map((_, i) => i + 1);
const g = (value) => `"g${value}"`;
const fr = (value) => `1fr`;
const auto = (value) => `auto`;
const count = ref(3);
const maxAreas = range(100);
const areas = computed(() =>
  count.value > 1 ? maxAreas.slice(0, count.value) : maxAreas.slice(0, 1)
);
const areasMinusOne = computed(() =>
  count.value > 1 ? maxAreas.slice(0, count.value - 1) : maxAreas.slice(0, 1)
);
const areasHalf = computed(() =>
  count.value > 1
    ? maxAreas.slice(0, Math.round(count.value / 2))
    : maxAreas.slice(0, 1)
);
const activeTemplate = ref(0);
const templates = computed(() => {
  return [
    {
      title: "Default",
      cols: "1fr",
      rows: areas.value.map(auto).join(" "),
      areas: areas.value.map(g).join(" "),
      area: undefined,
    },
    {
      title: "Overlay",
      cols: "1fr",
      rows: "minmax(0, 1fr)",
      areas: "g1",
      area: "g1",
    },
    // {
    //   title: "1/2 rows",
    //   cols: areasHalf.value.map(fr).join(" "),
    //   rows: "1fr 1fr",
    //   areas: areasHalf.value.map((a) => `a${a}`).join(" "),
    // },
    // {
    //   title: "Top auto row",
    //   cols: areasHalf.value.map(fr).join(" "),
    //   rows: "auto 1fr",
    //   area: " ",
    // },
    // {
    //   title: "Bottom auto row",
    //   cols: areasHalf.value.map(fr).join(" "),
    //   rows: "1fr auto",
    //   area: " ",
    // },
    // {
    //   title: "Two 1/2 cols",
    //   cols: "1fr 1fr",
    //   rows: areasHalf.value.map(fr).join(" "),
    //   area: " ",
    // },
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
      title: "Auto header, others in cols",
      cols: areasMinusOne.value.map(fr).join(" "),
      rows: "auto 1fr",
      areas:
        areas.value.length > 1
          ? [
              areasMinusOne.value.map((_) => `g1`).join(" "),
              areasMinusOne.value.map((a) => `g${a + 1}`).join(" "),
            ]
              .map((row) => `"${row}"`)
              .join(" ")
          : "g1",
    },
    {
      title: "1/3 header, others in cols",
      cols: areasMinusOne.value.map(fr).join(" "),
      rows: "1fr 2fr",
      areas:
        areas.value.length > 1
          ? [
              areasMinusOne.value.map((_) => `g1`).join(" "),
              areasMinusOne.value.map((a) => `g${a + 1}`).join(" "),
            ]
              .map((row) => `"${row}"`)
              .join(" ")
          : "g1",
    },
    {
      title: "1/2 header, others in cols",
      cols: areasMinusOne.value.map(fr).join(" "),
      rows: "1fr 1fr",
      areas:
        areas.value.length > 1
          ? [
              areasMinusOne.value.map((_) => `g1`).join(" "),
              areasMinusOne.value.map((a) => `g${a + 1}`).join(" "),
            ]
              .map((row) => `"${row}"`)
              .join(" ")
          : "g1",
    },
    {
      title: "Auto footer, others in cols",
      cols: areasMinusOne.value.map(fr).join(" "),
      rows: "1fr auto",
      areas:
        areas.value.length > 1
          ? [
              areasMinusOne.value.map((a) => `g${a + 1}`).join(" "),
              areasMinusOne.value.map((_) => `g1`).join(" "),
            ]
              .map((row) => `"${row}"`)
              .join(" ")
          : "g1",
    },
    {
      title: "1/3 footer, others in cols",
      cols: areasMinusOne.value.map(fr).join(" "),
      rows: "2fr 1fr",
      areas:
        areas.value.length > 1
          ? [
              areasMinusOne.value.map((a) => `g${a + 1}`).join(" "),
              areasMinusOne.value.map((_) => `g1`).join(" "),
            ]
              .map((row) => `"${row}"`)
              .join(" ")
          : "g1",
    },
    {
      title: "1/2 footer, others in cols",
      cols: areasMinusOne.value.map(fr).join(" "),
      rows: "1fr 1fr",
      areas:
        areas.value.length > 1
          ? [
              areasMinusOne.value.map((a) => `g${a + 1}`).join(" "),
              areasMinusOne.value.map((_) => `g1`).join(" "),
            ]
              .map((row) => `"${row}"`)
              .join(" ")
          : "g1",
    },
  ];
});
</script>
<template>
  <div class="grid grid-cols-[1fr_3fr]">
    <div class="p-4 flex flex-col gap-3">
      Number of colums: {{ count }}
      <input type="range" v-model="count" min="1" max="10" />
      <div class="font-bold mt-4">Layouts</div>
      <div
        class="cursor-pointer hover:opacity-70 underline-offset-2"
        :class="activeTemplate === i ? 'text-blue-700' : ''"
        v-for="(t, i) in templates"
        @click="activeTemplate = i"
      >
        {{ t.title }}
      </div>
      <div class="font-bold mt-4">Style</div>
      <pre class="whitespace-pre-wrap text-sm">
cols: {{ templates[activeTemplate].cols }}

rows: {{ templates[activeTemplate].rows }}

areas: {{ templates[activeTemplate].areas }}

area: {{ templates[activeTemplate].area }}
      </pre>
    </div>
    <div
      class="p-4 grid gap-4 h-screen mix-blend-multiply"
      :style="{
        gridTemplateAreas: templates[activeTemplate].areas,
        gridTemplateColumns: templates[activeTemplate].cols,
        gridTemplateRows: templates[activeTemplate].rows,
      }"
    >
      <div
        v-for="a in areas"
        contenteditable
        class="p-4 bg-gray-300 text-8xl font-bold"
        :style="{
          opacity: 0.5,
          gridArea: templates[activeTemplate].area || 'g' + a,
        }"
      >
        {{ "g" + a }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.test {
  grid-template-areas: "g1 g1 g2 g3";
}
</style>
