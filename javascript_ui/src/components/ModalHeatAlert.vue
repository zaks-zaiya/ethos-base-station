<!-- ModalNoConnection.vue -->
<template>
  <q-dialog v-model="showModal" full-width persistent> </q-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';

export default defineComponent({
  name: 'ModalCoolingInterventions',
  components: {},
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);

    const showModal = computed({
      get() {
        return modelValue.value;
      },
      set(newValue) {
        emit('update:modelValue', newValue);
      },
    });

    return {
      showModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.cooling-intervention {
  height: calc(100vh / 3);
}
</style>
