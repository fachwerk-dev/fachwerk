<script setup lang="ts">
import IconLeft from "~icons/ri/arrow-left-line";

const { find } = useStrapi();
const { data: documents, refresh } = await useAsyncData("document", () =>
  find("documents", {
    populate: ["users_permissions_user"],
  }).then((res) => parseStrapi(res))
);
useIntervalFn(refresh, 3000);

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
  <div class="grid md:grid-cols-[auto_1fr] min-h-screen">
    <div
      class="sticky md:block top-0 bg-gray-800 py-5 px-4 border-gray-700 flex md:flex-col gap-8 transition border-gray-700 border-b md:border-none"
    >
      <NuxtLink to="/" class="block">
        <IconLeft
          class="text-gray-500/50 w-6 h-6 hover:text-gray-300 transition-all"
        />
      </NuxtLink>
    </div>
    <!-- <div class="bg-gray-800 w-16 border-r border-gray-700"></div> -->
    <div class="p-6 md:px-16 md:py-12">
      <h1 class="font-bold text-5xl md:text-6xl text-gray-800 tracking-tight">
        ▦ Fachwerk
      </h1>
      <div class="h-8" />
      <div class="grid md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="d in documents"
          :to="'/' + d.id"
          class="aspect-[4/3] rounded shadow grid grid-rows-[1fr_auto] overflow-hidden"
        >
          <div
            class="px-5 py-4 bg-gray-800 font-mono whitespace-pre-wrap text-gray-300 overflow-y-hidden md:overflow-y-scroll"
          >
            {{ d.body }}
          </div>
          <div class="py-3 px-4 flex items-center gap-1 bg-white">
            <div class="text-gray-600">
              By {{ d.users_permissions_user.username }}, updated
              {{ timeAgo(d.updatedAt) }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
