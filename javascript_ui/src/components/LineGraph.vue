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
    const pickedDay = ref(weekday[new Date().getDay()]);
    const activeIndex = ref(0);
    const forecastStore = useForecastStore();

    const moveChart = (day, index) => {
      // function to change min and max value based on the picked day of week
      // chartData.value.scales.x.min = 8;
      // chartData.value.scales.x.min = 15;
      // scales.value.x.min = 8;
      // scales.value.x.min = 15;

      activeIndex.value = index;
      pickedDay.value = day;
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
        console.log(ampmHour + period + ', ' + e[1]);
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
              // formatter: Math.round,
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
      };
    });

    onMounted(async () => {
      loaded.value = true;
    });

    return {
      loaded,
      chartData,
      pickedDay,
      forecastStore,
      moveChart,
      activeIndex,
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
.space10 {
  width: 8px;
}
.low {
  color: gray;
}
/* .daySelection :active {
  color: rgb(48, 49, 52);
} */
</style>
