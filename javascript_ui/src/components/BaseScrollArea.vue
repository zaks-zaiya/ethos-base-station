<template>
  <q-scroll-area
    @scroll="checkScroll"
    :class="{ 'scroll-shadow': showShadow }"
    style="height: 70vh; position: relative"
    class="q-pr-md"
    :thumb-style="thumbStyle"
    :bar-style="barStyle"
    visible
  >
    <slot></slot>
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { QScrollArea } from 'quasar';

export default defineComponent({
  name: 'BaseScrollArea',
  setup() {
    const showShadow = ref(false);

    const checkScroll = (scrollInfo: ReturnType<QScrollArea['getScroll']>) => {
      console.log(scrollInfo.verticalPercentage);
      showShadow.value = scrollInfo.verticalPercentage < 0.98;
    };

    return {
      showShadow,
      checkScroll,
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
    rgba(0, 0, 0, 0.2) 100%
  );
}
</style>
