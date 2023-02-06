<template>
  <q-page class="row">
    <div
      class="col-4 display-component"
      v-for="sensorData in sortedSensorData"
      :key="sensorData.id"
    >
      <DisplaySensor :sensor-data="sensorData"></DisplaySensor>
    </div>
    <div class="col-8 display-component">
      <DisplayForecast />
    </div>
  </q-page>
</template>

<script lang="ts">
import { SensorData } from 'components/models';

import DisplaySensor from 'components/DisplaySensor.vue';
import DisplayForecast from 'components/DisplayForecast.vue';

import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { DisplaySensor, DisplayForecast },
  setup() {
    // Temporary test data
    const allSensorData = ref<SensorData[]>([
      {
        id: '1',
        name: 'Bedroom',
        temperature: 31,
        humidity: 24,
        lastSeen: new Date(Date.now()),
      },
      {
        id: '2',
        name: 'Outside',
        temperature: 39,
        humidity: 52,
        lastSeen: new Date(Date.now()),
      },
      {
        id: '3',
        name: 'Kitchen',
        temperature: 31,
        humidity: 24,
        lastSeen: new Date(Date.now() - 5000000),
      },
      {
        id: '4',
        name: 'Living',
        temperature: 35,
        humidity: 48,
        lastSeen: new Date(Date.now()),
      },
    ]);

    const sortedSensorData = computed(() => {
      const copyOfSensorData = [...allSensorData.value]; // Shallow copy
      const outsideIndex = allSensorData.value.findIndex((el) => {
        if (el.name.toLowerCase().includes('out')) {
          return true;
        }
        return false;
      });
      if (outsideIndex >= 0) {
        copyOfSensorData.push(copyOfSensorData.splice(outsideIndex, 1)[0]);
      }
      return copyOfSensorData;
    });
    return { sortedSensorData };
  },
});
</script>

<style lang="scss" scoped>
.display-component {
  height: 215px;
  padding: 10px;
}
</style>
