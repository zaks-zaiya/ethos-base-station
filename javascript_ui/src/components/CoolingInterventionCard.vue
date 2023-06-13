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
import { calculateWBGT } from 'src/helper/riskLevel';
import { useDataSensorStore, isOutdoorSensor } from 'src/stores/dataSensor';
import { SensorData } from 'src/components/models';

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

    function calculateFanUse(
      sensor: SensorData
    ): 'yes' | 'maybe' | 'no' | undefined {
      if (sensor.humidity && sensor.temperature) {
        // Based on https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(21)00136-4/fulltext
        const fanThreshold = -(1 / 25) * sensor.humidity + 38.5;

        if (sensor.temperature < fanThreshold - 1) {
          // Safe to use fan
          return 'yes';
        } else if (sensor.temperature < fanThreshold + 1) {
          // Can maybe use fan
          return 'maybe';
        } else {
          // Should not use fan
          return 'no';
        }
      }
      return undefined;
    }

    function calculateBlindUse(
      sensor: SensorData
    ): 'yes' | 'maybe' | 'no' | undefined {
      const indoorWBGT = calculateWBGT(sensor);
      const outdoorWBGT = calculateWBGT(dataSensorStore.getOutdoorSensor);
      if (indoorWBGT && outdoorWBGT) {
        if (indoorWBGT < outdoorWBGT - 2) {
          return 'yes';
        } else if (indoorWBGT < outdoorWBGT + 2) {
          return 'maybe';
        } else {
          return 'no';
        }
      }
      return undefined;
    }

    const sensorsWithIconData = computed(() => {
      return dataSensorStore.allSensorData
        .filter((sensor) => {
          // If in 'blinds' mode and the sensor is an outdoor sensor, filter it out
          if (props.displayMode === 'blinds' && isOutdoorSensor(sensor)) {
            return false;
          }
          // Otherwise, include it
          return true;
        })
        .map((sensor) => {
          // Calculate status, and display icon accordingly
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
            case 'no':
              icon = 'close';
              color = 'negative';
              break;
            default:
              icon = 'device_unknown';
              color = 'grey';
          }

          return { ...sensor, icon, color };
        });
    });

    return { sensorsWithIconData };
  },
});
</script>
