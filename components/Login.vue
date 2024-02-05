<script lang="ts" setup>
const user = useStrapiUser();
const { login, logout } = useStrapiAuth();

const loading = ref(false);
const form = reactive({ identifier: "", password: "" });

const onSubmit = async () => {
  loading.value = true;
  try {
    await login(form);
    await navigateTo({ path: "/dev/home" });
  } catch (e) {}
  loading.value = false;
};
</script>

<template>
  <form v-if="!user" @submit.prevent="onSubmit" class="flex flex-col gap-4">
    <input
      v-model="form.identifier"
      placeholder="Username"
      type="text"
      name="email"
      required
      class="bg-transparent border border-gray-600 rounded px-4 py-3 text-lg"
    />

    <input
      v-model="form.password"
      placeholder="Password"
      type="password"
      name="password"
      required
      class="bg-transparent border border-gray-600 rounded px-4 py-3 text-lg"
    />
    <div>
      <Button type="submit">
        {{ loading ? "Loading..." : " Login" }}
      </Button>
    </div>
  </form>
  <div v-else>
    <button @click="logout" class="absolute top-6 right-16">Logout</button>
  </div>
</template>
