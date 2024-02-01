export function useEditor(
  activePage: Ref<number>,
  pages: Ref<any[]>,
  editor: Ref<any>
) {
  const row = ref(-1);
  return () => {
    row.value =
      editor.value.value
        .substr(0, editor.value.selectionStart)
        .split(/\r?\n|\r/).length - 1;
    const index = pages.value?.findIndex(
      (d) => d.start <= row.value && d.end >= row.value
    );
    activePage.value = index > -1 ? index : 0;
  };
}
