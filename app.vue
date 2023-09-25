<template>
  <div></div>
  <NuxtPage />
</template>

<style>
.debug > * {
  border: 1px solid red;
}
.prose button {
  @apply inline-flex w-full items-center justify-center gap-2 rounded border-2 border-black bg-white px-3 py-2 text-center font-medium transition hover:bg-sky-50 md:flex md:w-max;
}
.prose img {
  @apply mt-0;
}
</style>
