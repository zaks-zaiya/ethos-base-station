<template>
  <q-card class="full-height bg-dark text-white">
    <q-card-section horizontal class="full-height">
      <q-card-section>
        <div>
          <img
            :src="iconUrl"
            :alt="store.weatherDescription"
            style="width: 75px"
          />
          <div class="text-capitalize text-center">
            {{ store.weatherDescription }}
          </div>
        </div>
      </q-card-section>

      <q-separator vertical dark />

      <div class="full-width">
        <q-card-section class="q-pa-sm">
          <div class="text-h6">
            <span v-if="store.stationName"> {{ store.stationName }} - </span>
            <span>Weather Station</span>
          </div>
        </q-card-section>

        <q-separator dark />

        <q-card-section class="q-pa-sm">
          <div v-if="store.errorMessage">
            Weather Station Offline <br />
            Reason: {{ store.errorMessage }}
          </div>
          <div v-else class="row" style="font-size: 22px">
            <div class="col-7">
              <div>Temperature: {{ store.currentTemp?.toFixed(1) }}°C</div>
              <div>Humidity: {{ store.currentHumidity }}% RH</div>
            </div>
            <div class="col">
              <div>Min: {{ store.minTemp?.toFixed(1) }}°C</div>
              <div>Max: {{ store.maxTemp?.toFixed(1) }}°C</div>
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useForecastDataStore } from 'stores/forecastData';

export default defineComponent({
  name: 'DisplayForecast',
  setup() {
    const store = useForecastDataStore();

    let iconUrl = computed(() => {
      if (store.weatherIconId) {
        return `http://openweathermap.org/img/w/${store.weatherIconId}.png`;
      }
      return '';
    });

    return { store, iconUrl };
  },
});
</script>
