<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import IconEdit from "~icons/ri/quill-pen-line";
import IconDelete from "~icons/ri/delete-bin-line";

useTailwind();

const { find, create, delete: del } = useStrapi();
const user = useStrapiUser();

const { data: documents, refresh } = await useAsyncData("documents", () =>
  find("documents", {
    populate: ["user"],
    sort: ["id:desc"],
  }).then((res) => {
    return parseStrapi(res);
  })
);

//useIntervalFn(refresh, 3000);

const parseContents = documents.value.map(async ({ content }: any) => {
  let parsedContent = null;
  try {
    parsedContent = await parseContent(content);
  } catch (e) {
    console.log(e);
  }
  return parsedContent;
});

const contents = (await Promise.all(parseContents)).map((c) => {
  if (c && c[0]) {
    const content = c[0];
    const classesLength = (content.frontmatter?.class || "").split(
      /\s/g
    ).length;
    content.frontmatter.class = twMerge(
      "bg-white",
      classesLength < 6 ? content.frontmatter?.class : "",
      "p-4 aspect-video px-6 py-4 shadow group"
    );
    return content;
  }
});

useIntervalFn(refresh, 2000);

const onCreate = async () => {
  if (user.value) {
    const { id } = await create("documents", {
      content: "",
      user: user.value?.id,
    }).then((res) => parseStrapi(res));
    await navigateTo({ path: "/" + id, query: { edit: null } });
  }
};

const isRoot = computed(() => user.value?.id === 1);

const onDelete = async (id: number) => {
  if (user.value) {
    const confirmDelete = confirm("Do you want to delete?");
    if (confirmDelete) {
      await del("documents", id);
    }
  }
  await refresh();
};
</script>

<template>
  <div class="p-8 md:p-16 bg-sky-50 min-h-screen">
    <div class="grid sm:grid-cols-2 md:grid-cols-[1fr_3fr] gap-16">
      <div>
        <Intro />
        <Button class="hidden md:block" v-if="user" @click="onCreate"
          >Create new document</Button
        >
        <div class="hidden md:block">
          <Login v-if="!user" />
          <Logout class="hidden md:block" v-if="user" />
        </div>
      </div>
      <div class="grid lg:grid-cols-2 gap-6">
        <div
          v-for="(content, i) in contents"
          class="relative flex flex-col justify-between rounded prose-a:no-underline prose prose-xs md:prose-sm group bg-white"
          :class="content?.frontmatter?.class"
        >
          <NuxtLink
            :to="'/' + documents[i].id"
            class="flex flex-col justify-between h-full"
          >
            <h1 class="font-bold text-balance pr-16" v-html="content?.title" />
            <div class="opacity-70 text-sm !font-sans">
              {{ documents[i].user?.username }}
            </div>
          </NuxtLink>
          <div
            v-if="isRoot"
            class="absolute right-0 top-0 p-4 text-sm no-underline opacity-0 transition group-hover:opacity-100 cursor-pointer"
          >
            <IconDelete
              class="size-5 text-red-500"
              @click.stop="onDelete(documents[i].id)"
            />
          </div>
          <NuxtLink
            v-if="user"
            :to="'/' + documents[i].id + '?edit'"
            class="hidden md:block absolute right-0 bottom-0 p-4 pt-8 pl-8 text-sm no-underline opacity-0 transition group-hover:opacity-100"
          >
            <IconEdit class="size-5 hover:text-yellow-500 transition" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
