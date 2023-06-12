<template>
  <q-card class="fontsize-18 bg-grey-3">
    <q-card-section>
      <div class="text-bold" v-if="displayMode === 'fan'">
        Should you use a fan?
      </div>
      <div class="text-bold" v-else-if="displayMode === 'blinds'">
        Should you close your blinds/windows?
      </div>
      <div v-for="sensor of sensorsWithIconData" :key="sensor.name">
        {{ sensor.name }}:
        <q-avatar
          :icon="sensor.icon"
          size="lg"
          :color="sensor.color"
          text-color="white"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useDataSensorStore } from 'src/stores/dataSensor';
import { SensorData } from './models';

export default defineComponent({
  props: {
    displayMode: {
      type: String,
      required: true,
      validator: (value: string) => ['fan', 'blinds'].includes(value),
    },
  },
  setup(props) {
    const dataSensorStore = useDataSensorStore();

    function calculateFanUse(sensor: SensorData): 'yes' | 'maybe' | 'no' {
      // TODO: Implement logic
      return 'no';
    }

    function calculateBlindUse(sensor: SensorData): 'yes' | 'maybe' | 'no' {
      // TODO: Implement logic
      return 'maybe';
    }

    const sensorsWithIconData = computed(() => {
      return dataSensorStore.allSensorData.map((sensor) => {
        let result =
          props.displayMode === 'fan'
            ? calculateFanUse(sensor)
            : calculateBlindUse(sensor);
        let icon, color;

        switch (result) {
          case 'yes':
            icon = 'done';
            color = 'positive';
            break;
          case 'maybe':
            icon = 'question_mark';
            color = 'amber';
            break;
          default:
            icon = 'close';
            color = 'negative';
            break;
        }

        return { ...sensor, icon, color };
      });
    });

    return { sensorsWithIconData };
  },
});
</script>
