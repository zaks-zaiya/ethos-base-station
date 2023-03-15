<template>
  <q-input
    ref="inputEl"
    :model-value="reactiveValue.value"
    :label="label"
    :hint="hint"
    :error="error"
    :error-message="errorMessage"
    @focus="bindKeyboard"
    @blur="unbindKeyboard"
    type="text"
    class="q-mb-sm"
    outlined
  />
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref, Ref, watch } from 'vue';
import { useKeyboardStore } from 'src/stores/keyboard';
import { QInput } from 'quasar';

export default defineComponent({
  name: 'InputPasscode',
  props: {
    // modelValue for v-model binding
    modelValue: {
      type: [String, Number],
    },
    label: String,
    hint: String,
    customRule: {
      type: Function,
      required: true,
    },
    type: {
      type: String as PropType<'number' | 'text'>,
      default: 'text',
    },
  },
  setup(props, { emit }) {
    const keyboardStore = useKeyboardStore();
    const error = ref(false);
    const errorMessage = ref('');

    const toString = (val: string | number | undefined) => {
      if (val && typeof val === 'number') {
        // Is a number
        return val.toString();
      } else if (val && typeof val === 'string') {
        // Is a string
        return val;
      } else {
        // Is undefined
        return '';
      }
    };

    // A ref to the inputEl QInput
    const inputEl: Ref<undefined | QInput> = ref(undefined);
    // This is defined as a reactive object to enable passing by reference
    const reactiveValue = reactive({
      value: toString(props.modelValue) as string,
    });

    // Watch reactiveValue and emit 'update:modelValue' when changed (for v-model binding)
    watch(reactiveValue, () => {
      let emitValue;
      // Cast value to correct type
      if (props.type === 'number') {
        // Convert to number
        emitValue = parseInt(reactiveValue.value, 10);
      } else {
        // Already a string
        emitValue = reactiveValue.value;
      }
      // Check if valid
      const validCheck: boolean | string = props.customRule(emitValue);
      if (validCheck === true) {
        // Is valid, clear error
        error.value = false;
        errorMessage.value = '';
        // Emit new value to parent
        emit('update:modelValue', emitValue);
      } else if (typeof validCheck === 'string') {
        console.log('set error');
        // Not valid, throw error
        error.value = true;
        errorMessage.value = validCheck;
      } else {
        // Something went wrong
        console.error('validCheck is not a valid type:', typeof validCheck);
      }
    });

    // Bind keyboard on focus
    const bindKeyboard = () => {
      keyboardStore.bindKeyboard(inputEl.value, reactiveValue, props.type);
      setTimeout(() => {
        // Scroll input element into view
        if (inputEl.value) {
          const yOffset = -100;
          const y =
            inputEl.value.nativeEl.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    };

    // Unbind keyboard on blur
    const unbindKeyboard = () => {
      keyboardStore.unbindKeyboard();
    };

    return {
      error,
      errorMessage,
      inputEl,
      reactiveValue,
      bindKeyboard,
      unbindKeyboard,
    };
  },
});
</script>

<style lang="scss" scoped>
.passcode-row {
  height: 70px;
}
</style>
