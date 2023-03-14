<template>
  <!-- Mousedown.prevent prevents loss of focus on original input element when clicked -->
  <div @mousedown.prevent class="simple-keyboard"></div>
</template>

<script lang="ts">
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { useKeyboardStore } from 'src/stores/keyboard';
import { defineComponent, nextTick, onMounted, watch } from 'vue';

const textLayout = {
  default: [
    '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
    '{tab} q w e r t y u i o p [ ] \\',
    "{lock} a s d f g h j k l ; ' {enter}",
    '{shift} z x c v b n m , . / {shift}',
    '.com @ {space}',
  ],
  shift: [
    '~ ! @ # $ % ^ &amp; * ( ) _ + {bksp}',
    '{tab} Q W E R T Y U I O P { } |',
    '{lock} A S D F G H J K L : " {enter}',
    '{shift} Z X C V B N M &lt; &gt; ? {shift}',
    '.com @ {space}',
  ],
};

const numberLayout = {
  default: ['1 2 3', '4 5 6', '7 8 9', '{bksp} 0 {bksp}'],
  shift: ['1 2 3', '4 5 6', '7 8 9', '{bksp} 0 {bksp}'],
};

export default defineComponent({
  name: 'SimpleKeyboard',
  setup() {
    const keyboardStore = useKeyboardStore();
    let keyboard: null | Keyboard = null;

    onMounted(() => {
      // Initialize keyboard
      keyboard = new Keyboard('simple-keyboard', {
        onKeyPress: onKeyPress,
        layout: textLayout,
      });
    });

    // Watch for keyboard changing state between text and numerical input
    watch(keyboardStore, () => {
      if (keyboardStore.keyboardType === 'text') {
        keyboard?.setOptions({
          layout: textLayout,
        });
      }
      if (keyboardStore.keyboardType === 'number') {
        keyboard?.setOptions({
          layout: numberLayout,
        });
      }
    });

    const onKeyPress = (button: string) => {
      // Sanity check
      if (!keyboardStore.keyboardBinding || !keyboardStore.keyboardValue) {
        console.error('Keyboard store contains undefined');
        return;
      }

      // Handle shift press
      if (button === '{shift}' || button === '{lock}') {
        handleShift();
        return;
      }

      // Handle enter press
      if (button === '{enter}') {
        setTimeout(() => {
          // Blur instead of unbind to prevent continued focus
          keyboardStore.keyboardBinding?.blur();
        }, 100); // Timeout prevents click from focusing element below
        return;
      }

      // Get starting and ending cursor position
      const selectionStart =
        keyboardStore.keyboardBinding.nativeEl.selectionStart;
      const selectionEnd = keyboardStore.keyboardBinding.nativeEl.selectionEnd;

      if (selectionStart === null || selectionEnd === null) {
        console.error('No cursor position in input element');
        return;
      }

      // Is a normal character (e.g. 'a', 'f', ';', etc.)
      if (button.length === 1) {
        // Insert characters at position
        keyboardStore.keyboardValue.value = insertCharFromSelection(
          keyboardStore.keyboardValue.value,
          button,
          selectionStart,
          selectionEnd
        );
        // Restore cursor position
        restoreInputCursorToPosition(selectionStart + 1);
      }
      // Is backspace
      else if (button === '{bksp}') {
        keyboardStore.keyboardValue.value = deleteCharFromSelection(
          keyboardStore.keyboardValue.value,
          selectionStart,
          selectionEnd
        );
        // Restore cursor position
        restoreInputCursorToPosition(selectionStart - 1);
      }
    };

    // Toggle between capitalized layouts
    const handleShift = () => {
      let currentLayout = keyboard?.options.layoutName;
      let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

      keyboard?.setOptions({
        layoutName: shiftToggle,
      });
    };

    // Inserts char at cursor pos, replacing selection (if applicable)
    const insertCharFromSelection = (
      str: string,
      newChar: string,
      selectionStart: number,
      selectionEnd: number
    ) => {
      return str.slice(0, selectionStart) + newChar + str.slice(selectionEnd);
    };

    // If no chars are selected, delete the char before the cursor, otherwise replace the selection with ''
    const deleteCharFromSelection = (
      str: string,
      selectionStart: number,
      selectionEnd: number
    ) => {
      if (selectionStart === selectionEnd) {
        // Delete a single character
        return str.slice(0, selectionStart - 1) + str.slice(selectionEnd);
      }

      // Replace the selection with ''
      return str.slice(0, selectionStart) + str.slice(selectionEnd);
    };

    // Restore the input cursor position to the specified position
    const restoreInputCursorToPosition = (newStartPos: number) => {
      nextTick(() => {
        keyboardStore.keyboardBinding?.nativeEl.setSelectionRange(
          newStartPos,
          newStartPos
        );
      });
    };

    return { keyboard };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
