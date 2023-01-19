<template>
  <q-card class="full-height">
    <q-card-section>
      <div class="text-h6">Weather Forecast</div>

      <q-separator inset />
      <div v-if="errorMessage">
        Weather Forecast Offline <br />
        Reason: {{ errorMessage }}
      </div>
      <div v-else class="row" style="font-size: 20px">
        <div class="col-3">
          <div>
            <img :src="iconUrl" :alt="weatherDescription" style="width: 75px" />
          </div>
        </div>
        <div class="col">
          <div>Temperature: {{ currentTemp?.toFixed(1) }}°C</div>
          <div>Humidity: {{ currentHumidity }}% RH</div>
        </div>
        <div class="col-4">
          <div>Min: {{ minTemp?.toFixed(1) }}°C</div>
          <div>Max: {{ maxTemp?.toFixed(1) }}°C</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import axios, { AxiosError } from 'axios';

export default defineComponent({
  name: 'ForecastDisplay',
  setup() {
    let errorMessage = ref('Updating data...');
    let currentTemp: Ref<null | number> = ref(null);
    let currentHumidity: Ref<null | number> = ref(null);
    let minTemp: Ref<null | number> = ref(null);
    let maxTemp: Ref<null | number> = ref(null);
    let weatherDescription: Ref<undefined | string> = ref(undefined);
    let weatherIconId: Ref<null | string> = ref(null);
    let pollInterval: null | number = null;

    let iconUrl = computed(() => {
      if (weatherIconId.value) {
        return `http://openweathermap.org/img/w/${weatherIconId.value}.png`;
      }
      return '';
    });

    onMounted(() => {
      updateWeather();
      // Setup poll interval for every 10 min
      pollInterval = window.setInterval(updateWeather, 60000 * 10);
    });

    onUnmounted(() => {
      // Clear poll interval if already exists
      if (pollInterval) {
        window.clearInterval(pollInterval);
        pollInterval = null;
      }
    });

    let updateWeather = async () => {
      console.log('Updating weather...');
      try {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=-28.0167&lon=153.400&units=metric&appid=${process.env.OPENWEATHERMAPSAPIKEY}`;
        let result = await axios.get(url, {
          timeout: 4000,
          responseType: 'text',
          maxContentLength: 65536,
        });
        // Update weather values
        let weatherObj = JSON.parse(result.data);
        currentTemp.value = weatherObj.main.temp;
        currentHumidity.value = weatherObj.main.humidity;
        minTemp.value = weatherObj.main.temp_min;
        maxTemp.value = weatherObj.main.temp_max;
        weatherDescription.value = weatherObj.weather[0].description;
        weatherIconId.value = weatherObj.weather[0].icon;
        // Clear error message
        errorMessage.value = '';
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          errorMessage.value = error.message;
        } else {
          errorMessage.value = 'An unknown error occurred';
        }
      }
    };

    return {
      errorMessage,
      currentTemp,
      currentHumidity,
      maxTemp,
      minTemp,
      weatherDescription,
      iconUrl,
    };
  },
});
</script>
