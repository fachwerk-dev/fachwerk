<script lang="ts" setup>
const { login } = useStrapiAuth();

const loading = ref(false);
const form = reactive({ identifier: "", password: "" });

const onSubmit = async () => {
  loading.value = true;
  try {
    await login(form);
    //  await navigateTo({ path: "/" });
  } catch (e) {}
  loading.value = false;
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
    <input
      v-model="form.identifier"
      placeholder="Username"
      type="text"
      name="email"
      required
      class="bg-transparent border-2 border-gray-600 rounded px-4 py-3 text-lg shadow-inner"
    />
    <input
      v-model="form.password"
      placeholder="Password"
      type="password"
      name="password"
      required
      class="bg-transparent border-2 border-gray-600 rounded px-4 py-3 text-lg shadow-inner"
    />
    <div>
      <Button type="submit">
        {{ loading ? "Loading..." : " Login" }}
      </Button>
    </div>
  </form>
</template>
