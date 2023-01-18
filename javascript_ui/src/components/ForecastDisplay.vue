<template>
  <q-card flat bordered class="full-height">
    <q-card-section>
      <div class="text-h6">Weather Forecast</div>

      <q-separator inset />
      <div><img :src="iconUrl" alt="Weather icon"></div>
      <div>{{ weatherDescription }}</div>
      <div>{{ currentTemp }}°C</div>
      <div>{{ currentHumidity }}% RH</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'ForecastDisplay',
  data() {
    return {
      currentTemp: null,
      currentHumidity: null,
      maxTemp: null,
      minTemp: null,
      weatherDescription: null,
      weatherIcon: null as null | string,
      pollInterval: null as null | number
    }
  },
  computed: {
    iconUrl() {
      if (this.weatherIcon) {
        return `http://openweathermap.org/img/w/${this.weatherIcon}.png`;
      }
      return '';
    }
  },
  methods: {
    async updateWeather() {
      console.log('Updating weather...');
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=-28.0167&lon=153.400&units=metric&appid=${process.env.OPENWEATHERMAPSAPIKEY}`;
      let result = await axios.get(url, {
        timeout: 4000,
        responseType: 'text',
        maxContentLength: 65536
      });
      let weatherObj = JSON.parse(result.data)
      this.currentTemp = weatherObj.main.temp;
      this.currentHumidity = weatherObj.main.humidity;
      this.minTemp = weatherObj.main.temp_min;
      this.maxTemp = weatherObj.main.temp_max;
      this.weatherDescription = weatherObj.weather[0].description;
      this.weatherIcon = weatherObj.weather[0].icon;
    }
  },
  mounted() {
    this.updateWeather();
    // Clear poll interval if already exists
    if (this.pollInterval) {
      window.clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    // Setup poll interval for every 5 min
    this.pollInterval = window.setInterval(this.updateWeather, 60000 * 10) // 10 minutes;
  }
});
</script>
