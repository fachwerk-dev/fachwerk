<script lang="ts">
import { h, ComponentOptions, watch, shallowRef } from "vue";

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
    const compiledSource = shallowRef<ComponentOptions | null>(null);
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
