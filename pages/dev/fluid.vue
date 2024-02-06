<script setup lang="ts">
const w = ref(10);
const w2 = ref(55);
const steps = {
  xs: [20, "text-xs", "text-sm", "text-base"],
  sm: [24, "text-sm", "text-base", "text-lg"],
  md: [28, "text-base", "text-lg", "text-xl"],
  lg: [32, "text-lg", "text-xl", "text-2xl"],
  xl: [36, "text-xl", "text-2xl", "text-3xl"],
  "2xl": [42, "text-2xl", "text-3xl", "text-4xl"],
  "3xl": [48, "text-3xl", "text-4xl", "text-5xl"],
  "4xl": [56, "text-4xl", "text-5xl", "text-6xl"],
  "5xl": [64, "text-5xl", "text-6xl", "text-7xl"],
  "6xl": [72, "text-6xl", "text-7xl", "text-8xl"],
  "7xl": [80, "text-7xl", "text-8xl", "text-9xl"],
};
const steps2 = {
  "text-xs": [0.75, 1],
  "text-sm": [0.875, 1.25],
  "text-base": [1, 1.5],
  "text-lg": [1.125, 1.75],
  "text-xl": [1.25, 1.75],
  "text-2xl": [1.5, 2],
  "text-3xl": [1.875, 2.25],
  "text-4xl": [2.25, 2.5],
  "text-5xl": [3, 1],
  "text-6xl": [3.75, 1],
  "text-7xl": [4.5, 1],
  "text-8xl": [6, 1],
  "text-9xl": [8, 1],
};

const steps3 = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const sampleClass = `
p4
prose
prose-headings:tracking-tight
prose-headings:m-0
@4xl:prose-base
@5xl:prose-lg
@6xl:prose-xl
@7xl:prose-2xl
`;

const sampleClass2 = `p-4
prose
prose-headings:tracking-tight
prose-headings:m-0

prose-h1:text-4xl
prose-h1:leading-[2rem]
prose-h1:mb-[1.75rem]
@sm:prose-h1:text-4xl
@md:prose-h1:text-4xl
@lg:prose-h1:text-4xl
@xl:prose-h1:text-4xl
@2xl:prose-h1:text-4xl
@3xl:prose-h1:text-5xl
@4xl:prose-h1:text-6xl
@5xl:prose-h1:text-7xl
@6xl:prose-h1:text-8xl
@7xl:prose-h1:text-9xl

prose-h2:text-2xl
prose-h2:leading-[1.5rem]
prose-h2:mt-[0.75rem]
prose-h2:mb-[0.5rem]
@sm:prose-h2:text-2xl
@md:prose-h2:text-2xl
@lg:prose-h2:text-2xl
@xl:prose-h2:text-2xl
@2xl:prose-h2:text-2xl
@3xl:prose-h2:text-3xl
@4xl:prose-h2:text-4xl
@5xl:prose-h2:text-5xl
@6xl:prose-h2:text-6xl
@7xl:prose-h2:text-7xl

prose-h3:text-lg
prose-h3:leading-[1.25rem]
prose-h2:mt-[5rem]
prose-h2:mb-[0.25rem]
@sm:prose-h3:text-lg
@md:prose-h3:text-lg
@lg:prose-h3:text-lg
@xl:prose-h3:text-lg
@2xl:prose-h3:text-lg
@3xl:prose-h3:text-xl
@4xl:prose-h3:text-2xl
@5xl:prose-h3:text-3xl
@6xl:prose-h3:text-4xl
@7xl:prose-h3:text-5xl

prose-h4:text-base
prose-h4:leading-[1rem]
prose-h2:mt-[5rem]
prose-h2:mb-[0.25rem]
@sm:prose-h4:text-base
@md:prose-h4:text-base
@lg:prose-h4:text-base
@xl:prose-h4:text-base
@2xl:prose-h4:text-base
@3xl:prose-h4:text-lg
@4xl:prose-h4:text-xl
@5xl:prose-h4:text-2xl
@6xl:prose-h4:text-3xl
@7xl:prose-h4:text-4xl

prose-p:text-xs
@sm:prose-p:text-xs
@md:prose-p:text-xs
@lg:prose-p:text-xs
@xl:prose-p:text-xs
@2xl:prose-p:text-sm
@3xl:prose-p:text-base
@4xl:prose-p:text-lg
@5xl:prose-p:text-xl
@6xl:prose-p:text-2xl
@7xl:prose-p:text-3xl

`;
</script>

<template>
  <div class="">
    <!-- <div class="flex flex-col gap-px">
      <div
        v-for="(s, key) in steps"
        :style="{ width: s[0] + 'rem', fontSize: steps2[s[1]][0] + 'rem' }"
        class="bg-green-200 font-bold"
      >
        {{ key }} / {{ steps2[s[1]][0] }}
      </div>
    </div> -->

    <div class="flex flex-col gap-px">
      <div
        v-for="(s, key) in steps"
        :style="{ width: s[0] + 'rem', fontSize: steps2[s[2]][0] + 'rem' }"
        class="bg-red-200 font-bold"
      >
        {{ key }} / {{ s[2] }}
      </div>
    </div>
    <!-- <div class="flex flex-col gap-px">
      <div
        v-for="(s, key) in steps"
        :style="{ width: s[0] + 'rem', fontSize: steps2[s[3]][0] + 'rem' }"
        class="bg-blue-300 font-bold"
      >
        {{ key }} / {{ steps2[s[3]][0] }}rem
      </div>
    </div> -->
    <!-- <div class="flex flex-col gap-px">
      <div
        v-for="(s, key) in steps2"
        :style="{ width: s[0] * 5 + 'rem' }"
        class="bg-sky-200 overflow-auto whitespace-nowrap"
      >
        {{ key }} {{ s[0] }}rem
      </div>
    </div> -->

    <div class="flex flex-col gap-px">
      <div
        v-for="(s, key) in steps3"
        :style="{ width: s + 'px' }"
        class="bg-orange-200"
      >
        {{ key }} / {{ s }}
      </div>
    </div>

    <div class="p-8">
      <input type="range" v-model="w" min="10" max="100" class="block mb-16" />
      {{ w }}rem
    </div>

    <div class="bg-gray-300 @container" :style="{ width: w + 'rem' }">
      <div :class="sampleClass">
        <h1>Hello world Hello world Hello world Hello world</h1>
        <h2>Hello world Hello world Hello world Hello world</h2>
        <h3>Hello world Hello world Hello world Hello world</h3>
        <h4>Hello world Hello world Hello world Hello world</h4>
        <p>What a wonderful wonderful world!</p>
      </div>
    </div>
    <div class="p-8">
      <input type="range" v-model="w2" min="0" max="100" class="block mb-16" />
      {{ w2 }}%
    </div>

    <div class="bg-gray-400 @container" :style="{ width: w2 + '%' }">
      <div :class="sampleClass">
        <h1>Hello world Hello world Hello world Hello world</h1>
        <h2>Hello world Hello world Hello world Hello world</h2>
        <h3>Hello world Hello world Hello world Hello world</h3>
        <h4>Hello world Hello world Hello world Hello world</h4>
        <h2>Hello world Hello world Hello world Hello world</h2>
        <p>What a wonderful wonderful world!</p>
        <ul>
          <li>aaaa</li>
        </ul>
      </div>
    </div>
  </div>
</template>
