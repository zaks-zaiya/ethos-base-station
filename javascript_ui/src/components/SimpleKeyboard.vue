<template>
  <div @click="focusInput" class="simple-keyboard"></div>
</template>

<script>
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import { useKeyboardStore } from 'src/stores/keyboard';
import { defineComponent, onMounted, watch } from 'vue';

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
    let keyboard = null;
    let numericKeyboard = null;

    onMounted(() => {
      keyboard = new Keyboard('simple-keyboard', {
        onChange: onChange,
        onKeyPress: onKeyPress,
        layout: textLayout,
      });
    });

    watch(keyboardStore, () => {
      if (keyboardStore.keyboardType === 'text') {
        keyboard.setOptions({
          layout: textLayout,
        });
      }
      if (keyboardStore.keyboardType === 'number') {
        keyboard.setOptions({
          layout: numberLayout,
        });
      }
    });

    const focusInput = () => {
      console.log('refocus');
      keyboardStore.keyboardBinding.focus();
    };

    const onChange = () => {
      console.log('onChange');
    };

    const onKeyPress = (button) => {
      if (button.length === 1) {
        keyboardStore.keyboardValue.value += button;
      }
      // Backspace
      else if (button === '{bksp}') {
        keyboardStore.keyboardValue.value =
          keyboardStore.keyboardValue.value.slice(0, -1);
      }
      // Shift and caps
      else if (button === '{shift}' || button === '{lock}') {
        handleShift();
      }
    };

    const handleShift = () => {
      let currentLayout = keyboard.options.layoutName;
      let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

      keyboard.setOptions({
        layoutName: shiftToggle,
      });
    };

    return { focusInput, keyboard, numericKeyboard };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
