<template>
  <q-page class="row">
    <div
      class="col-4 display-component"
      v-for="sensor in sortedSensorData"
      :key="sensor.id"
    >
      <DisplaySensor :sensor="sensor"></DisplaySensor>
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
import { useDataSensorStore } from 'src/stores/dataSensor';

export default defineComponent({
  name: 'IndexPage',
  components: { DisplaySensor, DisplayForecast },
  setup() {
    const sortedSensorData = useDataSensorStore().getSortedSensorData;

    return { sortedSensorData };
  },
});
</script>

<style lang="scss" scoped>
.display-component {
  height: calc((100vh - 50px) / 2);
  padding: 10px;
}
</style>
