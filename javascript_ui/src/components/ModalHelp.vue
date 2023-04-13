<template>
  <q-dialog v-model="showModal">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Help</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        You can contact the team via:
        <contact-card />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import ContactCard from './ContactCard.vue';

export default defineComponent({
  name: 'ModalNoConnection',
  components: { ContactCard },
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
      isTemperatureRisk: computed(() => true),
    };
  },
});
</script>
