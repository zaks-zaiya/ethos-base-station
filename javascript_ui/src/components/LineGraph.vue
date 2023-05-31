<template>
  <LineChart
    v-if="loaded"
    :data="chartData.data"
    :options="chartData.options"
  />
</template>

<script>
import { ref, onMounted, computed } from 'vue';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line as LineChart } from 'vue-chartjs';
import { useForecastStore } from 'src/stores/forecast';

ChartJS.register(
  Filler,
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  props: {
    day: String,
  },
  name: 'LineGraph',
  components: { LineChart },
  setup(props) {
    const loaded = ref(false);
    const currentDay = ref(0);
    const forecastStore = useForecastStore();

    const chartData = computed(() => {
      // Check if weather data is avaliable yet
      if (!forecastStore.forecastTemps) {
        return {};
      }

      let keys = [];
      let values = [];
      const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      forecastStore.forecastTemps
        .filter(
          (e) =>
            weekday[e[0].getDay()].localeCompare(props.day) == currentDay.value
        )
        .forEach((e) => {
          const date = e[0];
          const ampmHour = date.getHours() % 12;
          const period = date.getHours() >= 12 ? 'pm' : 'am';
          keys.push('' + ampmHour + period);
          values.push(e[1]);
        });

      return {
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
                above: 'rgb(80,71,42,1)',
                below: 'rgb(0, 0, 255)',
              },
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            ChartDataLabels: true,
          },
          responsive: true,
          maintainAspectRatio: true,
        },
      };
    });

    onMounted(async () => {
      loaded.value = true;
    });

    return {
      loaded,
      chartData,
      currentDay,
    };
  },
};
</script>
