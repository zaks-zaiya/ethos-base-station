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
  Filler,
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
  Filler,
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
    currentDay: 0,
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
          (e) =>
            weekday[e[0].getDay()].localeCompare(this.day) == this.currentDay
        )
        .forEach((e) => {
          const date = e[0];
          console.log(date.getHours());
          const ampmHour = date.getHours() % 12;
          const period = date.getHours() >= 12 ? 'pm' : 'am';
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
              fill: {
                target: 'origin',
                above: 'rgb(80,71,42,1)', // Area will be red above the origin
                below: 'rgb(0, 0, 255)', // And blue below the origin
              },
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
