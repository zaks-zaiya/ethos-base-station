<template>
  <div class="auto-scroll" :class="heightClass">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { useKeyboardStore } from 'src/stores/keyboard';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  setup() {
    const keyboardStore = useKeyboardStore();
    const heightClass = computed(() => {
      if (keyboardStore.isKeyboardBound) {
        return 'height-keyboard-open';
      }
      return 'height-keyboard-closed';
    });
    return { heightClass };
  },
});
</script>

<style lang="scss" scoped>
.auto-scroll {
  overflow: scroll;
}
.height-keyboard-open {
  height: calc(100vh - 240px);
  transition: height 0.15s ease-out;
}
.height-keyboard-closed {
  height: calc(100vh - 60px);
  transition: height 0.15s ease-in;
}
</style>
