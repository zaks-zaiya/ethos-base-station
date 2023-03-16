<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useDataSensorStore } from 'stores/dataSensor';
import { useForecastStore } from 'stores/forecast';

export default defineComponent({
  name: 'App',
  // Setup store connections here
  setup() {
    const dataSensorStore = useDataSensorStore();
    dataSensorStore.setup();

    const forecastStore = useForecastStore();
    forecastStore.setup();
  },
});
</script>
