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
import DisplaySensor from 'components/DisplaySensor.vue';
import DisplayForecast from 'components/DisplayForecast.vue';

import { defineComponent } from 'vue';
import { useSensorDataStore } from 'src/stores/sensorData';

export default defineComponent({
  name: 'IndexPage',
  components: { DisplaySensor, DisplayForecast },
  setup() {
    const sortedSensorData = useSensorDataStore().getSortedSensorData;

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
