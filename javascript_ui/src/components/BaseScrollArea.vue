<template>
  <q-scroll-area
    @scroll="checkScroll"
    :style="{ height: height, position: 'relative' }"
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
  props: {
    height: {
      type: String,
      default: '100vh',
    },
  },
  setup() {
    const scrollArea: Ref<null | QScrollArea> = ref(null);

    const checkScroll = (scrollInfo: ReturnType<QScrollArea['getScroll']>) => {
      let topOpacity = 0.3;
      let bottomOpacity = 0.3;

      // Fade out at top of screen
      if (scrollInfo.verticalPercentage < 0.1) {
        topOpacity = scrollInfo.verticalPercentage * 3;
      }

      // Fade out at bottom of screen
      if (scrollInfo.verticalPercentage > 0.9) {
        bottomOpacity = (1 - (scrollInfo.verticalPercentage - 0.9) * 10) * 0.3;
      }

      scrollArea.value?.$el.style.setProperty(
        '--shadow-top-opacity',
        topOpacity.toString()
      );
      scrollArea.value?.$el.style.setProperty(
        '--shadow-bottom-opacity',
        bottomOpacity.toString()
      );
    };

    return {
      checkScroll,
      scrollArea,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '16px',
        opacity: '0.75',
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '20px',
        opacity: '0.2',
      },
    };
  },
});
</script>

<style scoped>
.scroll-shadow::before,
.scroll-shadow::after {
  z-index: 1;
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 100px;
}

.scroll-shadow::before {
  top: 0;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, var(--shadow-top-opacity, 0)) 100%
  );
}

.scroll-shadow::after {
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, var(--shadow-bottom-opacity, 0.3)) 100%
  );
}
</style>
