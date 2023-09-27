<script setup lang="ts">
import IconLeft from "~icons/ri/arrow-left-line";

const { find, create } = useStrapi();
const user = useStrapiUser();

const { data: documents, refresh } = await useAsyncData("documents", () =>
  find("documents", {
    populate: ["user"],
    sort: ["id:desc"],
  }).then((res) => parseStrapi(res))
);
useIntervalFn(refresh, 2000);

const onCreate = async () => {
  const { id } = await create("documents", {
    content: "",
    user: user.value?.id,
  }).then((res) => parseStrapi(res));
  await navigateTo({ path: "/" + id });
};

function timeAgo(isoTimestamp) {
  const timestamp = new Date(isoTimestamp).getTime();
  const currentTimestamp = new Date().getTime();
  const timestampDiff = currentTimestamp - timestamp;

  const seconds = Math.floor(timestampDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 7) {
    // If more than a week, return a full date
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  } else if (days >= 1) {
    return `${days}d ago`;
  } else if (hours >= 1) {
    return `${hours}h ago`;
  } else if (minutes >= 1) {
    return `${minutes}m ago`;
  } else {
    return `just now`;
  }
}
</script>

<template>
  <div class="md:grid md:grid-cols-[auto_1fr] min-h-screen bg-gray-50">
    <div
      class="sticky md:block top-0 bg-gray-800 py-5 px-4 flex md:flex-col gap-8 transition border-gray-700 border-b md:border-none"
    >
      <NuxtLink to="/" class="block">
        <IconLeft
          class="text-gray-500/50 w-6 h-6 hover:text-gray-300 transition-all"
        />
      </NuxtLink>
    </div>
    <div class="p-6 md:px-16 md:py-12">
      <div
        class="flex gap-4 flex-col md:flex-row md:justify-between md:items-center"
      >
        <h1 class="font-bold text-5xl md:text-6xl text-gray-800 tracking-tight">
          ▦ Fachwerk
        </h1>
        <button
          @click="onCreate"
          class="md:w-auto font-semibold text-center text-lg rounded bg-gray-300 hover:bg-gray-400 transition px-4 py-2"
        >
          Create new document
        </button>
      </div>
      <div class="h-8" />
      <div v-if="documents" class="grid md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="d in documents"
          :to="'/' + d.id"
          class="aspect-[4/3] rounded shadow grid grid-rows-[1fr_auto] overflow-hidden"
        >
          <div
            class="px-5 py-4 bg-gray-800 font-mono whitespace-pre-wrap text-gray-300 overflow-y-hidden md:overflow-y-scroll"
          >
            {{ d.content }}
          </div>
          <div class="py-3 px-4 flex items-center gap-1 bg-white">
            <div class="text-gray-500">
              <span class="font-semibold">{{ d.id }}</span> by
              {{ d.user.username }}
              {{ timeAgo(d.updatedAt) }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
