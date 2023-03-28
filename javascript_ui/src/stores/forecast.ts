import { defineStore } from 'pinia';

import axios, { AxiosError } from 'axios';
import { useDataUserStore } from './dataUser';
import { watch } from 'vue';

export const useForecastStore = defineStore('forecast', {
  state: () => ({
    isShowDetailedForecast: false,
    errorMessage: 'Updating data...',
    stationName: null as null | string,
    currentTemp: null as null | number,
    currentHumidity: null as null | number,
    // minTemp: null as null | number,
    // maxTemp: null as null | number,
    weatherDescription: undefined as undefined | string,
    weatherIconId: null as null | string,
    pollInterval: null as null | number,
  }),

  getters: {},

  actions: {
    setup() {
      // Initialize user data for lat/lon
      const dataUserStore = useDataUserStore();

      // Update forecast if lat or lon change
      watch(
        () => {
          return { lat: dataUserStore.latitude, lon: dataUserStore.longitude };
        },
        () => {
          console.log('Lat/lon updated, updating weather');
          updateWeather();
        }
      );

      /**
       * Read the user latitude and longitude (based off postcode)
       * and updates the weather forecast accordingly
       */
      const updateWeather = async () => {
        const latitude = dataUserStore.latitude;
        const longitude = dataUserStore.longitude;
        console.log('Updating weather...');
        if (!(latitude && longitude)) {
          this.errorMessage =
            'Unspecified latitude/longitude, is postcode specified in settings?';
          return;
        }
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHERMAPSAPIKEY}`;
          const result = await axios.get(url, {
            timeout: 4000,
            responseType: 'text',
            maxContentLength: 65536,
          });
          // Update weather values
          const weatherObj = JSON.parse(result.data);
          this.stationName = weatherObj.name;
          this.currentTemp = weatherObj.main.temp;
          this.currentHumidity = weatherObj.main.humidity;
          // this.minTemp = weatherObj.main.temp_min;
          // this.maxTemp = weatherObj.main.temp_max;
          this.weatherDescription = weatherObj.weather[0].description;
          this.weatherIconId = weatherObj.weather[0].icon;
          // Clear error message
          this.errorMessage = '';
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'An unknown error occurred';
          }
        }
      };

      updateWeather();
      // Setup poll interval for every 10 min
      this.pollInterval = window.setInterval(updateWeather, 60000 * 10);
    },
  },
});
