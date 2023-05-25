<template>
  <LineChart :data="chartData.data" :options="chartData.options" />
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
  // props: chartData,
  name: 'LineGraph',
  components: { LineChart },
  setup() {
    const forecastStore = useForecastStore();
    let keys = [];
    let values = [];
    forecastStore.forecastTemps.forEach((element) => {
      keys.push(element[0]);
      values.push(element[1]);
    });
    // console.log('Keys' + keys);
    // console.log('Values' + values);
    const chartData = {
      data: {
        labels: keys,
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: values,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
    return {
      forecastStore,
      chartData,
    };
  },
});
</script>
