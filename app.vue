<template>
  <div></div>
  <NuxtPage />
</template>

<style>
.debug > * {
  @apply border border-red-500 p-1;
}
.debug2 > * > * {
  @apply border border-yellow-500 p-1;
}
.prose button {
  @apply inline-flex w-full items-center justify-center gap-2 rounded border-2 border-black bg-white px-3 py-2 text-center font-medium transition hover:bg-sky-50 md:flex md:w-max;
}
.prose img {
  @apply mt-0;
}
</style>
