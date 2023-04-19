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
  // -10px for top toolbar
  height: $remaining-height-keyboard-open;
  transition: height 0.15s ease-out;
}
.height-keyboard-closed {
  // -10px a bit of extra room
  height: $remaining-height;
  transition: height 0.15s ease-in;
}
</style>
