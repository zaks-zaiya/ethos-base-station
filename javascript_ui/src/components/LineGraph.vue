<template>
  <LineChart
    v-if="loaded"
    :data="chartData.data"
    :options="chartData.options"
  />
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line as LineChart } from 'vue-chartjs';
import { defineComponent } from 'vue';
import { useForecastStore } from 'src/stores/forecast';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default defineComponent({
  props: {
    day: String,
  },
  name: 'LineGraph',
  components: { LineChart },
  setup() {
    const forecastStore = useForecastStore();
    return {
      forecastStore,
    };
  },
  data: () => ({
    loaded: false,
    chartData: null,
  }),
  async mounted() {
    this.loaded = true;
    try {
      let keys = [];
      let values = [];
      // Get the picked day DayofWeek component
      const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      this.forecastStore.forecastTemps
        .filter(
          (e) => weekday[new Date(e[0]).getDay()].localeCompare(this.day) == 0
        )
        .forEach((e) => {
          const dateAndHour = e[0].split(' ');
          const hour = parseInt(dateAndHour[1].split(':')[0]);
          const period = hour < 12 ? 'am' : 'pm';
          const ampmHour = hour % 12 || 12;
          keys.push('' + ampmHour + period);
          values.push(e[1]);
        });
      // console.log('keys ' + keys);
      // console.log('values ' + values);
      this.chartData = {
        data: {
          labels: keys,
          datasets: [
            {
              borderColor: 'rgb(242,206,52,1)',
              backgroundColor: 'white',
              data: values,
              lineTension: 0.2,
              radius: 0,
              borderWidth: 3,
              fill: 0,
            },
            {
              label: 'Fill',
              data: [
                { x: keys[0], y: 3 },
                { x: keys[1], y: 5 },
                { x: keys[2], y: 7 },
              ],
              borderColor: 'rgb(242,206,52)',
              borderWidth: 10,
              radius: 0,
              backgroundColor: 'red',
              fill: 30,
            },
          ],
        },
        options: {
          plugins: { legend: { display: false } },
          responsive: true,
          maintainAspectRatio: true,
        },
      };
    } catch (e) {
      console.error(e);
    }
  },
});
</script>
