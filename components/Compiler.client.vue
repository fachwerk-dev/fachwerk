<script lang="ts">
import { h, watch, shallowRef } from "vue";

const modules = import.meta.glob("../utils/*.js", { eager: true });
const functions: any = Object.values(modules).reduce(
  (acc: any, module: any) => {
    return { ...acc, ...module };
  },
  {}
);

export default {
  props: ["source"],
  setup(props: any) {
    const compiledSource = shallowRef(null);
    watch(
      () => props.source,
      (newSource) => {
        const { code } = compileTemplate(newSource);
        compiledSource.value = {
          setup() {
            return functions;
          },
          render: code,
        };
      },
      { immediate: true }
    );

    return () => (compiledSource.value ? h(compiledSource.value) : null);
  },
};
</script>
