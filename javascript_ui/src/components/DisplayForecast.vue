<template>
  <q-card class="full-height bg-dark text-white">
    <q-card-section horizontal class="full-height">
      <q-card-section>
        <div>
          <img
            :src="iconUrl"
            :alt="forecastStore.weatherDescription"
            style="width: 75px"
          />
          <div class="text-capitalize text-center">
            {{ forecastStore.weatherDescription }}
          </div>
        </div>
      </q-card-section>

      <q-separator vertical dark />

      <div class="full-width">
        <q-card-section class="q-pa-sm">
          <div class="text-h6">
            <span v-if="forecastStore.stationName">
              {{ forecastStore.stationName }} -
            </span>
            <span>Weather Station</span>
          </div>
        </q-card-section>

        <q-separator dark />

        <q-card-section class="q-pa-sm">
          <div v-if="forecastStore.errorMessage">
            Weather Station Offline <br />
            Reason: {{ forecastStore.errorMessage }}
          </div>
          <div v-else class="row" style="font-size: 22px">
            <div class="col-7">
              <div>
                Temperature: {{ forecastStore.currentTemp?.toFixed(1) }}°C
              </div>
              <div>Humidity: {{ forecastStore.currentHumidity }}% RH</div>
              <q-btn class="q-mt-sm" color="secondary"
                >View Detailed Forecast</q-btn
              >
            </div>
            <!-- <div class="col"> -->
            <!-- <div>Min: {{ forecastStore.minTemp?.toFixed(1) }}°C</div> -->
            <!-- <div>Max: {{ forecastStore.maxTemp?.toFixed(1) }}°C</div> -->
            <!-- </div> -->
          </div>
        </q-card-section>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useForecastStore } from 'stores/forecast';

export default defineComponent({
  name: 'DisplayForecast',
  setup() {
    const forecastStore = useForecastStore();

    let iconUrl = computed(() => {
      if (forecastStore.weatherIconId) {
        return `https://openweathermap.org/img/w/${forecastStore.weatherIconId}.png`;
      }
      return '';
    });

    return { forecastStore, iconUrl };
  },
});
</script>
