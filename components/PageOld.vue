<script setup lang="ts">
const props = defineProps<{ active: boolean; hide: boolean }>();
const el = ref();
watch(
  () => props.active,
  () => {
    if (props.active && !props.hide) {
      el.value.scrollIntoView({ behavior: "smooth" });
    }
  }
);
</script>
<template>
  <div class="relative" v-show="hide ? active : true">
    <div ref="el" class="invisible absolute -top-32 left-0 right-0 h-32" />
    <slot />
  </div>
</template>
