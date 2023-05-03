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
    const displayInfo: Ref<null | CoolingStrategy> = ref(null);
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
        description: `
      <ul>
        <li>Position the fan to create optimal airflow in the room.</li>
        <li>Adjust the fan speed according to your comfort level.</li>
        <li>Use an oscillating fan to circulate air more evenly in the room.</li>
        <li>Clean the fan blades and vents regularly to maintain efficiency.</li>
        <li>Combine the fan with other cooling methods, such as open windows or air conditioning.</li>
      </ul>
    `,
      },
      {
        text: 'Hand/Foot Immersion',
        imageUrl: 'images/foot-immersion.jpg',
        description: `
      <ul>
        <li>Submerge hands and/or feet in cool water for 10-20 minutes.</li>
        <li>Avoid using ice-cold water to prevent discomfort and possible cold injury.</li>
        <li>For better results, combine with drinking cool fluids.</li>
        <li>Repeat as needed to maintain a comfortable body temperature.</li>
      </ul>
    `,
      },
      {
        text: 'Sit Down Quietly',
        imageUrl: 'images/sitting-quietly.jpg',
        description: `
      <ul>
        <li>Find a cool, shaded, and well-ventilated area.</li>
        <li>Avoid physical activity to reduce heat generation in the body.</li>
        <li>Relax and practice deep, slow breathing.</li>
        <li>Combine with other cooling methods for better results.</li>
      </ul>
    `,
      },
      {
        text: 'Drink Cool Fluids',
        imageUrl: 'images/ice-water.jpg',
        description: `
      <ul>
        <li>Drink cool water or other non-alcoholic, caffeine-free beverages.</li>
        <li>Avoid very cold fluids to prevent stomach cramps.</li>
        <li>Stay hydrated by drinking fluids at regular intervals, even if you're not thirsty.</li>
        <li>Combine with other cooling methods for better results.</li>
      </ul>
    `,
      },
      {
        text: 'Drape a Wet Towel',
        imageUrl: 'images/tea-towel.jpg',
        description: `
      <ul>
        <li>Soak a towel or cloth in cool water and wring out excess water.</li>
        <li>Place the wet towel around your neck or on other pulse points like wrists and ankles.</li>
        <li>As the water evaporates, it will help to cool your body.</li>
        <li>Re-wet the towel as needed to maintain its cooling effect.</li>
      </ul>
    `,
      },
      {
        text: 'Remove Unnecessary Clothing',
        imageUrl: '/images/clothing.jpg',
        description: `
      <ul>
        <li>Wear lightweight, loose-fitting clothing made from breathable fabrics.</li>
        <li>Remove layers of clothing to help your body dissipate heat more effectively.</li>
        <li>Choose light-coloured clothing to reflect sunlight and reduce heat absorption.</li>
        <li>Combine with other cooling methods for better results.</li>
      </ul>
    `,
      },
    ];

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
