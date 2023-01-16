<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useSensorDataStore } from 'stores/sensorData'

export default defineComponent({
  name: 'App',
  // Setup store connections here
  setup() {
    const store = useSensorDataStore();
    store.setup();
  }
});
</script>
