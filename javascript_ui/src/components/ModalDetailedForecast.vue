<!-- Detailed modal -->
<template>
  <q-dialog
    v-model="forecastStore.isShowDetailedForecast"
    full-width
    :persistent="true"
  >
    <q-card class="bg-dark q-pb-none text-white">
      <q-card-section>
        <!-- TODO: Content here -->
        <div class="row justify-between">
          <div class="text-h5">
            <span v-if="forecastStore.stationName"
              >Detailed Forecast - {{ forecastStore.stationName }}</span
            >
          </div>
          <q-btn icon="close" square color="primary" v-close-popup>CLOSE</q-btn>
        </div>
      </q-card-section>
      <q-separator dark />
      <q-card-section class="q-pt-s">
        <div class="text-h3">{{ forecastStore.currentTemp?.toFixed(1) }}°C</div>
        <div class="fontsize-18">
          Humidity: {{ forecastStore.currentHumidity }}% RH
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <LineGraph day="Fri"
      /></q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useForecastStore } from 'stores/forecast';
import LineGraph from './LineGraph.vue';
import DayOfWeekCard from './DayOfWeekCard.vue';

export default defineComponent({
  name: 'ModalDetailedForecast',
  components: { LineGraph },
  data: function () {
    return {
      pickedDay: String,
    };
  },
  setup() {
    const forecastStore = useForecastStore();
    // this.pickedDay
    return {
      forecastStore,
    };
  },
});
</script>
