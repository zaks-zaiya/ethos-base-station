<template>
  <q-page class="row">
    <div
      :class="[
        'display-component',
        dataSensorStore.numberOfSensors > 2
          ? 'col-xs-6 col-sm-4'
          : dataSensorStore.numberOfSensors === 1
          ? 'col-xs-6 col-sm-12'
          : 'col-xs-6 col-sm-6',
      ]"
      v-for="sensor in dataSensorStore.getSortedSensorData"
      :key="sensor.id"
    >
      <CardSensor :sensor="sensor"></CardSensor>
    </div>
    <div
      v-if="true"
      :class="[
        'display-component',
        dataSensorStore.numberOfSensors < 4
          ? 'col-xs-12 col-sm-12'
          : 'col-xs-12 col-sm-8',
      ]"
    >
      <CardForecast />
    </div>
  </q-page>
</template>

<script lang="ts">
import CardSensor from 'components/CardSensor.vue';
import CardForecast from 'components/CardForecast.vue';

import { defineComponent } from 'vue';
import { useDataSensorStore } from 'src/stores/dataSensor';

export default defineComponent({
  name: 'MainPage',
  components: { CardSensor, CardForecast },
  setup() {
    const dataSensorStore = useDataSensorStore();
    return { dataSensorStore };
  },
});
</script>

<style lang="scss" scoped>
@media screen and (min-width: 600px) {
  .display-component {
    height: calc(#{$remaining-height} / 2);
    padding: 10px;
  }
}
@media screen and (max-width: 599px) {
  .display-component {
    height: calc(#{$remaining-height} / 3);
    padding: 10px;
  }
}
</style>
