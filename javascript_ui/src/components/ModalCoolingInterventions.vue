<template>
  <q-dialog v-model="showModal" full-width>
    <q-slide-transition appear>
      <q-card v-if="displayInfo === null">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 fontsize-14">Cooling Strategies</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="fontsize-12">
            If you need to lower your body temperature, here are the best ways
            to do it (click on a intervention for more info):
          </div>
          <div class="row">
            <CoolingInterventionCard
              v-for="(item, index) in coolingStrategies"
              :key="index"
              :strategy="item"
              @click="showInfo(item)"
            />
          </div>
        </q-card-section>
      </q-card>
      <q-card v-else flat bordered class="full-width">
        <CoolingInterventionInfo
          :strategy="displayInfo"
          @back="displayInfo = null"
        />
      </q-card>
    </q-slide-transition>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, toRefs, computed } from 'vue';
import CoolingInterventionCard from './CoolingInterventionCard.vue';
import CoolingInterventionInfo from './CoolingInterventionInfo.vue';

interface CoolingStrategy {
  text: string;
  imageUrl: string;
  description: string;
}

export default defineComponent({
  name: 'ModalNoConnection',
  components: {
    CoolingInterventionCard,
    CoolingInterventionInfo,
  },
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
    const coolingStrategies: Array<CoolingStrategy> = [
      {
        text: 'Turn on a Fan',
        imageUrl: 'images/fan.jpg',
        description: '',
      },
      {
        text: 'Hand/Foot Immersion',
        imageUrl: 'images/foot-immersion.jpg',
        description: '',
      },
      {
        text: 'Sit Down Quietly',
        imageUrl: 'images/sitting-quietly.jpg',
        description: '',
      },
      {
        text: 'Drink Cool Fluids',
        imageUrl: 'images/ice-water.jpg',
        description: '',
      },
      {
        text: 'Drape a Wet Towel',
        imageUrl: 'images/tea-towel.jpg',
        description: '',
      },
      {
        text: 'Remove Unnecessary Clothing',
        imageUrl: '/images/clothing.jpg',
        description: '',
      },
    ];

    const displayInfo: Ref<null | CoolingStrategy> = ref(null);

    function showInfo(item: CoolingStrategy) {
      displayInfo.value = item;
    }

    return {
      showModal,
      isTemperatureRisk: computed(() => true),
      coolingStrategies,
      displayInfo,
      showInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
.cooling-intervention {
  height: calc(100vh / 3);
}
</style>
