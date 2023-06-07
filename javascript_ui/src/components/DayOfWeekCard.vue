<template>
  <q-card class="bg-dark no-shadow" @click="chooseDay">
    <q-card-section class="q-pt-none">
      <div class="column">
        <div class="row text-white justify-center">{{ day }}</div>
        <div class="row">
          <div>{{ Math.round(maxTemp) }}°</div>
          <div class="width10"></div>
          <div class="low">{{ Math.round(minTemp) }}°</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useForecastStore } from 'src/stores/forecast';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DayOfWeekCard',
  props: {
    day: String,
    maxTemp: Number,
    minTemp: Number,
  },
  setup() {
    const forecastStore = useForecastStore();
    const chooseDay = () => {
      console.log('Picked ');
    };
    return { forecastStore, chooseDay };
  },
});
</script>
<style>
.width10 {
  width: 8px;
}
.low {
  color: gray;
}
</style>
