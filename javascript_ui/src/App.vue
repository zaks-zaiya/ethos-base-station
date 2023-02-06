<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useSensorDataStore } from 'stores/sensorData';
import { useForecastDataStore } from 'stores/forecastData';

export default defineComponent({
  name: 'App',
  // Setup store connections here
  setup() {
    const sensorDataStore = useSensorDataStore();
    sensorDataStore.setup();

    const forecastDataStore = useForecastDataStore();
    forecastDataStore.setup();
  },
});
</script>
