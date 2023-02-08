import { defineStore } from 'pinia';

import axios, { AxiosError } from 'axios';

export const useForecastDataStore = defineStore('forecastData', {
  state: () => ({
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
      const updateWeather = async () => {
        console.log('Updating weather...');
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=-28.0167&lon=153.400&units=metric&appid=${process.env.OPENWEATHERMAPSAPIKEY}`;
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
