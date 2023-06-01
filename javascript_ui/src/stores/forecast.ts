import { defineStore } from 'pinia';

import axios, { AxiosError } from 'axios';
import { useDataUserStore } from './dataUser';
import { watch } from 'vue';
import { date } from 'quasar';

export const useForecastStore = defineStore('forecast', {
  state: () => ({
    // add annother variable here to show or hdie the modal
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
    // Map with forecast temps
    forecastTemps: null as null | [Date, number][],
    // store an array with day of week, max temp and min temp
    dayOfWeekForecast: null as null | [string, number, number][],
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
          // console.log(result.data);
          // Update weather values
          const weatherObj = JSON.parse(result.data);
          // console.log(weatherObj);
          this.stationName = weatherObj.name;
          this.currentTemp = weatherObj.main.temp;
          this.currentHumidity = weatherObj.main.humidity;
          // this.minTemp = weatherObj.main.temp_min;
          // this.maxTemp = weatherObj.main.temp_max;
          this.weatherDescription = weatherObj.weather[0].description;
          this.weatherIconId = weatherObj.weather[0].icon;
          // Clear error message
          this.errorMessage = '';

          // if api call succeeded then call get detailed forecast\
          this.getDetailedForecast();
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
    /**
     * Read the user latitude and longitude (based off postcode)
     * and updates the weather forecast accordingly
     */
    async getDetailedForecast() {
      // Initialize user data for lat/lon
      const dataUserStore = useDataUserStore();
      const latitude = dataUserStore.latitude;
      const longitude = dataUserStore.longitude;

      if (!(latitude && longitude)) {
        this.errorMessage =
          'Unspecified latitude/longitude, is postcode specified in settings?';
        return;
      }
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.OPENWEATHERMAPSAPIKEY}`;
        const result = await axios.get(url, {
          timeout: 4000,
          responseType: 'text',
          maxContentLength: 65536,
        });

        // Update weather values
        const weatherObj = JSON.parse(result.data);

        // clear forecastTemps and dayofweek forecast array
        this.forecastTemps = [];
        this.dayOfWeekForecast = [];
        console.log(weatherObj);
        for (const w of weatherObj.list) {
          // Multiply by 1000 to convert seconds to ms (unix to js time)
          this.forecastTemps.push([new Date(w.dt * 1000), w.main.temp]);
        }

        console.log('success forecast data API');
        // console.log(JSON.stringify(this.forecastTemps));
        // separate out dayOfWeek max and min temp to a separate array
        const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const tempList: string[] = [];
        // filter to get a list of days of week
        for (const [dateAndTime, temp] of this.forecastTemps) {
          const currentDay = weekday[dateAndTime.getDay()];
          if (!tempList.includes(currentDay)) {
            tempList.push(currentDay);
          }
        }
        // console.log(tempList);

        // loop thru each day in tempList
        // get a single day with all the temps
        // find max and min
        for (const element of tempList) {
          const listOfTemps = this.forecastTemps
            .filter((item) => {
              return (
                weekday[new Date(item[0]).getDay()].localeCompare(element) == 0
              );
            })
            .map(function (value) {
              return value[1];
            });
          // console.log(listOfTemps);
          this.dayOfWeekForecast.push([
            element,
            Math.max(...listOfTemps),
            Math.min(...listOfTemps),
          ]);
        }
        console.log(JSON.stringify(this.dayOfWeekForecast));
        // Clear error message
        this.errorMessage = '';
        return 'success';
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'unable to fetch forecast api';
        }
        return this.errorMessage;
      }
    },
  },
});
