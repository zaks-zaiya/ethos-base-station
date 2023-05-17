<template>
  <q-scroll-area
    @scroll="checkScroll"
    style="height: 70vh; position: relative"
    class="q-pr-md scroll-shadow"
    :thumb-style="thumbStyle"
    :bar-style="barStyle"
    visible
    ref="scrollArea"
  >
    <slot></slot>
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { QScrollArea } from 'quasar';

export default defineComponent({
  name: 'BaseScrollArea',
  setup() {
    const scrollArea: Ref<null | QScrollArea> = ref(null);

    const checkScroll = (scrollInfo: ReturnType<QScrollArea['getScroll']>) => {
      let opacity = 0.3;

      if (scrollInfo.verticalPercentage > 0.9) {
        opacity = (1 - (scrollInfo.verticalPercentage - 0.9) * 10) * 0.3;
      }

      scrollArea.value?.$el.style.setProperty(
        '--shadow-opacity',
        opacity.toString()
      );
    };

    return {
      checkScroll,
      scrollArea,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: '0.75',
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: '0.2',
      },
    };
  },
});
</script>

<style scoped>
.scroll-shadow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, var(--shadow-opacity, 0.3)) 100%
  );
}
</style>
