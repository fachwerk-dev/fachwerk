<script lang="ts">
import { reactive, h, ComponentOptions, watch, shallowRef } from "vue";
import { emit, on } from "~/composables/events";

const data = reactive({});

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
            return { data, emit, on };
          },
          render: code,
        };
      },
      { immediate: true }
    );

    return () => (compiledSource.value ? h(compiledSource.value) : h());
  },
};
</script>
