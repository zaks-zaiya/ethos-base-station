<template>
  <q-card class="bg-primary no-shadow">
    <q-card-section class="q-pt-none">
      <div class="column">
        <div class="row text-white justify-center">{{ day }}</div>
        <div class="row justify-space=between">
          <div>{{ Math.round(maxTemp) }}°</div>
          <div>{{ Math.round(minTemp) }}°</div>
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
    return { forecastStore };
  },
});
</script>
