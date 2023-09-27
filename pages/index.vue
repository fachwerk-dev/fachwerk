<script lang="ts" setup>
const user = useStrapiUser();
const { login, logout } = useStrapiAuth();

const loading = ref(false);
const form = reactive({ identifier: "", password: "" });

const onSubmit = async () => {
  loading.value = true;
  try {
    await login(form);
    await navigateTo({ path: "/home" });
  } catch (e) {}
  loading.value = false;
};
</script>

<template>
  <div class="h-screen bg-gray-800 grid place-content-center">
    <div class="px-8 py-6 flex flex-col gap-16 items-center">
      <h1 class="font-bold text-5xl md:text-6xl text-gray-200 tracking-tight">
        ▦ Fachwerk
      </h1>
      <div v-if="user" class="flex flex-col gap-4 px-4 items-center">
        <NuxtLink
          to="/home"
          class="font-semibold text-center px-4 py-3 w-[24ch] text-lg rounded bg-gray-300 hover:bg-gray-400 transition"
        >
          Go to /home
        </NuxtLink>
        <button
          @click="logout"
          class="text-gray-300 hover:text-gray-400 text-lg"
        >
          Logout
        </button>
      </div>
      <form
        v-else
        @submit.prevent="onSubmit"
        class="flex flex-col gap-4 px-4 items-center"
      >
        <input
          v-model="form.identifier"
          placeholder="username"
          type="text"
          name="email"
          required
          class="font-semibold rounded px-4 py-3 w-[24ch] text-lg"
        />

        <input
          v-model="form.password"
          placeholder="Password"
          type="password"
          name="password"
          required
          class="font-semibold rounded px-4 py-3 w-[24ch] text-lg"
        />
        <div />
        <button
          type="submit"
          class="font-semibold text-center px-4 py-3 w-[24ch] text-lg rounded bg-gray-400 hover:bg-gray-500 transition"
        >
          {{ loading ? "Loading..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>
