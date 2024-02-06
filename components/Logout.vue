<script setup lang="ts">
const { logout } = useStrapiAuth();
</script>

<template>
  <button @click="logout" class="absolute top-6 right-16">Logout</button>
</template>
