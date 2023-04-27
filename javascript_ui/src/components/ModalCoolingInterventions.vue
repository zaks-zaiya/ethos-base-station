<template>
  <q-dialog v-model="showModal" full-width>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 fontsize-14">Cooling Strategies</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="fontsize-12">
          If you need to lower your body temperature, here are the best ways to
          do it:
        </div>
        <div class="row">
          <div
            class="cooling-intervention col-4 q-pa-md"
            v-for="(item, index) in coolingStrategies"
            :key="index"
          >
            <q-card flat bordered class="full-height">
              <q-card-section
                class="bg-no-repeat full-height flex items-center justify-center"
                :style="{
                  'background-image': `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${item.imageUrl})`,
                  'background-size': 'cover',
                }"
              >
                <div class="text-h3 text-white text-center">
                  {{ item.text }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
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

    const coolingStrategies = [
      {
        text: 'Turn on a Fan',
        imageUrl: 'images/fan.jpg',
      },
      {
        text: 'Hand/Foot Immersion',
        imageUrl: 'images/foot-immersion.jpg',
      },
      {
        text: 'Sit Down Quietly',
        imageUrl: 'images/sitting-quietly.jpg',
      },
      {
        text: 'Drink Cool Fluids',
        imageUrl: 'images/ice-water.jpg',
      },
      {
        text: 'Drape a Wet Towel',
        imageUrl: 'images/tea-towel.jpg',
      },
      {
        text: 'Remove Unnecessary Clothing',
        imageUrl: '/images/clothing.jpg',
      },
    ];

    return {
      showModal,
      isTemperatureRisk: computed(() => true),
      coolingStrategies,
    };
  },
});
</script>

<style lang="scss" scoped>
.cooling-intervention {
  height: calc(100vh / 3);
}
</style>
