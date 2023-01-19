<template>
  <q-card class="full-height">
    <q-card-section>
      <div class="text-h6">Weather Forecast</div>

      <q-separator inset />
      <div v-if="errorMessage">
        Weather Forecast Offline <br />
        Reason: {{ errorMessage }}
      </div>
      <div v-else>
        <div><img :src="iconUrl" alt="Weather icon" /></div>
        <div>{{ weatherDescription }}</div>
        <div>{{ currentTemp }}°C</div>
        <div>{{ currentHumidity }}% RH</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import axios, { AxiosError } from 'axios';

export default defineComponent({
  name: 'ForecastDisplay',
  setup() {
    let errorMessage = ref('');
    let currentTemp = ref(null);
    let currentHumidity = ref(null);
    let maxTemp = ref(null);
    let minTemp = ref(null);
    let weatherDescription = ref(null);
    let weatherIcon = ref(null);
    let pollInterval: null | number = null;

    let iconUrl = computed(() => {
      if (weatherIcon.value) {
        return `http://openweathermap.org/img/w/${weatherIcon.value}.png`;
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
        weatherIcon.value = weatherObj.weather[0].icon;
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
