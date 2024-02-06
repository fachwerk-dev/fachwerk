<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import IconEdit from "~icons/ri/quill-pen-line";

useTailwind();

const { find, create, delete: del } = useStrapi();
const user = useStrapiUser();

const { data: documents, refresh } = await useAsyncData("documents", () =>
  find("documents", {
    populate: ["user"],
    sort: ["id:desc"],
  }).then((res) => parseStrapi(res))
);

useIntervalFn(() => refresh(), 2000);

const parseContents = documents.value.map(async ({ content }: any) => {
  return await parseContent(content);
});

const contents = (await Promise.all(parseContents)).map((c) => {
  const content = c[0];
  const classesLength = (content.frontmatter?.class || "").split(/\s/g).length;
  content.frontmatter.class = twMerge(
    "bg-white",
    classesLength < 6 ? content.frontmatter?.class : "",
    "p-4 aspect-video px-6 py-4 shadow group"
  );
  return content;
});

useIntervalFn(refresh, 2000);

const onCreate = async () => {
  if (user.value) {
    const { id } = await create("documents", {
      content: "",
      user: user.value?.id,
    }).then((res) => parseStrapi(res));
    await navigateTo({ path: "/dev/" + id });
  }
};

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
        <Button v-if="user" @click="onCreate">Create new document</Button>
        <Login v-if="!user" />
        <Logout v-if="user" />
      </div>
      <div class="grid lg:grid-cols-3 gap-6">
        <div
          v-for="(content, i) in contents"
          class="flex flex-col justify-between rounded prose-a:no-underline prose"
          :class="content.frontmatter?.class"
        >
          <NuxtLink :to="'/dev/' + documents[i].id">
            <h1
              class="text-2xl font-bold text-balance pr-4"
              v-html="content.title || '№' + documents[i].id"
            />
          </NuxtLink>
          <div class="flex justify-between">
            <div class="opacity-70 text-sm !font-sans font-semibold">
              {{ documents[i].user?.username }}
            </div>
            <!-- <IconEdit
                class="size-6"
                @click.stop="onDelete(documents[i].id)"
              /> -->
            <NuxtLink
              :to="'/dev/' + documents[i].id + '?edit'"
              class="text-sm no-underline opacity-0 transition group-hover:opacity-50"
            >
              <IconEdit class="size-6" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
