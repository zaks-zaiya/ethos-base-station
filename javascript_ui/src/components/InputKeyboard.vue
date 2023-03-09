<template>
  <q-input
    outlined
    v-model="reactiveValue.value"
    :rules="[(val) => customRule(val)]"
    ref="inputEl"
    :label="label"
    :hint="hint"
    :type="type"
    class="q-mb-sm"
    @focus="bindKeyboard"
    @blur="unbindKeyboard"
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
      if (props.type === 'number') {
        // Convert to number
        emitValue = parseInt(reactiveValue.value);
      } else {
        // Already a string
        emitValue = reactiveValue.value;
      }
      // Check if valid
      if (props.customRule(emitValue) === true) {
        emit('update:modelValue', emitValue);
      }
    });

    // Bind keyboard on focus
    const bindKeyboard = () => {
      if (Number.isFinite(reactiveValue)) {
      }
      keyboardStore.bindKeyboard(inputEl.value, reactiveValue, props.type);
    };

    // Unbind keyboard on blur
    const unbindKeyboard = () => {
      keyboardStore.unbindKeyboard();
    };

    return {
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
