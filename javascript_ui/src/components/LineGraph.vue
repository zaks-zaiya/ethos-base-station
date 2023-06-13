<template>
  <q-card class="bg-dark no-shadow">
    <q-card-section class="q-pa-none">
      <div class="chartBox">
        <LineChart v-if="loaded" :data="chartData" :options="chartOptions" />
      </div>
    </q-card-section>
    <q-card-section>
      <span class="row justify-between">
        <div
          v-for="(item, idx) in forecastStore.dayOfWeekForecast"
          :key="item[0]"
          @click="moveChart(item[0], idx)"
        >
          <q-card
            class="no-shadow q-px-md"
            :class="[{ 'bg-grey-9': idx == activeIndex }, 'bg-dark']"
          >
            <div class="column">
              <div class="row text-white text-body1 justify-center">
                {{ item[0] }}
              </div>
              <div class="row">
                <div>{{ Math.round(item[1]) }}°</div>
                <div class="space10"></div>
                <div class="low">{{ Math.round(item[2]) }}°</div>
              </div>
            </div>
          </q-card>
        </div>
      </span>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, onMounted, computed, defineComponent } from 'vue';
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

export default defineComponent({
  name: 'LineGraph',
  components: { LineChart },
  setup() {
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const loaded = ref(false);
    const activeIndex = ref(0); // first day is always selected
    const forecastStore = useForecastStore();
    const min = ref(0); // which starting part of the chart to render
    const max = ref(7); // which ending part of the chart to render
    const moveChart = (day, index) => {
      // function to change min and max value based on the picked day of week
      for (let i = 0; i < forecastStore.forecastTemps.length; i++) {
        if (
          day.localeCompare(
            weekday[forecastStore.forecastTemps[i][0].getDay()]
          ) == 0
        ) {
          // found the first matching day of week
          // render only 8 datapoints for a single day
          min.value = i;
          max.value = i + 7;
          break;
        }
      }
      activeIndex.value = index;
    };

    const chartData = computed(() => {
      // Check if weather data is avaliable yet
      if (!forecastStore.forecastTemps) {
        return {};
      }
      let keys = [];
      let values = [];
      forecastStore.forecastTemps.forEach((e) => {
        const date = e[0];
        const ampmHour = date.getHours() % 12 || 12;
        const period = date.getHours() >= 12 ? 'pm' : 'am';
        keys.push('' + ampmHour + period);
        values.push(e[1]);
      });
      return {
        labels: keys,
        datasets: [
          {
            borderColor: 'rgb(242,206,52,1)',
            backgroundColor: 'white',
            data: values,
            lineTension: 0.3, // smoothens the line
            radius: 0, // removes dots at data points
            borderWidth: 2.5, // line width
            fill: {
              // fill the area underneath the line chart
              target: 'origin',
              above: 'rgb(80,71,42,1)',
              // below: 'rgb(0, 0, 255)',
            },
          },
        ],
      };
    });
    const chartOptions = computed(() => {
      return {
        // layout: {
        //   padding: {
        //     left: 10,
        //     right: 10,
        //   },
        // },
        // animation: false,
        animation: {
          duration: 1000, // general animation time
        },
        // animations: {
        //   borderColor: {
        //     type: 'number',
        //     duration: 1000,
        //     from: 0,
        //     to: 1,
        //     loop: true,
        //   },
        // },
        plugins: {
          legend: { display: false },
          datalabels: {
            color: 'white',
            // anchor: 'end',
            formatter: Math.round, // format labels
            align: 'end', // move datalabels on top of the line
            offset: 1, // how far datalabels are from anchor point
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            min: min.value,
            max: max.value,
            ticks: {
              color: 'white',
            },
            grid: {
              display: false,
            },
          },
          y: {
            display: false,
            // min: 11, adjust min value for y axis
            grace: '1%',
            ticks: {
              stepSize: 20, // step size on y axis. found 20 to look best.
            },
          },
        },
      };
    });
    onMounted(async () => {
      loaded.value = true;
    });

    return {
      min,
      max,
      loaded,
      chartData,
      chartOptions,
      forecastStore,
      moveChart,
      activeIndex,
    };
  },
});
</script>
<style>
.chartBox {
  height: 180px;
}
.space10 {
  width: 8px;
}
.low {
  color: gray;
}
</style>
