<template>
  <div style="position: relative">
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

    <q-avatar
      icon="arrow_downward"
      size="xl"
      color="primary"
      text-color="white"
      style="
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
      "
      v-show="isContentBelow"
      @click="scrollToPercent(1)"
    />

    <q-avatar
      icon="arrow_upward"
      size="xl"
      color="primary"
      text-color="white"
      style="
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
      "
      v-show="isContentAbove"
      @click="scrollToPercent(0)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { QScrollArea } from 'quasar';

export default defineComponent({
  name: 'BaseScrollArea',
  components: {},
  props: {
    height: {
      type: String,
      default: '70vh',
    },
  },
  setup() {
    const scrollArea: Ref<null | QScrollArea> = ref(null);
    const isContentBelow: Ref<boolean> = ref(false);
    const isContentAbove: Ref<boolean> = ref(false);

    /**
     * Check what styling should be applied (if any) for scroll area
     * @param scrollInfo Event passed with scroll area info
     */
    const checkScroll = (scrollInfo: ReturnType<QScrollArea['getScroll']>) => {
      if (scrollInfo.verticalSize === scrollInfo.verticalContainerSize) {
        // There is no scrollable content
        return;
      }
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

      isContentBelow.value = scrollInfo.verticalPercentage < 0.95;
      isContentAbove.value = scrollInfo.verticalPercentage > 0.05;
    };

    /**
     * Scroll to a certain point in the scroll area, over 100ms
     * @param percent A number between 0 and 1 which specifies how far to scroll
     */
    const scrollToPercent = (percent: number) => {
      scrollArea.value?.setScrollPercentage('vertical', percent, 100);
    };

    return {
      checkScroll,
      scrollArea,
      isContentBelow,
      isContentAbove,
      scrollToPercent,
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
    rgba(0, 0, 0, var(--shadow-bottom-opacity, 0)) 100%
  );
}
</style>
