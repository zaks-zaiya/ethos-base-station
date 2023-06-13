<template>
  <div style="position: relative">
    <q-scroll-area
      :style="{ height: height, position: 'relative' }"
      class="q-pr-md scroll-shadow auto-scroll"
      :class="heightClass"
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
import { defineComponent, ref, Ref, computed } from 'vue';
import { QScrollArea } from 'quasar';
import { useKeyboardStore } from 'src/stores/keyboard';

export default defineComponent({
  name: 'BaseScrollArea',
  components: {},
  props: {
    height: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const scrollArea: Ref<null | QScrollArea> = ref(null);

    const keyboardStore = useKeyboardStore();
    const heightClass = computed(() => {
      if (props.height) {
        return '';
      }
      if (keyboardStore.isKeyboardBound) {
        return 'remaining-height-keyboard-open';
      }
      return 'remaining-height';
    });

    /**
     * Check what styling should be applied (if any) for scroll area
     * @param scrollInfo Event passed with scroll area info
     */
    // const checkScroll = (scrollInfo: ReturnType<QScrollArea['getScroll']>) => {
    //   if (scrollInfo.verticalSize === scrollInfo.verticalContainerSize) {
    //     // There is no scrollable content
    //     return;
    //   }
    //   isContentBelow.value = scrollInfo.verticalPercentage < 0.95;
    //   isContentAbove.value = scrollInfo.verticalPercentage > 0.05;
    // };

    const isContentBelow = computed(() => {
      if (scrollArea.value) {
        const scrollInfo = scrollArea.value.getScroll();
        if (scrollInfo.verticalSize === scrollInfo.verticalContainerSize) {
          // There is no scrollable content
          return false;
        }
        return scrollInfo.verticalPercentage < 0.95;
        return scrollInfo.verticalPercentage > 0.05;
      }
      return false;
    });

    const isContentAbove = computed(() => {
      if (scrollArea.value) {
        const scrollInfo = scrollArea.value.getScroll();
        if (scrollInfo.verticalSize === scrollInfo.verticalContainerSize) {
          // There is no scrollable content
          return false;
        }
        return scrollInfo.verticalPercentage > 0.05;
      }
      return false;
    });

    /**
     * Scroll to a certain point in the scroll area, over 200ms
     * @param percent A number between 0 and 1 which specifies how far to scroll
     */
    const scrollToPercent = (percent: number) => {
      scrollArea.value?.setScrollPercentage('vertical', percent, 200);
    };

    return {
      heightClass,
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

<style scoped lang="scss"></style>
