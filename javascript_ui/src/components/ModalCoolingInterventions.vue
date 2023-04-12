<template>
  <q-dialog v-model="showModal">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Cooling Strategies</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div>
          If you need to lower your body temperature here are the best ways to
          do it:
        </div>
        <ul>
          <li>
            Turn on a fan and sit in the moving air (if humidity and temperature
            are low)
          </li>
          <li>Immerse your forearms and feet in cold water</li>
          <li>Drink cool fluids</li>
          <li>Remove any unnecessary clothing</li>
        </ul>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';

export default defineComponent({
  name: 'ModalNoConnection',
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
      isTemperatureRisk: computed(() => true),
    };
  },
});
</script>
