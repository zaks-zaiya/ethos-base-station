<template>
  <q-card class="bg-primary">
    <q-card-section class="q-pt-none">
      <div class="column">
        <div class="text-white">Hello</div>
        <div class="row">
          <div>22</div>
          <div>16</div>
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
  setup() {
    const forecastStore = useForecastStore();
    return { forecastStore };
  },
});
</script>
