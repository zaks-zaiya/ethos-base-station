<template>
  <div>
    <div class="q-mt-lg text-bold">Phone Numbers</div>
    <div
      v-for="(phoneNumber, index) in phoneNumbers"
      :key="index"
      class="q-mb-sm row"
    >
      <div class="col-1 q-mt-lg q-pl-sm text-h4">+61</div>
      <input-keyboard
        class="col-10"
        v-model="phoneNumbers[index]"
        :customRule="checkPhoneNumber"
        type="text"
        :label="`Phone Number ${index + 1}`"
      />
      <q-btn
        color="negative"
        icon="delete"
        @click="removePhoneNumber(index)"
        class="col q-ml-sm q-mb-lg"
      />
    </div>
    <q-btn
      color="positive"
      icon="add"
      label="Add Phone Number"
      @click="addPhoneNumber"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import InputKeyboard from './InputKeyboard.vue';

export default defineComponent({
  name: 'PhoneNumberInputs',
  components: {
    InputKeyboard,
  },
  props: {
    modelValue: {
      type: Array as () => string[],
      required: true,
    },
    checkPhoneNumber: {
      type: Function,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const phoneNumbers = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    const addPhoneNumber = () => {
      phoneNumbers.value.push('');
    };

    const removePhoneNumber = (index: number) => {
      phoneNumbers.value.splice(index, 1);
    };

    return {
      phoneNumbers,
      addPhoneNumber,
      removePhoneNumber,
    };
  },
});
</script>
