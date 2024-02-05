<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import IconEdit from "~icons/ri/quill-pen-line";
useTailwind();

const { find, create } = useStrapi();
const user = useStrapiUser();

const { data: documents, refresh } = await useAsyncData("documents", () =>
  find("documents", {
    populate: ["user"],
    sort: ["id:desc"],
  }).then((res) => parseStrapi(res))
);

// const content = documents.value[12].content;
// const doc = (await parseContent(content))[0];

const parseContents = documents.value.map(async ({ content }: any) => {
  return await parseContent(content);
});

const contents = (await Promise.all(parseContents)).map((c) => {
  const content = c[0];
  const classesLength = (content.frontmatter?.class || "").split(/\s/g).length;
  content.frontmatter.class = twMerge(
    "bg-white prose",
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
    await navigateTo({ path: "/" + id });
  }
};
</script>

<template>
  <div class="p-8 md:p-16 bg-sky-50 min-h-screen">
    <div class="grid sm:grid-cols-2 md:grid-cols-[1fr_3fr] gap-16">
      <div class="">
        <div class="text-6xl mb-2">▦</div>
        <div class="text-6xl font-bold text-balance mb-4 tracking-tight">
          Hallo Welt.<br />Das ist<br />Fachwerk
        </div>
        <div class="text-lg mb-8 prose">
          <p>
            This is Fachwerk, a place for creating interactive documents using
            Markdown.
          </p>
          <p>Without further <em>Ado</em>, let's get started!</p>
        </div>
        <Button v-if="user" @click="onCreate">Create new document</Button>
        <Login />
      </div>
      <div class="grid lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="(content, i) in contents"
          :to="'/dev/' + documents[i].id"
        >
          <div
            :class="content.frontmatter?.class"
            class="flex flex-col justify-between rounded"
          >
            <h1
              class="text-2xl font-bold text-balance pr-4"
              v-html="content.title || '№' + documents[i].id"
            />
            <div class="flex justify-between">
              <div class="opacity-70 text-sm !font-sans">
                {{ documents[i].user?.username }}
              </div>
              <NuxtLink
                :to="'/dev/' + documents[i].id + '?edit'"
                class="text-sm no-underline opacity-0 transition group-hover:opacity-50"
              >
                <IconEdit />
              </NuxtLink>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="h-16" />
  </div>
</template>
