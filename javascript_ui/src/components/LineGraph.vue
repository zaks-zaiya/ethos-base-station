<template>
  <q-card class="bg-dark no-shadow">
    <q-card-section>
      <div class="chartBox">
        <LineChart
          v-if="loaded"
          :data="chartData.data"
          :options="chartData.options"
        />
      </div>
    </q-card-section>
    <q-card-section>
      <span class="row justify-between">
        <div v-for="item in forecastStore.dayOfWeekForecast" :key="item[0]">
          <DayOfWeekCard :day="item[0]" :maxTemp="item[1]" :minTemp="item[2]" />
        </div>
      </span>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, onMounted, computed, defineComponent, withDirectives } from 'vue';
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
import DayOfWeekCard from './DayOfWeekCard.vue';
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

export default defineComponent({
  props: {
    day: String,
  },
  name: 'LineGraph',
  components: { LineChart, DayOfWeekCard },
  setup(props) {
    const loaded = ref(false);
    const currentDay = ref(0);
    const forecastStore = useForecastStore();
    const moveChart = (day) => {
      // function to change min and max value based on the picked day of week

      chartData.value.scales.x.min = 0;
      chartData.value.scales.x.min = 7;
    };
    const chartData = computed(() => {
      // Check if weather data is avaliable yet
      if (!forecastStore.forecastTemps) {
        return {};
      }
      let keys = [];
      let values = [];
      const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      console.log(
        'Number of items in forecastTemps ' + forecastStore.forecastTemps.length
      );
      forecastStore.forecastTemps
        // .filter((e) => weekday[e[0].getDay()].localeCompare(props.day) == 0)
        .forEach((e) => {
          // console.log('here');
          const date = e[0];
          const ampmHour = date.getHours() % 12 || 12;
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
              lineTension: 0.3, // smoothens the line
              radius: 0, // removes dots
              borderWidth: 3,
              fill: {
                // fill the area underneath the line chart
                target: 'origin',
                above: 'rgb(80,71,42,1)',
                below: 'rgb(0, 0, 255)',
              },
            },
          ],
        },
        plugins: [ChartDataLabels],
        options: {
          layout: {
            padding: {
              left: 10,
              right: 10,
            },
          },
          animation: false,
          plugins: {
            legend: { display: false },
            datalabels: {
              color: 'white',
              // anchor: 'end',
              formatter: Math.round,
              align: 'end', // move datalabels on top of the line
              offset: 1, // how far datalabels are from anchor point
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              min: 0,
              max: 7,
              ticks: {
                color: 'white',
              },
              grid: {
                display: false,
              },
            },
            y: {
              display: false,
              // min: 11,
              grace: '1%',
              ticks: {
                stepSize: 20,
              },
            },
          },
        },

        // options: {},
      };
    });

    onMounted(async () => {
      loaded.value = true;
    });

    return {
      loaded,
      chartData,
      currentDay,
      forecastStore,
    };
  },
});
</script>
<style>
.chartBox {
  /* height: 200px; */
  /* display: flex;
  flex-direction: row;
  align-items: stretch; */
  /* width: 100%; */
  height: 180px;
}
</style>
